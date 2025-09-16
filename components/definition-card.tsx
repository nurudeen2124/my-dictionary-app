"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2, Quote, Hash } from "lucide-react"
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
      className={`transition-all duration-300 hover:shadow-lg border-border/50 ${
        isHighlighted ? "ring-2 ring-primary/30 bg-primary/5" : "hover:border-primary/30"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-3xl font-bold word-highlight capitalize">{entry.word}</CardTitle>
            {entry.phonetic && (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                <span className="text-muted-foreground text-sm font-mono">/{entry.phonetic}/</span>
              </div>
            )}
            {entry.phonetics?.find((p) => p.audio) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const audioPhonetic = entry.phonetics?.find((p) => p.audio)
                  if (audioPhonetic?.audio) playAudio(audioPhonetic.audio)
                }}
                className="h-9 w-9 p-0 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
              >
                <Volume2 className="h-4 w-4 text-primary" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {entry.meanings.map((meaning, meaningIndex) => (
          <div key={meaningIndex} className="space-y-4">
            <Badge variant="secondary" className="text-sm font-medium bg-primary/10 text-primary border-primary/20">
              {meaning.partOfSpeech}
            </Badge>
            <div className="space-y-4">
              {meaning.definitions.slice(0, 3).map((def, defIndex) => (
                <div key={defIndex} className="space-y-3 pl-4 border-l-2 border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                      <Hash className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-foreground leading-relaxed text-base">{def.definition}</p>
                  </div>
                  {def.example && (
                    <div className="flex items-start gap-3 ml-9">
                      <Quote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground italic bg-muted/30 px-3 py-2 rounded-lg">{def.example}</p>
                    </div>
                  )}
                  {def.synonyms && def.synonyms.length > 0 && (
                    <div className="ml-9">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Synonyms:</span>{" "}
                        {def.synonyms.slice(0, 3).map((synonym, i) => (
                          <span key={synonym} className="inline-flex items-center">
                            <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                              {synonym}
                            </Badge>
                            {i < def.synonyms!.slice(0, 3).length - 1 && <span className="mx-1">•</span>}
                          </span>
                        ))}
                      </p>
                    </div>
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
