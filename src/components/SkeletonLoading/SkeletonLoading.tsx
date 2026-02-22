import { Skeleton } from '../ui/skeleton'

const SkeletonLoading = () => {
  return (
    <section className="p-4 space-y-4 mx-auto max-w-md">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-40 w-full" />
    </section>
  )
}

export default SkeletonLoading
