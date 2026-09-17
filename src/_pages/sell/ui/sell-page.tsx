import { redirect } from 'next/navigation'
import { getSessionUser } from '@/shared/api/server'
import { getCategoryTree } from '@/entities/listing/index.server'
import { CreateListingForm } from '@/features/create-listing'

export async function SellPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=%2Fsell')

  const categories = await getCategoryTree()

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Publica tu artículo</h1>
        <p className="text-muted-foreground">
          Tres pasos: qué vendes, cómo se ve y cuánto pides. Puedes guardarlo como borrador y
          publicarlo cuando quieras.
        </p>
      </header>
      <CreateListingForm categories={categories} />
    </div>
  )
}
