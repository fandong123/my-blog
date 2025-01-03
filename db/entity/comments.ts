import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './user'
import { Article } from './article'

@Entity({ name: 'comments' })
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column()
  content!: string

  @Column()
  create_time!: Date

  @Column()
  update_time!: Date

  // @Column()
  // article_id!: number

  // @Column()
  // user_id!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User


  @ManyToOne(() => Article)
  @JoinColumn({ name: 'article_id' })
  article!: Article
}
