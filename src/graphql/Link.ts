import { extendType, objectType } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

let links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

/*
  This generates 
  type Query {
    feed: [Link!]!
  }
*/
export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    // [Link!]!
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      // Resolver is implementation of GraphQL field
      resolve(parent, args, context, info) {
        return links;
      },
    });
  },
});
