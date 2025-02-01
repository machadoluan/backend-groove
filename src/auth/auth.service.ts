import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async findOrCreaterUser(discordUser: any) {
        const { discordId, email } = discordUser;

        let user = await this.userRepository.findOne({ where: { discordId } })

        if (!user) {
            return { redirectTo: `http://localhost:4200/cadastro?tokend=${discordId}`, user: null };
        }

        const payload = {
            nome: user.nome,
            username: discordUser.username,
            discordId: discordUser.discordId,
            email: user.email,
            dataNascimento: user.dataNascimento,
            telefone: user.telefone,
            avatar: discordUser.avatar,
        }
        const token = this.jwtService.sign({ ...payload })

        return { redirectTo: `http://localhost:4200/?token=${token}` }
    }


    async create(dadosCadastro) {
        console.log(dadosCadastro)
        if (!dadosCadastro.discordId) {
            throw new Error('O campo discordID é obrigatório');
        }


        const user = this.userRepository.create(dadosCadastro)
        await this.userRepository.save(user)

        return { sucess: true }
    }
}
