import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitacaoMesaRepository } from '../repositories/solicitacao-mesa.repository';
import { Repository } from 'typeorm';
import { Mesa } from '../mesa.entity';
import { Comanda } from '../../comandas/comanda.entity';
import { SolicitacaoMesaDto } from '../dtos/solicitacao-mesa.dto';
import { SocketGateway } from '../../socket/socket.gateway';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';

@Injectable()
export class SolicitacaoMesaService {
  private readonly logger = new Logger(SolicitacaoMesaService.name);

  constructor(
    @InjectRepository(SolicitacaoMesaRepository)
    private solicitacaoMesaRepository: SolicitacaoMesaRepository,
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,
    @InjectRepository(Comanda)
    private comandaRepository: Repository<Comanda>,
    private socketGateway: SocketGateway,
  ) {}

  async solicitarMesa(data: SolicitacaoMesaDto): Promise<SolicitacaoMesa> {
    try {
      this.logger.log(`Criando solicitação: ${JSON.stringify(data)}`);
      const solicitacao = await this.solicitacaoMesaRepository.save(data);
      this.logger.log(
        `Solicitação criada com sucesso: ${JSON.stringify(solicitacao)}`,
      );

      // Notificar o estabelecimento
      this.socketGateway
        .getServer()
        .to(data.num_cnpj)
        .emit('nova-solicitacao', solicitacao);
      this.logger.log(
        `Estabelecimento ${data.num_cnpj} notificado sobre nova solicitação`,
      );

      return solicitacao;
    } catch (error) {
      this.logger.error('Erro ao criar solicitação:', error);
      throw error;
    }
  }

  async aprovarSolicitacao(id: string): Promise<SolicitacaoMesa> {
    try {
      this.logger.log(`Aprovando solicitação: ${id}`);
      const solicitacao = await this.solicitacaoMesaRepository.findById(id);
      if (!solicitacao) {
        this.logger.error(`Solicitação não encontrada: ${id}`);
        throw new Error('Solicitação não encontrada');
      }

      // Atualizar status da mesa para ocupada
      await this.mesaRepository.update(
        { num_cnpj: solicitacao.num_cnpj, numMesa: solicitacao.numMesa },
        { status: 'ocupada' },
      );

      // Criar comanda
      const comandaData = {
        num_cpf: solicitacao.clienteId,
        num_cnpj: solicitacao.num_cnpj,
        numMesa: solicitacao.numMesa,
        datApropriacao: new Date(),
        horPedido: new Date(),
        codItem: '000000000000000',
        numQuant: 0,
        valPreco: 0,
        is_ativo: true,
      } as unknown as Comanda;
      const comanda = await this.comandaRepository.save(comandaData);

      // Atualizar status da solicitação
      await this.solicitacaoMesaRepository.updateStatus(id, 'aprovado');
      this.logger.log(`Solicitação ${id} aprovada com sucesso`);

      // Notificar o cliente
      this.socketGateway.getServer().emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'aprovado',
        comandaId: comanda.num_cpf,
      });
      this.logger.log(
        `Cliente notificado sobre aprovação da solicitação ${id}`,
      );

      // Notificar o estabelecimento
      this.socketGateway
        .getServer()
        .to(solicitacao.num_cnpj)
        .emit('solicitacao-atualizada', {
          ...solicitacao,
          status: 'aprovado',
          comandaId: comanda.num_cpf,
        });
      this.logger.log(
        `Estabelecimento ${solicitacao.num_cnpj} notificado sobre aprovação da solicitação`,
      );

      return solicitacao;
    } catch (error) {
      this.logger.error('Erro ao aprovar solicitação:', error);
      throw error;
    }
  }

  async rejeitarSolicitacao(id: string): Promise<SolicitacaoMesa> {
    try {
      this.logger.log(`Rejeitando solicitação: ${id}`);
      const solicitacao = await this.solicitacaoMesaRepository.findById(id);
      if (!solicitacao) {
        this.logger.error(`Solicitação não encontrada: ${id}`);
        throw new Error('Solicitação não encontrada');
      }

      await this.solicitacaoMesaRepository.updateStatus(id, 'rejeitado');
      this.logger.log(`Solicitação ${id} rejeitada com sucesso`);

      // Notificar o cliente
      this.socketGateway.getServer().emit('atualizacao-solicitacao', {
        ...solicitacao,
        status: 'rejeitado',
      });
      this.logger.log(`Cliente notificado sobre rejeição da solicitação ${id}`);

      // Notificar o estabelecimento
      this.socketGateway
        .getServer()
        .to(solicitacao.num_cnpj)
        .emit('solicitacao-atualizada', {
          ...solicitacao,
          status: 'rejeitado',
        });
      this.logger.log(
        `Estabelecimento ${solicitacao.num_cnpj} notificado sobre rejeição da solicitação`,
      );

      return solicitacao;
    } catch (error) {
      this.logger.error('Erro ao rejeitar solicitação:', error);
      throw error;
    }
  }

  async getSolicitacoesByEstabelecimento(
    cnpj: string,
  ): Promise<SolicitacaoMesa[]> {
    this.logger.log(`Buscando solicitações do estabelecimento: ${cnpj}`);
    const solicitacoes =
      await this.solicitacaoMesaRepository.findPendentesByEstabelecimento(cnpj);
    this.logger.log(
      `Encontradas ${solicitacoes.length} solicitações para o estabelecimento: ${cnpj}`,
    );
    return solicitacoes;
  }

  async getSolicitacaoById(id: string): Promise<SolicitacaoMesa | null> {
    this.logger.log(`Buscando solicitação: ${id}`);
    const solicitacao = await this.solicitacaoMesaRepository.findById(id);
    if (!solicitacao) {
      this.logger.error(`Solicitação não encontrada: ${id}`);
      throw new Error('Solicitação não encontrada');
    }
    this.logger.log(`Solicitação encontrada: ${JSON.stringify(solicitacao)}`);
    return solicitacao;
  }
}
