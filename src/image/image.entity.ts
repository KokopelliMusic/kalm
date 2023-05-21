import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  url: string
}
