import type { GenerateNotesRequest, NotesDocument } from "./types"

// ---------------------------------------------------------------------------
// Backend configuration
// ---------------------------------------------------------------------------
// Point this at your Spring Boot server, e.g. http://localhost:8080
// Set NEXT_PUBLIC_API_BASE_URL in your project environment variables.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? ""


export const ENDPOINTS = {
  // Spring Security default Google OAuth2 entry point. Spring redirects to
  // Google, then back to your configured success URL.

  googleAuthorize: "https://examnotes-ai-springboot-backend.onrender.com/api/oauth2/authorization/google",

  // Sends a one-time passcode to the given email address.
  sendOtp: "https://examnotes-ai-springboot-backend.onrender.com/api/otp/sender",
 
  // Verifies the OTP and establishes a session.
  verifyOtp: "https://examnotes-ai-springboot-backend.onrender.com/api/auth/login",

  // Returns the currently authenticated user (used to gate the home page).
  me: "https://examnotes-ai-springboot-backend.onrender.com/api/profile",

  // Generates exam notes from topic / level / exam type.
  generateNotes: "https://examnotes-ai-langchain-bot.onrender.com/api/v1/aiNotes",
  

  
} as const

function url(path: string) {
  return `${API_BASE_URL}${path}`
}

// The full URL the "Continue with Google" button should navigate to.
export function googleLoginUrl() {
  return url(ENDPOINTS.googleAuthorize)
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(url(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Include cookies so Spring Security session/JWT cookies flow through.
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

  // Some endpoints (like sendOtp) may return no body.
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

// Returns the authenticated user, or null if there is no valid session.
// Used to gate the home page so only logged-in users can see it.
export async function getMe(): Promise<{ email?: string } | null> {
  try {
    const res = await fetch(url(ENDPOINTS.me), {
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
