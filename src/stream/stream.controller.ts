import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common'
import { Response } from 'express'
import { StreamService } from './stream.service'
import { createReadStream } from 'fs'

@Controller('stream')
export class StreamController {
  constructor(private streamService: StreamService) {}

  @Get(':id')
  async listen(@Param() params: any, @Res({ passthrough: true }) res: Response) {
    const song = await this.streamService.getSong(params.id)

    if (!song) {
      return res.sendStatus(404)
    }

    // now stream
    const file = createReadStream(`./static/${song.id}.mp3`)

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `inline; filename="${song.title} - ${song.artists.map((a) => a.name).join(',')}"`,
    })

    return new StreamableFile(file)
  }
}
