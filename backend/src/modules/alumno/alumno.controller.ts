import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { CrearAlumnoDto } from './dto/alumno.dto';


@Controller('alumnos')
export class AlumnoController {

    constructor(private readonly alumnoService: AlumnoService) { }

    @Post()
    crear(@Body() dto: CrearAlumnoDto) {
        return this.alumnoService.crear(dto);
    }

    @Get()
    listar() {
        return this.alumnoService.listar();
    }

    @Get(':id')
    obtener(@Param('id') id: number) {
        return this.alumnoService.obtener(id);
    }

    @Put(':id')
    actualizar(@Param('id') id: number, @Body() dto: CrearAlumnoDto) {
        return this.alumnoService.actualizar(id, dto);
    }

    @Delete(':id')
    eliminar(@Param('id') id: number) {
        return this.alumnoService.eliminar(id);
    }
}