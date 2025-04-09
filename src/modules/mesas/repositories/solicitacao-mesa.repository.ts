import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';

type StatusSolicitacao = 'pendente' | 'aprovado' | 'rejeitado';

@Injectable()
export class SolicitacaoMesaRepository {
  constructor(
    @InjectRepository(SolicitacaoMesa)
    private readonly repository: Repository<SolicitacaoMesa>,
  ) {}

  async findPendentesByEstabelecimento(
    cnpj: string,
  ): Promise<SolicitacaoMesa[]> {
    return this.repository.find({
      where: { num_cnpj: cnpj, status: 'pendente' },
      order: { dataSolicitacao: 'DESC' },
    });
  }

  async findById(id: string): Promise<SolicitacaoMesa | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOne(
    where: FindOptionsWhere<SolicitacaoMesa>,
  ): Promise<SolicitacaoMesa | null> {
    return this.repository.findOne({ where });
  }

  async updateStatus(
    id: string,
    status: StatusSolicitacao,
  ): Promise<void> {
    await this.repository.update(id, { status });
  }

  async save(solicitacao: SolicitacaoMesa): Promise<SolicitacaoMesa> {
    return this.repository.save(solicitacao);
  }
}
