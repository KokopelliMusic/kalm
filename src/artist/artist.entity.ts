import { Image } from 'src/image/image.entity'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinTable } from 'typeorm'

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Image, { nullable: true })
  @JoinTable()
  image: Image

  @Column({ default: true })
  isActive: boolean
}
