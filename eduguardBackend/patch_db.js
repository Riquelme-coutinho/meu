const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // Drop the conflicting notificacao table if it exists
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS notificacao;`);
    
    // Create notificacao table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE notificacao (
        idnotificacao SERIAL PRIMARY KEY,
        idresponsavel INT REFERENCES responsavel(idresponsavel) ON DELETE CASCADE,
        titulo VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        visualizado BOOLEAN DEFAULT FALSE,
        dataenvio TIMESTAMP DEFAULT NOW(),
        datacriacao TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Table 'notificacao' created.");

    // Add idrotinachecklist to rotinachecklist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE rotinachecklist ADD COLUMN IF NOT EXISTS idrotinachecklist SERIAL PRIMARY KEY;
    `);
    console.log("Column 'idrotinachecklist' added to 'rotinachecklist'.");

  } catch (error) {
    console.error("Error running DB patch:", error);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
