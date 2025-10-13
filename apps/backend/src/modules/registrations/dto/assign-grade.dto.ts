import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { Grade } from '../../../entities/registration.entity';

@InputType()
export class AssignGradeDto {
  @Field()
  @IsInt()
  @IsNotEmpty()
  registrationId: number;

  @Field()
  @IsEnum(Grade)
  @IsNotEmpty()
  grade: Grade;
}
