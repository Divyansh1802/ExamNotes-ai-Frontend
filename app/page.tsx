import { AppHeader } from "@/components/app-header"
import { NotesStudio } from "@/components/notes/notes-studio"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function HomePage() {
  return (
    <AuthGuard>
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <NotesStudio />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>NoteForge — AI exam notes generator</span>
          <span>Powered by your Spring Boot backend</span>
        </div>
      </footer>
    </div>
    </AuthGuard>
  )
}
