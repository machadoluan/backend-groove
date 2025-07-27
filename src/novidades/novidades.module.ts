import { Module } from '@nestjs/common';
import { NovidadesController } from './novidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novidades } from 'src/entitys/novidades.entity';
import { BackblazeService } from 'src/backblaze/backblaze.service';
import { NovidadesService } from './novidades.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Novidades]),
  ],
  providers: [BackblazeService, NovidadesService],
  controllers: [NovidadesController]
})
export class NovidadesModule {}
