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

        if (dados.videoLink) {
            if (!dados.videoLink) {
                throw new BadRequestException('Para vídeo, informe videoLink.');
            }

            const novidade = this.novidadesRepository.create({
                title: dados.title,
                fotoLink: fotoLink,  // Sempre obrigatório
                videoLink: dados.videoLink,
                video: true,
                visibilidade: dados.visibilidade
            });

            return await this.novidadesRepository.save(novidade);
        } else {
            const novidade = this.novidadesRepository.create({
                title: dados.title,
                fotoLink: fotoLink,  // Sempre obrigatório
                videoLink: null,
                video: false,
                visibilidade: dados.visibilidade

            });

            return await this.novidadesRepository.save(novidade);
        }
    }



    async getNovidades() {
        return this.novidadesRepository.find()
    }

    async updateNovidade(id: number, dados: any, file?: Express.Multer.File) {
        if (!id) {
            throw new BadRequestException('Sem id');
        }

        let fotoLink: string | undefined;

        // Só faz upload se um novo arquivo for enviado
        if (file) {
            fotoLink = await this.backblazeService.uploadFile(file, 'novidades');
        }

        // Monta objeto de atualização
        const updateData: any = {
            title: dados.title,
            visibilidade: dados.visibilidade,
            video: !!dados.videoLink,
            videoLink: dados.videoLink ? dados.videoLink : null,
        };

        if (fotoLink) {
            updateData.fotoLink = fotoLink;
        }

        // Atualiza a novidade pelo id
        await this.novidadesRepository.update(id, updateData);

        return { message: 'Novidade atualizada com sucesso.' };
    }

    async deleteNovidade(id: number) {
        if (!id) {
            throw new BadRequestException('Sem id');
        }

        const novidade = await this.novidadesRepository.findOne({ where: { id: id } })

        if (novidade.fotoLink) {
            await this.deleteNovidadePhoto(novidade.fotoLink)
        }

        await this.novidadesRepository.delete(id)

        return { message: 'Novidade apagada com sucesso.' };

    }

    async deleteNovidadePhoto(fileName: string): Promise<void> {
        try {
            await this.backblazeService.deleteFileByUrl(fileName);
        } catch (error) {
            throw new BadRequestException('Erro ao deletar a foto associada.');
        }
    }
}
