import { Entity, Column, PrimaryColumn, BaseEntity, BeforeInsert } from 'typeorm'
import { createId } from '@paralleldrive/cuid2'

@Entity()
export class Image extends BaseEntity {
  @PrimaryColumn()
  id: string

  @BeforeInsert()
  private beforeInsert() {
    this.id = createId()
  }

  @Column()
  url: string

  @Column()
  size: number
}
