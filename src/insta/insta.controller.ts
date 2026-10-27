import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InstagramContainerRequestDto } from '../dtos/request/instagram-container-request.dto';
import { InstagramMediaRequestDto } from '../dtos/request/instagram-media-request.dto';
import { InstaService } from './insta.service';

@UseGuards(JwtAuthGuard)
@Controller('insta')
export class InstaController {
  constructor(private readonly instaService: InstaService) {}

  @Get('account')
  getAccount() {
    return this.instaService.getAccount();
  }

  @Post('media')
  criarMidia(@Body() dto: InstagramMediaRequestDto) {
    return this.instaService.criarMidia(dto.imageUrl, dto.caption);
  }

  @Get('media/:containerId/status')
  verificarStatus(@Param() params: InstagramContainerRequestDto) {
    return this.instaService.verificarStatus(params.containerId);
  }

  @Post('publish')
  publicar(@Body() dto: InstagramContainerRequestDto) {
    return this.instaService.publicar(dto.containerId);
  }
}
