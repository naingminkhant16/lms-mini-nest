import { Controller } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}
}
