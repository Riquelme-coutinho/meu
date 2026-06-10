const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const resp = await prisma.responsavel.findMany({ select: { nome: true, cpf: true, ativo: true } });
  console.log("Responsaveis:", resp);

  const func = await prisma.funcionario.findMany({ select: { nome: true, cpf: true, ativo: true } });
  console.log("Funcionarios:", func);
}
test().finally(() => prisma.$disconnect());
