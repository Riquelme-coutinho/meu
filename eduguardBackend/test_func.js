const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const res = await prisma.funcaofuncionario.findFirst();
    console.log("funcaofuncionario OK", res);
  } catch (e) {
    console.log("funcaofuncionario ERROR", e);
  }
  
  try {
    const res = await prisma.funcionario.findFirst();
    console.log("funcionario OK", res);
  } catch (e) {
    console.log("funcionario ERROR", e);
  }
}
test().finally(() => prisma.$disconnect());
