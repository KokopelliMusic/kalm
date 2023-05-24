import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Job, Queue } from 'bullmq'
import { Song } from './song.entity'
import { Repository } from 'typeorm'
import * as yt from 'usetube'
import { Logger } from '@nestjs/common'

@Processor('lookup-song')
export class LookupSongConsumer extends WorkerHost {
  private readonly logger = new Logger(LookupSongConsumer.name)

  constructor(@InjectRepository(Song) private songRepository: Repository<Song>, @InjectQueue('download-song') private downloadSongQueue: Queue) {
    super()
  }

  async process(job: Job<{ song: Song }>) {
    const song = job.data.song

    const query = `${song.title} - ${song.artists.map((a) => a.name).join(', ')}`

    const res = await yt.searchVideo(query)

    if (res.videos && res.videos.length > 0) {
      const video = res.videos[0]
      this.logger.log('Found video', video)
      await this.downloadSongQueue.add('download-song', { song, video })
    }
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.log('completed lookup')
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    this.logger.log('lookup failed with error', err)
  }
}
