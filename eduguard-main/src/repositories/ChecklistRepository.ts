import prisma from "../config/prisma"

class ChecklistRepository {

  async findByAlunos(idsAlunos: number[]) {

    return prisma.rotinachecklist.findMany({

      where: {
        idaluno: {
          in: idsAlunos
        }
      },

      include: {
        checklist: true,
        aluno: true,
        funcionario: true
      },

      orderBy: {
        datahorasys: "desc"
      }
    })
  }
}

export default new ChecklistRepository()