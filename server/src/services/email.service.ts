import nodemailer from 'nodemailer';
import { env } from '../config/env';

function createTransporter() {
  if (env.NODE_ENV === 'development' || !env.SMTP_HOST) {
    // Em dev, loga o email no console em vez de enviar
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 587),
    secure: env.SMTP_SECURE === 'true',
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

const transporter = createTransporter();
const FROM = env.EMAIL_FROM ?? 'ANSTARTUP Brasil <noreply@anstartup.com.br>';
const BASE_URL = env.FRONTEND_URL;

export const emailService = {
  async sendVerification(email: string, nome: string, token: string): Promise<void> {
    const link = `${BASE_URL}/verificar-email?token=${token}`;

    const info = await transporter.sendMail({
      from: FROM,
      to: email,
      subject: 'Confirme seu email — ANSTARTUP Brasil',
      html: `
        <h2>Olá, ${nome}!</h2>
        <p>Obrigado por se cadastrar na ANSTARTUP Brasil.</p>
        <p>Clique no link abaixo para confirmar seu email:</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#009B3A;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">
          Confirmar Email
        </a>
        <p>O link expira em 24 horas.</p>
        <p>Se você não criou uma conta, ignore este email.</p>
      `,
    });

    if (env.NODE_ENV === 'development') {
      console.log('📧 [email:verificacao]', link, info);
    }
  },

  async sendPasswordReset(email: string, nome: string, token: string): Promise<void> {
    const link = `${BASE_URL}/redefinir-senha?token=${token}`;

    const info = await transporter.sendMail({
      from: FROM,
      to: email,
      subject: 'Redefinição de senha — ANSTARTUP Brasil',
      html: `
        <h2>Olá, ${nome}!</h2>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#009B3A;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">
          Redefinir Senha
        </a>
        <p>O link expira em 1 hora.</p>
        <p>Se você não solicitou a redefinição, ignore este email.</p>
      `,
    });

    if (env.NODE_ENV === 'development') {
      console.log('📧 [email:reset-senha]', link, info);
    }
  },
};
