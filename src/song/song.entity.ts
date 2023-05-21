import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm'
import { Artist } from '../artist/artist.entity'

@Entity()
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[]

  @Column()
  album: string

  @Column()
  length: number

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  image: string | null

  @Column()
  platform: Platform

  @Column()
  platformId: string

  @Column()
  playCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}

export enum Platform {
  Spotify = 'spotify',
  YouTube = 'youtube',
  MP3 = 'mp3',
  SoundCloud = 'soundcloud',
}
