import { Body, Controller, Post } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('twilio')
export class TwilioController {
    constructor(private readonly twilioService: TwilioService) {}

    @Post('enviar-codigo')
    async enviarCodigo(@Body('telefone') telefone: string){
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        
        // const resultado = await this.twilioService.enviarSMS(telefone, `Seu código é: ${codigo}`)

        // return {sucess: true, codigo, messageId: resultado.messageId}
        return {sucess: true, codigo}
    }
}
