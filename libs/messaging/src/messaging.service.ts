import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'smtpexpress';
import { Twilio } from 'twilio';
import { MessageDto } from './messaging.dto';

@Injectable()
export class MessagingService {
  private emailClient: any;
  private senderEmail: string;

  constructor(private configService: ConfigService) {
    this.emailClient = createClient({
      projectId: this.configService.get('SMTPEXPRESS_PROJECT_ID'),
      projectSecret: this.configService.get('SMTPEXPRESS_PROJECT_SECRET'),
    });
    this.senderEmail = this.configService.get('SMTPEXPRESS_SENDER_EMAIL');
  }

  async sendEmail(dto: MessageDto) {
    await this.emailClient.sendApi.sendMail({
      subject: dto.subject,
      message: dto.message,
      sender: {
        name: 'LuxyRide',
        email: this.senderEmail,
      },
      recipients: { name: dto.name, email: dto.contact },
    });
  }
}
