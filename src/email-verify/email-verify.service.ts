import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class EmailVerifyService {
    constructor(private configService: ConfigService,
        private readonly mailerService: MailerService
    ) { }


    async sendEmail(email: string, code: string, nome: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Codigo para verificação de email',
            template: 'email-verify',

            context: { code: code, nome: nome }
        })
    }
}
