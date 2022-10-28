import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";
import { BaseModel } from "./generics/BaseModel";

@ObjectType()
export class Role extends BaseModel {
  @Field()
  name: string;
}
