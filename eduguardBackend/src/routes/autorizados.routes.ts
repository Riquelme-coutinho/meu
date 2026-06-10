import { Router } from "express"
import AutorizadosController from "../controllers/AutorizadosController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.use(authMiddleware)

router.get("/", AutorizadosController.listar)
router.post("/", AutorizadosController.adicionar)
router.delete("/:id", AutorizadosController.remover)

export default router
