import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CourseCategoryModule } from './course_category/course_category.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CertificateModule } from './certificate/certificate.module';
import { RatingModule } from './rating/rating.module';
import { QuizModule } from './quiz/quiz.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { StudentQuizModule } from './student-quiz/student_quiz.module';
import { LessonModule } from './lesson/lesson.module';
import { ModuleModule } from './module/module.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    RoleModule,
    CourseCategoryModule,
    CourseModule,
    EnrollmentModule,
    CertificateModule,
    RatingModule,
    QuizModule,
    AnswerModule,
    QuestionModule,
    StudentQuizModule,
    LessonModule,
    ModuleModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
