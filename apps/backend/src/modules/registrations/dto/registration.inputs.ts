import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';

@InputType()
export class CreateRegistrationInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  semester: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  year: number;
}

@InputType()
export class BulkRegistrationInput {
  @Field(() => [Int])
  @IsArray()
  @IsNumber({}, { each: true })
  courseIds: number[];

  @Field()
  @IsString()
  @IsNotEmpty()
  semester: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  year: number;
}

@InputType()
export class UpdateRegistrationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  grade?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  gradePoints?: number;

  @Field({ nullable: true })
  @IsOptional()
  isCompleted?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  isDropped?: boolean;
}
