import { Router } from "express"

import AvisoController from "../controllers/AvisoController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.get("/", authMiddleware, AvisoController.listar)

export default router