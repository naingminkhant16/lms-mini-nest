import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Role } from 'src/role/entities/role.entity';
import { StudentQuiz } from 'src/student-quiz/entities/student_quiz.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  username: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 25, name: 'phone_number' })
  phoneNumber: string;

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  registrationDate: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => StudentQuiz, (studentQuiz) => studentQuiz.student)
  quizAttempts: StudentQuiz[];
}
