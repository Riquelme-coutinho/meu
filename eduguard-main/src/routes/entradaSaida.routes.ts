import { Router } from "express"

import { authMiddleware } from "../middlewares/authMiddleware"

import EntradaSaidaController
from "../controllers/EntradaSaidaController"

const router = Router()

router.get(
  "/",
  authMiddleware,
  EntradaSaidaController.listar
)

export default router