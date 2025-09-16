import { type NextRequest, NextResponse } from "next/server"
import type { SearchResult } from "@/types/dictionary"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const word = searchParams.get("word")

  if (!word?.trim()) {
    return NextResponse.json({
      word: word || "",
      found: false,
      error: "Please enter a word to search",
    })
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          word,
          found: false,
          error: "Word not found",
        })
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const entry = data[0]

    const result: SearchResult = {
      word: entry.word,
      found: true,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
      audio: entry.phonetics?.find((p: any) => p.audio)?.audio || "",
      meanings:
        entry.meanings?.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions:
            meaning.definitions?.slice(0, 3).map((def: any) => ({
              definition: def.definition,
              example: def.example || "",
            })) || [],
          synonyms: meaning.synonyms?.slice(0, 5) || [],
        })) || [],
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Dictionary API error:", error)
    return NextResponse.json({
      word,
      found: false,
      error: error instanceof Error ? error.message : "Failed to fetch definition",
    })
  }
}
