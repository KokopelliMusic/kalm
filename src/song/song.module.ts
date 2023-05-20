import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artist/artist.entity';
import { Song } from 'src/song/song.entity';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  providers: [SongService],
  controllers: [SongController],
})
export class SongModule {}
