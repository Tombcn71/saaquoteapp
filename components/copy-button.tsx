'use client'

import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      size="sm"
      className="absolute top-2 right-2 bg-[#4285f4] hover:bg-[#3367d6] text-white border-none"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Gekopieerd!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1" />
          Kopieer
        </>
      )}
    </Button>
  )
}

