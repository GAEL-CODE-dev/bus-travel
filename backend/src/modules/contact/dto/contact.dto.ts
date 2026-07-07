import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-ZÀ-ÿ\s-]{2,100}$/)
  nom: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Question sur un trajet' })
  @IsOptional()
  @IsString()
  sujet?: string;

  @ApiProperty({ example: 'Bonjour, je souhaite réserver...' })
  @IsString()
  @MinLength(10)
  message: string;
}
