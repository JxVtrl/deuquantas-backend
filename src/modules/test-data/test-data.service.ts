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

  async createTestUsers() {
    try {
      this.logger.log('Verificando tabelas...');
      
      // Verifica se as tabelas existem
      const tablesExist = await this.checkTablesExist();
      if (!tablesExist) {
        this.logger.log('Tabelas não encontradas. Executando migrações...');
        await this.runMigrations();
      }

      this.logger.log('Criando dados de teste...');
      const senhaHash = await hash('123456', 10);

      // Criar usuários de teste
      const usuarios: Usuario[] = [];
      for (let i = 1; i <= 5; i++) {
        const usuario = await this.usuarioRepository.save({
          email: `cliente${i}@teste.com`,
          password: senhaHash,
          name: `Cliente Teste ${i}`,
          is_admin: false,
          is_ativo: true,
        } as Partial<Usuario>);
        usuarios.push(usuario);
      }

      this.logger.log('Dados de teste criados com sucesso!');
      return { success: true, data: usuarios };
    } catch (error) {
      this.logger.error('Erro ao criar dados de teste:', error);
      throw error;
    }
  }

  private async checkTablesExist(): Promise<boolean> {
    try {
      await this.usuarioRepository.query('SELECT 1 FROM usuarios LIMIT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      await this.usuarioRepository.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          is_admin BOOLEAN DEFAULT false,
          is_ativo BOOLEAN DEFAULT true,
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error) {
      this.logger.error('Erro ao executar migrações:', error);
      throw error;
    }
  }
}
