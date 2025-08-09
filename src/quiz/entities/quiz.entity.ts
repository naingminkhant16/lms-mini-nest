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
import { Module } from 'src/module/entities/module.entity';
import { Question } from 'src/question/entities/question.entity';
import { StudentQuiz } from 'src/student-quiz/entities/student_quiz.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @ManyToOne(() => Module, (module) => module.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @OneToMany(() => StudentQuiz, (studentQuiz) => studentQuiz.quiz)
  quizAttempts: StudentQuiz[];
}
