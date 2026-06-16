"use client"

import { useState } from "react"
import { AlertCircle, FileText, RotateCcw, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { GenerateForm } from "@/components/notes/generate-form"
import { ProcessingView } from "@/components/notes/processing-view"
import { DocumentView } from "@/components/notes/document-view"
import { generateNotes } from "@/lib/api"
import type { GenerateNotesRequest, NotesDocument } from "@/lib/types"

type Status = "idle" | "loading" | "done" | "error"

export function NotesStudio() {
  const [status, setStatus] = useState<Status>("idle")
  const [doc, setDoc] = useState<NotesDocument | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<string>("")

 async function handleGenerate(payload: GenerateNotesRequest) {
  setStatus("loading")
  setError(null)
  setDoc(null)
  setContext(`${payload.topic} · ${payload.examType}`)
  try {
    const result = await generateNotes(payload)
    // Unwrap envelope: API returns { success, message, data }
    const doc = (result as any)?.data ?? result
    setDoc(doc)
    setStatus("done")
    toast.success("Your notes are ready.")
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong."
    setError(message)
    setStatus("error")
    toast.error(message)
  }
}

  function reset() {
    setStatus("idle")
    setDoc(null)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-accent" />
          Exam Notes AI Generator
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          What should we prepare today?
        </h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Enter a topic, your class level, and the exam type. NoteForge builds
          structured, exam-ready notes with explanations, charts, tables, and
          references.
        </p>
      </section>

      <GenerateForm
        onGenerate={handleGenerate}
        loading={status === "loading"}
      />

      {status === "loading" && <ProcessingView context={context} />}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Couldn&apos;t generate notes</h2>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="size-4" />
            Try again
          </Button>
        </div>
      )}

      {status === "done" && doc && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Generated document
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              New notes
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
            <DocumentView document={doc} />
          </div>
        </div>
      )}

      {status === "idle" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
          <span className="grid size-12 place-items-center rounded-xl border border-border bg-background/40 text-muted-foreground">
            <FileText className="size-5" />
          </span>
          <p className="text-sm font-medium">Your notes will appear here</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Fill in the form above and hit{" "}
            <span className="text-foreground">Generate Notes</span> to get
            started.
          </p>
        </div>
      )}
    </div>
  )
}
