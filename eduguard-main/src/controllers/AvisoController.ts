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
}

export default new AvisoController()