import { Injectable } from '@nestjs/common'
import { CreateSongDto } from './create-song.dto'
import { Song } from './song.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Artist } from 'src/artist/artist.entity'

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  private async findById(id: number): Promise<Song[] | null> {
    return this.songRepository.find({
      where: {
        id,
      },
      relations: {
        artists: true,
      },
    })
  }

  async findAll(): Promise<Song[]> {
    return this.songRepository.find()
  }

  async findOne(id: number): Promise<Song | null> {
    const songs = await this.findById(id)

    if (songs && songs?.length > 0) {
      return songs[0]
    } else {
      return null
    }
  }

  async create(createSongDto: CreateSongDto): Promise<Song | null> {
    console.log(createSongDto)

    const artists = await Promise.all(
      createSongDto.artists.map(async (artist) => {
        const artistEntity = await this.artistRepository.findOne({
          where: {
            name: artist.name,
          },
        })

        if (artistEntity) {
          return artistEntity
        } else {
          return this.artistRepository.save(artist)
        }
      }),
    )

    const song = await this.songRepository.save({
      title: createSongDto.title,
      album: createSongDto.album,
      length: createSongDto.length,
      image: createSongDto.image,
      platform: createSongDto.platform,
      platformId: createSongDto.platformId,
      artists,
    })

    return song
  }
}
