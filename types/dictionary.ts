export interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics?: Array<{
    text?: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
      synonyms?: string[]
      antonyms?: string[]
    }>
  }>
}

export interface SearchResult {
  word: string
  found: boolean
  data?: DictionaryEntry[]
  error?: string
}
