import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

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
      this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash';

    this.client = new GoogleGenAI({
      apiKey,
    });

    this.logger.log(`AI provider initialized: Gemini (${this.model})`);
  }

  async generateText(prompt: string): Promise<string> {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.log(`Gemini request attempt ${attempt}/${maxAttempts}`);

        const response = await this.client.models.generateContent({
          model: this.model,
          contents: prompt,
        });

        const text = response.text;

        if (!text) {
          throw new Error('Gemini returned an empty response');
        }

        return text;
      } catch (error) {
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
          message.includes('"code":503');

        this.logger.warn(
          `Gemini request failed attempt=${attempt}/${maxAttempts} status=${status ?? 'unknown'}`,
        );

        if (!retryable || attempt === maxAttempts) {
          this.logger.error(
            'Gemini text generation failed',
            error instanceof Error ? error.stack : String(error),
          );

          throw new InternalServerErrorException('AI generation failed');
        }

        const delay = 1000 * 2 ** (attempt - 1);

        this.logger.warn(`Retrying Gemini request in ${delay}ms`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new InternalServerErrorException('AI generation failed');
  }
}
