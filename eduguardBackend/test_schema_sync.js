const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAllModels() {
  const models = [
    'aluno', 'aviso', 'avisodestinatario', 'avisoresposta', 'cardapio', 
    'cardapioitem', 'catraca', 'checklisterros', 'checklisthistorico', 
    'diario', 'entradasaida', 'enturmacao', 'escola', 'funcionario', 
    'funcao', 'medicacao', 'menu', 'notificacao', 'responsavel', 
    'responsavelaluno', 'rotinachecklist', 'rotinadiaria', 'sessao', 
    'turma', 'turmafuncionario'
  ];

  let errors = [];

  for (const model of models) {
    try {
      if (prisma[model]) {
        await prisma[model].findFirst();
        console.log("OK: " + model);
      }
    } catch (e) {
      if (e.code === 'P2022') {
        console.log("ERROR MISSING COLUMN in " + model + ": " + (e.meta ? e.meta.column : 'unknown'));
        errors.push({ model: model, column: e.meta ? e.meta.column : 'unknown' });
      } else {
        console.log("OTHER ERROR in " + model + ": " + e.message.substring(0, 50));
      }
    }
  }

  if (errors.length > 0) {
    console.log("SUMMARY OF MISSING COLUMNS:");
    console.log(errors);
  } else {
    console.log("ALL MODELS SYNCED WITH DATABASE!");
  }
}

testAllModels()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
