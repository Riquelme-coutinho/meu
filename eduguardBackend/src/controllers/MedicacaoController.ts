import { Request, Response, NextFunction } from "express"
import MedicacaoService from "../services/MedicacaoService"

class MedicacaoController {
  async getMinhasMedicacoes(req: Request, res: Response, next: NextFunction) {
    try {
      const idResponsavel = req.idResponsavel

      if (!idResponsavel) {
        return res.status(401).json({ message: "Usuário não autenticado" })
      }

      const medicacoes = await MedicacaoService.getMedicacoesByResponsavel(idResponsavel)
      
      return res.status(200).json(medicacoes)
    } catch (error) {
      next(error) // Route error to global error middleware
    }
  }

  async adicionarMedicacao(req: Request, res: Response, next: NextFunction) {
    try {
      const idResponsavel = req.idResponsavel!
      const { idaluno, nome, dosagem, descfrequencia, dataini, datafim } = req.body
      let url_receita = null

      if (req.file) {
        url_receita = `/uploads/${req.file.filename}`
      }

      if (!idaluno || !nome) {
        return res.status(400).json({ error: "idaluno e nome são obrigatórios" })
      }

      const novaMedicacao = await MedicacaoService.adicionarMedicacao(idResponsavel, {
        idaluno: Number(idaluno),
        nome,
        dosagem,
        descfrequencia,
        dataini: dataini ? new Date(dataini) : undefined,
        datafim: datafim ? new Date(datafim) : undefined,
        url_receita
      })

      return res.status(201).json(novaMedicacao)
    } catch (error) {
      next(error)
    }
  }

  async removerMedicacao(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const idResponsavel = req.idResponsavel!

      await MedicacaoService.removerMedicacao(idResponsavel, Number(id))
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

export default new MedicacaoController()
