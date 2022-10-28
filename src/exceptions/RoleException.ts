import { GraphQLError } from "graphql";

export class RoleNameDuplicated extends GraphQLError {}

export class RoleNameAlreadyExist extends GraphQLError {}

export class RoleNotFound extends GraphQLError {}
