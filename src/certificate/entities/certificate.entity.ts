import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Enrollment)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  issueDate: Date;

  @Column({ nullable: false })
  certificateUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
