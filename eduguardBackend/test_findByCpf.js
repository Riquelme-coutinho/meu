const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const usuario = await prisma.funcionario.findFirst({
      where: { cpf: '22222222222' }
    });
    console.log("Joao Porteiro found:", !!usuario);
  } catch (e) {
    console.log("Error finding Joao Porteiro:", e.message);
  }
}
test().finally(() => prisma.$disconnect());
