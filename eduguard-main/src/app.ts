import express from "express"
import cors from "cors"

import routes from "./routes"

import { errorMiddleware }
from "./middlewares/errorMiddleware"

import swaggerUi from "swagger-ui-express"

import { swaggerSpec }
from "./docs/swagger"

const app = express()

app.use(cors({ origin: "*"}))

app.use(express.json())

app.use(routes)

app.use( "/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorMiddleware)

export default app