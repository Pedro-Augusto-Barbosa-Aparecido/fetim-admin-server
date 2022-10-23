import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../context";
import {
  UserChangePasswordInput,
  UserCreateInput,
  UserFilterInput,
  UserLoginInput,
  UserUpdateInput,
} from "../inputs/UserInput";
import { User, UserLogged } from "../models/User";

import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { generateToken } from "../utils/token";

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

  @Mutation(() => UserLogged)
  async createUser(@Arg("user") user: UserCreateInput, @Ctx() ctx: Context) {
    const userOnDB = await ctx.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userOnDB) {
      throw new GraphQLError("User already exist with this email!");
    }

    const { password } = user;
    const encryptPassword = await bcrypt.hashSync(password, 10);

    const newUser = await ctx.prisma.user.create({
      data: {
        ...user,
        password: encryptPassword,
      },
    });

    const userLogged = new UserLogged({
      name: user.name,
      id: newUser.id,
      email: user.email,
      token: await generateToken(
        {
          id: newUser.id,
        },
        259200
      ),
    });

    return userLogged;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("userID") userID: string, @Ctx() ctx: Context) {
    const user = await ctx.prisma.user.findUnique({ where: { id: userID } });
    if (!user) {
      throw new GraphQLError("User not exist!");
    }

    await ctx.prisma.user.delete({
      where: {
        id: userID,
      },
    });

    return true;
  }

  @Mutation(() => User)
  async updateUser(@Arg("user") user: UserUpdateInput, @Ctx() ctx: Context) {
    if (user.email) {
      const userOnDB = await ctx.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (userOnDB) {
        throw new GraphQLError("This email already is used");
      }
    }

    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name || undefined,
        email: user.email || undefined,
      },
    });

    return user;
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("user") user: UserChangePasswordInput,
    @Ctx() ctx: Context
  ) {
    const userOnDB = await ctx.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userOnDB) {
      throw new GraphQLError("User not Exist");
    }

    const encryptPassword = await bcrypt.hashSync(user.password, 10);

    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: encryptPassword,
      },
    });

    return true;
  }

  @Mutation(() => UserLogged)
  async login(@Arg("user") user: UserLoginInput, @Ctx() ctx: Context) {
    const userOnDB = await ctx.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!userOnDB) {
      throw new GraphQLError("User not exist!!");
    }

    const isPasswordMatch = await bcrypt.compareSync(
      user.password,
      userOnDB.password
    );

    if (!isPasswordMatch) {
      throw new GraphQLError("Password didn't match");
    }

    const userLogged = new UserLogged({
      name: userOnDB.name,
      id: userOnDB.id,
      email: user.email,
      token: await generateToken(
        {
          id: userOnDB.id,
        },
        259200
      ),
    });

    return userLogged;
  }
}
