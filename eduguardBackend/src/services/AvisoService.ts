import ResponsavelRepository from "../repositories/ResponsavelRepository"
import AvisoRepository from "../repositories/AvisoRepository"

class AvisoService {
  async listarAvisosDoResponsavel(idResponsavel: number) {
    const vinculos =
      await ResponsavelRepository.findAlunosComTurma(idResponsavel)

    const idsTurmas = vinculos
      .flatMap((vinculo) =>
        vinculo.aluno.enturmacao.map((enturmacao) => enturmacao.idturma)
      )

    return AvisoRepository.findAvisosByTurmas(idsTurmas, idResponsavel)
  }

  async responderAviso(idResponsavel: number, idAviso: number, resposta?: string) {
    return AvisoRepository.createResposta({
      idresponsavel: idResponsavel,
      idaviso: idAviso,
      resposta
    })
  }
}

export default new AvisoService()