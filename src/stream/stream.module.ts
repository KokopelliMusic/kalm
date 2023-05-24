import { Module } from '@nestjs/common'
import { StreamController } from './stream.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Song } from 'src/song/song.entity'
import { StreamService } from './stream.service'

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [StreamService],
  controllers: [StreamController],
})
export class StreamModule {}
