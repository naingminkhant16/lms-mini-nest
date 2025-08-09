import { Module } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({ imports: [TypeOrmModule.forFeature([Quiz])] })
export class QuizModule {}
