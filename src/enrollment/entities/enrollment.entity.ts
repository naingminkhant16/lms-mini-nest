import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EnrollmentStatus } from '../enums/enrollment_status.enum';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Certificate } from 'src/certificate/entities/certificate.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  enrollmentDate: Date;

  @Column({ type: 'decimal', nullable: true })
  progress: number;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
  })
  status: EnrollmentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
