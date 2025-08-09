import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';

@Entity()
@Unique(['user', 'course'])
@Check(`"rating_count" >= 1 AND "rating_count" <= 5`)
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int', name: 'rating_count' })
  ratingCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
