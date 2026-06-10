const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Testing getMedicacoes logic...");

    const medicacoes = await prisma.medicacao.findMany({
      include: {
        aluno: {
          include: {
            enturmacao: {
              include: {
                turma: true
              }
            }
          }
        },
        administracaomedicacao: {
          where: {
            data: {
              gte: today
            }
          },
          orderBy: {
            datahorasysdate: 'desc'
          },
          take: 1,
          include: {
            funcionario: {
              select: { nome: true }
            }
          }
        }
      }
    });

    console.log("Success! Found", medicacoes.length, "items.");
    console.log(medicacoes[0] || "No items.");
  } catch (error) {
    console.error("Error in getMedicacoes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
