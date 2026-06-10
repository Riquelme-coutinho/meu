import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class AlunoRepository {
  async findByResponsavelId(idresponsavel: number) {
    const vinculos = await prisma.responsavelaluno.findMany({
      where: {
        idresponsavel: idresponsavel
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
    });
    
    return vinculos.map(v => v.aluno);
  }
}

export default new AlunoRepository()
