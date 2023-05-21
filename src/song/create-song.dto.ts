import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateArtistDto } from 'src/artist/create-artist.dto'
import { Platform } from './song.entity'

export class CreateSongDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  @IsArray()
  artists: CreateArtistDto[]

  @IsNotEmpty()
  album: string

  @IsNotEmpty()
  length: number

  @IsOptional()
  image: string | null

  @IsNotEmpty()
  @IsString()
  @IsEnum(Platform)
  platform: Platform

  @IsNotEmpty()
  platformId: string
}
