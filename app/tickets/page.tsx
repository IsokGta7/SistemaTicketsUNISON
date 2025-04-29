"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react"

// Mock data for tickets
const mockTickets = [
  {
    id: "T-1234",
    title: "Cannot access department printer",
    status: "in_progress",
    priority: "medium",
    created: "2023-04-25T10:30:00",
    updated: "2023-04-26T14:20:00",
    category: "Hardware",
  },
  {
    id: "T-1233",
    title: "Email not syncing on mobile device",
    status: "new",
    priority: "high",
    created: "2023-04-25T08:15:00",
    updated: "2023-04-25T08:15:00",
    category: "Email",
  },
  {
    id: "T-1232",
    title: "Request for software installation",
    status: "assigned",
    priority: "low",
    created: "2023-04-24T16:45:00",
    updated: "2023-04-25T09:30:00",
    category: "Software",
  },
  {
    id: "T-1231",
    title: "VPN connection issues",
    status: "resolved",
    priority: "high",
    created: "2023-04-23T11:20:00",
    updated: "2023-04-24T15:10:00",
    category: "Network",
  },
  {
    id: "T-1230",
    title: "Password reset request",
    status: "resolved",
    priority: "medium",
    created: "2023-04-22T09:10:00",
    updated: "2023-04-22T10:30:00",
    category: "Account",
  },
  {
    id: "T-1229",
    title: "Projector not working in Room 302",
    status: "in_progress",
    priority: "high",
    created: "2023-04-21T14:25:00",
    updated: "2023-04-22T11:15:00",
    category: "Hardware",
  },
  {
    id: "T-1228",
    title: "Request for additional storage space",
    status: "assigned",
    priority: "low",
    created: "2023-04-20T10:05:00",
    updated: "2023-04-21T09:45:00",
    category: "Storage",
  },
]

export default function TicketsPage() {
  const [userRole, setUserRole] = useState<string>("student")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole")
    if (storedUserRole) {
      setUserRole(storedUserRole)
    }
  }, [])

  // Filter tickets based on search query and filters
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            New
          </Badge>
        )
      case "assigned":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Assigned
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Tickets</h2>
          <p className="text-muted-foreground">View and manage your support tickets</p>
        </div>
        {(userRole === "student" || userRole === "professor") && (
          <Link href="/tickets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Browse and search through your support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.length > 0 ? (
                  paginatedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">
                        <Link href={`/tickets/${ticket.id}`} className="text-blue-600 hover:underline">
                          {ticket.id}
                        </Link>
                      </TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>{formatDate(ticket.created)}</TableCell>
                      <TableCell>{formatDate(ticket.updated)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No tickets found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
