const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function test() {
  try {
    const hashedSenha = await bcrypt.hash('123456', 10);
    const result = await prisma.funcionario.create({
      data: {
        nome: 'Teste Funcionario',
        cpf: '12345678901',
        email: 'teste@escola.com',
        senha: hashedSenha,
        idfuncao: 2,
        dataadmissao: new Date(),
        ativo: true
      }
    });
    console.log('Success:', result);
  } catch (err) {
    console.error('Error during create:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
