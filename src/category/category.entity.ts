import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => Post, (post: Post) => post.category)
  public posts: Post[];

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default Category;
