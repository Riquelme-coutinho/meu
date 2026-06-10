import { Router } from "express"
import AlunoController from "../controllers/AlunoController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.get("/meus", authMiddleware, AlunoController.getMeusAlunos)

export default router
