import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

import { CrearIncidenciaDto } from './dto/incidencia.dto';
import { IncidenciaService } from './Incidencia.service';

@Controller('incidencias')
export class IncidenciaController {

  constructor(private readonly incidenciaService: IncidenciaService) {}

  @Post()
  crear(@Body() dto: CrearIncidenciaDto) {
    return this.incidenciaService.crear(dto);
  }

  @Get()
  listar() {
    return this.incidenciaService.listar();
  }

  @Get(':id')
  obtener(@Param('id') id: number) {
    return this.incidenciaService.obtener(id);
  }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: CrearIncidenciaDto) {
    return this.incidenciaService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.incidenciaService.eliminar(id);
  }
}