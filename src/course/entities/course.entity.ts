import { CourseCategory } from 'src/course_category/entities/course_category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseStatus } from '../enums/course_status.enum';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Module } from 'src/module/entities/module.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @Column({ nullable: true })
  overallRating: number;

  @ManyToOne(() => CourseCategory, (courseCategory) => courseCategory.courses)
  @JoinColumn({ name: 'course_category_id' })
  courseCategory: CourseCategory;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.PENDING })
  status: CourseStatus;

  @Column({ nullable: true })
  durationDayCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Rating, (rating) => rating.course)
  ratings: Rating[];

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];
}
