import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from 'src/question/entities/question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'boolean', default: false })
  is_correct: boolean;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
