import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
// import { UserDto } from 'src/dto';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // @Post()
  // createUser(@Body() userDto: UserDto): Promise<any> {
  //   return this.usersService.createUser(userDto);
  // }
  @Get()
  getUsers() {
    return 'User Info';
    // return this.usersService.getUsers();
  }
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  // @Get(':id')
  // getUser(@Param('id', ParseIntPipe) id): Promise<any> {
  //   return this.usersService.getUser(id);
  // }
}
