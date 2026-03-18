import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Asistencia, EstadoAsistencia, TipoRegistro } from './Asistencia.entity';
import { CrearAsistenciaDto } from './dto/asistencia.dto';
import { Usuario } from '../usuario/usuario.entity';
import { Alumno } from '../alumno/alumno.entity';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(Alumno)
    private readonly alumnoRepo: Repository<Alumno>,
  ) { }




  async crear(dto: CrearAsistenciaDto) {
    // 1️⃣ Buscar alumno por código
    const alumno = await this.alumnoRepo.findOne({ where: { codigo: dto.codigo } });
    if (!alumno) throw new ConflictException('Alumno no encontrado');

    const ahora = new Date();

    // 2️⃣ Revisar si ya hay asistencia en las últimas 24 horas
    const desde24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000); // 24 horas atrás
    const asistenciaExistente = await this.asistenciaRepo
      .createQueryBuilder('a')
      .where('a.alumno_id = :alumnoId', { alumnoId: alumno.id })
      .andWhere('a.fecha >= :fechaDesde', { fechaDesde: desde24h.toISOString().split('T')[0] })
      .getOne();

    if (asistenciaExistente) {
      throw new ConflictException('El alumno ya registró asistencia en las últimas 24 horas');
    }

    // 3️⃣ Crear nueva asistencia
    const fecha = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
    const hora = ahora.toTimeString().split(' ')[0]; // HH:MM:SS

    const nuevaAsistencia = this.asistenciaRepo.create({
      alumno: { id: alumno.id } as any,
      registrado_por: { id: 1 } as any, // cambiar por usuario logueado si hay auth
      tipo_registro: dto.tipo_registro || TipoRegistro.QR,
      estado: EstadoAsistencia.PRESENTE,
      fecha,
      hora,
    });

    return await this.asistenciaRepo.save(nuevaAsistencia);
  }
  // READ ALL
  async listar() {
    return this.asistenciaRepo.find({
      relations: ['alumno', 'registrado_por'],
    });
  }

  // READ ONE
  async obtener(id: number) {
    const asistencia = await this.asistenciaRepo.findOne({
      where: { id },
      relations: ['alumno', 'registrado_por'],
    });

    if (!asistencia) throw new NotFoundException('Asistencia no encontrada');
    return asistencia;
  }

  // UPDATE
  async actualizar(id: number, dto: CrearAsistenciaDto) {
    const asistencia = await this.obtener(id);



    return this.asistenciaRepo.save(asistencia);
  }

  // DELETE
  async eliminar(id: number) {
    const asistencia = await this.obtener(id);
    return this.asistenciaRepo.remove(asistencia);
  }
}