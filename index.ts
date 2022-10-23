import "reflect-metadata";

import { ApolloServer } from "apollo-server";
import path from "path";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./src/resolvers/UserResolver";
import { context } from "./context";

async function main() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, "./src/schema.gql"),
  });

  const server = new ApolloServer({
    schema,
    context,
  });

  const { url } = await server.listen();

  console.log(`Server is running on ${url}`);
}

main();
