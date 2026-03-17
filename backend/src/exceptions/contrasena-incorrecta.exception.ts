// src/common/exceptions/contrasena-incorrecta.exception.ts
import { UnauthorizedException } from '@nestjs/common';

export class ContrasenaIncorrectaException extends UnauthorizedException {
  constructor() {
    super('Contraseña incorrecta');
  }
}