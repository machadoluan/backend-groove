import { Injectable, BadRequestException } from '@nestjs/common';
import { Cards } from './cards.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackblazeService } from 'src/backblaze/backblaze.service';


@Injectable()
export class VipsDimaService {

    constructor(
        @InjectRepository(Cards)
        private cardsRepository: Repository<Cards>,
        private backblazeService: BackblazeService
    ) { }


    async createVip(dadosVip: any, file: Express.Multer.File) {
        if (!dadosVip.title || !dadosVip.description || !dadosVip.dateValidade || !dadosVip.detalis || !dadosVip.price) {
            throw new BadRequestException('Preencha todos os campos e uma foto.')
        }

        // const url = await this.backblazeService.uploadFile(file);

        const card = await this.cardsRepository.create({
            ...dadosVip,
            // photo: url
        });


        await this.cardsRepository.save(card)

        return { success: 'Card criado com sucesso!', card }

    }


    async getVips() {
        const cards = this.cardsRepository.find()

        return cards
    }

    async editVip(id: number, dados: any, file: Express.Multer.File){
        const card = await this.cardsRepository.findOne({where: {id: id}});
        
        if (!card) {
            throw new BadRequestException('Card não encontrado');
        }

         const url = await this.backblazeService.uploadFile(file, 'novidades');


        // Atualiza os campos do card com os novos dados
        Object.assign(card, {
            ...dados,
            photo: url
        });

        // Salva as alterações no banco de dados
        await this.cardsRepository.save(card);

        return { success: 'Card atualizado com sucesso!', card };
    }



    async getDimas() {
        const cards = this.cardsRepository.find()

        return cards
    }

    async editDimas(id: number, dados: any, file: Express.Multer.File){
        const card = await this.cardsRepository.findOne({where: {id: id}});
        
        if (!card) {
            throw new BadRequestException('Card não encontrado');
        }

         const url = await this.backblazeService.uploadFile(file, 'vip');


        // Atualiza os campos do card com os novos dados
        Object.assign(card, {
            ...dados,
            photo: url
        });

        // Salva as alterações no banco de dados
        await this.cardsRepository.save(card);

        return { success: 'Card atualizado com sucesso!', card };
    }




}
