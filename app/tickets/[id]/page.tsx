"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Clock, MessageSquare, User } from "lucide-react"

// Mock ticket data
const mockTicket = {
  id: "T-1234",
  title: "Cannot access department printer",
  description:
    "I'm trying to print documents to the shared printer in the Computer Science department (HP LaserJet 4350 in Room 301), but my computer can't find the printer. I've tried restarting my computer and checking the network connection, but nothing seems to work. This is urgent as I need to print materials for tomorrow's lecture.",
  status: "in_progress",
  priority: "medium",
  created: "2023-04-25T10:30:00",
  updated: "2023-04-26T14:20:00",
  category: "Hardware",
  assignee: {
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    avatar: "/placeholder-user.jpg",
  },
  creator: {
    name: "Maria Rodriguez",
    email: "m.rodriguez@university.edu",
    avatar: "/placeholder-user.jpg",
  },
}

// Mock comments data
const mockComments = [
  {
    id: "1",
    user: {
      name: "Maria Rodriguez",
      email: "m.rodriguez@university.edu",
      avatar: "/placeholder-user.jpg",
    },
    content: "I've tried restarting the printer as well, but it didn't help.",
    timestamp: "2023-04-25T11:15:00",
  },
  {
    id: "2",
    user: {
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      avatar: "/placeholder-user.jpg",
    },
    content:
      "I'll check the printer configuration. Can you confirm if you're connected to the university network or using VPN?",
    timestamp: "2023-04-25T13:45:00",
  },
  {
    id: "3",
    user: {
      name: "Maria Rodriguez",
      email: "m.rodriguez@university.edu",
      avatar: "/placeholder-user.jpg",
    },
    content: "I'm connected to the university network directly, not using VPN.",
    timestamp: "2023-04-25T14:20:00",
  },
  {
    id: "4",
    user: {
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      avatar: "/placeholder-user.jpg",
    },
    content:
      "Thanks for confirming. I'll check the printer server and network settings. I'll update you once I have more information.",
    timestamp: "2023-04-26T09:10:00",
  },
]

// Mock history data
const mockHistory = [
  {
    id: "1",
    action: "Ticket created",
    user: {
      name: "Maria Rodriguez",
      email: "m.rodriguez@university.edu",
    },
    timestamp: "2023-04-25T10:30:00",
  },
  {
    id: "2",
    action: "Status changed to 'assigned'",
    user: {
      name: "System",
      email: "system@university.edu",
    },
    timestamp: "2023-04-25T10:45:00",
  },
  {
    id: "3",
    action: "Assigned to Alex Johnson",
    user: {
      name: "System",
      email: "system@university.edu",
    },
    timestamp: "2023-04-25T10:45:00",
  },
  {
    id: "4",
    action: "Status changed to 'in_progress'",
    user: {
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
    },
    timestamp: "2023-04-25T13:30:00",
  },
]

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [userRole, setUserRole] = useState<string>("student")
  const [status, setStatus] = useState(mockTicket.status)
  const [priority, setPriority] = useState(mockTicket.priority)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole")
    if (storedUserRole) {
      setUserRole(storedUserRole)
    }
  }, [])

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${newStatus}`,
    })
  }

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority)
    toast({
      title: "Priority updated",
      description: `Ticket priority changed to ${newPriority}`,
    })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to add a comment
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Comment added",
        description: "Your comment has been added to the ticket",
      })

      setNewComment("")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem adding your comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Ticket {params.id}</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{mockTicket.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>{mockTicket.id}</span>
                <span>•</span>
                <span>{mockTicket.category}</span>
                <span>•</span>
                <span>Created {formatDate(mockTicket.created)}</span>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(status)}
              {getPriorityBadge(priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Reported by:</span>
              <span className="font-medium text-foreground">{mockTicket.creator.name}</span>
            </div>
            {mockTicket.assignee && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Assigned to:</span>
                <span className="font-medium text-foreground">{mockTicket.assignee.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated:</span>
              <span className="font-medium text-foreground">{formatDate(mockTicket.updated)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Description</h3>
            <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-4">
              <p className="whitespace-pre-line">{mockTicket.description}</p>
            </div>
          </div>

          {(userRole === "technician" || userRole === "admin") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Priority</h3>
                <Select value={priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4 mt-4">
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                      <AvatarFallback>
                        {comment.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-4">
                {mockHistory.map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="h-2 w-2 mt-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <div className="flex-1">
                      <p className="text-sm">{event.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.user.name}</span>
                        <span>•</span>
                        <span>{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Tickets
          </Button>
          {status !== "resolved" && status !== "closed" && (
            <Button
              onClick={() => handleStatusChange("resolved")}
              variant={userRole === "student" || userRole === "professor" ? "outline" : "default"}
            >
              {userRole === "student" || userRole === "professor" ? "Mark as Resolved" : "Resolve Ticket"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
