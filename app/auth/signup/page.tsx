"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
      } else {
        router.push("/auth/signin?registered=true")
      }
    } catch (error) {
      console.error("[v0] Sign up error:", error)
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--hero-bg)" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285f4] to-[#3367d6] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#4285f4] to-[#3367d6] bg-clip-text text-transparent">
              LeadBot
            </span>
          </Link>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Start met LeadBot</CardTitle>
            <CardDescription className="text-center">Maak een account aan en plaats de AI chatbot op je website</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Bedrijfsnaam *</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Mijn Bedrijf BV"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Jouw naam</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jan Jansen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Account Aanmaken..." : "Account Aanmaken"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Heb je al een account?{" "}
              <Link href="/auth/signin" className="text-[#4285f4] hover:underline font-medium">
                Inloggen
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
