import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClienteService } from '../modules/clientes/services/cliente.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(numCpf: string, password: string): Promise<any> {
    const user = await this.clienteService.getClienteByCpf(numCpf);
    if (user && await bcrypt.compare(password, user.codCartao)) {
      const { codCartao, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(numCpf: string, password: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(numCpf, password);
    const payload = { numCpf: user.numCpf, nomeCliente: user.nomeCliente };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
