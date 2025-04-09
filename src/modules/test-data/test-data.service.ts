/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Cliente } from '../clientes/cliente.entity';
import { Estabelecimento } from '../estabelecimentos/estabelecimento.entity';
import { hash } from 'bcryptjs';

@Injectable()
export class TestDataService {
  private readonly logger = new Logger(TestDataService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Estabelecimento)
    private estabelecimentoRepository: Repository<Estabelecimento>,
  ) {}

  async createTestData() {
    try {
      this.logger.log('Criando dados de teste...');

      // Criar usuários
      const senhaHash = await hash('123456', 10);
      const usuarios: Usuario[] = [];

      // Criar 5 clientes
      for (let i = 1; i <= 5; i++) {
        const usuario = await this.usuarioRepository.save({
          email: `cliente${i}@teste.com`,
          password: senhaHash,
          name: `Cliente Teste ${i}`,
          is_admin: false,
          is_ativo: true,
        } as Partial<Usuario>);
        usuarios.push(usuario);

        await this.clienteRepository.save({
          usuario: usuario,
          num_cpf: `1234567890${i}`,
          nome: `Cliente Teste ${i}`,
          telefone: `1199999999${i}`,
        } as Partial<Cliente>);
      }

      // Criar 5 estabelecimentos
      for (let i = 1; i <= 5; i++) {
        const usuario = await this.usuarioRepository.save({
          email: `estabelecimento${i}@teste.com`,
          password: senhaHash,
          name: `Estabelecimento Teste ${i}`,
          is_admin: false,
          is_ativo: true,
        } as Partial<Usuario>);
        usuarios.push(usuario);

        await this.estabelecimentoRepository.save({
          usuario: usuario,
          num_cnpj: `1234567890123${i}`,
          nome: `Estabelecimento Teste ${i}`,
          telefone: `1199999999${i}`,
          endereco: `Rua Teste ${i}, 123`,
        } as Partial<Estabelecimento>);
      }

      this.logger.log('Dados de teste criados com sucesso!');
      return { success: true, data: usuarios };
    } catch (error) {
      this.logger.error('Erro ao criar dados de teste:', error);
      throw error;
    }
  }
}
