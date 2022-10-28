import "reflect-metadata";

import { IsEmail } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { BaseModel } from "./generics/BaseModel";
import { Role } from "./Role";

export interface UserLoggedConstructorParams {
  name: string;
  email: string;
  id: string;
  token: string;
}

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field()
  role: Role[];
}

@ObjectType()
export class UserLogged extends User {
  @Field()
  token: string;

  constructor({ name, email, id, token }: UserLoggedConstructorParams) {
    super();
    this.name = name;
    this.email = email;
    this.id = id;
    this.token = token;
  }
}
