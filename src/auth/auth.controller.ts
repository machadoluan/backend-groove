// auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('discord')
    @UseGuards(AuthGuard('discord'))
    async discordAuth() {
        // Inicia o fluxo de autenticação do Discord
    }

    @Get('discord/callback')
    @UseGuards(AuthGuard('discord'))
    async discordAuthRedirect(@Req() req, @Res() res: Response) {
        const discordUser = req.user;
        const { redirectTo } = await this.authService.findOrCreaterUser(discordUser);

        const userGuilds = discordUser.guilds.map(guild => guild.name);
        if (!userGuilds.includes('New York City')) {
            return res.redirect('http://localhost:4200/?error=not_in_guild');
        }

        return res.redirect(redirectTo);
    }


    @Post('cadastro')
    async cadastrarUsuario(@Body() dadosCadastro: any) {
        return this.authService.create(dadosCadastro)
    }
}