import { Body, Controller, Post } from '@nestjs/common';
import { EmailVerifyService } from './email-verify.service';

@Controller('email-send')
export class EmailVerifyController {

    constructor(private readonly emailService: EmailVerifyService) { }

    @Post()
    async sendEmail(@Body() dadosEmail: any) {
        console.log(dadosEmail)

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        await this.emailService.sendEmail(dadosEmail.email, codigo, dadosEmail.name);
        return { message: 'Email enviado com sucesso!', codigo }
    }
}
