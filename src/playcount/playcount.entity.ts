import { Entity, Column, BaseEntity, JoinTable, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm'
import { Song } from 'src/song/song.entity'

@Entity()
export class Playcount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @ManyToOne(() => Song)
  @JoinTable()
  song: Song

  @CreateDateColumn()
  createdAt: Date

  @Column()
  client: string

  @Column('simple-json')
  additionalData: object
}
