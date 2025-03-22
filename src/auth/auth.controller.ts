// auth/auth.controller.ts
import { Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) { }



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

        const userGuilds = discordUser.guilds.map(guild => guild.id);
        if (!userGuilds.includes(process.env.SERVER_ID)) {
            return res.redirect(`${process.env.URL_FONTEND}/?error=not_in_guild`);
        }

        return res.redirect(redirectTo);
    }

    @Get('steam')
    @UseGuards(AuthGuard('steam'))
    async steamAuth() {
    }

    @Get('steam/callback')
    @UseGuards(AuthGuard('steam'))
    async steamAuthRedirect(@Req() req, @Res() res: Response) {
        const steamHex = req.user.steamHex;

        const tempToken = this.jwtService.sign({steamHex}) 
        return res.redirect(`${process.env.URL_FONTEND}/cadastro?tokenS=${tempToken}`);
    }
    @Post('create')
    async createUser(@Body() dadosCadastro: any) {
        return this.authService.createUser(dadosCadastro)
    }

    @Put('update')
    async updateUser(@Body() dadosUpdate: any) {
        return this.authService.updateUser(dadosUpdate)
    }
}