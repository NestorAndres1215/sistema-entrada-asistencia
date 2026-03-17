// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../modules/usuario/usuario.entity';
/*
import { Alumno } from '../modules/alumno/alumno.entity';
import { Asistencia } from '../modules/asistencia/asistencia.entity';
import { Incidencia } from '../modules/incidencia/incidencia.entity';*/

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASS', ''),
  database: configService.get<string>('DB_NAME', 'sistema_entrada'),
  entities: [Usuario],
  synchronize: true, // solo en desarrollo, nunca en producción
  logging: true,
});