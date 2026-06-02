import { Request, Response } from "express"

import EntradaSaidaService from "../services/EntradaSaidaService"

class EntradaSaidaController {

  async listar(req: Request, res: Response) {

    const movimentacoes =
      await EntradaSaidaService.listarMovimentacoes(
        req.idResponsavel!
      )

    return res.json(movimentacoes)
  }
}

export default new EntradaSaidaController()