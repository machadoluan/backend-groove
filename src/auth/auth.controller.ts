// auth/auth.controller.ts
import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
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
            return res.redirect('https://front-groove.vercel.app/?error=not_in_guild');
        }

        return res.redirect(redirectTo);
    }

    @Get('steam')
    @UseGuards(AuthGuard('steam'))
    async steamAuth() {
        // Inicia o fluxo de autenticação da Steam
    }

    @Get('steam/callback')
    @UseGuards(AuthGuard('steam'))
    async steamAuthRedirect(@Req() req, @Res() res: Response) {
        const steamHex = req.user.steamHex;

    
        return res.redirect(`https://front-groove.vercel.app/cadastro?tokenS=${steamHex}`);
    }
    @Post('create')
    async createUser(@Body() dadosCadastro: any) {
        return this.authService.createUser(dadosCadastro)
    }
}