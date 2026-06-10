const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS avisoresposta (
        idavisoresposta SERIAL PRIMARY KEY,
        idaviso INTEGER NOT NULL,
        idresponsavel INTEGER NOT NULL,
        ciente BOOLEAN NOT NULL DEFAULT true,
        resposta TEXT,
        dataresposta TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_aviso FOREIGN KEY (idaviso) REFERENCES aviso(idaviso) ON DELETE CASCADE,
        CONSTRAINT fk_responsavel FOREIGN KEY (idresponsavel) REFERENCES responsavel(idresponsavel) ON DELETE CASCADE,
        CONSTRAINT unique_aviso_responsavel UNIQUE (idaviso, idresponsavel)
      );
    `);
    console.log("Table 'avisoresposta' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
