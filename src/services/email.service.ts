import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { toLogString } from 'src/utils/logging';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationCode(email: string, code: string) {
    this.logger.log(
      `sendVerificationCode:start ${toLogString({ email, code })}`,
    );

    try {
      await this.resend.emails.send({
        from: 'Loog System <onboarding@resend.dev>',
        to: 'andersonmendesdesouza2007@gmail.com',
        subject: 'Código de verificação – Loog System',
        html: `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f5f6f8;
    padding: 24px;
  ">
    <div style="
      max-width: 480px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 8px;
      text-align: center;
    ">
      <h1 style="
        font-size: 20px;
        color: #222;
        margin-bottom: 12px;
      ">
        Código de verificação
      </h1>

      <p style="
        font-size: 14px;
        color: #555;
        margin-bottom: 24px;
      ">
        Use o código abaixo para confirmar seu acesso:
      </p>

      <p style="
        font-size: 10px;
        color: #555;
        margin-bottom: 24px;
      ">
        Acesso pedido por: ${email}
      </p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #000;
        background: #f0f2f5;
        padding: 16px 0;
        border-radius: 6px;
        margin-bottom: 24px;
      ">
        ${code}
      </div>

      <p style="
        font-size: 12px;
        color: #888;
        margin: 0;
      ">
        Se você não solicitou este código, pode ignorar este email.
      </p>

      <p style="
        font-size: 12px;
        color: #aaa;
        margin-top: 24px;
      ">
        Loog System
      </p>
    </div>
  </div>
`,
      });
      this.logger.log('sendVerificationCode:success');
    } catch (err) {
      this.logger.error('sendVerificationCode:error', JSON.stringify(err));
    }
  }
}
