import { Router } from "express"
import { ticketController } from "./ticket.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = Router()

// Protected routes
router.get("/", authenticate, ticketController.getAllTickets.bind(ticketController))
router.get("/my", authenticate, ticketController.getMyTickets.bind(ticketController))
router.get("/:id", authenticate, ticketController.getTicketById.bind(ticketController))
router.post("/", authenticate, ticketController.createTicket.bind(ticketController))
router.patch("/:id", authenticate, ticketController.updateTicket.bind(ticketController))
router.post("/:id/comments", authenticate, ticketController.addComment.bind(ticketController))

export default router
