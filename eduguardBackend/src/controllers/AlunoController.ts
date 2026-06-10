import { Request, Response, NextFunction } from "express"
import AlunoService from "../services/AlunoService"

class AlunoController {
  async getMeusAlunos(req: Request, res: Response, next: NextFunction) {
    try {
      const idresponsavel = req.idResponsavel;

      if (!idresponsavel) {
        // Isso normalmente não deve acontecer pois o authMiddleware já filtra
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      const alunos = await AlunoService.getMeusAlunos(idresponsavel)

      return res.status(200).json(alunos)
    } catch (error) {
      // Passa o erro adiante para o errorMiddleware global
      next(error)
    }
  }
}

export default new AlunoController()
