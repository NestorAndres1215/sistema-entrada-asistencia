// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Alumno } from 'src/modules/alumno/alumno.entity';
import { Asistencia } from 'src/modules/asistencia/Asistencia.entity';
import { Incidencia } from 'src/modules/incidencia/Incidencia.entity';
import { Usuario } from 'src/modules/usuario/usuario.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASS', ''),
  database: configService.get<string>('DB_NAME', 'sistema_entrada'),
  entities: [Usuario,Alumno,Asistencia,Incidencia],
  synchronize: true, 
  logging: true,
});