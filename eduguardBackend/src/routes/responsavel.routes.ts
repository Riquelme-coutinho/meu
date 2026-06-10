import { Router } from "express"

import ResponsavelController from "../controllers/ResponsavelController"
import { authMiddleware } from "../middlewares/authMiddleware"
import { upload } from "../middlewares/uploadMiddleware"

const router = Router()

router.get("/", authMiddleware, ResponsavelController.listar)
router.post("/", ResponsavelController.criar)
router.get("/me", authMiddleware, ResponsavelController.perfil)
router.get("/me/alunos", authMiddleware, ResponsavelController.listarMeusAlunos)
router.get("/me/alunos-com-turma", authMiddleware, ResponsavelController.listarAlunosComTurma)
router.put("/me", authMiddleware, ResponsavelController.atualizarPerfil)
router.post("/secundario", authMiddleware, ResponsavelController.criarSecundario)
router.patch("/me/foto", authMiddleware, upload.single("foto"), ResponsavelController.atualizarFoto)
export default router