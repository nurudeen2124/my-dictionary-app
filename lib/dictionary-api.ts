import type { DictionaryEntry, SearchResult } from "@/types/dictionary"

const API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en"

export async function searchWord(word: string): Promise<SearchResult> {
  if (!word.trim()) {
    return { word, found: false, error: "Please enter a word to search" }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(word.trim())}`)

    if (!response.ok) {
      if (response.status === 404) {
        return { word, found: false, error: "Word not found in dictionary" }
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: DictionaryEntry[] = await response.json()
    return { word, found: true, data }
  } catch (error) {
    console.error("Dictionary API error:", error)
    return {
      word,
      found: false,
      error: error instanceof Error ? error.message : "Failed to fetch definition",
    }
  }
}
