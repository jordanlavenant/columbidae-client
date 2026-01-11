import { useParams } from 'react-router-dom'

// TODO: This page appear when clicking on a post from the user page or feed page (modal views)

const PostPage = () => {
  const { id } = useParams()

  return <div>Post Page with postId: {id}</div>
}

export default PostPage
