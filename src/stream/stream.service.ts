import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Song } from 'src/song/song.entity'
import { Repository } from 'typeorm'

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async getSong(id: string): Promise<Song | null> {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
      relations: {
        artists: true,
      },
    })

    if (song) {
      return song
    }

    return null
  }
}
