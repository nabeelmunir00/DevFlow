import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

import { TaskSuggestionSchema } from './schemas/task-suggestion.schema.js';
import type { TaskSuggestion } from './schemas/task-suggestion.schema.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.model =
      this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-3.8-flash';

    this.client = new GoogleGenAI({
      apiKey,
    });

    this.logger.log(`AI provider initialized: Gemini (${this.model})`);
  }

  /*
   * ------------------------------------------------------------------------
   * CENTRAL GEMINI REQUEST HANDLER
   * ------------------------------------------------------------------------
   *
   * Every Gemini request should go through this method.
   *
   * It automatically retries temporary upstream failures such as:
   * - 429 Too Many Requests
   * - 500 Internal Server Error
   * - 502 Bad Gateway
   * - 503 Service Unavailable
   * - 504 Gateway Timeout
   */
  private async generateWithRetry(
    request: Parameters<GoogleGenAI['models']['generateContent']>[0],
    maxAttempts = 3,
  ) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.log(
          `Gemini request attempt ${attempt}/${maxAttempts} model=${this.model}`,
        );

        return await this.client.models.generateContent(request);
      } catch (error) {
        lastError = error;

        const status =
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          typeof error.status === 'number'
            ? error.status
            : undefined;

        const message = error instanceof Error ? error.message : String(error);

        const retryable =
          status === 429 ||
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 504 ||
          message.includes('"code":429') ||
          message.includes('"code":500') ||
          message.includes('"code":502') ||
          message.includes('"code":503') ||
          message.includes('"code":504') ||
          message.includes('UNAVAILABLE') ||
          message.includes('RESOURCE_EXHAUSTED');

        this.logger.warn(
          `Gemini request failed attempt=${attempt}/${maxAttempts} status=${status ?? 'unknown'}`,
        );

        /*
         * Do not retry permanent errors such as:
         * - invalid API key
         * - invalid request
         * - invalid model
         *
         * Also stop after the final attempt.
         */
        if (!retryable || attempt === maxAttempts) {
          throw error;
        }

        /*
         * Exponential backoff:
         *
         * attempt 1 -> 1000ms
         * attempt 2 -> 2000ms
         * attempt 3 -> no retry
         */
        const delayMs = 1000 * 2 ** (attempt - 1);

        this.logger.warn(
          `Gemini temporarily unavailable. Retrying in ${delayMs}ms...`,
        );

        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }
    }

    /*
     * Defensive fallback.
     * Normally execution never reaches here.
     */
    throw lastError instanceof Error
      ? lastError
      : new Error('Gemini request failed after retries');
  }

  /*
   * ------------------------------------------------------------------------
   * GENERIC TEXT GENERATION
   * ------------------------------------------------------------------------
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.generateWithRetry({
        model: this.model,
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error('Gemini returned an empty response');
      }

      return text;
    } catch (error) {
      this.logger.error(
        'Gemini text generation failed',
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException('AI generation failed');
    }
  }

  /*
   * ------------------------------------------------------------------------
   * TASK SUGGESTION GENERATION
   * ------------------------------------------------------------------------
   */
  async generateTaskSuggestion(
    title: string,
    description?: string,
  ): Promise<TaskSuggestion> {
    const prompt = `
You are an AI engineering assistant inside DevFlow, a software development and project management platform.

Your job is to analyze and improve a software-development task.

INPUT

Title:
${title}

Description:
${description?.trim() || 'No description provided.'}

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "title": "Clear improved task title",
  "description": "Detailed implementation-focused task description",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "tags": [
    "tag1",
    "tag2"
  ],
  "subtasks": [
    {
      "title": "First actionable subtask"
    }
  ]
}

RULES

- Keep the title concise, specific, and engineering-focused.
- Improve unclear task titles when necessary.
- Write a useful implementation-focused description.
- Do not invent unrelated requirements.
- Priority must be exactly one of:
  LOW
  MEDIUM
  HIGH
  URGENT
- Generate at most 6 relevant technical tags.
- Tags should be short and lowercase where appropriate.
- Generate between 2 and 8 actionable subtasks.
- Each subtask should represent a concrete engineering action.
- Avoid duplicate subtasks.
- Do not include markdown.
- Do not include code fences.
- Do not include explanations outside the JSON.
`.trim();

    try {
      const response = await this.generateWithRetry({
        model: this.model,
        contents: prompt,

        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error('Gemini returned an empty task suggestion');
      }

      /*
       * Parse Gemini JSON response.
       */
      let parsed: unknown;

      try {
        parsed = JSON.parse(text);
      } catch {
        this.logger.error(`Gemini returned invalid JSON: ${text}`);

        throw new Error('Gemini returned invalid JSON');
      }

      /*
       * Runtime validation.
       *
       * Never trust AI-generated JSON directly.
       */
      const result = TaskSuggestionSchema.safeParse(parsed);

      if (!result.success) {
        this.logger.error(
          `Invalid Gemini task suggestion: ${JSON.stringify(
            result.error.flatten(),
          )}`,
        );

        throw new Error('Gemini returned an invalid task suggestion');
      }

      this.logger.log(
        `AI task suggestion generated successfully title="${result.data.title}" priority=${result.data.priority}`,
      );

      return result.data;
    } catch (error) {
      this.logger.error(
        'Gemini task suggestion generation failed',
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to generate AI task suggestion',
      );
    }
  }
}
