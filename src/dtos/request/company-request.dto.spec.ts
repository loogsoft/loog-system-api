import { ValidationPipe } from '@nestjs/common';
import { RequestAssasDto } from '../../asaas/dto/request-asaas.dto';
import { CompanyRequestDto } from './company-request.dto';
import { UpdateCompanyRequestDto } from './update-company-request.dto';

describe.each([
  {
    name: 'CompanyRequestDto',
    metatype: CompanyRequestDto,
    documentField: 'companyCpfCnpj',
    body: {
      companyName: 'Empresa de teste',
      companyEmail: 'teste@example.com',
      companyPhone: '11999999999',
      color: '#112233',
    },
  },
  {
    name: 'RequestAssasDto',
    metatype: RequestAssasDto,
    documentField: 'cpfCnpj',
    body: { name: 'Empresa de teste', email: 'teste@example.com' },
  },
])('$name: validação de CPF/CNPJ', ({ metatype, documentField, body }) => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    validationError: { target: false, value: false },
  });

  it.each([
    { informado: '52998224725', normalizado: '52998224725' },
    { informado: '529.982.247-25', normalizado: '52998224725' },
    { informado: '012.345.678-90', normalizado: '01234567890' },
    { informado: '11222333000181', normalizado: '11222333000181' },
    { informado: '11.222.333/0001-81', normalizado: '11222333000181' },
  ])(
    'aceita documento válido: $informado',
    async ({ informado, normalizado }) => {
      await expect(
        pipe.transform(
          { ...body, [documentField]: informado },
          { type: 'body', metatype },
        ),
      ).resolves.toMatchObject({ [documentField]: normalizado });
    },
  );

  it.each([
    '12332123411',
    '52998224726',
    '11222333000182',
    '11111111111',
    '00000000000000',
    '123',
  ])('retorna 400 para documento inválido: %s', async (documento) => {
    await expect(
      pipe.transform(
        { ...body, [documentField]: documento },
        { type: 'body', metatype },
      ),
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        message: ['CPF ou CNPJ inválido.'],
      },
    });
  });
});

describe('UpdateCompanyRequestDto: validação herdada', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  it('também rejeita CPF inválido ao atualizar a empresa', async () => {
    await expect(
      pipe.transform(
        { companyCpfCnpj: '12332123411' },
        { type: 'body', metatype: UpdateCompanyRequestDto },
      ),
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        message: ['CPF ou CNPJ inválido.'],
      },
    });
  });

  it('mantém o documento opcional na atualização', async () => {
    await expect(
      pipe.transform(
        { companyName: 'Novo nome' },
        { type: 'body', metatype: UpdateCompanyRequestDto },
      ),
    ).resolves.toMatchObject({ companyName: 'Novo nome' });
  });
});
