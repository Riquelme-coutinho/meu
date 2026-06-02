import { Router } from "express"

import AuthController from "../controllers/AuthController"

const router = Router()
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do responsável
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post("/login", AuthController.login)

export default router