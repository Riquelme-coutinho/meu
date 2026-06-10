async function test() {
  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '00000000000',
        senha: '123456'
      })
    });
    const data = await res.json();
    const token = data.token;
    console.log("Got token.");

    const endpoints = [
      '/admin/dashboard',
      '/admin/staff',
      '/admin/logs',
      '/avisos'
    ];

    for (const ep of endpoints) {
      console.log(`Fetching ${ep}...`);
      const epRes = await fetch(`http://localhost:3000${ep}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`${ep}: ${epRes.status}`);
      if (epRes.status === 500) {
        const errorData = await epRes.json();
        console.log("Error details:", errorData);
      }
    }

  } catch(e) {
    console.log("Script error:", e);
  }
}

test();
