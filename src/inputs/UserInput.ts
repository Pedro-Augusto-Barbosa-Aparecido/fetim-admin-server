import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserCreateInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}

@InputType()
export class UserFilterInput {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  name: string;
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field()
  id: string;
}

@InputType()
export class UserChangePasswordInput {
  @Field()
  id: string;

  @Field()
  password: string;
}

@InputType()
export class UserLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
