const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS autorizadobusca (
        idautorizado SERIAL PRIMARY KEY,
        idaluno INT REFERENCES aluno(idaluno) ON DELETE CASCADE,
        nome VARCHAR(255) NOT NULL,
        cpf VARCHAR(14),
        parentesco VARCHAR(50),
        telefone VARCHAR(20),
        foto_url TEXT,
        datacriacao TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Table 'autorizadobusca' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
