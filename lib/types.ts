// Types that mirror the JSON document returned by the notes-generation backend.

// 1. Add "tree" (and string fallback) to ChartType
export type ChartType = "line" | "bar" | "pie" | "area" | "scatter" | "tree" | (string & {})

export interface DocumentMetadata {
  topic: string
  author: string
  version: string
}

// 2. Allow string values in datasets (for non-numeric chart types like "tree")
export interface ChartDataset {
  label: string
  values: (number | string)[]
}

export interface ChartData {
  labels: (string | number)[]
  datasets: ChartDataset[]
}

export interface HeadingBlock {
  id: string
  type: "heading"
  level: number
  text: string
}

export interface ParagraphBlock {
  id: string
  type: "paragraph"
  content: string
}

export interface ImageBlock {
  id: string
  type: "image"
  title?: string
  description?: string
  url: string
}

export interface ChartBlock {
  id: string
  type: "chart"
  title?: string
  chartType: ChartType
  description?: string
  data: ChartData
}

export interface TableBlock {
  id: string
  type: "table"
  title?: string
  columns: string[]
  rows: (string | number)[][]
}

export interface CodeBlock {
  id: string
  type: "code"
  language?: string
  content: string
}

export interface QuoteBlock {
  id: string
  type: "quote"
  content: string
  author?: string
}

export interface ListBlock {
  id: string
  type: "list"
  style: "ordered" | "unordered"
  items: string[]
}

export type DocumentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ChartBlock
  | TableBlock
  | CodeBlock
  | QuoteBlock
  | ListBlock

export interface Reference {
  title: string
  url: string
}

// 3. Make fields optional to match real API responses
export interface NotesDocument {
  documentId?: string
  title: string
  summary?: string
  metadata?: Partial<DocumentMetadata>
  blocks: DocumentBlock[]
  references?: Reference[]
}

export interface GenerateNotesRequest {
  topic: string
  level: string
  examType: string
}