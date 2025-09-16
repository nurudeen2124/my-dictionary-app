"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { DefinitionCard } from "@/components/definition-card"
import { Book, AlertCircle, Sparkles, TrendingUp } from "lucide-react"
import { searchWord } from "@/lib/dictionary-api"
import type { SearchResult } from "@/types/dictionary"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="min-h-screen gradient-bg">
      <div className="flex-1">
        <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Book className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground text-balance">
                  English <span className="word-highlight">Dictionary</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Discover meanings, pronunciations, and examples with our comprehensive dictionary
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
              <div className="mb-8">
                {searchResult.found ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p>
                      Found definitions for <span className="font-semibold text-primary">"{searchResult.word}"</span>
                    </p>
                  </div>
                ) : (
                  <Alert className="border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      {searchResult.error || `No results found for "${searchResult.word}"`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {!hasSearched && (
              <div className="text-center py-16">
                <div className="mb-12">
                  <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Book className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to English Dictionary</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                    Search for any English word above to get comprehensive definitions, pronunciations, and examples.
                    Powered by our advanced Python backend for fast and accurate results.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Comprehensive Definitions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Get detailed meanings, parts of speech, and usage examples for any word.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Smart Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Get word suggestions as you type to help you find what you're looking for.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto">
                        <Book className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Audio Pronunciation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Listen to correct pronunciations with phonetic transcriptions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
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
