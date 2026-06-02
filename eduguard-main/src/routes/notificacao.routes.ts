import { Router } from "express"

import { authMiddleware }
from "../middlewares/authMiddleware"

import NotificacaoController
from "../controllers/NotificacaoController"

const router = Router()

router.get("/", authMiddleware, NotificacaoController.listar)


router.get("/nao-lidas/contador", authMiddleware, NotificacaoController.contarNaoLidas)

router.patch("/:id/visualizar", authMiddleware, NotificacaoController.visualizar)
export default router