import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

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
}
