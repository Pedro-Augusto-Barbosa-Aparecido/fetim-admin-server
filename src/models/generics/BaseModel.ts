import "reflect-metadata";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class BaseModel {
  @Field({ nullable: true })
  createdAt: Date;

  @Field((_type) => ID)
  id: string;
}
