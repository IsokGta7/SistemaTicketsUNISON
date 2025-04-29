import { Suspense } from "react"
import TicketList from "@/components/ticket-list"
import TicketFilters from "@/components/ticket-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-unison-blue">Mis Tickets</h2>
        <p className="text-muted-foreground">Visualiza y gestiona tus solicitudes de soporte técnico</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Busca y filtra tus tickets de soporte</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketFilters />

          <Suspense fallback={<TicketListSkeleton />}>
            <TicketList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function TicketListSkeleton() {
  return (
    <div className="space-y-4 mt-6">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
