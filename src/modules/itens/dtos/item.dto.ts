import { IsString, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsString()
  codItem: string;

  @IsString()
  desItem: string;

  @IsString()
  tipItem: string;

  @IsOptional()
  @IsString()
  imgItem?: string;
}
