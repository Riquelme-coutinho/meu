const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Adding column url_receita to medicacao table...");
    await prisma.$executeRawUnsafe(`ALTER TABLE medicacao ADD COLUMN IF NOT EXISTS url_receita VARCHAR(255);`);
    console.log("Success! Column added.");
  } catch (error) {
    console.error("Error modifying database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
