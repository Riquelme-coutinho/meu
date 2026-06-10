const AdminService = require('./src/services/AdminService').default;
const prisma = require('./src/config/prisma').default;

async function testAll() {
  try {
    console.log('Testing getDashboard...');
    await AdminService.getDashboard();
    
    console.log('Testing getFuncoes...');
    await AdminService.getFuncoes();
    
    console.log('Testing getStaff...');
    await AdminService.getStaff();
    
    console.log('Testing getAlunos...');
    await AdminService.getAlunos();
    
    console.log('Testing getFamilias...');
    await AdminService.getFamilias();
    
    console.log('Testing getTurmas...');
    await AdminService.getTurmas();
    
    console.log('Testing getRotinas...');
    await AdminService.getRotinas();
    
    console.log('Testing getMedicacoes...');
    await AdminService.getMedicacoes();
    
    console.log('Testing getAvisos...');
    await AdminService.getAvisos();
    
    console.log('Testing getRecentAttendance...');
    await AdminService.getRecentAttendance();

    console.log('ALL GET ROUTES SUCCEEDED!');
  } catch (err) {
    console.error('ERROR ENCOUNTERED:', err);
  } finally {
    process.exit();
  }
}

testAll();
