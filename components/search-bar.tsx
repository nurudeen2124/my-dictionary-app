"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getWordSuggestions } from "@/lib/dictionary-api"

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
  isLoading?: boolean
}

export function SearchBar({ onSearch, className, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim() && query.length > 1) {
        try {
          const newSuggestions = await getWordSuggestions(query)
          setSuggestions(newSuggestions)
          setShowSuggestions(newSuggestions.length > 0)
        } catch (error) {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault()
          const selectedWord = suggestions[selectedIndex]
          setQuery(selectedWord)
          onSearch(selectedWord)
          setShowSuggestions(false)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for any English word..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-10 h-12 text-base bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              disabled={isLoading}
              autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors",
                      index === selectedIndex && "bg-accent text-accent-foreground",
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" disabled={isLoading || !query.trim()} className="h-12 px-6">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>
    </div>
  )
}
