import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Artist } from 'src/artist/artist.entity'
import { Song } from 'src/song/song.entity'
import { SongController } from './song.controller'
import { SongService } from './song.service'
import { BullModule } from '@nestjs/bullmq'
import { LookupSongConsumer } from './lookup-song.processor'
import { DownloadSongConsumer } from './download-song.processor'
import { AlbumService } from 'src/album/album.service'
import { Album } from 'src/album/entities/album.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Artist, Album]),
    BullModule.registerQueue({
      name: 'lookup-song',
    }),
    BullModule.registerFlowProducer({
      name: 'lookup-song',
    }),
    BullModule.registerQueue({
      name: 'download-song',
    }),
    BullModule.registerFlowProducer({
      name: 'download-song',
    }),
  ],
  providers: [SongService, LookupSongConsumer, DownloadSongConsumer, AlbumService],
  controllers: [SongController],
})
export class SongModule {}
