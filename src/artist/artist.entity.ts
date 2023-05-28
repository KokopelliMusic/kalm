import { Image } from 'src/image/image.entity'
import { Entity, Column, PrimaryColumn, BaseEntity, BeforeInsert, ManyToMany, JoinTable } from 'typeorm'
import { createId } from '@paralleldrive/cuid2'

@Entity()
export class Artist extends BaseEntity {
  @PrimaryColumn()
  id: string

  @BeforeInsert()
  private beforeInsert() {
    this.id = createId()
  }

  @Column()
  name: string

  @ManyToMany(() => Image, { nullable: true })
  @JoinTable()
  images: Image[]

  @Column({ default: true })
  isActive: boolean

  @Column('varchar', { array: true })
  genres: string[]

  @Column({ nullable: true })
  spotifyId: string
}
