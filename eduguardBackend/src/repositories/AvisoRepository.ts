import prisma from "../config/prisma"

class AvisoRepository {
  async findAvisosByTurmas(idsTurmas: number[], idResponsavel: number) {
    return prisma.aviso.findMany({
      where: {
        OR: [
          { idturma: null },
          { idturma: { in: idsTurmas } }
        ]
      },
      include: {
        avisoresposta: {
          where: {
            idresponsavel: idResponsavel
          }
        }
      },
      orderBy: {
        datacadastro: "desc"
      }
    })
  }

  async createResposta(data: any) {
    return prisma.avisoresposta.upsert({
      where: {
        idaviso_idresponsavel: {
          idaviso: data.idaviso,
          idresponsavel: data.idresponsavel
        }
      },
      update: {
        ciente: true,
        resposta: data.resposta,
        dataresposta: new Date()
      },
      create: {
        idaviso: data.idaviso,
        idresponsavel: data.idresponsavel,
        ciente: true,
        resposta: data.resposta
      }
    })
  }
}

export default new AvisoRepository()