import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4285f4] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
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
