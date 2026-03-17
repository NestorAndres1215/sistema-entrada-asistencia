// src/common/exceptions/usuario-no-encontrado.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UsuarioNoEncontradoException extends NotFoundException {
  constructor() {
    super('Usuario no encontrado');
  }
}