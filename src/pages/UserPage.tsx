import { useParams } from 'react-router-dom'

// TODO: if its our own user page, show edit profile button, settings, etc. (view useAuth in the future ^^)

const UserPage = () => {
  const { username } = useParams()

  return <div>User Page with username: {username}</div>
}

export default UserPage
