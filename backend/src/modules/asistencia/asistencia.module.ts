import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AsistenciaController } from './asistencia.controller';
import { Alumno } from '../alumno/alumno.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Asistencia } from './Asistencia.entity';
import { AsistenciaService } from './Asistencia.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistencia, Alumno, Usuario]),
    AuthModule,
  ],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
})
export class AsistenciaModule {}