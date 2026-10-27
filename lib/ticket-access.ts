// Who may see or change a ticket. Staff see every ticket; everyone else only
// the tickets they created.
export const STAFF_ROLES = ["admin", "tecnico"] as const

export const MAX_TICKETS_PAGE_SIZE = 100
const DEFAULT_TICKETS_PAGE_SIZE = 10

export function isStaff(role: string | null | undefined): boolean {
  return typeof role === "string" && (STAFF_ROLES as readonly string[]).includes(role)
}

export function canAccessTicket(
  user: { id?: string | null; role?: string | null },
  ticket: { creatorId: string | null | undefined },
): boolean {
  if (isStaff(user.role)) return true
  return Boolean(user.id) && ticket.creatorId === user.id
}

function positiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback
}

// Page and limit come straight from the query string, so clamp them: a
// missing or malformed value falls back to the default and limit never
// exceeds MAX_TICKETS_PAGE_SIZE.
export function parsePagination(pageParam: string | null, limitParam: string | null) {
  const page = positiveInt(pageParam, 1)
  const limit = Math.min(positiveInt(limitParam, DEFAULT_TICKETS_PAGE_SIZE), MAX_TICKETS_PAGE_SIZE)
  return { page, limit, offset: (page - 1) * limit }
}
