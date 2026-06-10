const AdminService = require('./src/services/AdminService').default;

async function main() {
  try {
    const res = await AdminService.getMedicacoes(1, 'diretor');
    console.log("Success", res);
  } catch(e) {
    console.error("Error:", e);
  }
}
main();
