import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import { RequestAssasDto } from './dto/request-asaas.dto';
import { addMonths, format } from 'date-fns';
import { AsaasWebhookDto } from './dto/asaas-webhook-dto';
import { CompanyService } from 'src/services/company.service';
import { SubscriptionStatusEnum } from 'src/dtos/enums/subscription-status.enum';

@Injectable()
export class AsaasService {
  private readonly logger = new Logger(AsaasService.name);

  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>(
      'ASAAS_BASE_URL',
    );

    this.apiKey = this.configService.getOrThrow<string>(
      'ASAAS_API_KEY_TEST',
    );
  }

  async listarClientes() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/customers`, {
          headers: {
            access_token: this.apiKey,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('STATUS ASAAS:', error.response?.status);
        console.error('ERRO ASAAS:', error.response?.data);
      } else {
        console.error('ERRO INTERNO:', error);
      }

      throw new InternalServerErrorException(
        'Erro ao consultar clientes no Asaas',
      );
    }
  }

  async criarCliente(dto: RequestAssasDto) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/customers`,
        {
          name: dto.name,
          cpfCnpj: dto.cpfCnpj,
          email: dto.email,
        },
        {
          headers: {
            access_token: this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'LoogSystem/1.0',
          },
        },
      ),
    );

    return response.data;
  }

  async registrarConta(dto: RequestAssasDto) {
    const cliente = await this.criarCliente(dto);
    const assinatura = await this.criarAssinatura(cliente.id);

    return assinatura.id;
  }


  async criarAssinatura(customerId: string) {
    const hoje = new Date();

    // Adiciona 1 mês à data atual
    const vencimento = addMonths(hoje, 1);

    // Formata a data para o padrão exigido pelo Asaas
    const nextDueDate = format(vencimento, 'yyyy-MM-dd');

    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/subscriptions`,
        {
          customer: customerId,
          billingType: 'UNDEFINED',
          value: 150,
          nextDueDate,
          cycle: 'MONTHLY',
          description: 'Mensalidade Loog System',
        },
        {
          headers: {
            access_token: this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'LoogSystem/1.0',
          },
        },
      ),
    );

    return response.data;
  }

  async receberWebhook(body: AsaasWebhookDto): Promise<string> {
    const pagamentoValido =
      body.event === 'PAYMENT_RECEIVED' || body.event === 'PAYMENT_CONFIRMED';

    if (!pagamentoValido) {
      return 'Evento ignorado: não representa um pagamento recebido ou confirmado.';
    }

    const subscriptionId = body.payment.subscription;

    if (!subscriptionId) {
      return 'Pagamento ignorado: não possui assinatura vinculada.';
    }

    const vencimentoAsaas = body.payment.originalDueDate;

    if (!vencimentoAsaas) {
      throw new BadRequestException(
        'Pagamento sem data de vencimento original',
      );
    }

    const company = await this.companyService.findById(
      undefined,
      subscriptionId,
    );

    if (!company.paymentDueDay) {
      throw new BadRequestException('Empresa sem vencimento cadastrado');
    }

    const vencimentoBanco = format(company.paymentDueDay, 'yyyy-MM-dd');

    if (vencimentoBanco !== vencimentoAsaas) {
      return 'Inscrição não atualizada: vencimento diferente do cadastrado.';
    }

    await this.companyService.updateSubscription(
      company.id,
      SubscriptionStatusEnum.ACTIVATED,
    );

    console.log("Inscrição atualizada com sucesso!");
    return 'Inscrição atualizada com sucesso!';
  }

  async buscarLinkPagamento(subscriptionId: string): Promise<string | null> {
    const response = await firstValueFrom(
      this.httpService.get<{
        data: { status: string; invoiceUrl?: string | null }[];
      }>(
        `${this.baseUrl}/subscriptions/${subscriptionId}/payments`,
        {
          headers: {
            access_token: this.apiKey,
          },
        },
      ),
    );

    const pagamentos = response.data.data;

    const pendente = pagamentos.find(
      (payment) =>
        payment.status === 'PENDING' ||
        payment.status === 'OVERDUE',
    );

    return pendente?.invoiceUrl ?? null;
  }
}
