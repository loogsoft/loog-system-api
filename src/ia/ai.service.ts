import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { BadGatewayException } from '@nestjs/common';
@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async perguntar(mensagem: string) {
    if (typeof mensagem !== 'string' || !mensagem.trim()) {
      throw new BadRequestException('Mensagem obrigatória');
    }
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: mensagem,
        });

        return {
          pergunta: mensagem,
          resposta: response.text,
        };

      } catch (error: any) {
        console.error(`Tentativa ${tentativa}:`, error.status);

        if (error.status !== 503 || tentativa === 3) {
          throw new InternalServerErrorException(
            'Não foi possível consultar a IA',
          );
        }

        await new Promise(resolve =>
          setTimeout(resolve, tentativa * 2000),
        );
      }
    }
  }

  async listarModelos() {
    const modelos: {
      nome: string | undefined;
      metodos: string[] | undefined;
    }[] = [];

    const response = await this.ai.models.list();

    for await (const model of response) {
      modelos.push({
        nome: model.name,
        metodos: model.supportedActions,
      });
    }

    return modelos;
  }

  async gerarPublicacao(imagem: Express.Multer.File, mensagem: string) {
    if (!imagem?.buffer) {
      throw new BadRequestException('Imagem obrigatória');
    }

    if (!mensagem?.trim()) {
      throw new BadRequestException('Mensagem obrigatória');
    }

    const prompt = `
  Você é um designer publicitário especializado em publicações para Instagram.

  Crie uma imagem a partir da referência enviada.

  INSTRUÇÕES DO USUÁRIO:
  ${mensagem.trim()}

  REGRAS PARA A IMAGEM:
  - Utilize a imagem enviada como referência principal.
  - Preserve as características reais do produto.
  - Respeite as cores, o estilo e as alterações solicitadas.
  - Priorize o formato quadrado 1:1 para Instagram.
  - Não invente preços, descontos ou informações comerciais.

  Retorne a imagem gerada. A legenda será criada em outra etapa.
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imagem.mimetype,
                  data: imagem.buffer.toString('base64'),
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const partes = response.candidates?.[0]?.content?.parts ?? [];

      let imagemBase64: string | undefined;
      let mimeType = 'image/png';

      for (const parte of partes) {
        if (!parte.thought && parte.inlineData?.data?.trim()) {
          imagemBase64 = parte.inlineData.data.trim();
          mimeType = parte.inlineData.mimeType ?? 'image/png';
        }
      }

      if (!imagemBase64) {
        throw new BadGatewayException(
          'O Gemini não retornou uma imagem gerada',
        );
      }

      const respostaLegenda = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Crie a legenda para a imagem desta publicação.
                Contexto informado pelo usuário: ${mensagem.trim()}`,
              },
              {
                inlineData: {
                  mimeType,
                  data: imagemBase64,
                },
              },
            ],
          },
        ],
        config: {
          systemInstruction: `
            Você escreve legendas publicitárias em português do Brasil para Instagram.
            Retorne somente a legenda final, pronta para publicar junto à imagem.
            Escreva para o público da loja, com um texto natural e atrativo.
            Use a imagem como referência e o contexto do usuário para orientar o conteúdo.
            As instruções de edição da imagem são apenas contexto, não texto para a legenda.
            Inclua uma chamada para ação e hashtags relevantes.
            Não invente preços, descontos, contatos ou informações comerciais.
            Não mencione instruções, edição, geração de imagem, IA ou o que foi feito.
            Não inclua introduções como "Aqui está", títulos como "Legenda",
            explicações, formatação Markdown ou ofertas de outras versões.
            A legenda deve ter no máximo 2200 caracteres, incluindo as hashtags.
          `,
          responseMimeType: 'text/plain',
        },
      });

      const legenda = respostaLegenda.text?.trim();

      if (!legenda) {
        throw new BadGatewayException(
          'O Gemini gerou a imagem, mas não retornou uma legenda válida. Tente novamente.',
        );
      }

      if (legenda.length > 2200) {
        throw new BadGatewayException(
          'O Gemini retornou uma legenda com mais de 2200 caracteres. Tente novamente.',
        );
      }

      return {
        sucesso: true,
        legenda,
        imagem: {
          base64: imagemBase64,
          mimeType,
        },
      };
    } catch (error: unknown) {
      console.error('Erro ao gerar publicação:', error);

      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException(
        'Não foi possível gerar a publicação com o Gemini',
      );
    }
  }
}
