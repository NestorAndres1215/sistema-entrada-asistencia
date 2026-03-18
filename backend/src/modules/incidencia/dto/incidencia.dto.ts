import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CrearIncidenciaDto {

  @IsNumber()
  alumno_id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  resuelto?: boolean;
}