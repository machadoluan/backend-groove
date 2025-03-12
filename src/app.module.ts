import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio/twilio.service';
import { TwilioController } from './twilio/twilio.controller';
import { TwilioModule } from './twilio/twilio.module';
import { DiscordService } from './discord/discord.service';
import { DiscordModule } from './discord/discord.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: true
    }),
    AuthModule,
    AccountModule,
    TwilioModule,
    DiscordModule,
    PaymentModule,

  ],
  controllers: [AppController],
  providers: [AppService, DiscordService],
})
export class AppModule { }
