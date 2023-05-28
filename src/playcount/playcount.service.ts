import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Playcount } from './playcount.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PlaycountService {
  constructor(
    @InjectRepository(Playcount)
    private playcountRepository: Repository<Playcount>,
  ) {}

  async findAll(): Promise<Playcount[]> {
    return await this.playcountRepository.find()
  }

  async findByClient(client: string): Promise<Playcount[]> {
    return await this.playcountRepository.find({
      where: {
        client,
      },
    })
  }
}
