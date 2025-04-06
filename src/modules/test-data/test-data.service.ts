/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';
import { hash } from 'bcryptjs';
import { Usuario } from '../usuarios/usuario.entity';

@Injectable()
export class TestDataService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
  ) {}

  async createTestUsers() {
    try {
      // Criar 10 clientes
      for (let i = 1; i <= 10; i++) {
        const senhaHash = await hash('123456', 10);

        // Criar usuário
        const usuario = this.usuarioRepository.create({
          email: `cliente${i}@teste.com`,
          password: senhaHash,
          name: `Cliente ${i}`,
          is_admin: false,
          is_ativo: true,
        });
        const savedUsuario = await this.usuarioRepository.save(usuario);

        // Criar cliente
        const cliente = this.clienteRepository.create({
          num_cpf: `1234567890${i}`,
          num_celular: `1199999999${i}`,
          usuario: savedUsuario,
        });
        await this.clienteRepository.save(cliente);
      }

      // Criar 10 estabelecimentos
      for (let i = 1; i <= 10; i++) {
        const senhaHash = await hash('123456', 10);

        // Criar usuário
        const usuario = this.usuarioRepository.create({
          email: `estabelecimento${i}@teste.com`,
          password: senhaHash,
          name: `Estabelecimento ${i}`,
          is_admin: false,
          is_ativo: true,
        });
        const savedUsuario = await this.usuarioRepository.save(usuario);

        // Criar estabelecimento
        const estabelecimento = this.estabelecimentoRepository.create({
          num_cnpj: `1234567890123${i}`,
          num_celular: `1199999999${i}`,
          usuario: savedUsuario,
        });
        await this.estabelecimentoRepository.save(estabelecimento);
      }

      return { message: 'Usuários de teste criados com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao criar usuários de teste: ${error.message}`);
    }
  }
}
