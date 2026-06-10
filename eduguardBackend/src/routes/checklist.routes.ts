import { Router } from "express"

import ChecklistController from "../controllers/ChecklistController"

import { authMiddleware }
from "../middlewares/authMiddleware"

const router = Router()

router.get(
  "/",
  authMiddleware,
  ChecklistController.listar
)

export default router