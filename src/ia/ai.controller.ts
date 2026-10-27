
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('perguntar')
  async perguntar(@Body('mensagem') mensagem: string) {
    return this.aiService.perguntar(mensagem);
  }

  @Get('modelos')
  async listarModelos() {
    return this.aiService.listarModelos();
  }

  @Post('gerar-publicacao')
  @UseInterceptors(
    FileInterceptor('imagem', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async gerarPublicacao(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(jpeg|png|webp)/,
        })
        .build(),
    )
    imagem: Express.Multer.File,
    @Body('mensagem') mensagem: string,
  ) {
    return this.aiService.gerarPublicacao(imagem, mensagem);
  }
}
