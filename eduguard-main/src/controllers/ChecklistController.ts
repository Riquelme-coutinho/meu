import { Request, Response } from "express"

import ChecklistService from "../services/ChecklistService"

class ChecklistController {

  async listar(req: Request, res: Response) {

    const checklists =
      await ChecklistService.listar(
        req.idResponsavel!
      )

    return res.json(checklists)
  }
}

export default new ChecklistController()