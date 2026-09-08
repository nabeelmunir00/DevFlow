import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  syncCurrentUser(
    @CurrentUser()
    auth: {
      userId: string;
    },
  ) {
    return this.usersService.syncCurrentUser(auth.userId);
  }

  @Get('me')
  getCurrentUser(
    @CurrentUser()
    auth: {
      userId: string;
    },
  ) {
    return this.usersService.findByClerkId(auth.userId);
  }
}
