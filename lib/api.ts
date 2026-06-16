import type { GenerateNotesRequest, NotesDocument } from "./types"

export const ENDPOINTS = {
  googleAuthorize: "https://examnotes-ai-springboot-backend.onrender.com/api/oauth2/authorization/google",
  sendOtp: "https://examnotes-ai-springboot-backend.onrender.com/api/otp/sender",
  verifyOtp: "https://examnotes-ai-springboot-backend.onrender.com/api/auth/login",
  me: "https://examnotes-ai-springboot-backend.onrender.com/api/profile",
  generateNotes: "https://examnotes-ai-langchain-bot.onrender.com/api/v1/aiNotes",
} as const

// The full URL the "Continue with Google" button should navigate to.
export function googleLoginUrl() {
  return ENDPOINTS.googleAuthorize
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data?.message ?? data?.error ?? message
    } catch {
      // ignore JSON parse errors and use the default message
    }
    throw new Error(message)
  }

  const text = await res.text()
  return (text ? JSON.parse(text) : {}) as T
}

export function sendOtp(email: string) {
  return postJson<{ message?: string }>(ENDPOINTS.sendOtp, { email })
}

export function verifyOtp(email: string, code: string) {
  return postJson<{ message?: string }>(ENDPOINTS.verifyOtp, { email, code })
}

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

export async function postParams<T>(
  url: string,
  params: Record<string, string | number | boolean>,
): Promise<T> {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    }, {} as Record<string, string>)
  ).toString()

  const response = await fetch(`${url}?${queryString}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response.json()
}

export async function generateNotes(
  payload: GenerateNotesRequest,
): Promise<NotesDocument> {
  const data = await postParams<NotesDocument>(
    ENDPOINTS.generateNotes,
    {
      topic: payload.topic,
      level: payload.level,
      exam_type: payload.examType,
    }
  )

  console.log(data)

  return data
}

export async function getMe(): Promise<{ email?: string } | null> {
  try {
    const res = await fetch(ENDPOINTS.me, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return null
    const text = await res.text()
    return text ? (JSON.parse(text) as { email?: string }) : {}
  } catch {
    return null
  }
}
