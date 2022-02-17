import {
  extendType,
  objectType,
  nonNull,
  stringArg,
  intArg,
  enumType,
  inputObjectType,
  arg,
  list,
} from "nexus";
import { Prisma } from "@prisma/client";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});
// let links: NexusGenObjects["Link"][] = [
//   {
//     id: 1,
//     url: "www.howtographql.com",
//     description: "Fullstack tutorial for GraphQL",
//   },
//   {
//     id: 2,
//     url: "graphql.org",
//     description: "GraphQL official website",
//   },
// ];

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: Link });
    t.nonNull.int("count");
  },
});

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
    t.nonNull.field("feed", {
      type: "Feed",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }), // 1
      },
      // Resolver is implementation of GraphQL field
      async resolve(parent, args, context) {
        // return links;
        const where = args.filter
          ? {
              OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } },
              ],
            }
          : {};

        const links = context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined,
        });

        const count = await context.prisma.link.count({ where });

        return {
          links,
          count,
        };
      },
    });
  },
});

/*
  This generates 
  type Mutation {
    post(description: String!, url: String!): Link!
  }

  Can pass in variables like 
  mutation Post($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      url
      description
    }
  }
*/
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        // const { description, url } = args;
        // const link = {
        //   id: links.length + 1,
        //   description,
        //   url,
        // };
        // links.push(link);
        // return link;
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        // Apollo automatically resolves Promise objects returned from resolver functions
        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } },
          },
        });

        return newLink;
      },
    });

    // t.nonNull.field("updateLink", {
    //   type: "Link",
    //   args: {
    //     id: nonNull(intArg()),
    //     url: stringArg(),
    //     description: stringArg(),
    //   },

    //   resolve(parent, args, context) {
    //     const { id, url = "", description = "" } = args;
    //     let updatedLink = {
    //       id,
    //       url: url ?? "",
    //       description: description ?? "",
    //     };
    //     links = links.map((link) => {
    //       if (link.id === id) {
    //         updatedLink = {
    //           id,
    //           url: updatedLink.url ?? link.url,
    //           description: updatedLink.description ?? link.description,
    //         };
    //         return updatedLink;
    //       }
    //       return link;
    //     });
    //     return updatedLink;
    //   },
    // });

    // t.nonNull.field("deleteLink", {
    //   type: "Link",
    //   args: {
    //     id: nonNull(intArg()),
    //   },

    //   resolve(parent, args, context) {
    //     const { id } = args;

    //     let deletedLink = {
    //       id,
    //       url: "",
    //       description: "",
    //     };
    //     links = links.filter((link) => {
    //       if (link.id === id) {
    //         deletedLink = {
    //           ...deletedLink,
    //           url: link.url,
    //           description: link.description,
    //         };
    //       }

    //       return link.id !== id;
    //     });

    //     return deletedLink;
    //   },
    // });
  },
});
