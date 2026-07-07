import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { EmailService } from './email.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async create(dto: ContactDto) {
    const message = await this.prisma.contactMessage.create({
      data: {
        nom: dto.nom,
        email: dto.email,
        sujet: dto.sujet,
        message: dto.message,
      },
    });

    await this.email.sendContactNotification({
      nom: dto.nom,
      email: dto.email,
      sujet: dto.sujet,
      message: dto.message,
    });

    return message;
  }
}
