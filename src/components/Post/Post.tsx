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

const Post = ({
  post,
}: {
  post: {
    id: string
    content: string
    createdAt: string
    Author: {
      id: string
      name: string
      email: string
    }
    Assets?: {
      id: string
      url: string
      mimeType: string
    }[]
    Comments: {
      id: string
      comment: string
      postId: string
      Author: {
        id: string
        name: string
        email: string
      }
    }[]
  }
}) => {
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
          className="w-full h-full object-cover"
        />
      )
    } else if (asset.mimeType.startsWith('video/')) {
      return (
        <div className="relative">
          <video
            ref={videoRef}
            src={asset.url}
            className="w-full h-full object-cover"
            loop
            muted={muted}
            playsInline
            onClick={() => setPaused(true)}
          />
          {paused && (
            <div
              className="absolute inset-0 sizeb-8 flex justify-center items-center"
              onClick={() => setPaused(false)}
            >
              <Play className="size-16 text-white absolute fill-white" />
            </div>
          )}

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
    <div
      key={post.id}
      className="mb-4 border rounded-lg overflow-hidden bg-card shadow-sm max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {post.Author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm">{post.Author.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
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
                    <div className="w-full aspect-square bg-gray-100">
                      {renderMedia(asset)}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="w-full aspect-square bg-gray-100">
              {renderMedia(post.Assets![0])}
            </div>
          )}
        </div>
      )}

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

export default Post
