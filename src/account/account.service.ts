import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getCharactersByLicense(discordId: string) {
        // Buscar o usuário pelo discordId
        const user = await this.userRepository.findOne({
            where: { discordId },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Consulta para pegar todos os characters com o mesmo license
        const charactersQuery = `
          SELECT * FROM characters
          WHERE license = ?
        `;

        // Executando a query com a license do usuário
        const characters = await this.userRepository.query(charactersQuery, [user.license]);

        return characters;
    }

    async getAccoutnsByLicense(discordId: string) {
        // Buscar o usuário pelo discordId
        const user = await this.userRepository.findOne({
            where: { discordId },
        });

        if (!user) {
            // Se não encontrar o usuário, lançar um erro
            throw new NotFoundException('Usuário não encontrado');
        }

        // Consulta para pegar todos os characters com o mesmo license
        const charactersQuery = `
          SELECT * FROM accounts
          WHERE license = ?
        `;

        // Executando a query com a license do usuário
        const characters = await this.userRepository.query(charactersQuery, [user.license]);

        return characters;
    }

    async releaseAllowList(discordId: string) {
        const user = await this.userRepository.findOne({
            where: { discordId },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const updateWhitelistQuery = `
            UPDATE accounts
            SET whitelist = 1
            WHERE license = ?
        `;

        await this.userRepository.query(updateWhitelistQuery, [user.license]);

        // Retorna uma mensagem de sucesso ou outro dado relevante
        return { message: 'Whitelist liberada com sucesso' };
    }
}
