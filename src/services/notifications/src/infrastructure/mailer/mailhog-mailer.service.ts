import { MailerService, SendMailPayload } from '@core/mailer/mailer.service';
import { Logger } from '@krater/building-blocks';
import Handlebars from 'handlebars';
import { Transporter, createTransport } from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface Dependencies {
  logger: Logger;
}

export class MailhogMailerService implements MailerService {
  private transporter: Transporter;

  constructor(private readonly dependencies: Dependencies) {
    this.transporter = createTransport({
      host: 'localhost',
      port: 1025,
    });
  }

  public async sendMail({
    payload,
    subject,
    template: templateName,
    to,
    from = 'team@krater.pl',
  }: SendMailPayload): Promise<void> {
    const { logger } = this.dependencies;

    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, 'templates', `${templateName}.html`),
      'utf-8',
    );

    const template = Handlebars.compile(emailTemplateSource);

    const htmlToSend = template(payload);

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html: htmlToSend,
    });

    logger.info(`[Mailer Service]: Email with subject: "${subject}" sent to "${to}".`);
  }
}
