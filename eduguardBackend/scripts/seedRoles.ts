import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  try {
    const roles = ['Diretor', 'Porteiro', 'Coordenador', 'Secretario', 'Professor'];
    const funcoesMap: Record<string, number> = {};

    // 1. Inserir ou atualizar funções
    for (const role of roles) {
      let funcao = await prisma.funcaofuncionario.findFirst({
        where: { descricaofuncao: role }
      });
      if (!funcao) {
        funcao = await prisma.funcaofuncionario.create({
          data: { descricaofuncao: role }
        });
        console.log(`Função criada: ${role} (ID: ${funcao.idfuncao})`);
      }
      funcoesMap[role] = funcao.idfuncao;
    }

    // 2. Atualizar Riquelme como Diretor
    const riquelme = await prisma.funcionario.findFirst({
      where: { nome: { contains: 'Riquelme' } }
    });

    if (riquelme) {
      await prisma.funcionario.update({
        where: { idfuncionario: riquelme.idfuncionario },
        data: { idfuncao: funcoesMap['Diretor'] }
      });
      console.log(`Riquelme agora é Diretor (CPF: ${riquelme.cpf})`);
    }

    // 3. Criar João Porteiro
    const senhaHash = await bcrypt.hash('123456', 10);
    let joao = await prisma.funcionario.findFirst({
      where: { cpf: '11111111111' }
    });

    if (!joao) {
      joao = await prisma.funcionario.create({
        data: {
          nome: 'João Porteiro',
          cpf: '11111111111',
          senha: senhaHash,
          ativo: true,
          idfuncao: funcoesMap['Porteiro']
        }
      });
      console.log(`Usuário criado: João Porteiro (CPF: 11111111111)`);
    } else {
      await prisma.funcionario.update({
        where: { idfuncionario: joao.idfuncionario },
        data: { idfuncao: funcoesMap['Porteiro'], senha: senhaHash, ativo: true }
      });
      console.log(`Usuário atualizado: João Porteiro (CPF: 11111111111)`);
    }

    console.log("-----------------------------------------");
    console.log("SUCESSO: Roles aplicados!");
    console.log(`Riquelme -> Diretor | CPF: 00000000000`);
    console.log(`João -> Porteiro | CPF: 11111111111`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
