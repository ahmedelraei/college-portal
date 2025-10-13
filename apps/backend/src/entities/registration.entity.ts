import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import {
  ObjectType,
  Field,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { Student } from './student.entity';
import { Course } from './course.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
  INCOMPLETE = 'I',
  WITHDRAW = 'W',
}

// Register enums with GraphQL
registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'The payment status of a registration',
});

registerEnumType(Grade, {
  name: 'Grade',
  description: 'The grade received for a course',
});

@ObjectType()
@Entity('registrations')
@Unique(['student', 'course', 'semester', 'year'])
export class Registration {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Student, { nullable: true })
  @ManyToOne(() => Student, (student) => student.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Field(() => Int)
  @Column()
  studentId: number;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Field(() => Int)
  @Column()
  courseId: number;

  @Field()
  @Column()
  semester: string; // "summer" or "winter"

  @Field(() => Int)
  @Column('int')
  year: number; // e.g., 2024

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'enum',
    enum: Grade,
    nullable: true,
  })
  grade: Grade;

  @Field(() => Float, { nullable: true })
  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  gradePoints: number | null; // A=4.0, B=3.0, C=2.0, D=1.0, F=0.0

  @Field()
  @Column({ default: false })
  isCompleted: boolean;

  @Field()
  @Column({ default: false })
  isDropped: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  droppedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Method to calculate grade points based on grade
  @Field(() => Float, { nullable: true })
  calculateGradePoints(): number | null {
    const gradePointMap = {
      [Grade.A]: 4.0,
      [Grade.B]: 3.0,
      [Grade.C]: 2.0,
      [Grade.D]: 1.0,
      [Grade.F]: 0.0,
      [Grade.INCOMPLETE]: 0.0,
      [Grade.WITHDRAW]: null, // Withdrawals don't count toward GPA
    };

    return gradePointMap[this.grade] ?? null;
  }
}
