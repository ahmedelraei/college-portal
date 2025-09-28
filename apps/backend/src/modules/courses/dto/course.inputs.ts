import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { Semester } from '../../../entities/course.entity';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  courseCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(6)
  creditHours: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerCredit?: number;

  @Field(() => String)
  @IsEnum(Semester)
  semester: Semester;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  prerequisiteIds?: number[];

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class UpdateCourseInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  courseCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  courseName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  creditHours?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerCredit?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  prerequisiteIds?: number[];

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class CourseFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  creditHours?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;
}
