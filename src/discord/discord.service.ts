import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Guild } from 'discord.js';

@Injectable()
export class DiscordService {
    private client: Client
    private guild: Guild

    constructor(
        private configService: ConfigService
    ) {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
        })

        this.client.login(this.configService.get<string>('DISCORD_TOKEN'))

    }

    async getUserTag(discordId: string): Promise<string[] | null> {
        try {
            // Acessa as guilds que o bot está
            const guild = this.client.guilds.cache.find(
                (guild) => guild.id === process.env.SERVER_ID,
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

    async createInvite(): Promise<string> {
        const channelId = '1162761936346300497'; // ID do canal desejado
        const channel = this.client.channels.cache.get(channelId);
    
        if (!channel || channel.type !== 0) {
            throw new Error('Canal não encontrado ou tipo de canal inválido');
        }
    
        // Cria o convite sem expiração e com usos ilimitados
        const invite = await (channel as any).createInvite({
            maxAge: 0, // Nunca expira
            maxUses: 0, // Usos ilimitados
            unique: true, // Garante um link único
        });
    
        return invite.url;
    }
    
}


