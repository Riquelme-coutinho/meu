
import ResponsavelService from "../services/ResponsavelService"

import { Request, Response, NextFunction } from "express"

class ResponsavelController {
  async listar(req: Request, res: Response) {
    const responsaveis =
      await ResponsavelService.listarResponsaveis()

    return res.json(responsaveis)
  }

  async criar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      nome,
      cpf,
      celular,
      email,
      senha,
      master
    } = req.body

    const responsavel =
      await ResponsavelService.criar({
        nome,
        cpf,
        celular,
        email,
        senha,
        master
      })

    const { senha: _, ...responsavelSemSenha } =
      responsavel

    return res.status(201).json(responsavelSemSenha)
  } catch (error) {
    next(error)
  }
}
  async perfil(req: Request, res: Response) {
  const responsavel =
    await ResponsavelService.buscarPerfil(
      req.idResponsavel!
    )

  return res.json(responsavel)
}

async listarMeusAlunos(req: Request, res: Response) {
  const alunos =
    await ResponsavelService.listarAlunosDoResponsavel(
      req.idResponsavel!
    )

  return res.json(alunos)
}

async listarAlunosComTurma(
  req: Request,
  res: Response
) {

  const alunos =
    await ResponsavelService.listarAlunosComTurma(
      req.idResponsavel!
    )

  return res.json(alunos)
}
//edição de perfil
async atualizarPerfil(
  req: Request,
  res: Response
) {

  const { nome, celular, email } =
    req.body

  const responsavel =
    await ResponsavelService.atualizarPerfil(
      req.idResponsavel!,
      {
        nome,
        celular,
        email
      }
    )

  return res.json(responsavel)
}


//responsavel secundário

async criarSecundario(
  req: Request,
  res: Response
) {

  const {
    nome,
    cpf,
    celular,
    email,
    senha
  } = req.body

  const responsavel =
    await ResponsavelService.criarResponsavelSecundario(
      req.idResponsavel!,
      {
        nome,
        cpf,
        celular,
        email,
        senha
      }
    )

  return res.status(201).json(
    responsavel
  )
}


//up de foto

async atualizarFoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw new Error("Foto não enviada")
    }

    const resultado =
      await ResponsavelService.atualizarFoto(
        req.idResponsavel!,
        req.file.buffer
      )

    return res.json(resultado)
  } catch (error) {
    next(error)
  }
}

}

  export default new ResponsavelController()