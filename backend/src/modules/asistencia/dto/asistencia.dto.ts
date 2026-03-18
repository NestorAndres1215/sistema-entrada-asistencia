import { IsEnum, IsNumber, IsDateString, IsString } from 'class-validator';
import { EstadoAsistencia, TipoRegistro } from '../Asistencia.entity';


export class CrearAsistenciaDto {

  @IsNumber()
  alumno_id: number;

  @IsDateString()
  fecha: string;

  @IsString()
  hora: string;

  @IsEnum(TipoRegistro)
  tipo_registro: TipoRegistro;

  @IsEnum(EstadoAsistencia)
  estado: EstadoAsistencia;

  @IsNumber()
  registrado_por: number;
}