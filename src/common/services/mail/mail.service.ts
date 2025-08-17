import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    this.transporter.use(
      'compile',
      nodemailerExpressHandlebars({
        viewEngine: {
          extname: '.hbs',
          partialsDir: './src/common/services/mail/templates/',
          layoutsDir: './src/common/services/mail/templates/',
          defaultLayout: false,
        },
        viewPath: './src/common/services/mail/templates/',
        extName: '.hbs',
      }),
    );
  }

  async sendVerifyMail(
    to: string,
    name: string,
    callbackURL: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject: 'Please verify your email',
      template: 'verify-mail',
      context: { name, callbackURL, year: new Date().getFullYear() },
    };

    try {
      this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }

  async sendResetPasswordCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Password Reset Code',
      template: 'reset-password',
      context: { code, year: new Date().getFullYear() },
    };

    try {
      this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new InternalServerErrorException(
        'Error sending reset password email',
      );
    }
  }
}
