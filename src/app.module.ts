import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { SongModule } from './song/song.module'
import { PlaylistModule } from './playlist/playlist.module'

config()

const configService = new ConfigService()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DB'),
      migrations: ['src/migration/*.ts'],
      synchronize: true,
      entities: ['dist/**/*.entity.{ts,js}'],
    }),
    SongModule,
    PlaylistModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
