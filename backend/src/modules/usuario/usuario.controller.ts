// src/modules/usuario/usuario.controller.ts
import { Controller, Post, Body, Get, UseGuards, ParseIntPipe, Param, Patch } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard'; // tu guard

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) { }


    @Post()
    crear(@Body() body: CrearUsuarioDto) {
        return this.usuarioService.crearUsuario(body.username, body.password, body.rol);
    }


    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    listar() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.findById(id);
    }

    @Get('username/:username')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    findByUsername(@Param('username') username: string) {
        return this.usuarioService.findByUsername(username);
    }
    
    @Patch(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { username?: string; password?: string },
    ) {
        return this.usuarioService.actualizarUsuario(id, body);
    }
}