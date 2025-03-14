import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }
    
    // Verifica se o usuário é admin quando o role 'admin' é requerido
    if (roles.includes('admin') && user.isAdmin) {
      return true;
    }
    
    // Adicione outras verificações de roles conforme necessário
    
    throw new ForbiddenException('Você não tem permissão para acessar este recurso');
  }
}
