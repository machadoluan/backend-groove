import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordService {
    private client: Client

    constructor(
        private configService: ConfigService
    ) {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
        })

        this.client.login(this.configService.get<string>('DISCORD_TOKEN'))

    }

    async getUserTag(guildName: string, discordId: string): Promise<string[] | null> {
        try {
            // Acessa as guilds que o bot está
            const guild = this.client.guilds.cache.find(
                (guild) => guild.name.toLowerCase() === guildName.toLowerCase(),
            );

            if (!guild) {
                throw new NotFoundException('Guild não encontrado');
            }

            // Busca o membro da guild
            const member = await guild.members.fetch(discordId);

            // Retorna as roles do usuário
            return member.roles.cache.map(role => role.name); // Aqui pegamos os nomes das roles
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}


