import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Usuario } from '../../modules/usuarios/usuario.entity';

interface RequestWithUser extends Request {
  user: Usuario;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
