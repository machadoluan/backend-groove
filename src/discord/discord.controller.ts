import { Controller, Get, Param } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
    constructor(private readonly discordService: DiscordService) { }

    @Get('roles/:discordId')
    async getUserTag(@Param('discordId') discordId: string): Promise<{ roles: any }> {
        const roles = await this.discordService.getUserTag( discordId);

        if (!roles) {
            return { roles: ['Erro ao obter roles ou usuário não encontrado!'] };
        }
        return { roles }
    }

    @Get('invite')
    async getInvite() {
        const invite = await this.discordService.createInvite();
        return { invite };
    }
}
