import { IsUUID } from 'class-validator';

export class LinkRepositoryDto {
  @IsUUID()
  projectId!: string;
}
