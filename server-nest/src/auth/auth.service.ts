import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, CookieOptions } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/common/services/mailer.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { throwError } from 'src/common/utils/helpers';
import { GoogleUser, JwtPayload, MulterFile } from 'src/common/types/type.d';
import { EMAIL_TYPES } from 'src/common/lib/constants';
import { Role } from '@prisma/client';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { hashPassword, verifyPassword } from 'src/common/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly uploadService: StorageService,
    private readonly mailerService: MailerService,
  ) {}

  async register(
    { email, name, password, role }: RegisterDto,
    image: MulterFile,
  ) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists)
        throw throwError('Email already in use', HttpStatus.CONFLICT);

      const { hash, salt } = hashPassword(password);

      const image_url = await this.uploadService.uploadFile(image);
      if (!image_url)
        throw throwError('Image upload failed', HttpStatus.BAD_REQUEST);

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          profileImage: image_url.filename,
          password: hash,
          salt,
          role,
        },
      });

      if (!user)
        throw throwError('Failed to register user', HttpStatus.BAD_REQUEST);

      return {
        message: 'User registered successfully',
        data: user,
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
