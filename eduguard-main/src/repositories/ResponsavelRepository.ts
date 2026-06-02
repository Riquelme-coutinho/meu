import prisma from "../config/prisma"

interface CreateResponsavelDTO {
  nome: string
  cpf: string
  celular: string
  email: string
  senha: string
  master?: boolean
}

class ResponsavelRepository {
  async findAll() {
    return prisma.responsavel.findMany()
  }

  async findByCpf(cpf: string) {
    return prisma.responsavel.findFirst({
      where: {
        cpf
      }
    })
  }

  async create(data: CreateResponsavelDTO) {
    return prisma.responsavel.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        celular: data.celular,
        email: data.email,
        senha: data.senha,
        master: data.master ?? false,
        ativo: true,
        datacadastro: new Date()
      }
    })
  }


async findById(id: number) {
  return prisma.responsavel.findUnique({
    where: {
      idresponsavel: id
    }
  })
}

async findAlunosByResponsavelId(idResponsavel: number) {
  return prisma.responsavelaluno.findMany({
    where: {
      idresponsavel: idResponsavel
    },
    include: {
      aluno: true
    }
  })
}

async findAlunosComTurma(idResponsavel: number) {
  return prisma.responsavelaluno.findMany({
    where: {
      idresponsavel: idResponsavel
    },

    include: {
      aluno: {
        include: {
          enturmacao: {
            include: {
              turma: true
            }
          }
        }
      }
    }
  })
}

//edição de perfil
async update(
  id: number,
  data: {
    nome?: string
    celular?: string
    email?: string
  }
) {

  return prisma.responsavel.update({
    where: {
      idresponsavel: id
    },

    data
  })
}


//responsavel secundaio

async vincularAluno(
  idResponsavel: number,
  idAluno: number
) {

  return prisma.responsavelaluno.create({

    data: {
      idresponsavel: idResponsavel,
      idaluno: idAluno
    }
  })
}

//up de foto
async updateFoto(id: number, foto: Buffer) {
  return prisma.responsavel.update({
    where: {
      idresponsavel: id
    },
    data: {
      foto: new Uint8Array(foto)
    }
  })
}


}
export default new ResponsavelRepository()