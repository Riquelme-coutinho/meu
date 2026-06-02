import { Router } from "express"

import responsavelRoutes from "./responsavel.routes"
import authRoutes from "./auth.routes"
import avisoRoutes from "./aviso.routes"
import entradaSaidaRoutes from "./entradaSaida.routes"
import checklistRoutes from "./checklist.routes"
import notificacaoRoutes from "./notificacao.routes"

const router = Router()

router.use("/responsaveis", responsavelRoutes)

router.use("/auth", authRoutes)

router.use("/avisos", avisoRoutes)

router.use("/entrada-saida", entradaSaidaRoutes)

router.use("/checklists", checklistRoutes)

router.use("/notificacoes", notificacaoRoutes)

router.get("/", (req, res) => {return res.json({
    message: "API EduGuard online"})
})

export default router