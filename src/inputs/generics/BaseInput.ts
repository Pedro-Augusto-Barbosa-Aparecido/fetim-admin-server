import { Field, InputType } from "type-graphql";

@InputType()
export class BaseInput {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;
}
