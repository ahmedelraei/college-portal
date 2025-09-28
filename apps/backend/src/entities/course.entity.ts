import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Registration } from './registration.entity';

export enum Semester {
  SUMMER = 'summer',
  WINTER = 'winter',
}

@ObjectType()
@Entity('courses')
export class Course {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  courseCode: string; // e.g., "CS101", "MATH201"

  @Field()
  @Column()
  courseName: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => Int)
  @Column('int')
  creditHours: number; // 2, 3, or 4 credits

  @Field(() => Float)
  @Column('decimal', { precision: 8, scale: 2, default: 500.0 })
  pricePerCredit: number; // $500 per credit hour

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: Semester,
  })
  semester: Semester;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  // Self-referencing many-to-many for prerequisites
  @Field(() => [Course], { nullable: true })
  @ManyToMany(() => Course, (course) => course.dependentCourses)
  @JoinTable({
    name: 'course_prerequisites',
    joinColumn: { name: 'courseId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'prerequisiteId', referencedColumnName: 'id' },
  })
  prerequisites: Course[];

  @Field(() => [Course], { nullable: true })
  @ManyToMany(() => Course, (course) => course.prerequisites)
  dependentCourses: Course[];

  @Field(() => [Registration], { nullable: true })
  @OneToMany(() => Registration, (registration) => registration.course)
  registrations: Registration[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // Computed property for total cost
  @Field(() => Float)
  get totalCost(): number {
    return this.creditHours * this.pricePerCredit;
  }
}
