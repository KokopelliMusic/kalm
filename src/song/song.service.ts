import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './create-song.dto';
import { Song } from './song.entity';

@Injectable()
export class SongService {
  async create(createSongDto: CreateSongDto): Promise<Song | undefined> {
    console.log(createSongDto);
    return undefined;
  }
}
