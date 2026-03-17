// src/modules/usuario/dto/login-usuario.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  @IsString()
  password: string;
}