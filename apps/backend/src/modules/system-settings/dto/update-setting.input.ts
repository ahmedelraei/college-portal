import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSettingInput {
  @Field()
  settingKey: string;

  @Field()
  settingValue: string;
}

