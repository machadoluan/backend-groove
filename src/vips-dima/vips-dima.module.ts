import { Module } from '@nestjs/common';
import { VipsDimaController } from './vips-dima.controller';
import { Cards } from './cards.enitity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VipsDimaService } from './vips-dima.service';
import { BackblazeService } from 'src/backblaze/backblaze.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cards]),
  ],
  providers: [VipsDimaService, BackblazeService],
  controllers: [VipsDimaController]
})
export class VipsDimaModule {}
