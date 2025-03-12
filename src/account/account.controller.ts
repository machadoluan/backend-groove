import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {

    constructor(private readonly accountService: AccountService) { }


    @Get(':discordId/characters')
    async getCharacters(@Param('discordId') discordId: string) {
        const characters = this.accountService.getCharactersByLicense(discordId)

        if (!characters) {
            throw new NotFoundException('Nenhum character encontrado para este usuário');
        }

        return characters
    }
    @Get(':discordId/account')
    async getAccount(@Param('discordId') discordId: string) {
        const characters = this.accountService.getAccoutnsByLicense(discordId)

        if (!characters) {
            throw new NotFoundException('Nenhuma conta encontrada');
        }

        return characters
    }

    @Post('releaseAllowList/:discordId')
    async releaseAllowList(@Param('discordId') discordId: string) {
        const characters = this.accountService.releaseAllowList(discordId)

        if (!characters) {
            throw new NotFoundException('Nenhuma conta encontrada');
        }

        return characters
    }
}
