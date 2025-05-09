import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { AccountModule } from './account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from './twilio/twilio.module';
import { DiscordService } from './discord/discord.service';
import { DiscordModule } from './discord/discord.module';
import { PaymentModule } from './payment/payment.module';
import { EmailVerifyModule } from './email-verify/email-verify.module';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TicketService } from './ticket/ticket.service';
import { TicketModule } from './ticket/ticket.module';
import { Ticket } from './ticket/entity/ticket.entity';
import { TicketMessage } from './ticket/entity/ticket-message.entity';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsLog } from './analytics/analytics-log.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: parseInt(configService.get<string>('SMTP_PORT')),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: { from: '"Equipe Suporte" <contato@groovegg.com.br>' },
        template: {
          dir: join(__dirname, 'mails'), // ⬅️ Caminho correto para os templates
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService], // Adicionei a injeção aqui também!
    }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      charset: 'utf8mb4',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Ticket, TicketMessage, AnalyticsLog],
      synchronize: true
    }),
    AuthModule,
    AccountModule,
    TwilioModule,
    DiscordModule,
    PaymentModule,
    EmailVerifyModule,
    TicketModule,
    AnalyticsModule,

  ],
  controllers: [AppController],
  providers: [AppService, DiscordService],
})
export class AppModule { }
