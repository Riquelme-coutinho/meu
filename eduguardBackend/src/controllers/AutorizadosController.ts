import { Request, Response, NextFunction } from "express"
import AutorizadosService from "../services/AutorizadosService"

class AutorizadosController {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const autorizados = await AutorizadosService.listar(req.idResponsavel!)
      return res.json(autorizados)
    } catch (error) {
      next(error)
    }
  }

  async adicionar(req: Request, res: Response, next: NextFunction) {
    try {
      const { idaluno, nome, cpf, parentesco, telefone } = req.body
      if (!idaluno || !nome) {
         return res.status(400).json({ error: "idaluno e nome são obrigatórios" })
      }
      
      const autorizado = await AutorizadosService.adicionar(req.idResponsavel!, {
        idaluno: Number(idaluno),
        nome,
        cpf,
        parentesco,
        telefone
      })
      
      return res.status(201).json(autorizado)
    } catch (error) {
      next(error)
    }
  }

  async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await AutorizadosService.remover(req.idResponsavel!, Number(id))
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

export default new AutorizadosController()
