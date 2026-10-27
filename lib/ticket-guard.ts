import { query } from "@/lib/db"
import { canAccessTicket } from "@/lib/ticket-access"

export type TicketAccess = "ok" | "not_found" | "forbidden"

// Looks up the ticket's creator and applies the owner-or-staff rule.
export async function checkTicketAccess(
  ticketId: string,
  user: { id?: string | null; role?: string | null },
): Promise<TicketAccess> {
  const result = await query(`SELECT "creatorId" FROM "Ticket" WHERE id = $1`, [ticketId])
  const ticket = result.rows[0]
  if (!ticket) return "not_found"
  return canAccessTicket(user, ticket) ? "ok" : "forbidden"
}
