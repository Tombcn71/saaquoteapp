import type React from "react"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"
import { AuthSessionProvider } from "@/lib/session-provider"

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "QuoteForm - AI-Powered Quote Generation",
  description: "Generate instant quotes with AI photo analysis. Embed on any website in minutes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
