import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentQuiz } from './entities/student_quiz.entity';

@Module({ imports: [TypeOrmModule.forFeature([StudentQuiz])] })
export class StudentQuizModule {}
