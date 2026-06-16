"use client"

import { useState } from "react"
import { BookOpen, GraduationCap, Sparkles, Target } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { GenerateNotesRequest } from "@/lib/types"

const EXAM_SUGGESTIONS = ["Board Exam", "Midterm", "Final", "Quiz", "Entrance"]

export function GenerateForm({
  onGenerate,
  loading,
}: {
  onGenerate: (payload: GenerateNotesRequest) => void
  loading: boolean
}) {
  const [topic, setTopic] = useState("")
  const [level, setLevel] = useState("")
  const [examType, setExamType] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = {
      topic: topic.trim(),
      level: level.trim(),
      examType: examType.trim(),
    }
    if (!trimmed.topic || !trimmed.level || !trimmed.examType) {
      toast.error("Please fill in topic, class/level, and exam type.")
      return
    }
    onGenerate(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur sm:p-7"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <Field
          id="topic"
          label="Topic"
          required
          icon={<BookOpen className="size-4" />}
        >
          <Input
            id="topic"
            placeholder="e.g. Photosynthesis"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </Field>

        <Field
          id="level"
          label="Class / Level"
          required
          icon={<GraduationCap className="size-4" />}
        >
          <Input
            id="level"
            placeholder="e.g. Grade 10 / Undergrad"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            disabled={loading}
          />
        </Field>

        <Field
          id="examType"
          label="Exam Type"
          required
          icon={<Target className="size-4" />}
        >
          <Input
            id="examType"
            placeholder="e.g. Board Exam"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            disabled={loading}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Quick exam type:</span>
        {EXAM_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setExamType(s)}
            disabled={loading}
            className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
        <p className="hidden text-xs text-muted-foreground sm:block">
          All three fields are required to generate notes.
        </p>
        <Button type="submit" size="lg" disabled={loading} className="gap-2">
          <Sparkles className="size-4" />
          Generate Notes
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  required,
  icon,
  children,
}: {
  id: string
  label: string
  required?: boolean
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        <span className="text-accent">{icon}</span>
        {label}
        {required && <span className="text-accent">*</span>}
      </Label>
      {children}
    </div>
  )
}
