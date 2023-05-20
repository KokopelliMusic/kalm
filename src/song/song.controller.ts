import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { SongService } from './song.service'
import { CreateSongDto } from './create-song.dto'
import { Song } from './song.entity'

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get('all')
  findAll(@Req() req: Request) {
    console.log(req)
    return 'This action returns all songs'
  }

  @Post()
  @HttpCode(204)
  async create(@Body() createSongDto: CreateSongDto): Promise<Song | null> {
    return await this.songService.create(createSongDto)
  }
}
