import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsNumber } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

@InputType()
export class RegisterInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

@InputType()
export class AdminLoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

@InputType()
export class CreateStudentInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
