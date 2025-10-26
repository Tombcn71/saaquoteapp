import { Button } from "@/components/ui/button"
import { ArrowRight, Camera } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: "var(--hero-bg)" }}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
            <span className="text-navy">AI-Powered Quote Forms</span>
            <br />
            <span className="bg-gradient-to-r from-brand-blue to-brand-blue-light bg-clip-text text-transparent">
              In 3 Lines of Code
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate instant quotes with AI photo analysis. No complex integrations.
            <br />
            Just embed, collect leads, and convert customers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="bg-brand-blue hover:bg-brand-blue-light text-white text-base px-8 py-6 h-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 text-base px-8 py-6 h-auto bg-white">
              <Camera className="mr-2 w-5 h-5" />
              View Demo
            </Button>
          </div>

          {/* Code Snippet Display */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="rounded-xl p-8 shadow-2xl" style={{ backgroundColor: "var(--code-bg)" }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400 ml-4 font-mono">index.html</span>
              </div>

              <div className="font-mono text-sm md:text-base space-y-2 text-left">
                <div className="text-gray-400">
                  <span className="text-green-400">&lt;script</span> <span className="text-blue-400">src</span>
                  <span className="text-white">=</span>
                  <span className="text-orange-400">"https://quotesaas.com/widget.js"</span>
                </div>
                <div className="text-gray-400 pl-8">
                  <span className="text-blue-400">data-company-id</span>
                  <span className="text-white">=</span>
                  <span className="text-orange-400">"your-id"</span>
                  <span className="text-green-400">&gt;</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-green-400">&lt;/script&gt;</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700 flex items-center justify-between">
                <p className="text-gray-400 text-sm">That's it. You're done.</p>
                <Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-gray-800">
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
