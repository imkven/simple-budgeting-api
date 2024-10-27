import {
  CategoryType,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.category.createMany({
    data: [
      {
        name: 'Rent/Mortgage',
        description: 'Rent and Mortgage related expenses.',
        type: CategoryType.EXPENSE,
      },
      {
        name: 'Utilities',
        description: 'All about utilities like electricity, water etc',
        type: CategoryType.EXPENSE,
      },
      {
        name: 'Car payment',
        description: 'Car payment related expenses',
        type: CategoryType.EXPENSE,
      },
      {
        name: 'Auto insurance',
        description: 'Auto insurance related expenses',
        type: CategoryType.EXPENSE,
      },
      {
        name: 'Health',
        description:'All about health related expenses like medicines, healthcare etc',
        type : CategoryType.EXPENSE,
      },
      {
        name: 'Groceries',
        description:'All about groceries related expenses like fruits, vegetables etc',
        type : CategoryType.EXPENSE,
      },
      {
        name: 'Entertainment',
        description:'All about entertainment related expenses like movies, games etc',
        type : CategoryType.EXPENSE,
      },
      {
        name: 'Transport',
        description:'All about transport related expenses like bus, train etc',
        type : CategoryType.EXPENSE,
      },
      {
        name: 'Dining',
        description:'All about dining related expenses like restaurants, hotels etc ',
        type : CategoryType.EXPENSE,
      },
      {
        name: 'Miscellaneous',
        description:'All about miscellaneous expenses like gifts, loans etc ',
        type : CategoryType.EXPENSE ,
      },
      {
        name: 'Salary',
        type : CategoryType.INCOME,
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
