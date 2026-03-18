import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asistencia } from '../asistencia/Asistencia.entity';
import { Incidencia } from '../incidencia/Incidencia.entity';


@Entity()
export class Alumno {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 100 })
    apellido: string;

    @Column({ length: 20, unique: true })
    codigo: string;

    @Column({ nullable: true })
    qr_code: string;

    @Column({ nullable: true })
    foto_url: string;

    @OneToMany(() => Asistencia, (asistencia) => asistencia.alumno)
    asistencias: Asistencia[];

    @OneToMany(() => Incidencia, (incidencia) => incidencia.alumno)
    incidencias: Incidencia[];
}