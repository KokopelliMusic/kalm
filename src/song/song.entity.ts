import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Artist } from '../artist/artist.entity'

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  artists: Artist[]

  @Column()
  album: string

  @Column()
  length: number

  @Column()
  image: string

  @Column()
  platform: string

  @Column()
  platformId: string

  @Column()
  playCount: number

  @Column({ default: true })
  isActive: boolean
}
