import MedicacaoRepository from "../repositories/MedicacaoRepository"

class MedicacaoService {
  async getMedicacoesByResponsavel(idResponsavel: number) {
    const medicacoes = await MedicacaoRepository.findByResponsavel(idResponsavel)
    return medicacoes
  }

  async adicionarMedicacao(idResponsavel: number, data: any) {
    return MedicacaoRepository.create({
      ...data,
      idresponsavel: idResponsavel
    })
  }

  async removerMedicacao(idResponsavel: number, idmedicacao: number) {
    // Validar se a medicação existe e pertence ao responsável
    const medicacoes = await this.getMedicacoesByResponsavel(idResponsavel)
    const pertence = medicacoes.find((m: any) => m.idmedicacao === idmedicacao)

    if (!pertence) {
      throw new Error("Acesso negado: Medicação não encontrada ou não pertence a você.")
    }

    return MedicacaoRepository.delete(idmedicacao)
  }
}

export default new MedicacaoService()
