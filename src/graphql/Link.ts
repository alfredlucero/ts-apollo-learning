import { extendType, objectType, nonNull, stringArg, intArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
  },
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
        // return links;
        return context.prisma.link.findMany();
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
