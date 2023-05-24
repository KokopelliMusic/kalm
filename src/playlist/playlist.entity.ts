import { Entity, PrimaryColumn, BaseEntity, BeforeInsert, ManyToOne, JoinTable, ManyToMany, Column } from 'typeorm'
import { createId } from '@paralleldrive/cuid2'
import { Song } from 'src/song/song.entity'
import { Image } from 'src/image/image.entity'

@Entity()
export class Playlist extends BaseEntity {
  @PrimaryColumn()
  id: string

  @BeforeInsert()
  private beforeInsert() {
    this.id = createId()
  }

  @ManyToOne(() => Image, { nullable: true })
  @JoinTable()
  image: Image

  @Column()
  title: string

  @ManyToMany(() => Song)
  @JoinTable()
  songs: Song[]

  static async findById(id: string): Promise<Playlist | null> {
    const playlist = await Playlist.find({
      where: {
        id,
      },
      relations: {
        songs: true,
      },
    })

    if (playlist && playlist[0]) {
      return playlist[0]
    } else {
      return null
    }
  }
}
