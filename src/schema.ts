import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
  types: [],
  outputs: {
    // npx ts-node --transpile-only src/schema generates the two files by Nexus
    schema: join(process.cwd(), "schema.graphql"),
    // TypeScrip type definitions for all types in GraphQL schema generated to keep things in sync with implementation
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
});
