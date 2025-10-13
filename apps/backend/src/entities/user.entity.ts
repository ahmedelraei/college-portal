import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Student } from './student.entity';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  // Password should not be exposed in GraphQL
  @Column()
  password: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  student: Student;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Computed property for full name
  @Field()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Computed property for student ID (for frontend compatibility)
  @Field(() => Int, { nullable: true })
  get studentId(): number | null {
    return this.student?.studentId || null;
  }
}
