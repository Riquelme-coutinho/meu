import prisma from "../config/prisma"

class AvisoRepository {
  async findAvisosByTurmas(idsTurmas: number[]) {
    return prisma.aviso.findMany({
      where: {
        OR: [
          { idturma: null },
          { idturma: { in: idsTurmas } }
        ]
      },
      orderBy: {
        datacadastro: "desc"
      }
    })
  }
}

export default new AvisoRepository()