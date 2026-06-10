import { Router } from "express"
import AdminController from "../controllers/AdminController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

// Simple middleware to enforce director access
const directorMiddleware = (req: any, res: any, next: any) => {
  if (req.tipoUsuario !== 'diretor') {
    return res.status(403).json({ message: 'Acesso negado. Apenas para diretores.' });
  }
  next();
};

// Route accessible to Porteiro as well
router.post("/attendance", authMiddleware, async (req: any, res: any, next: any) => {
  if (req.tipoUsuario !== 'diretor') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }
  // If 'diretor' literal is being used globally for staff, we allow.
  // We can further restrict by req.cargo if needed.
  if (req.cargo) {
    const allowed = ['diretor', 'porteiro'];
    if (!allowed.includes(req.cargo.toLowerCase())) {
      return res.status(403).json({ message: 'Cargo sem permissão.' });
    }
  }
  return AdminController.attendance(req, res);
});

router.get("/attendance/recent", authMiddleware, async (req: any, res: any, next: any) => {
  if (req.tipoUsuario !== 'diretor') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }
  if (req.cargo) {
    const allowed = ['diretor', 'porteiro'];
    if (!allowed.includes(req.cargo.toLowerCase())) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
  }
  return AdminController.getRecentAttendance(req, res);
});

// Protect below routes for Director specifically, though the current broad 'diretor' type applies
router.use(authMiddleware, directorMiddleware);

router.get("/dashboard", AdminController.dashboard)
router.get("/funcoes", AdminController.funcoes)
router.get("/staff", AdminController.staff)
router.post("/staff", AdminController.createStaff)
router.put("/staff/:id", AdminController.updateStaff)
router.delete("/staff/:id", AdminController.deleteStaff)
router.get("/logs", AdminController.logs)
router.get("/alunos", AdminController.getAlunos)
router.post("/alunos", AdminController.createAluno)
router.put("/alunos/:id", AdminController.updateAluno)
router.delete("/alunos/:id", AdminController.deleteAluno)
router.get("/familias", AdminController.getFamilias)
router.post("/familias", AdminController.createFamilia)
router.put("/familias/:id", AdminController.updateFamilia)
router.delete("/familias/:id", AdminController.deleteFamilia)
router.get("/turmas", AdminController.getTurmas)
router.post("/turmas", AdminController.createTurma)
router.put("/turmas/:id", AdminController.updateTurma)
router.delete("/turmas/:id", AdminController.deleteTurma)
router.get("/rotinas", AdminController.getRotinas)
router.post("/rotinas", AdminController.createRotina)
router.post("/rotinas/bulk", AdminController.createRotinasBulk)
router.get("/checklists", AdminController.getChecklists)

router.get("/avisos", AdminController.getAvisos)
router.post("/avisos", AdminController.createAviso)

export default router
