import jwt from "jsonwebtoken"

interface Payload {
  id: number
}

export function generateToken(payload: Payload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  })
}