import { ExternalLink, Quote as QuoteIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartBlock } from "@/components/notes/chart-block"
import type { DocumentBlock, NotesDocument } from "@/lib/types"

function Heading({ level, text }: { level: number; text: string }) {
  const Tag = (`h${Math.min(Math.max(level, 1), 6)}`) as React.ElementType
  const sizes: Record<number, string> = {
    1: "text-2xl sm:text-3xl font-semibold tracking-tight mt-2",
    2: "text-xl sm:text-2xl font-semibold tracking-tight",
    3: "text-lg sm:text-xl font-semibold",
    4: "text-base font-semibold",
    5: "text-sm font-semibold uppercase tracking-wide text-muted-foreground",
    6: "text-sm font-semibold text-muted-foreground",
  }
  return (
    <Tag className={`text-pretty ${sizes[level] ?? sizes[3]}`}>{text}</Tag>
  )
}

function BlockRenderer({ block }: { block: DocumentBlock }) {
  switch (block.type) {
    case "heading":
      return <Heading level={block.level} text={block.text} />

    case "paragraph":
      return (
        <p className="text-pretty leading-relaxed text-foreground/90">
          {block.content}
        </p>
      )

    case "image":
      return (
        <figure className="flex flex-col gap-2">
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.url || "/placeholder.svg"}
              alt={block.title || block.description || "Illustration"}
              crossOrigin="anonymous"
              className="h-auto w-full object-cover"
            />
          </div>
          {(block.title || block.description) && (
            <figcaption className="text-center text-sm text-muted-foreground">
              {block.title ? (
                <span className="font-medium text-foreground">
                  {block.title}.{" "}
                </span>
              ) : null}
              {block.description}
            </figcaption>
          )}
        </figure>
      )

    case "chart":
      return (
        <figure className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-4">
          {block.title && (
            <figcaption className="text-sm font-medium">
              {block.title}
            </figcaption>
          )}
          <ChartBlock block={block} />
          {block.description && (
            <p className="text-center text-xs text-muted-foreground">
              {block.description}
            </p>
          )}
        </figure>
      )

    case "table":
      return (
        <div className="flex flex-col gap-2">
          {block.title && (
            <p className="text-sm font-medium">{block.title}</p>
          )}
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {block.columns.map((col, i) => (
                    <TableHead key={i} className="font-semibold text-foreground">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {block.rows.map((row, ri) => (
                  <TableRow key={ri}>
                    {row.map((cell, ci) => (
                      <TableCell key={ci}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )

    case "code":
      return (
        <div className="overflow-hidden rounded-xl border border-border bg-[oklch(0.1_0.006_285)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              {block.language || "code"}
            </span>
          </div>
          <pre className="overflow-x-auto p-4">
            <code className="font-mono text-sm leading-relaxed text-foreground/90">
              {block.content}
            </code>
          </pre>
        </div>
      )

    case "quote":
      return (
        <blockquote className="relative rounded-xl border border-border bg-card/50 p-5 pl-6">
          <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-accent" />
          <QuoteIcon className="mb-2 size-4 text-accent" />
          <p className="text-pretty italic leading-relaxed">{block.content}</p>
          {block.author && (
            <footer className="mt-2 text-sm text-muted-foreground">
              — {block.author}
            </footer>
          )}
        </blockquote>
      )

    case "list": {
      const ListTag = block.style === "ordered" ? "ol" : "ul"
      return (
        <ListTag
          className={`flex flex-col gap-2 pl-5 leading-relaxed text-foreground/90 ${
            block.style === "ordered" ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {item}
            </li>
          ))}
        </ListTag>
      )
    }

    default:
      return null
  }
}

export function DocumentView({ document }: { document: NotesDocument }) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {document.metadata?.topic && (
            <span className="rounded-full border border-border bg-card px-2.5 py-1">
              {document.metadata.topic}
            </span>
          )}
          {document.metadata?.version && (
            <span className="rounded-full border border-border bg-card px-2.5 py-1">
              v{document.metadata.version}
            </span>
          )}
          <span className="rounded-full border border-border bg-card px-2.5 py-1">
            by {document.metadata?.author || "AI"}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {document.title}
        </h1>
        {document.summary && (
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {document.summary}
          </p>
        )}
      </header>

      <div className="flex flex-col gap-6">
        {document.blocks?.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {(document.references?.length ?? 0) > 0 && (
        <footer className="mt-2 flex flex-col gap-3">
          <Separator />
          <h2 className="text-lg font-semibold">References</h2>
          <ul className="flex flex-col gap-2">
            {document.references?.map((ref, i) =>  (
              <li key={i}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  {ref.title}
                  <ExternalLink className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  )
}
