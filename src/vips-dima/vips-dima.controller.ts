import { Body, Controller, Get, Post, Put, Query, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { VipsDimaService } from './vips-dima.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('card')
export class VipsDimaController {
    constructor(private readonly vipsDimaService: VipsDimaService) { }

    @Post('vip')
    // @UseInterceptors(FilesInterceptor('files'))
    async createVip(@Body() dadosVip: any, @UploadedFile() file: Express.Multer.File) {
        return this.vipsDimaService.createVip(dadosVip, file)
    }

    @Get('vip')
    async vips(){
        return this.vipsDimaService.getVips()
    }

    @Patch('edit')
    @UseInterceptors(FileInterceptor('file'))
    async editVip(
      @Query('id') id: number,
      @Body() dados: any,
      @UploadedFile() file: Express.Multer.File
    ) {
      console.log('DADOS:', dados);
      console.log('ARQUIVO:', file);
      return this.vipsDimaService.editVip(+id, dados, file);
    }
    
}
