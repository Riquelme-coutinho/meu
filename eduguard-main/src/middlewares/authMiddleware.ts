import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface TokenPayload {
  id: number
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

    req.idResponsavel = decoded.id

    return next()

  } catch (error) {

    console.log(error)

    return res.status(401).json({
      message: "Token inválido"
    })
  }
}