import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSpotifyDto {
  @IsString()
  @IsNotEmpty()
  spotifyId: string
}
