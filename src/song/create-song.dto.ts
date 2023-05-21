import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreateArtistDto } from 'src/artist/create-artist.dto'
import { Platform } from './song.entity'

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  @IsArray()
  artists: CreateArtistDto[]

  @IsString()
  @IsNotEmpty()
  album: string

  @IsNumber()
  @IsNotEmpty()
  length: number

  @IsString()
  @IsOptional()
  image: string | null

  @IsNotEmpty()
  @IsString()
  @IsEnum(Platform)
  platform: Platform

  @IsString()
  @IsNotEmpty()
  platformId: string
}
