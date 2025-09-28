import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Student } from './student.entity';

export enum PaymentType {
  TUITION = 'tuition',
  REFUND = 'refund',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@ObjectType()
@Entity('payments')
export class Payment {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Student, { nullable: true })
  @ManyToOne(() => Student, (student) => student.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Field(() => Int)
  @Column()
  studentId: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.TUITION,
  })
  type: PaymentType;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  method: PaymentMethod;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  transactionId: string; // External payment processor transaction ID

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>; // Additional payment data

  @Field({ nullable: true })
  @Column({ nullable: true })
  failureReason: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  processedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
