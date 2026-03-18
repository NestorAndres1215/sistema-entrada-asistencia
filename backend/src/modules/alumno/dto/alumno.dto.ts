import { IsString, IsOptional } from 'class-validator';

export class CrearAlumnoDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  qr_code?: string;

  @IsOptional()
  @IsString()
  foto_url?: string;
}

