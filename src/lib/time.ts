export function formatTimeDifference(date: string): string {
  const now = new Date()
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 1000
  )

  if (diffInSeconds < 60) {
    return `Il y a ${diffInSeconds} seconde${diffInSeconds !== 1 ? 's' : ''}`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours !== 1 ? 's' : ''}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `Il y a ${diffInDays} jour${diffInDays !== 1 ? 's' : ''}`
}
