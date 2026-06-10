const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const data = {
      idaluno: 1, // hardcoded for test
      nome: "Teste Remédio",
      descfrequencia: "8 em 8 horas",
      dosagem: "15 gotas"
    };

    const responsavelAluno = await prisma.responsavelaluno.findFirst({
      where: { idaluno: data.idaluno }
    });

    const idresponsavel = responsavelAluno?.idresponsavel || null;

    const res = await prisma.medicacao.create({
      data: {
        idaluno: data.idaluno,
        nome: data.nome,
        descfrequencia: data.descfrequencia,
        dosagem: data.dosagem,
        idresponsavel: idresponsavel,
        dataini: new Date(),
      }
    });

    console.log("Success:", res);
  } catch (error) {
    console.error("Error creating:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
