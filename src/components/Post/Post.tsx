const Post = ({
  post,
}: {
  post: {
    id: string
    title: string
    content: string
    Author: {
      id: string
      name: string
      email: string
    }
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
  return (
    <div key={post.id} className="mb-4 p-2 border rounded">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="mb-2">{post.content}</p>
      <p className="text-sm text-gray-500">
        Author: {post.Author.name} (ID: {post.Author.id})
      </p>
      {post.Comments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Comments:</h3>
          <ul>
            {post.Comments.map((com) => (
              <li key={com.id} className="mb-1">
                {com.comment} (Author: {com.Author.name} - ID: {com.Author.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Post
