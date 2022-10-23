import "reflect-metadata";

import { IsEmail } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";

export interface UserLoggedConstructorParams {
  name: string;
  email: string;
  id: string;
  token: string;
}

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  name: string;
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
