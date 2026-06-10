import prisma from "../config/prisma"

class ChecklistRepository {

  async findByAlunos(idsAlunos: number[], data?: string) {

    let startDate: Date;
    let endDate: Date;

    if (data) {
      const [year, month, day] = data.split('-').map(Number);
      startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    } else {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    }

    return prisma.rotinachecklist.findMany({

      where: {
        idaluno: {
          in: idsAlunos
        },
        datahorasys: {
          gte: startDate,
          lte: endDate
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