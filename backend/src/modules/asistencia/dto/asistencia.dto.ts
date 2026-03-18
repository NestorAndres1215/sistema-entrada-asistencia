import { IsEnum, IsNumber, IsDateString, IsString } from 'class-validator';
import { EstadoAsistencia, TipoRegistro } from '../Asistencia.entity';


export class CrearAsistenciaDto {

  @IsString()
  codigo: string; // el código del alumno escaneado

  @IsEnum(TipoRegistro)
  tipo_registro: TipoRegistro;
}