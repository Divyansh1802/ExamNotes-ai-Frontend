"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { GoogleIcon } from "@/components/brand-logo"
import { googleLoginUrl, sendOtp, verifyOtp } from "@/lib/api"

type Step = "email" | "otp"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  function handleGoogle() {
    setGoogleLoading(true)
    // Hand off to Spring Security's OAuth2 entry point. On success the backend
    // should redirect the browser back to "/" where the user is logged in.
    window.location.href = googleLoginUrl()
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }
    setSending(true)
    try {
      await sendOtp(email)
      toast.success(`We sent a 6-digit code to ${email}`)
      setStep("otp")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code.")
    } finally {
      setSending(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from your email.")
      return
    }
    setVerifying(true)
    try {
      await verifyOtp(email, code)
      toast.success("Verified! Redirecting…")
      router.push("/")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code.")
      setVerifying(false)
    }
  }

  async function handleResend() {
    try {
      await sendOtp(email)
      toast.success("A new code is on its way.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend code.")
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerify} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="mx-auto mb-1 grid size-11 place-items-center rounded-full bg-accent/15 text-accent">
            <Mail className="size-5" />
          </div>
          <h2 className="text-pretty text-lg font-semibold">
            Check your inbox
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            autoFocus
            disabled={verifying}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="size-11 text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={verifying}>
          {verifying ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Verify &amp; continue
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setStep("email")
              setCode("")
            }}
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Use another email
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="font-medium text-accent transition-opacity hover:opacity-80"
          >
            Resend code
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-card"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={sending}>
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Send login code
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
