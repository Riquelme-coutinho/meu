import prisma from "../config/prisma"

class FuncionarioRepository {
  async findByCpf(cpf: string) {
    return prisma.funcionario.findFirst({
      where: {
        cpf
      }
    })
  }

  async findAll() {
    return prisma.funcionario.findMany()
  }

  async updatePassword(idfuncionario: number, senhaHash: string) {
    return prisma.funcionario.update({
      where: { idfuncionario },
      data: { senha: senhaHash }
    })
  }
}

export default new FuncionarioRepository()
