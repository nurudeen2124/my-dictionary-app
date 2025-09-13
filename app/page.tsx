"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { DefinitionCard } from "@/components/definition-card"
import { Book, AlertCircle } from "lucide-react"
import { searchWord } from "@/lib/dictionary-api"
import type { SearchResult } from "@/types/dictionary"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DictionaryApp() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const result = await searchWord(query)
      setSearchResult(result)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResult({
        word: query,
        found: false,
        error: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Book className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground text-balance">English Dictionary</h1>
                <p className="text-muted-foreground mt-1">
                  Search for definitions, pronunciations, and examples of English words
                </p>
              </div>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </header>

        {/* Results */}
        <main className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {searchResult && hasSearched && (
              <div className="mb-6">
                {searchResult.found ? (
                  <p className="text-muted-foreground">Found definitions for "{searchResult.word}"</p>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {searchResult.error || `No results found for "${searchResult.word}"`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {!hasSearched && (
              <div className="text-center py-12">
                <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to English Dictionary</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-pretty">
                  Search for any English word above to get comprehensive definitions, pronunciations, and examples.
                </p>
              </div>
            )}

            <div className="grid gap-6">
              {searchResult?.found &&
                searchResult.data?.map((entry, index) => (
                  <DefinitionCard key={`${entry.word}-${index}`} entry={entry} />
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
