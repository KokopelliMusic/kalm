import { Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity, BeforeInsert, PrimaryColumn, Entity } from 'typeorm'
import { createId } from '@paralleldrive/cuid2'
import { Artist } from 'src/artist/artist.entity'
import { Image } from 'src/image/image.entity'

@Entity()
export class Album extends BaseEntity {
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

  @Column()
  length: number

  @ManyToMany(() => Image, { nullable: true })
  @JoinTable()
  image: Image[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

  @Column()
  releaseDate: Date

  @Column('varchar', { array: true })
  genres: string[]

  @Column()
  label: string

  @Column()
  spotifyId: string

  @Column()
  type: string
}
