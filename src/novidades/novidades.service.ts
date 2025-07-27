import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BackblazeService } from 'src/backblaze/backblaze.service';
import { Novidades } from 'src/entitys/novidades.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NovidadesService {

    constructor(
        @InjectRepository(Novidades)
        private novidadesRepository: Repository<Novidades>,
        private backblazeService: BackblazeService

    ) { }

    async createNovidade(dados: any, file?: Express.Multer.File) {
        if (!dados.title || !file) {
            throw new BadRequestException('Preencha title e envie uma foto.');
        }

        // Faz upload da imagem obrigatória
        const fotoLink = await this.backblazeService.uploadFile(file, 'novidades');

        if (dados.video) {
            if (!dados.videoLink) {
                throw new BadRequestException('Para vídeo, informe videoLink.');
            }

            const novidade = this.novidadesRepository.create({
                title: dados.title,
                fotoLink: fotoLink,  // Sempre obrigatório
                videoLink: dados.videoLink,
                video: true
            });

            return await this.novidadesRepository.save(novidade);
        } else {
            const novidade = this.novidadesRepository.create({
                title: dados.title,
                fotoLink: fotoLink,  // Sempre obrigatório
                videoLink: null,
                video: false
            });

            return await this.novidadesRepository.save(novidade);
        }
    }



    async getNovidades() {
        return this.novidadesRepository.find()
    }
}
