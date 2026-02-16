import AccountEdit from '@/components/AccountEdit/AccountEdit'
import { useAuth } from '@/hooks/use-auth'
import { useEndpoint } from '@/hooks/use-endpoint'
import { fetchUserAccount } from '@/services/functions/user/fetch-user-account'
import type { User } from '@/services/models/user/user'
import { useEffect, useState } from 'react'

const AccountEditPage = () => {
  const ENDPOINT = useEndpoint()
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <div>Please log in to edit your account.</div>
  }

  const currentUserId = currentUser?.id

  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAccount(ENDPOINT, currentUserId)
      .then((data) => {
        setUser(data)
        setError('')
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [ENDPOINT])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>

  return <AccountEdit user={user} />
}

export default AccountEditPage
