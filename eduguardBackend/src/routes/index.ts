import { Router } from "express"

import responsavelRoutes from "./responsavel.routes"
import authRoutes from "./auth.routes"
import avisoRoutes from "./aviso.routes"
import entradaSaidaRoutes from "./entradaSaida.routes"
import checklistRoutes from "./checklist.routes"
import notificacaoRoutes from "./notificacao.routes"
import alunoRoutes from "./aluno.routes"
import medicacaoRoutes from "./medicacao.routes"

import autorizadosRoutes from "./autorizados.routes"
import adminRoutes from "./admin.routes"

const router = Router()

router.use("/responsaveis", responsavelRoutes)

router.use("/auth", authRoutes)

router.use("/avisos", avisoRoutes)

router.use("/entrada-saida", entradaSaidaRoutes)

router.use("/checklists", checklistRoutes)

router.use("/notificacoes", notificacaoRoutes)

router.use("/alunos", alunoRoutes)

router.use("/medicacoes", medicacaoRoutes)

router.use("/autorizados", autorizadosRoutes)
router.use("/admin", adminRoutes)

router.get("/", (req, res) => {return res.json({
    message: "API EduGuard online"})
})

export default router