import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common'
import { Response } from 'express'
import { PlaylistService } from './playlist.service'
import { CreatePlaylistDto } from './create-playlist.dto'
import { AddSongDto } from './add-song.dto'

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Get('all')
  async findAll() {
    return await this.playlistService.findAll()
  }

  @Get(':id')
  async findOne(@Param() params: any, @Res() res: Response) {
    const song = await this.playlistService.findOne(params.id)

    if (!song) {
      return res.sendStatus(404)
    }

    return res.json(song)
  }

  @Post()
  async create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return await this.playlistService.create(createPlaylistDto)
  }

  @Put('add-song')
  async add(@Body() addSongDto: AddSongDto) {
    return await this.playlistService.addSong(addSongDto)
  }
}
