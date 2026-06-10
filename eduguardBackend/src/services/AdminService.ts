import prisma from "../config/prisma"
import bcrypt from "bcrypt"

class AdminService {
  async getDashboard() {
    // Metrics: total attendance, active school status, etc.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.entradasaida.findMany({
      where: {
        datahorasys: {
          gte: today
        }
      },
      include: {
        aluno: true
      },
      orderBy: {
        datahorasys: 'desc'
      },
      take: 10
    });

    const activeAlunos = await prisma.aluno.count({
      where: { ativo: true }
    });

    return {
      activeAlunos,
      todayLogs: logs.length,
      recentLogs: logs.map(l => ({ ...l, datahora: l.datahorasys, tipo: l.descricao }))
    };
  }

  async getFuncoes() {
    return prisma.funcaofuncionario.findMany();
  }

  async getStaff() {
    const funcoes = await prisma.funcaofuncionario.findMany();
    const mapFuncoes = new Map(funcoes.map((f: any) => [f.idfuncao, f.descricaofuncao]));

    const staff = await prisma.funcionario.findMany({
      select: {
        idfuncionario: true,
        nome: true,
        cpf: true,
        email: true,
        ativo: true,
        idfuncao: true
      }
    });

    return staff.map((s: any) => ({
      idfuncionario: s.idfuncionario,
      nome: s.nome,
      cpf: s.cpf,
      email: s.email,
      ativo: s.ativo,
      cargo: mapFuncoes.get(s.idfuncao) || 'Sem Cargo'
    }));
  }

  async createStaff(data: any) {
    const hashedSenha = await bcrypt.hash(data.senha, 10);
    return prisma.funcionario.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        senha: hashedSenha,
        idfuncao: data.idfuncao,
        dataadmissao: new Date(),
        ativo: true
      }
    });
  }

  async updateStaff(idfuncionario: number, data: any) {
    const updateData: any = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      idfuncao: data.idfuncao,
    };

    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    return prisma.funcionario.update({
      where: { idfuncionario },
      data: updateData
    });
  }

  async deleteStaff(id: number) {
    return prisma.funcionario.delete({
      where: { idfuncionario: id }
    });
  }

  async getAuditLogs() {
    // For simplicity without a real audit table, we just return some placeholders or existing metric logs
    return [
      { id: 1, action: 'Login', user: 'Diretor', timestamp: new Date().toISOString() },
      { id: 2, action: 'Aviso Enviado', user: 'Diretor', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ];
  }

  async recordAttendance(document: string, tipo: 'ENTRADA' | 'SAIDA') {
    // Basic lookup logic: search if document is an Aluno's matricula, or a Responsavel's CPF.
    const docClean = document.replace(/\D/g, '');
    let aluno: any = null;

    if (docClean.length === 11) { // Likely CPF
      const responsavel = await prisma.responsavel.findFirst({
        where: { cpf: docClean },
        include: { responsavelaluno: { include: { aluno: true } } }
      });
      if (responsavel && responsavel.responsavelaluno.length > 0) {
        aluno = responsavel.responsavelaluno[0].aluno; // Taking the first child for demo purposes. In a real scenario, allow selecting.
      }
    } else {
      // Matricula do aluno
      aluno = await prisma.aluno.findFirst({
        where: { matricula: document }
      });
    }

    if (!aluno) {
      throw new Error("Estudante ou Responsável não encontrado.");
    }

    // Check if the same action was recently performed to avoid duplicates
    const lastRecord = await prisma.entradasaida.findFirst({
      where: { idaluno: aluno.idaluno },
      orderBy: { datahorasys: 'desc' }
    });

    if (lastRecord && lastRecord.descricao === tipo && lastRecord.datahorasys) {
      const hoursDiff = (new Date().getTime() - lastRecord.datahorasys.getTime()) / 3600000;
      if (hoursDiff < 2) {
        throw new Error(`Este aluno já possui um registro de ${tipo} nas últimas 2 horas.`);
      }
    }

    const log = await prisma.entradasaida.create({
      data: {
        idaluno: aluno.idaluno,
        descricao: tipo,
        datahorasys: new Date()
      },
      include: { aluno: true }
    });

    return { ...log, tipo: log.descricao, datahora: log.datahorasys };
  }

  async getRecentAttendance() {
    const logs = await prisma.entradasaida.findMany({
      include: { aluno: true },
      orderBy: { datahorasys: 'desc' },
      take: 10
    });
    return logs.map((l: any) => ({ ...l, datahora: l.datahorasys, tipo: l.descricao }));
  }

  async getAlunos() {
    const alunos = await prisma.aluno.findMany({
      include: {
        enturmacao: {
          include: { turma: true }
        },
        responsavelaluno: {
          include: {
            responsavel: {
              select: { idresponsavel: true, nome: true, cpf: true }
            }
          }
        }
      }
    });
    return alunos.map(a => ({
      idaluno: a.idaluno,
      nome: a.nome,
      matricula: a.matricula,
      ativo: a.ativo,
      idturma: a.enturmacao[0]?.turma?.idturma || null,
      turma: a.enturmacao[0]?.turma?.codigoturma || 'Sem Turma',
      responsavelaluno: a.responsavelaluno
    }));
  }

  
  async createAluno(nome: string, idturma: number, idresponsaveis: number[]) {
    const matricula = new Date().getFullYear().toString() + Math.floor(1000 + Math.random() * 9000).toString();
    return prisma.$transaction(async (tx) => {
      const aluno = await tx.aluno.create({
        data: {
          nome,
          matricula,
          ativo: true,
          datacriacao: new Date()
        }
      });
      await tx.enturmacao.create({
        data: {
          idaluno: aluno.idaluno,
          idturma: idturma,
          dtmatricula: new Date()
        }
      });
      if (idresponsaveis && idresponsaveis.length > 0) {
        for (const idresp of idresponsaveis) {
          await tx.responsavelaluno.create({
            data: {
              idaluno: aluno.idaluno,
              idresponsavel: idresp
            }
          });
        }
      }
      return aluno;
    });
  }

  async updateAluno(idaluno: number, nome: string, matricula: string, idturma: number, idresponsaveis: number[]) {
    return prisma.$transaction(async (tx) => {
      const aluno = await tx.aluno.update({
        where: { idaluno },
        data: { nome, matricula }
      });
      await tx.enturmacao.deleteMany({
        where: { idaluno }
      });
      await tx.enturmacao.create({
        data: {
          idaluno: idaluno,
          idturma: idturma,
          dtmatricula: new Date()
        }
      });
      await tx.responsavelaluno.deleteMany({
        where: { idaluno }
      });
      if (idresponsaveis && idresponsaveis.length > 0) {
        for (const idresp of idresponsaveis) {
          await tx.responsavelaluno.create({
            data: { idaluno, idresponsavel: idresp }
          });
        }
      }
      return aluno;
    });
  }

  async deleteAluno(idaluno: number) {
    return prisma.$transaction(async (tx) => {
      // Deletar relações dependentes primeiro
      await tx.responsavelaluno.deleteMany({ where: { idaluno } });
      await tx.enturmacao.deleteMany({ where: { idaluno } });
      await tx.entradasaida.deleteMany({ where: { idaluno } });
      await tx.medicacao.deleteMany({ where: { idaluno } });
      await tx.rotinachecklist.deleteMany({ where: { idaluno } });
      await tx.autorizadobusca.deleteMany({ where: { idaluno } });
      
      // Finalmente deletar o aluno
      return tx.aluno.delete({
        where: { idaluno }
      });
    });
  }

  async getFamilias() {
    return prisma.responsavel.findMany({
      select: {
        idresponsavel: true,
        nome: true,
        cpf: true,
        email: true,
        celular: true,
        ativo: true,
        responsavelaluno: {
          include: {
            aluno: {
              select: { nome: true }
            }
          }
        }
      }
    });
  }

  
  async createFamilia(nome: string, cpf: string, celular: string) {
    const hashedSenha = await bcrypt.hash(cpf.replace(/\D/g, ''), 10);
    return prisma.responsavel.create({
      data: {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        celular: celular.replace(/\D/g, ''),
        senha: hashedSenha,
        ativo: true,
        datacadastro: new Date()
      },
      select: { idresponsavel: true, nome: true, cpf: true, celular: true, ativo: true }
    });
  }

  async updateFamilia(idresponsavel: number, nome: string, cpf: string, celular: string) {
    return prisma.responsavel.update({
      where: { idresponsavel },
      data: {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        celular: celular.replace(/\D/g, '')
      },
      select: { idresponsavel: true, nome: true, cpf: true, celular: true, ativo: true }
    });
  }

  async deleteFamilia(idresponsavel: number) {
    return prisma.responsavel.update({
      where: { idresponsavel },
      data: { ativo: false },
      select: { idresponsavel: true }
    });
  }

  async getTurmas() {
    return prisma.turma.findMany({
      select: {
        idturma: true,
        codigoturma: true,
        capacidademaxima: true,
        idfuncionario: true,
        funcionario: {
          select: { nome: true }
        }
      }
    });
  }

  async createRotinasBulk(idchecklist: number, idfuncionario: number, rotinas: { idaluno: number, rotinafeita: boolean, obsden_o?: string }[]) {
    return prisma.$transaction(async (tx) => {
      const results = [];
      const datahora = new Date();
      for (const r of rotinas) {
        const res = await tx.rotinachecklist.create({
          data: {
            idaluno: r.idaluno,
            idchecklist,
            rotinafeita: r.rotinafeita,
            obsden_o: r.obsden_o || null,
            idfuncionario,
            datahorasys: datahora
          }
        });
        results.push(res);
      }
      return results;
    });
  }

  async createTurma(codigoturma: string, capacidademaxima: number, idfuncionario?: number) {
    return prisma.turma.create({
      data: { 
        codigoturma, 
        capacidademaxima,
        idfuncionario: idfuncionario || null
      }
    });
  }

  async updateTurma(idturma: number, codigoturma: string, capacidademaxima: number, idfuncionario?: number) {
    return prisma.turma.update({
      where: { idturma },
      data: { 
        codigoturma, 
        capacidademaxima,
        idfuncionario: idfuncionario || null
      }
    });
  }

  async deleteTurma(idturma: number) {
    return prisma.$transaction(async (tx) => {
      // Remover relacionamentos ou avisar.
      // O Prisma vai dar erro se tiver alunos vinculados (enturmacao).
      // Então exclui enturmacao.
      await tx.enturmacao.deleteMany({ where: { idturma } });
      return tx.turma.delete({ where: { idturma } });
    });
  }

  async getRotinas() {
    return prisma.rotinachecklist.findMany({
      select: {
        idrotinachecklist: true,
        datahorasys: true,
        rotinafeita: true,
        obsden_o: true,
        aluno: true,
        checklist: true,
        funcionario: true
      },
      orderBy: { datahorasys: 'desc' },
      take: 50
    });
  }

  async createRotina(idaluno: number, idchecklist: number, rotinafeita: boolean, obsden_o: string, idfuncionario: number) {
    return prisma.rotinachecklist.create({
      data: {
        idaluno,
        idchecklist,
        rotinafeita,
        obsden_o,
        idfuncionario,
        datahorasys: new Date()
      }
    });
  }

  async getChecklists() {
    return prisma.checklist.findMany({
      where: { ativo: true },
      orderBy: { descricao: 'asc' }
    });
  }



  async getResponsaveisByAluno(idaluno: number) {
    return prisma.alunoresponsavel.findMany({
      where: { idaluno },
      select: { idresponsavel: true }
    });
  }

  async getAvisos() {
    return prisma.aviso.findMany({
      orderBy: { datacadastro: 'desc' },
      take: 50
    });
  }

  async createAviso(titulo: string, descricao: string, idturma?: number, idresponsavel?: number) {
    return prisma.aviso.create({
      data: {
        titulo,
        descricao,
        idturma: idturma || null,
        idresponsavel: idresponsavel || null,
        datacadastro: new Date(),
        dataentrada: new Date(),
      }
    });
  }
}

export default new AdminService()
