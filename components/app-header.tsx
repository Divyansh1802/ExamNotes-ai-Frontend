"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { API_BASE_URL } from "@/lib/api"

export function AppHeader() {
  function handleLogout() {
    // Spring Security default logout endpoint. Adjust if your backend differs.
    window.location.href = `${API_BASE_URL}/logout`
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </div>
    </header>
  )
}
