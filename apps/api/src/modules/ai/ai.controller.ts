import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service.js';
import { GenerateTaskSuggestionDto } from './dto/generate-task-suggestion.dto.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /*
   * Temporary endpoint used to verify the Gemini connection.
   * We'll remove this after the AI feature endpoints are stable.
   */
  @Post('test')
  async testAi(
    @Body()
    body: {
      prompt?: string;
    },
  ) {
    const prompt =
      body.prompt ?? 'Say hello from DevFlow AI in one short sentence.';

    const result = await this.aiService.generateText(prompt);

    return {
      provider: 'gemini',
      result,
    };
  }

  /*
   * Generate an AI-assisted software engineering task suggestion.
   */
  @Post('tasks/suggest')
  async generateTaskSuggestion(
    @Body()
    dto: GenerateTaskSuggestionDto,
  ) {
    const suggestion = await this.aiService.generateTaskSuggestion(
      dto.title,
      dto.description,
    );

    return {
      provider: 'gemini',
      model: process.env.GEMINI_MODEL,
      suggestion,
    };
  }
}
