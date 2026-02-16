import UserProfile from '@/components/User/User'
import { useEndpoint } from '@/hooks/use-endpoint'
import fetchUser from '@/services/functions/user/fetch-user'
import type { User } from '@/services/models/user/user'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const UserPage = () => {
  const { username } = useParams()
  const ENDPOINT = useEndpoint()

  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (username) {
      fetchUser(ENDPOINT, username)
        .then((data) => {
          setUser(data)
          setError('')
          setLoading(false)
        })
        .catch((err: Error) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [username, ENDPOINT])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>

  return <UserProfile user={user} />
}

export default UserPage
