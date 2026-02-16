import { Play, Volume2, VolumeOff } from 'lucide-react'
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
import { getInitials } from '@/lib/utils'
import { formatTimeDifference } from '@/lib/time'

const PostComponent = ({ post }: { post: Post }) => {
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
          className="w-full h-full object-cover rounded-xl"
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
    <div key={post.id} className="mb-4 overflow-hidden shadow-sm border-b">
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
            <div className="w-full aspect-square">
              {renderMedia(post.Assets![0])}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!hasAssets && <Separator />}
      <div className="px-4 py-3">
        <Rourous rourous={post.Reacts} />
      </div>

      {/* Comments */}
      {post.Comments.length > 0 && (
        <div className="px-4 py-3 border-t">
          <h3 className="text-sm font-semibold mb-2">
            Commentaires ({post.Comments.length})
          </h3>
          <div className="space-y-2">
            {post.Comments.map((com) => (
              <div key={com.id} className="text-sm">
                <span className="font-semibold">{com.Author.name}</span>
                <span className="ml-2 text-gray-700">{com.comment}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostComponent
