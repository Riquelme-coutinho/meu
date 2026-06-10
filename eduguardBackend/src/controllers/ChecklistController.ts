import { Request, Response } from "express"

import ChecklistService from "../services/ChecklistService"

class ChecklistController {

  async listar(req: Request, res: Response) {
    const data = req.query.data as string | undefined;

    const checklists =
      await ChecklistService.listar(
        req.idResponsavel!,
        data
      )

    return res.json(checklists)
  }
}

export default new ChecklistController()