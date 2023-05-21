import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common'
import { Response } from 'express'
import { SongService } from './song.service'
import { CreateSongDto } from './create-song.dto'
import { Song } from './song.entity'
import { CreateSpotifyDto } from './create-spotify.dto'

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
    return await this.songService.create(createSongDto)
  }

  @Post('play')
  @HttpCode(204)
  async play(@Query('id') songId: number) {
    try {
      return await this.songService.play(songId)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND)
    }
  }

  @Post('create-spotify')
  async addSpotify(@Body() createSpotifyDto: CreateSpotifyDto) {
    return await this.songService.addSpotify(createSpotifyDto)
  }
}
