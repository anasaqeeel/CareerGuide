import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Post from './Post'
import PostSkeleton from '../skeletons/PostSkeleton'

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case 'forYou': return '/api/posts/all'
      case 'following': return '/api/posts/following'
      case 'posts': return `/api/posts/user/${username}`
      case 'likes': return `/api/posts/likes/${userId}`
      default: return '/api/posts/all'
    }
  }

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts', feedType, username, userId],
    queryFn: async () => {
      const res = await fetch(getPostEndpoint())
      if (!res.ok) {
        throw new Error('Failed to fetch posts')
      }
      return res.json()
    },
  })

  React.useEffect(() => {
    refetch()
  }, [feedType, refetch, username])

  if (isLoading || isRefetching) {
    return (
      <div className="space-y-4 animate-pulse">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-xl font-semibold">No posts to show</p>
        <p className="text-sm mt-2">Try switching tabs or follow some users 👻</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-800 m-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Posts