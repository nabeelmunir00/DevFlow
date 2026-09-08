import { Module } from '@nestjs/common';

import { ClerkAuthGuard } from './guards/clerk-auth.guard.js';

@Module({
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard],
})
export class AuthModule {}
