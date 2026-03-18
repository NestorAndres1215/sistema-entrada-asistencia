import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Asistencia } from './Asistencia.entity';
import { CrearAsistenciaDto } from './dto/asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,
  ) { }

  // CREATE
  async crear(dto: CrearAsistenciaDto) {
    const asistencia = this.asistenciaRepo.create({
      fecha: dto.fecha,
      hora: dto.hora,
      tipo_registro: dto.tipo_registro,
      estado: dto.estado,
      alumno: { id: dto.alumno_id } as any,
      registrado_por: { id: dto.registrado_por } as any,
    });

    return this.asistenciaRepo.save(asistencia);
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

    Object.assign(asistencia, {
      ...dto,
      alumno: { id: dto.alumno_id } as any,
      registrado_por: { id: dto.registrado_por } as any,
    });

    return this.asistenciaRepo.save(asistencia);
  }

  // DELETE
  async eliminar(id: number) {
    const asistencia = await this.obtener(id);
    return this.asistenciaRepo.remove(asistencia);
  }
}