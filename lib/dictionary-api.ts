import type { SearchResult } from "@/types/dictionary"

const API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000/api"

export async function searchWord(word: string): Promise<SearchResult> {
  if (!word.trim()) {
    return { word, found: false, error: "Please enter a word to search" }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search?word=${encodeURIComponent(word.trim())}`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result: SearchResult = await response.json()
    return result
  } catch (error) {
    console.error("Dictionary API error:", error)
    return {
      word,
      found: false,
      error: error instanceof Error ? error.message : "Failed to fetch definition",
    }
  }
}

export async function getWordSuggestions(partial: string): Promise<string[]> {
  if (!partial.trim()) {
    return []
  }

  try {
    const response = await fetch(`${API_BASE_URL}/suggestions?partial=${encodeURIComponent(partial.trim())}`)

    if (!response.ok) {
      return []
    }

    const result = await response.json()
    return result.suggestions || []
  } catch (error) {
    console.error("Suggestions API error:", error)
    return []
  }
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch (error) {
    return false
  }
}
