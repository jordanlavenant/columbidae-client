import PostComponent from '@/components/Post/Post'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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

  return (
    <section className="max-w-2xl mx-auto">
      <PostComponent post={post} />
    </section>
  )
}

export default PostPage
