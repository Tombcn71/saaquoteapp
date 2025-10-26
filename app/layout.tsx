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
  title: "QuoteSaaS - AI-Powered Quote Forms",
  description: "Generate instant quotes with AI photo analysis in 3 lines of code",
    generator: 'v0.app'
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
