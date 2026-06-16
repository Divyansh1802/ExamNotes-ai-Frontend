import Link from "next/link"
import { Sparkles, FileText, BarChart3, Quote } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { LoginForm } from "@/components/auth/login-form"
import { Card } from "@/components/ui/card"

const highlights = [
  {
    icon: FileText,
    title: "Structured study notes",
    desc: "Headings, summaries, lists, and tables generated for any topic.",
  },
  {
    icon: BarChart3,
    title: "Visual explainers",
    desc: "Charts and diagrams turn dense theory into clear visuals.",
  },
  {
    icon: Quote,
    title: "Cited & exam-ready",
    desc: "Every set of notes ships with references you can trust.",
  },
]

export default function LoginPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative">
          <BrandLogo />
        </div>

        <div className="relative flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-accent" />
            AI-powered exam preparation
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight">
            Turn any topic into
            <br />
            exam-ready notes.
          </h1>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            NoteForge generates clear, structured study material — complete with
            charts, tables, and references — tailored to your class level and
            exam type.
          </p>

          <ul className="flex flex-col gap-4">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-background/40 text-accent">
                  <item.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">
          Trusted by students preparing for boards, entrance, and competitive
          exams.
        </p>
      </section>

      {/* Auth panel */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo />
          </div>

          <div className="mb-8 flex flex-col gap-1.5 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to start generating notes.
            </p>
          </div>

          <Card className="border-border bg-card/60 p-6 backdrop-blur">
            <LoginForm />
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need help?{" "}
            <Link href="#" className="text-accent hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
