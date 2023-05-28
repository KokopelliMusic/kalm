import { Entity, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity, BeforeInsert, ManyToOne, PrimaryColumn } from 'typeorm'
import { Artist } from '../artist/artist.entity'
import { Image } from '../image/image.entity'
import { createId } from '@paralleldrive/cuid2'
import { Album } from 'src/album/entities/album.entity'

@Entity()
export class Song extends BaseEntity {
  @PrimaryColumn()
  id: string

  @BeforeInsert()
  private beforeInsert() {
    this.id = createId()
  }

  @Column()
  title: string

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[]

  @ManyToMany(() => Album, { nullable: true })
  @JoinTable()
  album: Album

  @Column()
  length: number

  @ManyToMany(() => Image, { nullable: true })
  @JoinTable()
  image: Image[]

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
