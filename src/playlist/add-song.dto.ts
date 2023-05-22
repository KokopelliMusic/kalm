import { IsNotEmpty } from 'class-validator'

export class AddSongDto {
  @IsNotEmpty()
  songId: string
  @IsNotEmpty()
  playlistId: string
}
