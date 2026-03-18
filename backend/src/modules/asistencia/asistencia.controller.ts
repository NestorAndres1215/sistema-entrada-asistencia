import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';

import { CrearAsistenciaDto, } from './dto/asistencia.dto';
import { AsistenciaService } from './Asistencia.service';
import { AuthGuard } from 'src/common/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('asistencias')
export class AsistenciaController {

  constructor(private readonly asistenciaService: AsistenciaService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  crear(@Body() dto: CrearAsistenciaDto) {
    return this.asistenciaService.crear(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  listar() {
    return this.asistenciaService.listar();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  obtener(@Param('id') id: number) {
    return this.asistenciaService.obtener(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  actualizar(@Param('id') id: number, @Body() dto: CrearAsistenciaDto) {
    return this.asistenciaService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  eliminar(@Param('id') id: number) {
    return this.asistenciaService.eliminar(id);
  }
}