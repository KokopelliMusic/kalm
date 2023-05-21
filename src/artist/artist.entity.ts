import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  image: string

  @Column({ default: true })
  isActive: boolean
}
