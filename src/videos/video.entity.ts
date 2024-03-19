import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  } from 'typeorm';
  
  @Entity()
  export class Video {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Column()
    public filename: string;
  
    @Column()
    public path: string;

    @Column()
    public mimetype: string;
  
    @CreateDateColumn()
    public created_at: Date;
  
    @UpdateDateColumn()
    public updated_at: Date;
  
    @DeleteDateColumn()
    public deleted_at: Date;
  }
  