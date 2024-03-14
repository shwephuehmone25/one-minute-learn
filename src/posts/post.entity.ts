import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Category from '../category/category.entity';
 
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public title: string;
 
  @Column()
  public content: string;

  @ManyToOne(() => Category, (category: Category) => category.posts)
  public category: Category;

  @Column({ nullable: true })
  public categoryId: number;
}
