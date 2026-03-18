import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Alumno } from '../alumno/alumno.entity';
import { Usuario } from '../usuario/usuario.entity';



export enum TipoRegistro {
  QR = 'QR',
  MANUAL = 'MANUAL',
}

export enum EstadoAsistencia {
  PRESENTE = 'PRESENTE',
  TARDE = 'TARDE',
  FALTA = 'FALTA',
}

@Entity()
export class Asistencia {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Alumno, (alumno) => alumno.asistencias)
  @JoinColumn({ name: 'alumno_id' })
  alumno: Alumno;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({
    type: 'enum',
    enum: TipoRegistro,
  })
  tipo_registro: TipoRegistro;

  @Column({
    type: 'enum',
    enum: EstadoAsistencia,
  })
  estado: EstadoAsistencia;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrado_por: Usuario;
}