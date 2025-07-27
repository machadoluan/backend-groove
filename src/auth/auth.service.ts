import { HttpException, HttpStatus, Inject, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entitys/user.entity';

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
            const tempToken = this.jwtService.sign({ discordId })
            return { redirectTo: `${process.env.URL_FONTEND}/cadastro?tokend=${tempToken}`, user: null };
        }

        const payload = {
            ...user,
            username: discordUser.username,
            discordId: discordUser.discordId,
            avatar: discordUser.avatar,
        }
        const token = this.jwtService.sign({ ...payload })

        return { redirectTo: `${process.env.URL_FONTEND}/?token=${token}` }
    }

    async createUser(dadosCadastro: any) {
        if (!dadosCadastro.discordId) {
            throw new Error('O campo discord é obrigatorio')
        }


        const existingUser = await this.userRepository.findOne({ where: { license: dadosCadastro.license } })
        if (existingUser) {
            throw new UnauthorizedException({ message: 'Usuário cadastrado em outro discord, entre em contato com a nossa equipe!' });

        }


        const userCompleted = {
            ...dadosCadastro,
            username: this.discordUser.username,
            avatar: this.discordUser.avatar,
            fila: true
            
        }


        const user = this.userRepository.create(userCompleted)


        await this.userRepository.save(user)

        const payload = {
            ...user
        }

        const token = this.jwtService.sign({ ...payload })

        return { sucess: 'Usuario cadastrado com sucesso!', token }
    }

    async updateUser(dadosUpdate: any) {

        if (!dadosUpdate.discordId) {
            throw new Error('O campo discord é obrigatorio')
        }

        const user = await this.userRepository.findOne({ where: { discordId: dadosUpdate.discordId } })

        if (!user) {
            throw new Error('Usuario não encontrado!')
        }

        Object.assign(user, dadosUpdate)

        await this.userRepository.save(user)


        console.log(user)
        const payload = {
            ...user
        }

        const token = this.jwtService.sign({ ...payload })

        return { sucess: 'Usuario alterado com sucesso!', token };
    }
}
