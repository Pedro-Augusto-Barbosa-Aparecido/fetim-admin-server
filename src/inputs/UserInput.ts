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
