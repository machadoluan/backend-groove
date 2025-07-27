import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NovidadesService } from './novidades.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Novidades } from 'src/entitys/novidades.entity';
import { Repository } from 'typeorm';


@Controller('novidades')
export class NovidadesController {

    constructor(
        @InjectRepository(Novidades)
        private novidadesRepository: Repository<Novidades>,
        private readonly novidadeService: NovidadesService
    ) {

    }


    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createNovidade(
        @Body('dados') dados: string,  // chega como string JSON
        @UploadedFile() file: Express.Multer.File
    ) {
        const parseData = JSON.parse(dados)
        console.log('DADOS:', parseData);
        console.log('ARQUIVO:', file);
        return this.novidadeService.createNovidade(parseData, file)
    }

    @Get()
    async getNovidades() {
        return this.novidadeService.getNovidades()
    }

    @Post('visibilidade/:id')
    async updateVisibilidade(
        @Param('id') id: number,
        @Body('visibilidade') visibilidade: boolean
    ) {

        return await this.novidadesRepository.update(id, { visibilidade });
    }

    @Post('update/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateNovidade(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body('dados') dados: string
    ) {
        const parsedDados = JSON.parse(dados);
        console.log('DADOS:', parsedDados);
        console.log('ARQUIVO:', file);
        await this.novidadeService.updateNovidade(id, parsedDados, file)
        return { message: 'Novidade atualizada com sucesso.' };
    }

    @Delete('delete/:id')
    async deleteNovidade(
        @Param('id') id: number,

    ) {
        await this.novidadeService.deleteNovidade(id)
        return { message: 'Novidade deletada com sucesso.' };
    }

}
