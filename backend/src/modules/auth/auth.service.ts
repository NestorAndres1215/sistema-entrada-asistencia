// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usuarioService.validarUsuario(username, password);
    if (!user) throw new UnauthorizedException('Usuario o contraseña inválidos');

    const payload = { sub: user.id, username: user.username, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}