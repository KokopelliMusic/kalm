import { IsNotEmpty } from 'class-validator'

export class CreateArtistDto {
  @IsNotEmpty()
  name: string
  platformId: string
  image: string
}
