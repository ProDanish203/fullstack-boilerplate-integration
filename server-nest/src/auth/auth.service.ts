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
}
