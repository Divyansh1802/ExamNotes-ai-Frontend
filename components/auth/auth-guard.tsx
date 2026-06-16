"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { getMe } from "@/lib/api"
import { BrandLogo } from "@/components/brand-logo"

type Status = "checking" | "authed" | "anon"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("checking")

  useEffect(() => {
    let active = true
    getMe().then((user) => {
      if (!active) return
      if (user) {
        setStatus("authed")
      } else {
        setStatus("anon")
        router.replace("/login")
      }
    })
    return () => {
      active = false
    }
  }, [router])

  if (status === "authed") {
    return <>{children}</>
  }

  // Shown while verifying the session or before the redirect lands.
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <BrandLogo />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {status === "anon" ? "Redirecting to sign in…" : "Verifying your session…"}
      </div>
    </div>
  )
}
