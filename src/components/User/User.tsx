import type { User } from '@/services/user/models/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Post } from '@/services/post/models/post'
import PostComponent from '../Post/Post'
import { useAuth } from '@/hooks/use-auth'
import { useEndpoint } from '@/hooks/use-endpoint'
import createFollow from '@/services/follow/create-follow'
import deleteFollow from '@/services/follow/delete-follow'
import { cn, getInitials } from '@/lib/utils'
import { useEffect, useState } from 'react'
import FollowersDialog from './components/FollowersDialog'
import FollowingDialog from './components/FollowingDialog'

const UserProfile = ({ user }: { user: User }) => {
  const ENDPOINT = useEndpoint()
  const { currentUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const currentUserId = currentUser?.id

  const followers = user.Followers || []
  const following = user.Following || []
  const posts = user.Posts || ([] as Post[])

  // Check if the profile belongs to the current user
  const ownUser = currentUser?.id === user.id

  // Check if the current user is following this profile
  const followingEntry = followers.find(
    (entry) => entry.follower.id === currentUserId
  )

  useEffect(() => {
    setIsFollowing(!!followingEntry)
  }, [followingEntry])

  const handleFollow = () => {
    createFollow(ENDPOINT, currentUserId!, user.id)
      .then(() => {
        // Update local state to reflect the new follow relationship
        setIsFollowing(true)
      })
      .catch((err: Error) => {
        console.error('Failed to follow user:', err.message)
      })
  }

  const handleUnfollow = () => {
    deleteFollow(ENDPOINT, followingEntry?.id || '')
      .then(() => {
        // Update local state to reflect the removed follow relationship
        setIsFollowing(false)
      })
      .catch((err: Error) => {
        console.error('Failed to unfollow user:', err.message)
      })
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      {/* Header Section */}
      <section className="flex flex-col gap-8">
        {/* Profile Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="size-24 sm:size-36">
            <AvatarImage src={''} alt={user.name} />
            <AvatarFallback className="text-2xl sm:text-4xl font-mono">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          {/* User Details */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-medium">{user.username}</h1>
            </div>

            {/* Name */}
            <div>
              <p className="font-semibold">{user.name}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold">{posts.length}</span>{' '}
                <span className="text-muted-foreground">publications</span>
              </div>
              <FollowersDialog followers={followers} />
              <FollowingDialog following={following} />
            </div>
          </div>
        </div>
        <div
          className={cn('grid gap-4', ownUser ? 'grid-cols-1' : 'grid-cols-2')}
        >
          {ownUser ? (
            <Button
              variant="outline"
              className="text-white hover:cursor-pointer font-semibold"
            >
              Modifier le profil
            </Button>
          ) : (
            <Button
              variant={isFollowing ? 'outline' : 'default'}
              className={cn(
                'text-white hover:cursor-pointer hover:bg-blue-600 font-semibold',
                !isFollowing && 'bg-blue-500'
              )}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? 'Suivi(e)' : 'Suivre'}
            </Button>
          )}
          {!ownUser && (
            <Button
              variant="outline"
              className="text-white hover:cursor-pointer font-semibold"
            >
              Contacter
            </Button>
          )}
        </div>

        <Separator />

        {/* Tabs for Posts */}

        <section>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Aucune publication</p>
            </div>
          ) : (
            posts
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((post) => <PostComponent post={post} key={post.id} />)
          )}
        </section>
      </section>
    </section>
  )
}

export default UserProfile
