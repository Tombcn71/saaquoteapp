import { AIQuoteForm } from '@/components/ai-quote-form'

export default async function EmbedPage({ params }: { params: { widgetId: string } }) {
  // Simpel: toon gewoon het formulier met het widget ID
  // De lead API zal later checken of de widget geldig is
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-start justify-center">
      <div className="w-full max-w-2xl pt-8">
        <AIQuoteForm widgetId={params.widgetId} />
      </div>
    </div>
  )
}

