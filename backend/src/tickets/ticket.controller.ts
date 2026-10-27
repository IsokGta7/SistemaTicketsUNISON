import type { Request, Response } from "express"
import { ticketService } from "./ticket.service"
import { canAccessOwned, isStaff } from "../auth/roles"
import {
  createTicketDtoSchema,
  updateTicketDtoSchema,
  createCommentDtoSchema,
  ticketFiltersSchema,
  type TicketFilters,
} from "./ticket.dto"

type TicketWhere = TicketFilters & { creatorId?: string }

export class TicketController {
  async getAllTickets(req: Request, res: Response) {
    try {
      const user = req.user
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const parsed = ticketFiltersSchema.safeParse({
        status: req.query.status || undefined,
        priority: req.query.priority || undefined,
        category: req.query.category || undefined,
      })
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid filters", errors: parsed.error.errors })
      }

      const filters: TicketWhere = { ...parsed.data }
      // Students and professors only ever see the tickets they created.
      if (!isStaff(user.role)) filters.creatorId = user.id

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
      const user = req.user
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { id } = req.params
      const ticket = await ticketService.getTicketById(id)

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" })
      }

      if (!canAccessOwned(user, ticket.creator?.id)) {
        return res.status(403).json({ message: "Forbidden" })
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
      const denied = await this.denyUnlessOwnerOrStaff(req, res, id)
      if (denied) return denied

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
      const denied = await this.denyUnlessOwnerOrStaff(req, res, id)
      if (denied) return denied

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

  // Sends 404 or 403 and returns the response when the caller may not touch
  // this ticket; returns undefined when they may.
  private async denyUnlessOwnerOrStaff(req: Request, res: Response, ticketId: string) {
    const creatorId = await ticketService.getTicketCreatorId(ticketId)
    if (!creatorId) {
      return res.status(404).json({ message: "Ticket not found" })
    }
    if (!req.user || !canAccessOwned(req.user, creatorId)) {
      return res.status(403).json({ message: "Forbidden" })
    }
    return undefined
  }
}

export const ticketController = new TicketController()
