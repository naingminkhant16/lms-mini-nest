import { Injectable } from '@nestjs/common';
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

  async sendVerifyMail(to: string, name: string, callbackURL: string) {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject: 'Please verify your email',
      template: 'verify-mail',
      context: { name, callbackURL, year: new Date().getFullYear() },
    };

    return this.transporter.sendMail(mailOptions);
  }
}
