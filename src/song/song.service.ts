import { Injectable } from '@nestjs/common'
import { CreateSongDto } from './create-song.dto'
import { Platform, Song } from './song.entity'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Artist } from 'src/artist/artist.entity'
import { Image } from 'src/image/image.entity'
import { CreateSpotifyDto } from './create-spotify.dto'
import spotifyUtils from 'src/utils/spotify.utils'
import { ConfigService } from '@nestjs/config'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { Playcount } from 'src/playcount/playcount.entity'
import { AlbumService } from 'src/album/album.service'

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private albumService: AlbumService,
    @InjectQueue('lookup-song')
    private lookupSongQueue: Queue,
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

  async play(songId: string, client: string, additionalData: object = {}) {
    const song = await this.findById(songId)

    if (song) {
      const playcount = new Playcount()
      playcount.song = song
      playcount.client = client
      playcount.additionalData = additionalData
      await playcount.save()

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
          a.genres = ['Unknown']

          let image: Image | null = null

          if (artist.image) {
            image = new Image()
            image.url = artist.image
            image.save()
          }

          if (image) a.images = [image]

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

  private async createSpotifyArtist(qr: QueryRunner, artistId: string, spotifyId: string, secret: string) {
    const artist = await spotifyUtils.getArtistById(artistId, spotifyId, secret)

    // First we check if the artist already exists
    const existingArtist = await this.artistRepository.findOne({
      where: {
        spotifyId: artist.id,
      },
    })

    if (existingArtist) {
      return existingArtist
    }

    // Now create the Image object
    const a = new Artist()
    a.name = artist.name
    a.isActive = true
    a.spotifyId = artist.id
    a.genres = artist.genres

    const images = []

    if (artist.images) {
      for (const image of artist.images) {
        const i = new Image()
        i.url = image.url
        i.size = image.height
        images.push(i)
        await qr.manager.save(i)
      }
    }

    a.images = images

    return await qr.manager.save(a)
  }

  async addSpotify(createSpotifyDto: CreateSpotifyDto) {
    const id = this.configService.get('SPOTIFY_ID')
    const secret = this.configService.get('SPOTIFY_SECRET')
    const spotify = await spotifyUtils.getById(createSpotifyDto.spotifyId, id, secret)

    // First we check if the song already exists
    const existingSong = await this.songRepository.findOne({
      where: {
        platformId: createSpotifyDto.spotifyId,
      },
      relations: {
        artists: {
          images: true,
        },
        image: true,
      },
    })

    if (existingSong) {
      return existingSong
    }

    const qr = this.dataSource.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()

    // Now we can use this object to create a song
    const song = new Song()
    try {
      song.title = spotify.name
      song.length = spotify.duration_ms
      song.platform = Platform.Spotify
      song.platformId = spotify.id

      // Create Album
      const album = await this.albumService.create({ spotifyId: spotify.album.id })

      song.album = album

      song.image = album.image

      const artists = await Promise.all(spotify.artists.map(async (artist: any) => await this.createSpotifyArtist(qr, artist.id, id, secret)))

      song.artists = artists

      console.log(song)

      await qr.manager.save(song)

      await qr.commitTransaction()

      // Now we need to queue up the song for lookup
      await this.lookupSongQueue.add('lookup-song', { song })

      return song
    } catch (err) {
      await qr.rollbackTransaction()
      throw err
    } finally {
      await qr.release()
    }
  }
}
