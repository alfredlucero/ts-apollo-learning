import { ApolloServer } from "apollo-server";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { context } from "./context";

import { schema } from "./schema";
export const server = new ApolloServer({
  schema,
  // We can access context.prisma everywhere in resolver functions
  context,
  // To use GraphQL Playground instead of Apollo Studio (which requires an internet connection) you can use this plugin instead
  // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const port = 3000;

server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
