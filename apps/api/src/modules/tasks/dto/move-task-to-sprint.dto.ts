import { IsOptional, IsUUID } from 'class-validator';

export class MoveTaskToSprintDto {
  @IsOptional()
  @IsUUID()
  sprintId?: string;
}
