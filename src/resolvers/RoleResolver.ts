import {
  RoleNameAlreadyExist,
  RoleNameDuplicated,
  RoleNotFound,
} from "./../exceptions/RoleException";
import { GraphQLError } from "graphql";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../context";
import {
  RoleCreateInput,
  RoleFilterInput,
  RoleGetInput,
  RoleUpdateInput,
} from "../inputs/RoleInput";
import { Role } from "../models/Role";
import { InvalidRequestParameters } from "../exceptions/generic/GenericExceptions";

@Resolver()
export class RoleResolver {
  @Query(() => [Role])
  async listRole(@Arg("filter") filter: RoleFilterInput, @Ctx() ctx: Context) {
    return await ctx.prisma.role.findMany({
      where: {
        name: filter.name || undefined,
      },
    });
  }

  @Query(() => Role)
  async getRole(@Arg("filter") filter: RoleGetInput, @Ctx() ctx: Context) {
    if (!filter.id && !filter.name)
      throw new GraphQLError("Invalid parameters");

    const role = await ctx.prisma.role.findFirst({
      where: {
        AND: {
          name: filter.name || undefined,
          id: filter.id || undefined,
        },
      },
    });

    if (!role) {
      throw new RoleNotFound("Role not found");
    }

    return role;
  }

  @Mutation(() => Role)
  async createRole(@Arg("role") role: RoleCreateInput, @Ctx() ctx: Context) {
    const _role = await ctx.prisma.role.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: role.name,
        },
      },
    });

    if (_role) {
      throw new RoleNameAlreadyExist("Role already exist!!");
    }

    return await ctx.prisma.role.create({
      data: {
        name: role.name,
      },
    });
  }

  @Mutation(() => Role)
  async updateRole(@Arg("role") role: RoleUpdateInput, @Ctx() ctx: Context) {
    if (!role.id) throw new InvalidRequestParameters("ID is empty!!");

    const roleOnDb = await ctx.prisma.role.findFirst({
      where: {
        name: role.name,
      },
    });

    if (roleOnDb)
      throw new RoleNameDuplicated("Already exist a role with this name");

    const _role = await ctx.prisma.role.update({
      where: {
        id: role.id,
      },
      data: {
        name: role.name,
        updatedAt: new Date(),
      },
    });

    return _role;
  }

  @Mutation(() => Boolean)
  async deleteRole(@Arg("roleId") roleId: string, @Ctx() ctx: Context) {
    const role = await ctx.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) throw new RoleNotFound("Role not exists!");

    try {
      await ctx.prisma.role.delete({
        where: {
          id: roleId,
        },
      });
    } catch (err) {
      return false;
    }

    return true;
  }
}
