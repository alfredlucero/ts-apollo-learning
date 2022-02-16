import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
  1. Manually adjust your Prisma data model.
  2. Migrate your database using the prisma migrate CLI commands we covered.
  3. (Re-)generate Prisma Client.
  4. Use Prisma Client in your application code to access your database.
*/
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "Fullstack tutorial for GraphQL",
      url: "www.howtographql.com",
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
