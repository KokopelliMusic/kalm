import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bullmq'
import { Song } from './song.entity'
import { Repository } from 'typeorm'
import * as ytdl from 'ytdl-core'
import * as ffmpeg from 'fluent-ffmpeg'
import * as yt from 'usetube'

interface JobType {
  song: Song
  video: yt.Video
}

@Processor('download-song')
export class DownloadSongConsumer extends WorkerHost {
  constructor(@InjectRepository(Song) private songRepository: Repository<Song>) {
    super()
  }

  async process(job: Job<JobType>) {
    console.log('Starting download')

    const info = await ytdl.getInfo(job.data.video.id)

    const stream = ytdl.downloadFromInfo(info, { quality: 'highestaudio' })

    const bitrate = info.formats[0].audioBitrate ?? info.formats[0].bitrate ?? 128

    ffmpeg(stream).audioBitrate(bitrate).withAudioCodec('libmp3lame').toFormat('mp3').on('error', console.error).saveToFile(`./static/${job.data.song.id}.mp3`)
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<JobType>, err: Error) {
    console.log('failed download', err)
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('completed download')
  }
}
