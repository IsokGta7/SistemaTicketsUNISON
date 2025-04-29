import prisma from "../db/client"
import type { CreateTicketDto, TicketDto, UpdateTicketDto, CreateCommentDto } from "./ticket.dto"

export class TicketService {
  async getAllTickets(filters: any = {}): Promise<TicketDto[]> {
    const tickets = await prisma.ticket.findMany({
      where: filters,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return tickets.map(this.mapToTicketDto)
  }

  async getTicketsByUser(userId: string): Promise<TicketDto[]> {
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [{ creatorId: userId }, { assigneeId: userId }],
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return tickets.map(this.mapToTicketDto)
  }

  async getTicketById(id: string): Promise<TicketDto | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        history: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!ticket) {
      return null
    }

    return this.mapToTicketDto(ticket)
  }

  async createTicket(data: CreateTicketDto, userId: string): Promise<TicketDto> {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || "medium",
        status: "new",
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Create history entry
    await prisma.ticketHistory.create({
      data: {
        action: "Ticket created",
        ticketId: ticket.id,
        userId,
      },
    })

    return this.mapToTicketDto(ticket)
  }

  async updateTicket(id: string, data: UpdateTicketDto, userId: string): Promise<TicketDto> {
    // Get existing ticket
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!existingTicket) {
      throw new Error("Ticket not found")
    }

    // Update ticket
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.assigneeId && { assigneeId: data.assigneeId }),
        updatedAt: new Date(),
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Record history for changes
    if (data.status && data.status !== existingTicket.status) {
      await prisma.ticketHistory.create({
        data: {
          action: `Status changed to '${data.status}'`,
          ticketId: id,
          userId,
        },
      })
    }

    if (data.priority && data.priority !== existingTicket.priority) {
      await prisma.ticketHistory.create({
        data: {
          action: `Priority changed to '${data.priority}'`,
          ticketId: id,
          userId,
        },
      })
    }

    if (data.assigneeId && data.assigneeId !== existingTicket.assigneeId) {
      await prisma.ticketHistory.create({
        data: {
          action: `Ticket assigned to new technician`,
          ticketId: id,
          userId,
        },
      })

      // Create notification for the assignee
      await prisma.notification.create({
        data: {
          title: `New ticket assigned`,
          description: `You have been assigned to ticket: "${existingTicket.title}"`,
          userId: data.assigneeId,
        },
      })
    }

    return this.mapToTicketDto(ticket)
  }

  async addComment(ticketId: string, data: CreateCommentDto, userId: string): Promise<any> {
    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        ticketId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Record in history
    await prisma.ticketHistory.create({
      data: {
        action: "Comment added",
        ticketId,
        userId,
      },
    })

    // Create notifications
    // For ticket creator (if not the commenter)
    if (ticket.creatorId !== userId) {
      await prisma.notification.create({
        data: {
          title: `New comment on your ticket`,
          description: `A new comment has been added to your ticket: "${ticket.title}"`,
          userId: ticket.creatorId,
        },
      })
    }

    // For ticket assignee (if exists and not the commenter)
    if (ticket.assigneeId && ticket.assigneeId !== userId) {
      await prisma.notification.create({
        data: {
          title: `New comment on assigned ticket`,
          description: `A new comment has been added to ticket: "${ticket.title}"`,
          userId: ticket.assigneeId,
        },
      })
    }

    return comment
  }

  private mapToTicketDto(ticket: any): TicketDto {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      creator: ticket.creator
        ? {
            id: ticket.creator.id,
            firstName: ticket.creator.firstName,
            lastName: ticket.creator.lastName,
            email: ticket.creator.email,
          }
        : undefined,
      assignee: ticket.assignee
        ? {
            id: ticket.assignee.id,
            firstName: ticket.assignee.firstName,
            lastName: ticket.assignee.lastName,
            email: ticket.assignee.email,
          }
        : undefined,
      comments: ticket.comments?.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          email: comment.user.email,
        },
      })),
      history: ticket.history?.map((entry: any) => ({
        id: entry.id,
        action: entry.action,
        createdAt: entry.createdAt,
      })),
    }
  }
}

export const ticketService = new TicketService()
