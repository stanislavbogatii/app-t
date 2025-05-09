import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import * as argon from 'argon2';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
import { SignInDto, SignUpDto } from './dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
    ) {}
  
    async signup(dto: SignUpDto) {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (userExists) {
        console.log('exits')
        throw new ForbiddenException(
          'User with this email already exists',
        );
      }

      const hash = await argon.hash(dto.password);
      try {
        const user = await this.prisma.user.create({
          data: {
            email: dto.email,
            hash,
            profile: {
              create: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto?.phone,
                gender: dto?.gender
              }
            },
            company: {
              create: {
                name: dto.companyName,
                commercialName: dto.companyCommercialName,
                phone: dto.companyPhone,
                fiscalCode: dto.companyFiscalCode
              }
            }
          },
        });

        return this.signToken(user.id, user.email);
      } catch (error) {
        console.log(error)
        if (
          error instanceof
          PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Credentials taken',
            );
          }
        }
        throw error;
      }
    }
  
    async signin(dto: SignInDto) {
      // find the user by email
      const user =
        await this.prisma.user.findUnique({
          where: {
            email: dto.email,
          },
        });
      // if user does not exist throw exception
      if (!user)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
  
      // compare password
      const pwMatches = await argon.verify(
        user.hash,
        dto.password,
      );
      // if password incorrect throw exception
      if (!pwMatches)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
      return this.signToken(user.id, user.email);
    }
  
    async signToken(
      userId: number,
      email: string,
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: userId,
        email,
      };
      const secret = this.config.get('JWT_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          expiresIn: '15m',
          secret: secret,
        },
      );
  
      return {
        access_token: token,
      };
    }
  }