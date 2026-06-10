const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const rotinas = await prisma.rotinachecklist.findMany({ take: 1 });
    console.log("Success:", rotinas);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
