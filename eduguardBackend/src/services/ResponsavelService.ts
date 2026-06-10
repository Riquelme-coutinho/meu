import bcrypt from "bcrypt"

import ResponsavelRepository from "../repositories/ResponsavelRepository"

import { validarCampoObrigatorio, validarCpf, validarEmail, validarSenha } from "../utils/validations"

interface CreateResponsavelDTO {
  nome: string
  cpf: string
  celular: string
  email: string
  senha: string
  master?: boolean
}

class ResponsavelService {
  async listarResponsaveis() {
    return ResponsavelRepository.findAll()
  }

  async criar(data: CreateResponsavelDTO) {

validarCampoObrigatorio(data.nome, "nome")
validarCampoObrigatorio(data.cpf, "cpf")
validarCampoObrigatorio(data.celular, "celular")
validarCampoObrigatorio(data.email, "email")
validarCampoObrigatorio(data.senha, "senha")

const cpfLimpo = validarCpf(data.cpf)

validarEmail(data.email)
validarSenha(data.senha)

    const responsavelExiste =
      await ResponsavelRepository.findByCpf(cpfLimpo)

    if (responsavelExiste) {
      throw new Error("Responsável já cadastrado")
    }

    const senhaHash = await bcrypt.hash(data.senha, 10)

    return ResponsavelRepository.create({
      ...data,
      cpf: cpfLimpo,
      senha: senhaHash
    })
  }

  async buscarPerfil(id: number) {
  const responsavel =
    await ResponsavelRepository.findById(id)

  if (!responsavel) {
    throw new Error("Responsável não encontrado")
  }

  const { senha, ...responsavelSemSenha } =
    responsavel

  return responsavelSemSenha
}

async listarAlunosDoResponsavel(idResponsavel: number) {
  const vinculos =
    await ResponsavelRepository.findAlunosByResponsavelId(idResponsavel)

  return vinculos.map((vinculo) => vinculo.aluno)
}

async listarAlunosComTurma(idResponsavel: number) {

  const vinculos =
    await ResponsavelRepository.findAlunosComTurma(
      idResponsavel
    )

  return vinculos.map((vinculo) => {

    const aluno = vinculo.aluno

    const turma =
      aluno.enturmacao[0]?.turma || null

    return {
      ...aluno,
      turma
    }
  })
}
//edição de perfil
async atualizarPerfil(
  id: number,
  data: {
    nome?: string
    celular?: string
    email?: string
  }
) {

  const responsavel =
    await ResponsavelRepository.update(
      id,
      data
    )

  const { senha, ...responsavelSemSenha } =
    responsavel

  return responsavelSemSenha
}


//responsavel secundario

async criarResponsavelSecundario(
  idResponsavelMaster: number,
  data: CreateResponsavelDTO
) {

  const responsavelExiste =
    await ResponsavelRepository.findByCpf(
      data.cpf
    )

  if (responsavelExiste) {
    throw new Error("Responsável já cadastrado")
  }

  const senhaHash =
    await bcrypt.hash(data.senha, 10)

  const novoResponsavel =
    await ResponsavelRepository.create({
      ...data,
      senha: senhaHash,
      master: false
    })

  const vinculos =
    await ResponsavelRepository.findAlunosByResponsavelId(
      idResponsavelMaster
    )

  for (const vinculo of vinculos) {

    await ResponsavelRepository.vincularAluno(
      novoResponsavel.idresponsavel,
      vinculo.idaluno
    )
  }

  const { senha, ...responsavelSemSenha } =
    novoResponsavel

  return responsavelSemSenha
}

//upload de foto

async atualizarFoto(id: number, foto: Buffer) {
  const responsavel =
    await ResponsavelRepository.updateFoto(id, foto)

  const { senha, foto: _, ...responsavelSemSenha } = responsavel

  return {
    message: "Foto atualizada com sucesso",
    responsavel: responsavelSemSenha
  }
}

}

export default new ResponsavelService()