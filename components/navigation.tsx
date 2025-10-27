import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4285f4] flex items-center justify-center relative">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
              <Sparkles className="w-2 h-2 text-white absolute top-1 right-1" />
            </div>
            <span className="text-xl text-gray-900">QuoteForm</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#pricing"
              className="text-sm font-medium text-foreground hover:text-[#4285f4] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-foreground hover:text-[#4285f4] transition-colors"
            >
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium text-foreground hover:text-brand-blue transition-colors">
              Try Demo
            </Link>
          </div>

          <Link href="/auth/signin">
            <Button className="bg-[#4285f4] hover:bg-[#3367d6] text-white">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
