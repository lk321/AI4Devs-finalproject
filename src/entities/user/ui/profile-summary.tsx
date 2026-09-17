import Link from 'next/link'
import { formatSince } from '@/entities/listing'
import { UserAvatar } from './user-avatar'
import { Rating } from './rating'
import type { PublicProfile } from '../model/types'

export function ProfileSummary({ profile }: { profile: PublicProfile }) {
  return (
    <Link
      href={`/profile/${profile.alias}`}
      className="hover:bg-muted/60 flex items-center gap-3 rounded-lg p-2 transition-colors"
    >
      <UserAvatar alias={profile.alias} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{profile.alias}</p>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Rating value={profile.rating_average} />
          <span aria-hidden>·</span>
          <span>{profile.closed_deals} operaciones</span>
        </div>
        <p className="text-muted-foreground text-xs">
          {profile.city} · En Loop Market {formatSince(profile.created_at).toLowerCase()}
        </p>
      </div>
    </Link>
  )
}
