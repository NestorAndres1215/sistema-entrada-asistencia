import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Alumno } from '../alumno/alumno.entity';


@Entity()
export class Incidencia {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Alumno, (alumno) => alumno.incidencias)
  @JoinColumn({ name: 'alumno_id' })
  alumno: Alumno;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column({ default: false })
  resuelto: boolean;
}