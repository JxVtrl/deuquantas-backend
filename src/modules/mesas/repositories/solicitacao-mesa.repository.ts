import { Repository } from 'typeorm';
import { SolicitacaoMesa } from '../entities/solicitacao-mesa.entity';

export class SolicitacaoMesaRepository extends Repository<SolicitacaoMesa> {
  async findPendentesByEstabelecimento(
    num_cnpj: string,
  ): Promise<SolicitacaoMesa[]> {
    return this.find({
      where: {
        num_cnpj,
        status: 'pendente',
      },
      order: {
        dataSolicitacao: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<SolicitacaoMesa | null> {
    return this.findOne({ where: { id } });
  }

  async updateStatus(
    id: string,
    status: 'aprovado' | 'rejeitado',
  ): Promise<void> {
    await this.update(id, { status });
  }
}
