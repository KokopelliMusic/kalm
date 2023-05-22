import { Image } from 'src/image/image.entity'
import { Entity, Column, PrimaryColumn, BaseEntity, BeforeInsert, ManyToOne, JoinTable } from 'typeorm'
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

  @ManyToOne(() => Image, { nullable: true })
  @JoinTable()
  image: Image

  @Column({ default: true })
  isActive: boolean
}
