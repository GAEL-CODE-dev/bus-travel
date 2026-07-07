import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
    } else {
      this.logger.warn('Email non configuré — les messages sont stockés mais pas envoyés par email');
    }
  }

  async sendContactNotification(data: { nom: string; email: string; sujet?: string; message: string }) {
    const nom = escapeHtml(data.nom);
    const email = escapeHtml(data.email);
    const sujet = escapeHtml(data.sujet || 'Nouveau message');
    const message = escapeHtml(data.message);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8f9fa">
        <div style="background:#1B2A4A;padding:20px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0">BUS TRAVEL</h1>
          <p style="color:#C9A84C;margin:5px 0 0">Nouveau message de contact</p>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Nom</td><td style="padding:8px;font-weight:bold">${nom}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Email</td><td style="padding:8px;font-weight:bold">${email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Sujet</td><td style="padding:8px;font-weight:bold">${sujet}</td></tr>
            <tr><td style="padding:8px;vertical-align:top;color:#666">Message</td><td style="padding:8px">${message}</td></tr>
          </table>
        </div>
      </div>`;

    await this.send(process.env.COMPANY_EMAIL || 'contact@bustravel.cg', `Contact: ${sujet}`, html);
  }

  private async send(to: string, subject: string, html: string) {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"BUS TRAVEL" <${process.env.EMAIL_USER}>`,
          to,
          subject,
          html,
        });
        this.logger.log(`Email envoyé à ${to}: ${subject}`);
      } catch (err) {
        this.logger.error(`Échec envoi email: ${err}`);
      }
    } else {
      this.logger.log(`[EMAIL SIMULÉ] To: ${to} | Subject: ${subject}`);
    }
  }
}
