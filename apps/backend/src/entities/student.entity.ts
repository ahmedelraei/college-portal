import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Registration } from './registration.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('students')
export class Student {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ unique: true })
  studentId: number; // College ID - now integer format like 12200207

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => Float)
  @Column('decimal', { precision: 3, scale: 2, default: 0.0 })
  currentGPA: number;

  @Field(() => [Registration], { nullable: true })
  @OneToMany(() => Registration, (registration) => registration.student)
  registrations: Registration[];

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties that delegate to user
  @Field()
  get firstName(): string {
    return this.user?.firstName || '';
  }

  @Field()
  get lastName(): string {
    return this.user?.lastName || '';
  }

  @Field()
  get email(): string {
    return this.user?.email || '';
  }

  @Field()
  get fullName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
  }

  @Field()
  get isActive(): boolean {
    return this.user?.isActive || false;
  }

  @Field()
  get role(): string {
    return this.user?.role || 'student';
  }
}
