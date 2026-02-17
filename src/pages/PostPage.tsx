import CommentsSide from '@/components/Post/Comments/CommentsSide'
import Comments from '@/components/Post/Comments/components/Comments'
import PostComponent from '@/components/Post/Post'
import { useEndpoint } from '@/hooks/use-endpoint'
import fetchPost from '@/services/functions/post/fetch-post'
import type { Post } from '@/services/models/post/post'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PostPage = () => {
  const { id } = useParams()
  const ENDPOINT = useEndpoint()

  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchPost(ENDPOINT, id)
        .then((data) => {
          setPost(data)
          setError('')
          setLoading(false)
        })
        .catch((err: Error) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [id, ENDPOINT])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!post) return <div>Post not found</div>

  const comments = post.Comments || ([] as Post['Comments'])

  return (
    <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:max-w-4xl w-full">
      <section className="grid md:grid-cols-3 gap-4 md:border md:rounded-lg md:shadow-md max-h-[80vh] overflow-hidden">
        <PostComponent className="col-span-2" post={post} />
        <CommentsSide
          className="hidden md:block col-span-1 border-l"
          postId={post.id}
          comments={comments}
        />
      </section>
    </section>
  )
}

export default PostPage
