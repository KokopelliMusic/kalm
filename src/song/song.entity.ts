import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'
import { Artist } from '../artist/artist.entity'

@Entity()
export class Song {
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

  @Column()
  image: string

  @Column()
  platform: string

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
