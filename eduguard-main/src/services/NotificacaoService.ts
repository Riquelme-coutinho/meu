import NotificacaoRepository
from "../repositories/NotificacaoRepository"

class NotificacaoService {

  async listar(idResponsavel: number) {

    return NotificacaoRepository.findByResponsavel(
      idResponsavel
    )
  }

  async visualizar(
  idNotificacao: number,
  idResponsavel: number
) {
  const resultado =
    await NotificacaoRepository.visualizar(
      idNotificacao,
      idResponsavel
    )

  if (resultado.count === 0) {
    throw new Error("Notificação não encontrada")
  }

  return {
    message: "Notificação marcada como visualizada"
  }
}
//contador de not n lidas
async contarNaoLidas(idResponsavel: number) {
  const total = await NotificacaoRepository.countNaoLidas(idResponsavel)

  return {
    total
  }
}


}

export default new NotificacaoService()