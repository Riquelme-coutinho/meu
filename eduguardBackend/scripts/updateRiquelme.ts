import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  try {
    // Aumentar o tamanho do campo senha para suportar bcrypt
    await prisma.$executeRawUnsafe(`
      ALTER TABLE funcionario
      ALTER COLUMN senha TYPE VARCHAR(255);
    `);
    console.log("Database altered: 'senha' in 'funcionario' is now VARCHAR(255).");
  } catch (error: any) {
    console.log("Could not alter table, might be MySQL syntax or already altered:", error.message);
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE funcionario
        MODIFY senha VARCHAR(255);
      `);
      console.log("Database altered using MySQL syntax.");
    } catch (e: any) {
      console.log("Fallback alter failed:", e.message);
    }
  }

  // Buscar Riquelme
  let riquelme = await prisma.funcionario.findFirst({
    where: {
      nome: {
        contains: 'Riquelme'
      }
    }
  });

  if (!riquelme) {
    console.log("Riquelme não encontrado. Criando novo registro...");
    // Se não existir, criar um para não quebrar a demo
    riquelme = await prisma.funcionario.create({
      data: {
        nome: 'Riquelme',
        cpf: '00000000000',
        ativo: true
      }
    });
  }

  console.log(`Encontrado: ${riquelme.nome} (CPF: ${riquelme.cpf})`);

  // Atualizar senha e ativo
  const senhaHash = await bcrypt.hash('123456', 10);
  
  // Como 'cargo' ou 'role' não existe nativamente como string, o dual-check já trata como 'diretor'
  // Mas vamos garantir que idfuncao seja algo não-nulo para consistência se necessário.
  
  await prisma.funcionario.update({
    where: { idfuncionario: riquelme.idfuncionario },
    data: {
      senha: senhaHash,
      ativo: true,
      email: 'riquelme@eduguard.com.br' // atualizando email para visualização na tela de equipe
    }
  });

  console.log("-----------------------------------------");
  console.log("SUCESSO: 1 row successfully updated!");
  console.log(`NOME: ${riquelme.nome}`);
  console.log(`CPF PARA LOGIN: ${riquelme.cpf}`);
  console.log(`SENHA PARA LOGIN: 123456`);
  console.log("-----------------------------------------");
}

run()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
