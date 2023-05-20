import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Song } from './song/song.entity'
import { Artist } from './artist/artist.entity'
import { SongModule } from './song/song.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'kalm',
      entities: [Song, Artist],
      synchronize: true,
    }),
    SongModule,
  ],
})
export class AppModule {}
