const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign(
    { id: 1, cargo: 'Professor', tipo_usuario: 'diretor' },
    'eduguard_super_secret_key_123456',
    { expiresIn: '1h' }
  );

  console.log("Generated token:", token);

  try {
    const response = await fetch('http://localhost:3000/admin/medicacoes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("HTTP Error:", response.status, text);
    } else {
      console.log("Success:", response.status);
    }
  } catch (error) {
    console.error("Network Error:", error.message);
  }
}

test();
