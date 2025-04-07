import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../cliente.entity';
import { CreateClienteDto } from '../dtos/cliente.dto';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async getAllClientes(): Promise<Cliente[]> {
    this.logger.log('Buscando todos os clientes no banco de dados');
    const clientes = await this.clienteRepository.find();
    this.logger.log(`Retornando ${clientes.length} clientes do banco de dados`);
    return clientes;
  }

  async getClienteByCpf(num_cpf: string): Promise<Cliente | null> {
    this.logger.log(
      `Buscando cliente para o CPF: ${num_cpf} no banco de dados`,
    );
    const cliente = await this.clienteRepository.findOne({
      where: { num_cpf },
    });
    this.logger.log(
      `Cliente ${cliente ? 'encontrado' : 'não encontrado'} para o CPF: ${num_cpf}`,
    );
    return cliente;
  }

  async createCliente(dto: CreateClienteDto): Promise<Cliente> {
    this.logger.log(
      `Criando novo cliente no banco de dados para o CPF: ${dto.num_cpf}`,
    );
    const newCliente = this.clienteRepository.create({
      num_cpf: dto.num_cpf,
      num_celular: dto.num_celular,
      data_nascimento: dto.data_nascimento,
      endereco: dto.endereco,
      numero: dto.numero,
      complemento: dto.complemento,
      bairro: dto.bairro,
      cidade: dto.cidade,
      estado: dto.estado,
      cep: dto.cep,
      is_ativo: dto.is_ativo,
      usuario: dto.usuario,
    });

    const savedCliente = await this.clienteRepository.save(newCliente);
    this.logger.log(
      `Cliente criado com sucesso no banco de dados. CPF: ${savedCliente.num_cpf}`,
    );
    return savedCliente;
  }

  async findByEmail(email: string): Promise<Cliente> {
    this.logger.log(
      `Buscando cliente para o email: ${email} no banco de dados`,
    );
    const cliente = await this.clienteRepository.findOne({
      where: { usuario: { email } },
      relations: ['usuario'],
    });

    if (!cliente) {
      this.logger.error(`Cliente não encontrado para o email: ${email}`);
      throw new NotFoundException('Cliente não encontrado');
    }

    this.logger.log(`Cliente encontrado para o email: ${email}`);
    return cliente;
  }

  async findByCPF(num_cpf: string): Promise<Cliente> {
    this.logger.log(
      `Buscando cliente para o CPF: ${num_cpf} no banco de dados`,
    );
    const cliente = await this.clienteRepository.findOne({
      where: { num_cpf },
    });

    if (!cliente) {
      this.logger.error(`Cliente não encontrado para o CPF: ${num_cpf}`);
      throw new NotFoundException('Cliente não encontrado');
    }

    this.logger.log(`Cliente encontrado para o CPF: ${num_cpf}`);
    return cliente;
  }

  async findByPhone(num_celular: string): Promise<Cliente> {
    this.logger.log(
      `Buscando cliente para o telefone: ${num_celular} no banco de dados`,
    );
    const cliente = await this.clienteRepository.findOne({
      where: { num_celular },
    });

    if (!cliente) {
      this.logger.error(
        `Cliente não encontrado para o telefone: ${num_celular}`,
      );
      throw new NotFoundException('Cliente não encontrado');
    }

    this.logger.log(`Cliente encontrado para o telefone: ${num_celular}`);
    return cliente;
  }

  async findByUsuarioId(usuarioId: string): Promise<Cliente> {
    this.logger.log(
      `Iniciando busca de cliente para o usuário: ${usuarioId}`,
    );

    try {
      if (!usuarioId) {
        this.logger.error('ID do usuário não fornecido');
        throw new NotFoundException('ID do usuário não fornecido');
      }

      const cliente = await this.clienteRepository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.usuario', 'usuario')
        .where('usuario.id = :usuarioId', { usuarioId })
        .getOne();

      if (!cliente) {
        this.logger.error(`Cliente não encontrado para o usuário: ${usuarioId}`);
        throw new NotFoundException(`Cliente não encontrado para o usuário: ${usuarioId}`);
      }

      this.logger.log(`Cliente encontrado com sucesso para o usuário: ${usuarioId}`);
      return cliente;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar cliente para o usuário ${usuarioId}:`,
        error.stack,
      );
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
  }
}
