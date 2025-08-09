import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Entity()
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Course, (course) => course.modules, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.module)
  quizzes: Quiz[];

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];
}
