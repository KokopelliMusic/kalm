import { Injectable } from '@nestjs/common'
import { CreateSongDto } from './create-song.dto'
import { Platform, Song } from './song.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Artist } from 'src/artist/artist.entity'
import { Image } from 'src/image/image.entity'
import { CreateSpotifyDto } from './create-spotify.dto'
import spotifyUtils from 'src/utils/spotify.utils'
import { ConfigService } from '@nestjs/config'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private configService: ConfigService,
    @InjectQueue('lookup-song') private lookupSongQueue: Queue,
  ) {}

  private async findById(id: string): Promise<Song | null> {
    const song = await this.songRepository.find({
      where: {
        id,
      },
      relations: {
        artists: true,
        image: true,
      },
    })

    if (song && song[0]) {
      return song[0]
    } else {
      return null
    }
  }

  async findAll(): Promise<Song[]> {
    return this.songRepository.find()
  }

  async findOne(id: string): Promise<Song | null> {
    return await this.findById(id)
  }

  async play(songId: string) {
    const song = await this.findById(songId)

    if (song) {
      song.playCount += 1
      await song.save()
    } else {
      throw new Error('Song not found')
    }
  }

  async create(createSongDto: CreateSongDto): Promise<Song | null> {
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
          // Now create the Image object
          const a = new Artist()
          a.name = artist.name
          a.isActive = true

          let image: Image | null = null

          if (artist.image) {
            image = new Image()
            image.url = artist.image
            image.save()
          }

          if (image) a.image = image

          console.log(a)

          return await a.save()
        }
      }),
    )

    let obj = {
      title: createSongDto.title,
      album: createSongDto.album,
      length: createSongDto.length,
      platform: createSongDto.platform,
      platformId: createSongDto.platformId,
      artists,
    }

    if (createSongDto.image) {
      obj = Object.assign(obj, { image: createSongDto.image })
    } else {
      obj = Object.assign(obj, { image: null })
    }

    const song = await this.songRepository.save(obj)

    // Now we need to queue up the song for lookup
    this.lookupSongQueue.add('lookup-song', { song })

    return song
  }

  async addSpotify(createSpotifyDto: CreateSpotifyDto) {
    const id = this.configService.get('SPOTIFY_ID')
    const secret = this.configService.get('SPOTIFY_SECRET')
    const spotify = await spotifyUtils.getById(createSpotifyDto.spotifyId, id, secret)

    // First we check if the song already exists
    const existingSong = await this.songRepository.findOne({
      where: {
        platform: Platform.Spotify,
        platformId: createSpotifyDto.spotifyId,
      },
      relations: {
        artists: true,
        image: true,
      },
    })

    if (existingSong) {
      return existingSong
    }

    // Now we can use this object to create a song
    const song = new Song()
    song.title = spotify.name
    song.album = spotify.album.name
    song.length = spotify.duration_ms
    song.platform = Platform.Spotify
    song.platformId = spotify.id

    const images = await Promise.all(
      spotify.album.images.map(async (image: any) => {
        const img = new Image()
        img.url = image.url
        img.size = image.height
        await img.save()
        return img
      }),
    )

    song.image = images

    const artists = await Promise.all(
      spotify.artists.map(async (artist: any) => {
        const artistEntity = await this.artistRepository.findOne({
          where: {
            name: artist.name,
          },
        })

        if (artistEntity) {
          return artistEntity
        } else {
          const a = new Artist()
          a.name = artist.name
          a.isActive = true

          let image: Image | null = null

          if (artist.images && artist.images[0]) {
            image = new Image()
            image.url = artist.images[0].url
            await image.save()
          }

          if (image) a.image = image

          return await a.save()
        }
      }),
    )

    song.artists = artists

    await song.save()

    // Now we need to queue up the song for lookup
    await this.lookupSongQueue.add('lookup-song', { song })

    return song
  }
}
