import { Module } from '@nestjs/common'
import { AlbumService } from './album.service'
import { AlbumController } from './album.controller'
import { Album } from './entities/album.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Artist } from 'src/artist/artist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist])],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
