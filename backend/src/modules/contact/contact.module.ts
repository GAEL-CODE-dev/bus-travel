import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { EmailService } from './email.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, EmailService, PrismaService],
})
export class ContactModule {}
