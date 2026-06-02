import prisma from "../config/prisma"

class EntradaSaidaRepository {

  async findByAlunos(idsAlunos: number[]) {

    return prisma.entradasaida.findMany({

      where: {
        idaluno: {
          in: idsAlunos
        }
      },

      include: {
        aluno: true,
        responsavel: true
      },

      orderBy: {
        datahorasys: "desc"
      }
    })
  }
}

export default new EntradaSaidaRepository()