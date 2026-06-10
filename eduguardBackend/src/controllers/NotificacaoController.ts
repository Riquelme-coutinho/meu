import { Request, Response, NextFunction } from "express"

import NotificacaoService
from "../services/NotificacaoService"

class NotificacaoController {

  async listar(req: Request, res: Response) {

    const notificacoes =
      await NotificacaoService.listar(
        req.idResponsavel!
      )

    return res.json(notificacoes)
  }

 async visualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params

    const resultado =
      await NotificacaoService.visualizar(
        Number(id),
        req.idResponsavel!
      )

    return res.json(resultado)
  } catch (error) {
    next(error)
  }
}

  //contador de not n lidas
async contarNaoLidas(req: Request, res: Response) {
  const resultado =
    await NotificacaoService.contarNaoLidas(req.idResponsavel!)

  return res.json(resultado)
}



}

export default new NotificacaoController()