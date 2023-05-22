import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Song } from 'src/song/song.entity'
import { Playlist } from './playlist.entity'
import { Image } from '../image/image.entity'
import { CreatePlaylistDto } from './create-playlist.dto'
import { AddSongDto } from './add-song.dto'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private configService: ConfigService,
  ) {}


  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find()
  }

  async findOne(id: string): Promise<Playlist | null> {
    return await Playlist.findById(id)
  }

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = new Playlist()
    playlist.title = createPlaylistDto.title

    if (createPlaylistDto.image) {
      const img = new Image()
      img.url = createPlaylistDto.image
      await img.save()
      playlist.image = img
    }

    await playlist.save()

    return playlist
  }

  async addSong(addSongDto: AddSongDto) {
    const playlist = await Playlist.findById(addSongDto.playlistId)
    const song = await this.songRepository.findOne({
      where: {
        id: addSongDto.songId,
      },
    })

    if (!playlist || !song) {
      return null
    }

    playlist.songs.push(song)
    await playlist.save()

    return playlist
  }
}
