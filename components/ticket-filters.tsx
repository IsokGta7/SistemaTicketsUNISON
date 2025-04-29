"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"

export default function TicketFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get("priority") || "all")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("query", searchQuery)
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (priorityFilter !== "all") params.set("priority", priorityFilter)
    if (categoryFilter !== "all") params.set("category", categoryFilter)

    router.push(`/dashboard/tickets?${params.toString()}`)
  }

  // Aplicar filtros cuando cambien los valores
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setTimeout(applyFilters, 0)
  }

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value)
    setTimeout(applyFilters, 0)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setTimeout(applyFilters, 0)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters()
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tickets..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar:</span>
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="new">Nuevo</SelectItem>
            <SelectItem value="assigned">Asignado</SelectItem>
            <SelectItem value="in_progress">En Progreso</SelectItem>
            <SelectItem value="resolved">Resuelto</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Hardware">Hardware</SelectItem>
            <SelectItem value="Software">Software</SelectItem>
            <SelectItem value="Red">Red</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Cuenta">Cuenta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
