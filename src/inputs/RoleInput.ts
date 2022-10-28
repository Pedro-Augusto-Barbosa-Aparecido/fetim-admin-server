import { InputType } from "type-graphql";
import { BaseInput } from "./generics/BaseInput";

@InputType()
export class RoleFilterInput extends BaseInput {}

@InputType()
export class RoleCreateInput extends BaseInput {}

@InputType()
export class RoleGetInput extends BaseInput {}

@InputType()
export class RoleUpdateInput extends BaseInput {}
