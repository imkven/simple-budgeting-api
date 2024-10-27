import {
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.category.createMany({
    data: [
      {
        name: 'Salary',
        description : 'All about salary.',
      },
      {
        name: 'Food',
        description:'All about food.',
      },
      {
        name: 'Clothing',
        description:'All about clothes.',
      },
      {
        name: 'Household',
        description:'All about household.',
      },
      {
        name: 'Transport',
        description:'All about transport.',
      }
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
