import { MessageCircle, Play, Volume2, VolumeOff } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { useState, useRef, useEffect } from 'react'
import Rourous from './Rourous/Rourous'
import { Separator } from '@radix-ui/react-separator'
import type { Post } from '@/services/models/post/post'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import { formatTimeDifference } from '@/lib/time'
import CommentsDrawer from './Comments/CommentsDrawer'

const PostComponent = ({
  className,
  post,
}: {
  className?: string
  post: Post
}) => {
  const navigate = useNavigate()
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto play/pause video based on visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !paused) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [paused])

  const hasAssets = post.Assets && post.Assets.length > 0
  const hasMultipleAssets = post.Assets && post.Assets.length > 1

  const renderMedia = (asset: { url: string; mimeType: string }) => {
    if (asset.mimeType.startsWith('image/')) {
      return (
        <img
          src={asset.url}
          alt="Post asset"
          className="w-full max-h-[85vh] object-contain rounded-xl"
        />
      )
    } else if (asset.mimeType.startsWith('video/')) {
      return (
        <div className="relative w-full max-h-[85vh] bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={asset.url}
            className="max-h-[85vh] w-auto object-contain"
            loop
            muted={muted}
            playsInline
          />
          {/* Clickable Play/Pause div */}
          <div
            className="absolute inset-0 sizeb-8 flex justify-center items-center"
            onClick={() => setPaused(!paused)}
          >
            {paused && (
              <Play className="size-16 text-white absolute fill-white" />
            )}
          </div>

          <Button
            variant="default"
            className="absolute bottom-2 right-2 size-8 rounded-full bg-card/70 hover:bg-card/90 hover:cursor-pointer"
            onClick={() => setMuted(!muted)}
          >
            {muted ? (
              <VolumeOff className="size-4 text-white absolute fill-white" />
            ) : (
              <Volume2 className="size-4 text-white absolute fill-white" />
            )}
          </Button>
        </div>
      )
    }
    return null
  }

  return (
    <div key={post.id} className={cn('overflow-hidden shadow-sm', className)}>
      {/* Header */}
      <div
        className="p-4 pb-3 hover:cursor-pointer"
        onClick={() => navigate(`/${post.Author.username}`)}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className="size-8">
            <AvatarImage
              src={post.Author.Avatar?.url}
              alt={post.Author.name}
              className="object-cover"
            />
            <AvatarFallback className="text-md font-mono">
              {getInitials(post.Author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-x-2">
            <p className="font-semibold text-sm">{post.Author.username}</p>
            <p className="text-sm text-muted-foreground">
              {formatTimeDifference(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="px-4 pb-3 hover:cursor-pointer"
        onClick={() => navigate(`/p/${post.id}`)}
      >
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Assets */}
      {hasAssets && (
        <div className="w-full">
          {hasMultipleAssets ? (
            <Carousel className="w-full">
              <CarouselContent>
                {post.Assets!.map((asset) => (
                  <CarouselItem key={asset.id}>
                    <div className="w-full">{renderMedia(asset)}</div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="w-full">{renderMedia(post.Assets![0])}</div>
          )}
        </div>
      )}

      {!hasAssets && <Separator />}

      {/* Footer & Actions */}
      <div className="p-4 flex items-center justify-between">
        {/* Mobile comments drawer */}
        <CommentsDrawer
          className="md:hidden"
          comments={post.Comments}
          postId={post.id}
        />
        {/* Desktop comments */}
        <MessageCircle
          onClick={() => navigate(`/p/${post.id}`)}
          className="hidden md:block hover:cursor-pointer"
        />
        {/* Rourous */}
        <Rourous rourous={post.Reacts} />
      </div>
    </div>
  )
}

export default PostComponent
