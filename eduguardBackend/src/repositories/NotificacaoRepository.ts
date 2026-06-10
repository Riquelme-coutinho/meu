import prisma from "../config/prisma"

class NotificacaoRepository {

  async findByResponsavel(
    idResponsavel: number
  ) {

    return prisma.notificacao.findMany({

      where: {
        idresponsavel: idResponsavel
      },

      orderBy: {
        datacriacao: "desc"
      }
    })
  }

  async visualizar(
  idNotificacao: number,
  idResponsavel: number
) {
  return prisma.notificacao.updateMany({
    where: {
      idnotificacao: idNotificacao,
      idresponsavel: idResponsavel
    },
    data: {
      visualizado: true
    }
  })
}

  // validação de not não lidas
async countNaoLidas(idResponsavel: number) {
  return prisma.notificacao.count({
    where: {
      idresponsavel: idResponsavel,
      visualizado: false
    }
  })
}


}

export default new NotificacaoRepository()