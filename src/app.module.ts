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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '132.255.58.65',
      port: 1324,
      username: 'luan',
      password: '428766',
      database: 'newyork',
      entities: [User],
      synchronize: true
    }),
    AuthModule,
    AccountModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TwilioModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
