import { CircleAlert } from 'lucide-react'
import { acceptsMessages, formatPrice } from '@/entities/listing'
import { DealActions, OfferDecision, OfferForm, latestPendingOffer } from '@/features/make-offer'
import { ReviewDialog, canReview, reviewSubjectId } from '@/features/review-deal'
import type { ConversationThreadData } from '../model/types'

export function ThreadActions({
  data,
  viewerId,
}: {
  data: ConversationThreadData
  viewerId: string
}) {
  const { listing, buyer, offers, reviewedAuthorIds } = data
  const isSeller = viewerId === listing.seller_id
  const pending = latestPendingOffer(offers)

  const subjectId = reviewSubjectId({
    viewerId,
    sellerId: listing.seller_id,
    buyerId: listing.buyer_id,
  })

  const review = canReview({
    listingStatus: listing.status,
    soldAt: listing.sold_at,
    viewerId,
    sellerId: listing.seller_id,
    buyerId: listing.buyer_id,
    reviewedAuthorIds,
  })

  const counterpartAlias = isSeller ? buyer.alias : listing.seller.alias

  return (
    <section
      className="bg-muted/40 space-y-3 border-t px-4 py-3"
      aria-label="Acciones de la operación"
    >
      {isSeller && pending ? (
        <div>
          <p className="text-sm">
            <span className="font-medium">{buyer.alias}</span> ofrece{' '}
            <span className="font-semibold">{formatPrice(pending.amount_cents)}</span>
          </p>
          <OfferDecision offerId={pending.id} conversationId={data.id} />
        </div>
      ) : null}

      {!isSeller && acceptsMessages(listing.status) ? (
        <OfferForm
          conversationId={data.id}
          listingPriceCents={listing.price_cents}
          hasPendingOffer={Boolean(pending)}
        />
      ) : null}

      {isSeller && listing.status === 'reserved' ? (
        <DealActions listingId={listing.id} conversationId={data.id} />
      ) : null}

      {listing.status === 'sold' && subjectId ? (
        review.allowed ? (
          <ReviewDialog
            listingId={listing.id}
            subjectId={subjectId}
            subjectAlias={counterpartAlias}
            conversationId={data.id}
          />
        ) : (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <CircleAlert className="size-4 shrink-0" aria-hidden />
            {review.reason}
          </p>
        )
      ) : null}
    </section>
  )
}
