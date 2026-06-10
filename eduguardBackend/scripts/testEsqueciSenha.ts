async function test() {
  try {
    const res = await fetch('http://localhost:3000/auth/esqueci-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: '00000000000' })
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("ERRO 400:", data);
    } else {
        console.log("SUCESSO:", data);
    }
  } catch (error: any) {
    console.error("ERRO FETCH:", error);
  }
}

test();
