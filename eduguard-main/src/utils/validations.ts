export function validarCampoObrigatorio(
  valor: unknown,
  nomeCampo: string
) {
  if (!valor) {
    throw new Error(`O campo ${nomeCampo} é obrigatório`)
  }
}

export function limparCpf(cpf: string) {
  return cpf.replace(/\D/g, "")
}

export function validarCpf(cpf: string) {
  const cpfLimpo = limparCpf(cpf)

  if (cpfLimpo.length !== 11) {
    throw new Error("CPF inválido")
  }

  return cpfLimpo
}

export function validarEmail(email: string) {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (!emailValido) {
    throw new Error("Email inválido")
  }
}

export function validarSenha(senha: string) {
  if (senha.length < 6) {
    throw new Error("A senha deve ter no mínimo 6 caracteres")
  }
}