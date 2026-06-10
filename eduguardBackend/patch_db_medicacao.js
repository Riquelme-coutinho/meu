const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE medicacao ADD COLUMN IF NOT EXISTS url_receita TEXT;
    `);
    console.log("Column 'url_receita' added successfully.");
  } catch (error) {
    console.error("Error adding column:", error);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
