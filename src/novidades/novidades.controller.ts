import { Body, Controller, Get, Post, UploadedFile } from '@nestjs/common';
import { NovidadesService } from './novidades.service';

@Controller('novidades')
export class NovidadesController {

    constructor(
        private readonly novidadeService: NovidadesService
    ) {

    }

    @Post('create')
    async createNovidade(
        @Body('dados') dados: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log('DADOS:', dados);
        console.log('ARQUIVO:', file);
        return this.novidadeService.createNovidade(dados, file)
    }

    @Get()
    async getNovidades() {
        return this.novidadeService.getNovidades()
    }
}
