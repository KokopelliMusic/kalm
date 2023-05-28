import { IsNotEmpty, IsObject, IsString } from 'class-validator'

export class PlaySongDto {
  @IsString()
  @IsNotEmpty()
  client: string

  @IsNotEmpty()
  @IsObject()
  additionalData: object

  @IsString()
  @IsNotEmpty()
  songId: string
}
