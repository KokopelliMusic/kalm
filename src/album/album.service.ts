import { Injectable } from '@nestjs/common'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'
import { Album } from './entities/album.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import spotifyUtils from 'src/utils/spotify.utils'
import { Artist } from 'src/artist/artist.entity'
import { Image } from 'src/image/image.entity'

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private configService: ConfigService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    // check if album exists

    const oldAlbum = await this.albumRepository.findOne({
      where: {
        spotifyId: createAlbumDto.spotifyId,
      },
      relations: {
        artists: true,
        image: true,
      },
    })

    if (oldAlbum) return oldAlbum

    const sAlbum = await this.getSpotifyAlbum(createAlbumDto.spotifyId)

    const album = new Album()
    album.title = sAlbum.name
    album.length = sAlbum.total_tracks
    album.releaseDate = new Date(sAlbum.release_date)
    album.genres = sAlbum.genres
    album.label = sAlbum.label
    album.spotifyId = sAlbum.id
    album.type = sAlbum.album_type

    const artists = []

    // add artists
    for (const artist of sAlbum.artists) {
      // check if artist exists
      const a = await this.artistRepository.findOne({
        where: {
          spotifyId: artist.id,
        },
      })

      if (a) {
        artists.push(a)
      } else {
        const newArtist = new Artist()
        newArtist.name = artist.name
        newArtist.spotifyId = artist.id
        newArtist.genres = []
        await this.artistRepository.save(newArtist)
        artists.push(newArtist)
      }
    }

    album.artists = artists

    const images = []
    for (const image of sAlbum.images) {
      const i = new Image()
      i.size = image.height
      i.url = image.url
      await i.save()

      images.push(i)
    }

    album.image = images

    await album.save()

    return album
  }

  async findAll() {
    return await this.albumRepository.find()
  }

  async findOne(id: string) {
    return await this.albumRepository.findOne({
      where: {
        id,
      },
    })
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return await this.albumRepository.update(id, updateAlbumDto)
  }

  async remove(id: string) {
    return await this.albumRepository.softDelete(id)
  }

  async getSpotifyAlbum(id: string) {
    const spotifyId = this.configService.get('SPOTIFY_ID')
    const spotifySecret = this.configService.get('SPOTIFY_SECRET')
    return await spotifyUtils.getAlbumById(id, spotifyId, spotifySecret)
  }
}
