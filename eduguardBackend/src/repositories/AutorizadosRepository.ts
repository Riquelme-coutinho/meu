import prisma from "../config/prisma"

class AutorizadosRepository {
  async findByAlunos(idsAlunos: number[]) {
    return prisma.autorizadobusca.findMany({
      where: { idaluno: { in: idsAlunos } },
      include: { aluno: true },
      orderBy: { datacriacao: "desc" }
    })
  }

  async create(data: { idaluno: number, nome: string, cpf?: string, parentesco?: string, telefone?: string }) {
    return prisma.autorizadobusca.create({
      data
    })
  }

  async delete(idautorizado: number) {
    return prisma.autorizadobusca.delete({
      where: { idautorizado }
    })
  }
}

export default new AutorizadosRepository()
