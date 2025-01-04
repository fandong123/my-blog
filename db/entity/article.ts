import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import { User } from './user'
import { Comments } from './comments'
import  { Tag } from './tag'

@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  title!: string

  @Column()
  content!: string

  @Column()
  views!: number

  @Column()
  create_time!: Date

  @Column()
  update_time!: Date

  @Column()
  is_delete!: number

  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true,
  })
  tags!: Tag[]

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @OneToMany(() => Comments, (comments) => comments.article)
  @JoinColumn({ name: 'id' })
  comments!: Comments[]
}
