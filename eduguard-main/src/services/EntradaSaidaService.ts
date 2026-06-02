import ResponsavelRepository from "../repositories/ResponsavelRepository"
import EntradaSaidaRepository from "../repositories/EntradaSaidaRepository"

class EntradaSaidaService {

  async listarMovimentacoes(idResponsavel: number) {

    const vinculos =
      await ResponsavelRepository.findAlunosByResponsavelId(
        idResponsavel
      )

    const idsAlunos =
      vinculos.map((vinculo) => vinculo.idaluno)

    return EntradaSaidaRepository.findByAlunos(
      idsAlunos
    )
  }
}

export default new EntradaSaidaService()