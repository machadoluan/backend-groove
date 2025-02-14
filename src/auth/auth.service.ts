import { HttpException, HttpStatus, Inject, Injectable, Res, UnauthorizedException } from '@nestjs/common';
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

    discordUser: any

    async findOrCreaterUser(discordUser: any) {
        this.discordUser = discordUser
        const discordId = this.discordUser.discordId

        let user = await this.userRepository.findOne({ where: { discordId } })

        if (!user) {
            return { redirectTo: `https://front-groove.vercel.app/cadastro?tokend=${discordId}`, user: null };
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

        return { redirectTo: `https://front-groove.vercel.app/?token=${token}` }
    }

    async createUser(dadosCadastro: any) {
        if (!dadosCadastro.discordId) {
            throw new Error('O campo discord é obrigatorio')
        }


        const user = this.userRepository.create(dadosCadastro)
        await this.userRepository.save(user)

        const payload = {
            username: this.discordUser.username,
            avatar: this.discordUser.avatar,
            ...user
        }

        const token = this.jwtService.sign({ ...payload })

        return { sucess: 'Usuario cadastrado com sucesso!', token }
    }
}
