import { Request, Response } from "express"

import AuthService from "../services/AuthService"

class AuthController {
  async login(req: Request, res: Response) {
    const { cpf, senha } = req.body

    const result =
      await AuthService.login(cpf, senha)

    return res.json(result)
  }
}

export default new AuthController()