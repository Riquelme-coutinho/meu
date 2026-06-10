import AlunoRepository from "../repositories/AlunoRepository"

class AlunoService {
  async getMeusAlunos(idresponsavel: number) {
    const alunos = await AlunoRepository.findByResponsavelId(idresponsavel)

    // Formatar os dados para o Frontend (extraindo o nome da turma para simplificar o card)
    return alunos.map(aluno => {
      const turmaInfo = aluno.enturmacao?.[0]?.turma?.codigoturma || null;
      return {
        idaluno: aluno.idaluno,
        nome: aluno.nome,
        matricula: aluno.matricula,
        turma: turmaInfo
      }
    })
  }
}

export default new AlunoService()
