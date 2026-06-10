import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class MedicacaoRepository {
  async findByResponsavel(idResponsavel: number) {
    return prisma.medicacao.findMany({
      where: {
        aluno: {
          responsavelaluno: {
            some: {
              idresponsavel: idResponsavel
            }
          }
        }
      },
      include: {
        aluno: {
          select: {
            nome: true,
            matricula: true
          }
        },
        administracaomedicacao: {
          orderBy: {
            datahorasysdate: 'desc'
          },
          include: {
            funcionario: {
              select: {
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        idmedicacao: 'desc'
      }
    })
  }

  async create(data: any) {
    return prisma.medicacao.create({
      data
    })
  }

  async delete(idmedicacao: number) {
    return prisma.medicacao.delete({
      where: { idmedicacao }
    })
  }
}

export default new MedicacaoRepository()
