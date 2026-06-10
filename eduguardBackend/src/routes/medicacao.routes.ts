import { Router } from "express"
import MedicacaoController from "../controllers/MedicacaoController"
import { authMiddleware } from "../middlewares/authMiddleware"

import { upload } from "../middlewares/uploadMiddleware"

const router = Router()

router.get("/meus", authMiddleware, MedicacaoController.getMinhasMedicacoes)
router.post("/", authMiddleware, upload.single('receita'), MedicacaoController.adicionarMedicacao)
router.delete("/:id", authMiddleware, MedicacaoController.removerMedicacao)

export default router
