import ResponsavelRepository from "../repositories/ResponsavelRepository"
import AutorizadosRepository from "../repositories/AutorizadosRepository"

class AutorizadosService {
  async listar(idResponsavel: number) {
    const vinculos = await ResponsavelRepository.findAlunosByResponsavelId(idResponsavel)
    const idsAlunos = vinculos.map(v => v.idaluno)
    return AutorizadosRepository.findByAlunos(idsAlunos)
  }

  async adicionar(idResponsavel: number, data: { idaluno: number, nome: string, cpf?: string, parentesco?: string, telefone?: string }) {
    // Validate if responsavel has access to this aluno
    const vinculos = await ResponsavelRepository.findAlunosByResponsavelId(idResponsavel)
    const hasAccess = vinculos.some(v => v.idaluno === data.idaluno)
    
    if (!hasAccess) {
      throw new Error("Acesso negado: Aluno não vinculado a este responsável.")
    }
    
    return AutorizadosRepository.create(data)
  }

  async remover(idResponsavel: number, idautorizado: number) {
    // Need to verify if the autorizadobusca belongs to an aluno linked to this responsavel
    const autorizados = await this.listar(idResponsavel)
    const belongs = autorizados.find(a => a.idautorizado === idautorizado)
    
    if (!belongs) {
      throw new Error("Acesso negado: Autorizado não encontrado para seus alunos.")
    }

    return AutorizadosRepository.delete(idautorizado)
  }
}

export default new AutorizadosService()
