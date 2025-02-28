import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cardapio } from './cardapio.entity';

@Injectable()
export class CardapioRepository {
    constructor(
        @InjectRepository(Cardapio)
        private readonly repository: Repository<Cardapio>,
    ) { }

    async findAll(): Promise<Cardapio[]> {
        return this.repository.find();
    }

    async findByNome(nome: string): Promise<Cardapio | null> {
        return this.repository.findOne({ where: { nome } });
    }
}
