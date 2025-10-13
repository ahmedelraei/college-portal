import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { User, UserRole } from '../../../entities/user.entity';

// Register the enum for GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

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
