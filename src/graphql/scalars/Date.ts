import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars";

// Uses ISO-8601 spec, same as Prisma
export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime");
