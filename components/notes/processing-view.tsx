"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

const STAGES = [
  "Understanding your topic",
  "Researching key concepts",
  "Structuring the notes",
  "Generating charts & tables",
  "Adding references",
  "Finalizing your document",
]

export function ProcessingView({ context }: { context?: string }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Advance through stages on a loop while we wait for the AI response.
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % STAGES.length)
    }, 1600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/50 p-8 text-center">
        <div className="relative grid size-14 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
          <span className="grid size-14 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
            <Loader2 className="size-6 animate-spin" />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Generating your notes</h2>
          <p className="text-sm text-muted-foreground">
            {context
              ? `Working on “${context}”. This usually takes a moment.`
              : "This usually takes a moment."}
          </p>
        </div>

        {/* Indeterminate browsing-loop progress bar */}
        <div className="relative mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-[loop_1.4s_ease-in-out_infinite] rounded-full bg-accent" />
        </div>

        <ul className="mt-2 flex w-full max-w-xs flex-col gap-2.5 text-left">
          {STAGES.map((stage, i) => {
            const done = i < active
            const current = i === active
            return (
              <li
                key={stage}
                className="flex items-center gap-2.5 text-sm transition-opacity"
                style={{ opacity: done || current ? 1 : 0.45 }}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                    done
                      ? "border-accent bg-accent text-accent-foreground"
                      : current
                        ? "border-accent text-accent"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {done ? (
                    <Check className="size-3" />
                  ) : current ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className={current ? "text-foreground" : "text-muted-foreground"}>
                  {stage}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Skeleton preview of the incoming document */}
      <div className="flex flex-col gap-4" aria-hidden="true">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
