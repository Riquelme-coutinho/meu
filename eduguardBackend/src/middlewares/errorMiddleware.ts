import { Request, Response, NextFunction }
from "express"

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  console.log(error)

  return res.status(400).json({
    message: error.message
  })
}