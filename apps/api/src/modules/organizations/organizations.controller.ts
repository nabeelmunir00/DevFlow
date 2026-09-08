import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { OrganizationsService } from './organizations.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';

@Controller('organizations')
@UseGuards(ClerkAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  // CREATE ORGANIZATION
  @Post()
  create(
    @CurrentUser()
    auth: { userId: string },

    @Body()
    dto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(auth.userId, dto);
  }

  // GET CURRENT USER ORGANIZATIONS
  @Get()
  findAll(
    @CurrentUser()
    auth: {
      userId: string;
    },
  ) {
    return this.organizationsService.findAllForCurrentUser(auth.userId);
  }
}
