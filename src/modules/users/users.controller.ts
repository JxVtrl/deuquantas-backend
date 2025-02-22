import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {
    return { message: 'Lista de usuários' };
  }

  @Post()
  createUser(@Body() userData: any) {
    return { message: 'Usuário criado!', userData };
  }
}
