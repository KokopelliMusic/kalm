import { Body, Controller, Get, HttpCode, Param, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common'
import { Response } from 'express'
import { SongService } from './song.service'
import { CreateSongDto } from './create-song.dto'
import { Song } from './song.entity'

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get('all')
  async findAll() {
    return await this.songService.findAll()
  }

  @Get(':id')
  async findOne(@Param() params: any, @Res() res: Response) {
    const song = await this.songService.findOne(params.id)

    if (!song) {
      return res.sendStatus(404)
    }

    return res.json(song)
  }

  @Post()
  @HttpCode(204)
  async create(@Body() createSongDto: CreateSongDto): Promise<Song | null> {
    console.log(createSongDto)
    return await this.songService.create(createSongDto)
  }
}
