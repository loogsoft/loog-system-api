import { Body, Controller, Get, Headers, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AsaasService } from './asaas.service';
import { ConfigService } from '@nestjs/config/dist';
import { RequestAssasDto } from './dto/request-asaas.dto';
import { AsaasWebhookDto } from './dto/asaas-webhook-dto';

@Controller('asaas')
export class AsaasController {
  constructor(
    private readonly asaasService: AsaasService,
    private readonly configService: ConfigService,
  ) { }

  @Get('clientes')
  listarClientes() {
    return this.asaasService.listarClientes();
  }

  @Post('clientes')
  criarCliente(@Body() dto: RequestAssasDto) {
    return this.asaasService.criarCliente(dto);
  }

  @Post('assinaturas')
  criarAssinatura() {
    return this.asaasService.criarAssinatura(
      'cus_000009703923',
    );
  }

  @Post('registro')
  registrarConta(@Body() dto: RequestAssasDto) {
    return this.asaasService.criarCliente(dto);
  }

  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Body() body: AsaasWebhookDto,
  ): Promise<string> {
    return this.asaasService.receberWebhook(body);
  }

}
