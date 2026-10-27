// Staff can see and act on every ticket and report; everyone else only on
// the ones they own.
export const STAFF_ROLES = ["admin", "tecnico"] as const

export function isStaff(role: string | null | undefined): boolean {
  return typeof role === "string" && (STAFF_ROLES as readonly string[]).includes(role)
}

export function canAccessOwned(
  user: { id?: string | null; role?: string | null },
  ownerId: string | null | undefined,
): boolean {
  if (isStaff(user.role)) return true
  return Boolean(user.id) && ownerId === user.id
}
