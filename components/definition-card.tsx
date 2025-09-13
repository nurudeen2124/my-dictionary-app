"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import type { DictionaryEntry } from "@/types/dictionary"

interface DefinitionCardProps {
  entry: DictionaryEntry
  isHighlighted?: boolean
}

export function DefinitionCard({ entry, isHighlighted = false }: DefinitionCardProps) {
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play().catch(console.error)
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isHighlighted ? "ring-2 ring-primary/20 bg-primary/5" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-semibold text-foreground capitalize">{entry.word}</CardTitle>
            {entry.phonetic && <span className="text-muted-foreground text-sm">/{entry.phonetic}/</span>}
            {entry.phonetics?.find((p) => p.audio) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const audioPhonetic = entry.phonetics?.find((p) => p.audio)
                  if (audioPhonetic?.audio) playAudio(audioPhonetic.audio)
                }}
                className="h-8 w-8 p-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entry.meanings.map((meaning, meaningIndex) => (
          <div key={meaningIndex} className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {meaning.partOfSpeech}
            </Badge>
            <div className="space-y-2">
              {meaning.definitions.slice(0, 3).map((def, defIndex) => (
                <div key={defIndex} className="space-y-1">
                  <p className="text-foreground leading-relaxed">
                    <span className="font-medium">{defIndex + 1}.</span> {def.definition}
                  </p>
                  {def.example && <p className="text-muted-foreground text-sm italic pl-4">Example: "{def.example}"</p>}
                  {def.synonyms && def.synonyms.length > 0 && (
                    <p className="text-muted-foreground text-sm pl-4">
                      Synonyms: {def.synonyms.slice(0, 3).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
