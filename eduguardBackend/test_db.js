const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const rotinaCols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name ILIKE 'rotinachecklist';
  `);
  console.log("Columns in rotinachecklist:");
  console.table(rotinaCols);

  const notifCols = await prisma.$queryRawUnsafe(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name ILIKE '%notificacao%' OR table_name ILIKE '%aviso%';
  `);
  console.log("Columns in matched tables:");
  console.table(notifCols);
}

run().catch(console.error).finally(() => prisma.$disconnect());
