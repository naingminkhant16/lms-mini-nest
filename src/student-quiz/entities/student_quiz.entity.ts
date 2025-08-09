import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Entity('student_quiz')
@Unique(['student', 'quiz'])
export class StudentQuiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.quizAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizAttempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'int', default: 1 })
  attempt: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
