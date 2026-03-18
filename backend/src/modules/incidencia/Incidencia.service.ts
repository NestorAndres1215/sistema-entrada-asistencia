import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Incidencia } from './Incidencia.entity';

@Injectable()
export class IncidenciaService {
  constructor(
    @InjectRepository(Incidencia)
    private incidenciaRepo: Repository<Incidencia>,
  ) {}

  // CREATE
  async crear(data: Partial<Incidencia>) {
    const incidencia = this.incidenciaRepo.create(data);
    return this.incidenciaRepo.save(incidencia);
  }

  // READ ALL
  async listar() {
    return this.incidenciaRepo.find({
      relations: ['alumno'],
    });
  }

  // READ ONE
  async obtener(id: number) {
    const incidencia = await this.incidenciaRepo.findOne({
      where: { id },
      relations: ['alumno'],
    });

    if (!incidencia) throw new NotFoundException('Incidencia no encontrada');
    return incidencia;
  }

  // UPDATE
  async actualizar(id: number, data: Partial<Incidencia>) {
    const incidencia = await this.obtener(id);
    Object.assign(incidencia, data);
    return this.incidenciaRepo.save(incidencia);
  }

  // DELETE
  async eliminar(id: number) {
    const incidencia = await this.obtener(id);
    return this.incidenciaRepo.remove(incidencia);
  }
}