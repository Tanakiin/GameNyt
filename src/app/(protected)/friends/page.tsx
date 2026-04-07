import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/auth/require-current-user'
import {
  acceptFriendRequestAction,
  declineFriendRequestAction,
} from '@/app/actions/friends'
import { FriendSearchForm } from './search-form'

export default async function FriendsPage() {
  const currentUser = await requireCurrentUser()

  const incomingRequests = await prisma.friendRequest.findMany({
    where: {
      recipientId: currentUser.id,
      status: 'PENDING',
    },
    include: {
      requester: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const accepted = await prisma.friendRequest.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [
        { requesterId: currentUser.id },
        { recipientId: currentUser.id },
      ],
    },
    include: {
      requester: true,
      recipient: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const friends = accepted.map((entry) =>
    entry.requesterId === currentUser.id ? entry.recipient : entry.requester
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Friends</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Compare libraries</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Add friends in GameNight and compare what you both own, what overlaps, and which multiplayer games you can jump into together.
        </p>
      </div>

      <FriendSearchForm />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Incoming requests</h2>

        {incomingRequests.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 text-sm text-neutral-400">
            No pending requests.
          </div>
        ) : (
          incomingRequests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">
                  {request.requester.username || request.requester.email}
                </p>
                <p className="text-sm text-neutral-500">{request.requester.email}</p>
              </div>

              <div className="flex gap-2">
              <form action={acceptFriendRequestAction}>
                <input type="hidden" name="requestId" value={request.id} />
                <button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">
                  Accept
                </button>
              </form>

              <form action={declineFriendRequestAction}>
                <input type="hidden" name="requestId" value={request.id} />
                <button className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-200">
                  Decline
                </button>
              </form>
            </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Friends</h2>

        {friends.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 text-sm text-neutral-400">
            No friends yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {friends.map((friend) => (
              <Link
                key={friend.id}
                href={`/friends/${friend.id}`}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 transition hover:border-neutral-700"
              >
                <p className="text-lg font-semibold text-white">
                  {friend.username || 'Player'}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{friend.email}</p>
                <p className="mt-4 text-sm text-cyan-300">Compare libraries →</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}