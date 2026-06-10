import { Request, Response } from "express"

import AuthService from "../services/AuthService"

class AuthController {
  async login(req: Request, res: Response) {
    const { cpf, senha } = req.body

    const result =
      await AuthService.login(cpf, senha)

    return res.json(result)
  }

  async esqueciSenha(req: Request, res: Response) {
    try {
      const { cpf } = req.body
      const result = await AuthService.esqueciSenha(cpf)
      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async resetarSenha(req: Request, res: Response) {
    try {
      const { cpf, codigo, novaSenha } = req.body
      const result = await AuthService.resetarSenha(cpf, codigo, novaSenha)
      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}

export default new AuthController()