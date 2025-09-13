"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DictionarySidebarProps {
  terms: string[]
  onTermSelect: (term: string) => void
  selectedTerm?: string
}

export function DictionarySidebar({ terms, onTermSelect, selectedTerm }: DictionarySidebarProps) {
  const [filter, setFilter] = useState<"all" | "data" | "control" | "oop">("all")

  // Categorize terms for better organization
  const categories = {
    data: ["string", "integer", "boolean", "list", "dictionary", "tuple", "set", "variable", "database"],
    control: ["function", "loop", "algorithm", "recursion", "compilation", "syntax"],
    oop: ["class", "object", "inheritance"],
    all: terms,
  }

  const filteredTerms = categories[filter] || terms
  const displayTerms = filteredTerms.filter((term) => terms.includes(term))

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Programming Dictionary</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All ({terms.length})
          </Button>
          <Button
            variant={filter === "data" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("data")}
            className="text-xs"
          >
            Data Types
          </Button>
          <Button
            variant={filter === "control" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("control")}
            className="text-xs"
          >
            Control
          </Button>
          <Button
            variant={filter === "oop" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("oop")}
            className="text-xs"
          >
            OOP
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-1">
          {displayTerms.map((term) => (
            <Button
              key={term}
              variant={selectedTerm === term ? "secondary" : "ghost"}
              className="w-full justify-start text-left capitalize"
              onClick={() => onTermSelect(term)}
            >
              {term}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
