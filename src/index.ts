import { ApolloServer } from "apollo-server";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { schema } from "./schema";
export const server = new ApolloServer({
  schema,
  // To use GraphQL Playground instead of Apollo Studio (which requires an internet connection) you can use this plugin instead
  // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const port = 3000;

server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
