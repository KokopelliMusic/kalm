import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity, OneToOne, ManyToOne } from 'typeorm'
import { Artist } from '../artist/artist.entity'
import { Image } from '../image/image.entity'

@Entity()
export abstract class Song extends BaseEntity {
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

  @ManyToOne(() => Image, { nullable: true })
  @JoinTable()
  image: string | null

  @Column()
  platform: Platform

  @Column()
  platformId: string

  @Column({ default: 0 })
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
