import { Controller, Get, UseGuards } from '@nestjs/common';

import { ClerkAuthGuard } from './modules/auth/guards/clerk-auth.guard.js';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator.js';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'DevFlow API',
      status: 'running',
    };
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  getMe(
    @CurrentUser()
    auth: {
      userId: string;
    },
  ) {
    return {
      authenticated: true,
      clerkUserId: auth.userId,
    };
  }
}
