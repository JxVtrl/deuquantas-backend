import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdatePreferenciasUsuarioDto {
  @IsBoolean()
  @IsOptional()
  isLeftHanded?: boolean;

  @IsString()
  @IsOptional()
  language?: string;
}
