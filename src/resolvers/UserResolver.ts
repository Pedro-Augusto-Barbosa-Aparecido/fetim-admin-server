import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../context";
import { UserCreateInput, UserFilterInput } from "../inputs/UserInput";
import { User } from "../models/User";

import bcrypt from "bcrypt";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Arg("filter") filter: UserFilterInput, @Ctx() ctx: Context) {
    return ctx.prisma.user.findMany({
      where: {
        email: filter.email || undefined,
        name: {
          contains: filter.name || undefined,
        },
      },
    });
  }

  @Mutation(() => User)
  async createUser(@Arg("user") user: UserCreateInput, @Ctx() ctx: Context) {
    const { password } = user;
    const encryptPassword = await bcrypt.hashSync(password, 10);

    await ctx.prisma.user.create({
      data: {
        ...user,
        password: encryptPassword,
      },
    });

    return user;
  }
}
