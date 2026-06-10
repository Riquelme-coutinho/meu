import { Request, Response } from "express"

import AvisoService from "../services/AvisoService"

class AvisoController {
  async listar(req: Request, res: Response) {
    const avisos =
      await AvisoService.listarAvisosDoResponsavel(
        req.idResponsavel!
      )

    return res.json(avisos)
  }

  async responder(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { resposta } = req.body
      const idResponsavel = req.idResponsavel!

      const avisoresposta = await AvisoService.responderAviso(idResponsavel, Number(id), resposta)
      return res.status(200).json(avisoresposta)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao registrar ciente do aviso.' })
    }
  }
}

export default new AvisoController()