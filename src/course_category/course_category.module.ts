import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CourseCategoryController } from './course_category.controller';
import { CourseCategory } from './entities/course_category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CourseCategory])],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
})
export class CourseCategoryModule {}
