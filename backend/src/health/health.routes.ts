import { Router } from "express"
import { healthController } from "./health.controller"

const router = Router()

router.get("/", healthController.check.bind(healthController))

export default router
