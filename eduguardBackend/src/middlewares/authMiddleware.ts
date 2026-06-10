import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface TokenPayload {
  id: number
  tipo_usuario?: string
  cargo?: string
}

declare global {
  namespace Express {
    interface Request {
      idResponsavel?: number;
      idFuncionario?: number;
      tipoUsuario?: string;
      cargo?: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado"
    })
  }

  const parts = authHeader.split(" ")

  if (parts.length !== 2) {
    return res.status(401).json({
      message: "Token mal formatado"
    })
  }

  const [scheme, token] = parts

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Token mal formatado"
    })
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload

    if (decoded.tipo_usuario === 'diretor') { // Maintain 'diretor' literal for staff until we fully phase it out, or map it.
      req.idFuncionario = decoded.id;
      req.tipoUsuario = 'diretor';
      req.cargo = decoded.cargo;
    } else {
      req.idResponsavel = decoded.id;
      req.tipoUsuario = 'responsavel';
    }

    return next()

  } catch (error) {

    console.log(error)

    return res.status(401).json({
      message: "Token inválido"
    })
  }
}