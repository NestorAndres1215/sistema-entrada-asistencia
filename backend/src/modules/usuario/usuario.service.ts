// src/modules/usuario/usuario.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario, UserRole } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) { }

  async crearUsuario(username: string, password: string, rol: UserRole) {
    const hashed = await bcrypt.hash(password, 10);
    const usuario = this.usuarioRepo.create({ username, password: hashed, rol });
    return this.usuarioRepo.save(usuario);
  }

  async validarUsuario(username: string, password: string) {
    const user = await this.usuarioRepo.findOne({ where: { username } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  findAll() {
    return this.usuarioRepo.find();
  }

  async findByUsername(username: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { username } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findById(id: number) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async actualizarUsuario(
    id: number,
    updateData: { username?: string; password?: string },
  ) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (updateData.username) usuario.username = updateData.username;
    if (updateData.password) {

      usuario.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.usuarioRepo.save(usuario);
  }
}