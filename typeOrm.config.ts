import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { Song } from 'src/song/song.entity'
import { Artist } from 'src/artist/artist.entity'

config()

const configService = new ConfigService()

export default new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST'),
  port: configService.get('MYSQL_PORT'),
  username: configService.get('MYSQL_USER'),
  password: configService.get('MYSQL_PASSWORD'),
  database: configService.get('MYSQL_DB'),
  entities: [Song, Artist],
})
