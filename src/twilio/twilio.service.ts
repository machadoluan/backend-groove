import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
    private twilioClient: Twilio.Twilio

    constructor(
        private configService: ConfigService
    ) {
        this.twilioClient = Twilio(
            this.configService.get<string>('TWILIO_ACCOUNT_SID'),
            this.configService.get<string>('TWILIO_AUTH_TOKEN'),
        )
    }

    async enviarSMS(telefone: string, mensagem: string){
        try {
            const response = await this.twilioClient.messages.create({
                body: mensagem,
                from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
                to: telefone
            })
            console.log('SMS Enviado', response.sid);
            return {sucess: true, messageId: response.sid};
        }

        catch(error) {
            console.error('Erro ao enviar SMS', error);
            throw new Error('Error ao enviar SMS');
        }
    }
}
