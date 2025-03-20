import { Module } from '@nestjs/common';
import { EmailVerifyController } from './email-verify.controller';
import { EmailVerifyService } from './email-verify.service';

@Module({
  controllers: [EmailVerifyController],
  providers: [EmailVerifyService]
})
export class EmailVerifyModule {}
