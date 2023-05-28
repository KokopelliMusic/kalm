import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  spotifyId: string
}
