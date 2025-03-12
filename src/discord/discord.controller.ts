import { Controller, Get, Param } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
    constructor(private readonly discordService: DiscordService) { }

    @Get('roles/:guildName/:discordId')
    async getUserTag(@Param('guildName') guildName: string, @Param('discordId') discordId: string): Promise<{ roles: any }> {
        const roles = await this.discordService.getUserTag(guildName, discordId);

        if (!roles) {
            return { roles: ['Erro ao obter roles ou usuário não encontrado!'] };
        }
        return { roles }
    }
}
