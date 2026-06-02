import bcrypt from "bcrypt"

import ResponsavelRepository from "../repositories/ResponsavelRepository"

import { generateToken } from "../utils/jwt"

import { validarCampoObrigatorio, validarCpf } from "../utils/validations"

class AuthService {
  async login(cpf: string, senha: string) {

validarCampoObrigatorio(cpf, "cpf")
validarCampoObrigatorio(senha, "senha")

const cpfLimpo = validarCpf(cpf)

    const responsavel =
      await ResponsavelRepository.findByCpf(cpfLimpo)

    if (!responsavel) {
      throw new Error("CPF ou senha inválidos")
    }

    const senhaCorreta =
      await bcrypt.compare(senha, responsavel.senha as string)

    if (!senhaCorreta) {
      throw new Error("CPF ou senha inválidos")
    }

    const token = generateToken({
      id: responsavel.idresponsavel
    })

    const { senha: _, ...responsavelSemSenha } =
      responsavel

    return {
      token,
      responsavel: responsavelSemSenha
    }
  }
}

export default new AuthService()