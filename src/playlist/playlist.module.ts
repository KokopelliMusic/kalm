import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Song } from 'src/song/song.entity'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { Playlist } from './playlist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Song, Playlist])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
