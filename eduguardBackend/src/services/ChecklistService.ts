import ResponsavelRepository from "../repositories/ResponsavelRepository"
import ChecklistRepository from "../repositories/ChecklistRepository"

class ChecklistService {

  async listar(idResponsavel: number, data?: string) {

    const vinculos =
      await ResponsavelRepository.findAlunosByResponsavelId(
        idResponsavel
      )

    const idsAlunos =
      vinculos.map((vinculo) => vinculo.idaluno)

    return ChecklistRepository.findByAlunos(
      idsAlunos,
      data
    )
  }
}

export default new ChecklistService()