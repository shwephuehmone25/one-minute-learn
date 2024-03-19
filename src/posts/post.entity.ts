import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import Category from '../category/category.entity';
import PublicFile from '../files/publicFile.entity';
import { User } from '../users/user.entity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(() => Category, (category: Category) => category.posts)
  @JoinColumn({ name: 'categoryId' }) 
  public category: Category;

  @Column({ nullable: true })
  public categoryId: number;

  @JoinColumn() 
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: false,
  })
  public file?: PublicFile;

  @ManyToOne(() => User, (author: User) => author.posts)
  @JoinColumn({ name: 'userId' }) 
  public author: User;

  @Column({ nullable: true })
  public userId: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @DeleteDateColumn()
  public deleted_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  scheduledDate?: Date;
}
