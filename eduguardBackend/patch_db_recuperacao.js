const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE responsavel
      ADD COLUMN IF NOT EXISTS codigo_recuperacao VARCHAR(6),
      ADD COLUMN IF NOT EXISTS expiracao_codigo TIMESTAMP(6);
    `);
    console.log("Columns 'codigo_recuperacao' and 'expiracao_codigo' added successfully to responsavel.");
  } catch (error) {
    console.error("Error altering table:", error);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
