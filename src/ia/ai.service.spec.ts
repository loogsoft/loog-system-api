import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  Content,
  GenerateContentParameters,
  GenerateContentResponse,
} from '@google/genai';
import { AiService } from './ai.service';

const mockGenerateContent = jest.fn<
  Promise<GenerateContentResponse>,
  [GenerateContentParameters]
>();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: { generateContent: mockGenerateContent },
  })),
}));

describe('AiService.gerarPublicacao', () => {
  let service: AiService;
  const imagem = {
    buffer: Buffer.from('imagem-original'),
    mimetype: 'image/jpeg',
  } as Express.Multer.File;
  const imagemGerada = {
    data: 'imagem-gerada-base64',
    mimeType: 'image/jpeg',
  };
  const respostaImagem = {
    candidates: [{ content: { parts: [{ inlineData: imagemGerada }] } }],
  } as GenerateContentResponse;
  const legenda =
    'Estilo para aproveitar os dias de sol. Conheça nossos looks! #Moda';

  beforeEach(() => {
    mockGenerateContent.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    service = new AiService(new ConfigService({ GEMINI_API_KEY: 'test-key' }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('gera a legenda em outra chamada quando a primeira resposta contém somente a imagem', async () => {
    mockGenerateContent
      .mockResolvedValueOnce(respostaImagem)
      .mockResolvedValueOnce({
        text: `  ${legenda}  `,
      } as GenerateContentResponse);

    const publicacao = await service.gerarPublicacao(imagem, 'Modelo na praia');

    expect(publicacao).toEqual({
      sucesso: true,
      legenda,
      imagem: { base64: imagemGerada.data, mimeType: imagemGerada.mimeType },
    });
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);

    const requisicaoLegenda = mockGenerateContent.mock.calls[1][0];
    const conteudos = requisicaoLegenda.contents as Content[];
    expect(requisicaoLegenda.model).toBe('gemini-3.5-flash-lite');
    expect(conteudos[0].parts?.[1].inlineData).toEqual(imagemGerada);
    expect(conteudos[0].parts?.[0].text).toContain('Modelo na praia');
  });

  it('ignora comentários da etapa de imagem ao preencher a legenda', async () => {
    mockGenerateContent
      .mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'Aqui está a arte, seguindo todas as suas instruções.',
                },
                { inlineData: imagemGerada },
              ],
            },
          },
        ],
      } as GenerateContentResponse)
      .mockResolvedValueOnce({ text: legenda } as GenerateContentResponse);

    const publicacao = await service.gerarPublicacao(imagem, 'Modelo na praia');

    expect(publicacao.legenda).toBe(legenda);
  });

  it('não tenta gerar legenda quando não recebe imagem', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      candidates: [
        { content: { parts: [{ text: 'Não foi possível gerar.' }] } },
      ],
    } as GenerateContentResponse);

    await expect(
      service.gerarPublicacao(imagem, 'Modelo na praia'),
    ).rejects.toThrow('O Gemini não retornou uma imagem gerada');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('não usa uma imagem interna de raciocínio como resultado final', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      candidates: [
        { content: { parts: [{ thought: true, inlineData: imagemGerada }] } },
      ],
    } as GenerateContentResponse);

    await expect(
      service.gerarPublicacao(imagem, 'Modelo na praia'),
    ).rejects.toThrow('O Gemini não retornou uma imagem gerada');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, '', '   '])(
    'rejeita uma legenda ausente ou vazia (%j), mesmo com a imagem gerada',
    async (texto) => {
      mockGenerateContent
        .mockResolvedValueOnce(respostaImagem)
        .mockResolvedValueOnce({ text: texto } as GenerateContentResponse);

      await expect(
        service.gerarPublicacao(imagem, 'Modelo na praia'),
      ).rejects.toThrow(
        'O Gemini gerou a imagem, mas não retornou uma legenda válida.',
      );
    },
  );

  it('rejeita legenda acima do limite usado pela publicação', async () => {
    mockGenerateContent
      .mockResolvedValueOnce(respostaImagem)
      .mockResolvedValueOnce({
        text: 'a'.repeat(2201),
      } as GenerateContentResponse);

    await expect(
      service.gerarPublicacao(imagem, 'Modelo na praia'),
    ).rejects.toThrow(
      'O Gemini retornou uma legenda com mais de 2200 caracteres.',
    );
  });

  it('retorna erro quando a chamada de legenda falha', async () => {
    mockGenerateContent
      .mockResolvedValueOnce(respostaImagem)
      .mockRejectedValueOnce(new Error('Falha de rede simulada'));

    await expect(
      service.gerarPublicacao(imagem, 'Modelo na praia'),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('preserva a validação da imagem e das instruções antes de chamar a IA', async () => {
    await expect(
      service.gerarPublicacao({} as Express.Multer.File, 'Modelo na praia'),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.gerarPublicacao(imagem, '   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });
});
