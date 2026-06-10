import bcrypt from "bcrypt"

import ResponsavelRepository from "../repositories/ResponsavelRepository"

import { generateToken } from "../utils/jwt"

import { validarCampoObrigatorio, validarCpf } from "../utils/validations"

class AuthService {
  static recoveryCodes = new Map<string, { codigo: string, expiracao: Date }>();

  async login(cpf: string, senha: string) {
    validarCampoObrigatorio(cpf, "cpf")
    validarCampoObrigatorio(senha, "senha")

    const cpfLimpo = validarCpf(cpf)

    let usuario: any = await ResponsavelRepository.findByCpf(cpfLimpo)
    let tipo_usuario = "responsavel"
    let cargo = ""

    if (!usuario) {
      const FuncionarioRepository = (await import("../repositories/FuncionarioRepository")).default
      usuario = await FuncionarioRepository.findByCpf(cpfLimpo)
      tipo_usuario = "diretor"

      if (usuario?.idfuncao) {
        const funcao = await (await import("../config/prisma")).default.funcaofuncionario.findUnique({
          where: { idfuncao: usuario.idfuncao }
        })
        cargo = funcao?.descricaofuncao || ""
      }
    }

    if (!usuario) {
      throw new Error("CPF ou senha inválidos")
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha as string)

    if (!senhaCorreta) {
      throw new Error("CPF ou senha inválidos")
    }

    const id = tipo_usuario === "responsavel" ? usuario.idresponsavel : usuario.idfuncionario

    const token = generateToken({
      id,
      tipo_usuario,
      cargo
    })

    const { senha: _, ...usuarioSemSenha } = usuario

    return {
      token,
      usuario: {
        ...usuarioSemSenha,
        tipo_usuario,
        cargo
      }
    }
  }

  async esqueciSenha(cpf: string) {
    validarCampoObrigatorio(cpf, "cpf")
    const cpfLimpo = validarCpf(cpf)
    
    let isFuncionario = false;
    let usuario: any = await ResponsavelRepository.findByCpf(cpfLimpo)
    
    if (!usuario) {
      const FuncionarioRepository = (await import("../repositories/FuncionarioRepository")).default
      usuario = await FuncionarioRepository.findByCpf(cpfLimpo)
      if (usuario) {
        isFuncionario = true;
      }
    }

    if (!usuario) {
      throw new Error("CPF não encontrado")
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    const expiracao = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    if (!isFuncionario) {
      await ResponsavelRepository.saveRecoveryCode(usuario.idresponsavel, codigo, expiracao)
    } else {
      AuthService.recoveryCodes.set(cpfLimpo, { codigo, expiracao });
    }

    console.log(`\n======================================================`)
    console.log(`🔐 CÓDIGO DE RECUPERAÇÃO DE SENHA GERADO: ${codigo} (Para: ${cpfLimpo})`)
    console.log(`======================================================\n`)

    return { message: "Código de recuperação gerado." }
  }

  async resetarSenha(cpf: string, codigo: string, novaSenha: string) {
    validarCampoObrigatorio(cpf, "cpf")
    validarCampoObrigatorio(codigo, "codigo")
    validarCampoObrigatorio(novaSenha, "novaSenha")
    
    const cpfLimpo = validarCpf(cpf)
    let isFuncionario = false;
    let usuario: any = await ResponsavelRepository.findByCpf(cpfLimpo)
    
    if (!usuario) {
      const FuncionarioRepository = (await import("../repositories/FuncionarioRepository")).default
      usuario = await FuncionarioRepository.findByCpf(cpfLimpo)
      if (usuario) {
        isFuncionario = true;
      }
    }
    
    if (!usuario) {
      throw new Error("CPF não encontrado")
    }

    if (!isFuncionario) {
      if (usuario.codigo_recuperacao !== codigo) {
        throw new Error("Código de recuperação inválido")
      }
      if (!usuario.expiracao_codigo || new Date() > usuario.expiracao_codigo) {
        throw new Error("Código de recuperação expirado")
      }
    } else {
      const savedCode = AuthService.recoveryCodes.get(cpfLimpo);
      if (!savedCode || savedCode.codigo !== codigo) {
        throw new Error("Código de recuperação inválido");
      }
      if (new Date() > savedCode.expiracao) {
        throw new Error("Código de recuperação expirado");
      }
    }

    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(novaSenha, salt)

    if (!isFuncionario) {
      await ResponsavelRepository.resetSenha(usuario.idresponsavel, senhaHash)
    } else {
      const FuncionarioRepository = (await import("../repositories/FuncionarioRepository")).default
      await FuncionarioRepository.updatePassword(usuario.idfuncionario, senhaHash)
      AuthService.recoveryCodes.delete(cpfLimpo);
    }

    return { message: "Senha atualizada com sucesso." }
  }
}

export default new AuthService()