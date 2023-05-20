import { CreateArtistDto } from 'src/artist/create-artist.dto'

export class CreateSongDto {
  title: string
  artists: CreateArtistDto[]
  album: string
  length: number
  image: string
  platform: string
  platformId: string
}
