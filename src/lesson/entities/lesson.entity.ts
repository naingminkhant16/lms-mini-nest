import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaterialType } from '../enums/material_type.enum';
import { Module } from 'src/module/entities/module.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'enum', enum: MaterialType, default: MaterialType.TEXT })
  materialType: MaterialType;

  @ManyToOne(() => Module, (module) => module.lessons)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
