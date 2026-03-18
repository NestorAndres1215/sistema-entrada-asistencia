import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alumno } from './alumno.entity';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
@Injectable()
export class AlumnoService {
  constructor(
    @InjectRepository(Alumno)
    private alumnoRepo: Repository<Alumno>,
  ) { }

  // CREATE
  async crear(data: Partial<Alumno>) {
    if (!data.codigo) {
      throw new Error('El código es obligatorio');
    }

    const contenidoQR = data.codigo; 
    const qr = await QRCode.toDataURL(contenidoQR);

    data.qr_code = qr;

    const alumno = this.alumnoRepo.create(data);
    return this.alumnoRepo.save(alumno);
  }
  // READ ALL
  async listar() {
    return this.alumnoRepo.find({
      relations: ['asistencias', 'incidencias'],
    });
  }

  // READ ONE
  async obtener(id: number) {
    const alumno = await this.alumnoRepo.findOne({
      where: { id },
      relations: ['asistencias', 'incidencias'],
    });

    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return alumno;
  }

  // UPDATE
  async actualizar(id: number, data: Partial<Alumno>) {
    const alumno = await this.obtener(id);
    Object.assign(alumno, data);
    return this.alumnoRepo.save(alumno);
  }

  // DELETE
  async eliminar(id: number) {
    const alumno = await this.obtener(id);
    return this.alumnoRepo.remove(alumno);
  }
}