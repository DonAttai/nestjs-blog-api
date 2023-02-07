import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(user: SignUpDto) {
    //check if user exits
    const isUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (isUser) throw new ForbiddenException('User exits! Please, login ');

    //hash password
    user.password = await argon.hash(user.password);

    //create user
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      include: {
        posts: true,
      },
    });

    return this.jwtToken(newUser.id, newUser.email);
  }

  async signin(user: SignInDto) {
    //check if user exits
    const isUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!isUser)
      throw new NotFoundException('User does not exist! Please, signup');

    // compare password
    const isPasswordMatch = await argon.verify(isUser.password, user.password);

    //check if password match
    if (!isPasswordMatch) {
      throw new ForbiddenException('Password is incorrect!');
    }

    return this.jwtToken(isUser.id, isUser.email);
  }

  //function to get jwt access token
  async jwtToken(id: number, email: string): Promise<Object> {
    const payload = { sub: id, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
