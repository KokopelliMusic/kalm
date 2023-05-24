import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bullmq'
import { Song } from './song.entity'
import { Repository } from 'typeorm'
import * as ytdl from 'ytdl-core'
import * as ffmpeg from 'fluent-ffmpeg'
import * as yt from 'usetube'
import { Logger } from '@nestjs/common'

interface JobType {
  song: Song
  video: yt.Video
}

@Processor('download-song')
export class DownloadSongConsumer extends WorkerHost {
  private readonly logger = new Logger(DownloadSongConsumer.name)

  constructor(@InjectRepository(Song) private songRepository: Repository<Song>) {
    super()
  }

  async process(job: Job<JobType>) {
    this.logger.log('Starting download of song ' + job.data.song.id)

    const info = await ytdl.getInfo(job.data.video.id)

    const stream = ytdl.downloadFromInfo(info, { quality: 'highestaudio' })

    const bitrate = info.formats[0].audioBitrate ?? info.formats[0].bitrate ?? 128

    ffmpeg(stream).audioBitrate(bitrate).withAudioCodec('libmp3lame').toFormat('mp3').on('error', console.error).saveToFile(`./static/${job.data.song.id}.mp3`)
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<JobType>, err: Error) {
    this.logger.warn('Failed to download song ' + job.data.song.id, err)
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.log('Completed download')
  }
}
