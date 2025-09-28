import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';
import { UserRole } from '../../../entities/user.entity';

// Register the enum for GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  studentId?: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field()
  message: string;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
}
