import type { Request, Response } from "express"
import { ticketService } from "./ticket.service"
import { createTicketDtoSchema, updateTicketDtoSchema, createCommentDtoSchema } from "./ticket.dto"

export class TicketController {
  async getAllTickets(req: Request, res: Response) {
    try {
      const { status, priority, category } = req.query

      const filters: any = {}
      if (status) filters.status = status
      if (priority) filters.priority = priority
      if (category) filters.category = category

      const tickets = await ticketService.getAllTickets(filters)
      return res.status(200).json(tickets)
    } catch (error) {
      console.error("Error getting tickets:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getMyTickets(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const tickets = await ticketService.getTicketsByUser(userId)
      return res.status(200).json(tickets)
    } catch (error) {
      console.error("Error getting user tickets:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const ticket = await ticketService.getTicketById(id)

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" })
      }

      return res.status(200).json(ticket)
    } catch (error) {
      console.error("Error getting ticket:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async createTicket(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const validatedData = createTicketDtoSchema.parse(req.body)
      const ticket = await ticketService.createTicket(validatedData, userId)

      return res.status(201).json(ticket)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Error creating ticket:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { id } = req.params
      const validatedData = updateTicketDtoSchema.parse(req.body)

      const ticket = await ticketService.updateTicket(id, validatedData, userId)
      return res.status(200).json(ticket)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Error updating ticket:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { id } = req.params
      const validatedData = createCommentDtoSchema.parse(req.body)

      const comment = await ticketService.addComment(id, validatedData, userId)
      return res.status(201).json(comment)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Error adding comment:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}

export const ticketController = new TicketController()
