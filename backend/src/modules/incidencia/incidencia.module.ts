import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncidenciaController } from './incidencia.controller';
import { Alumno } from '../alumno/alumno.entity';
import { Incidencia } from './Incidencia.entity';
import { IncidenciaService } from './Incidencia.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incidencia, Alumno]),
    AuthModule,
  ],
  controllers: [IncidenciaController],
  providers: [IncidenciaService],
})
export class IncidenciaModule { }