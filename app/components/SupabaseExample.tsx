'use client'

import { useState } from 'react'
import { useAuth, useSupabaseQuery, useSupabaseMutation } from '../lib/useSupabase'
import { insertData, fetchData } from '../lib/database'

interface Post {
  id?: string
  title: string
  content: string
  created_at?: string
}

export default function SupabaseExample() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Example: Fetch posts
  const { data: posts, loading: postsLoading, refetch: refetchPosts } = useSupabaseQuery(
    () => fetchData<Post>('posts', { orderBy: { column: 'created_at', ascending: false } }),
    []
  )

  // Example: Create post mutation
  const { mutate: createPost, loading: createLoading } = useSupabaseMutation(
    async (postData: Omit<Post, 'id' | 'created_at'>) => {
      return await insertData<Post>('posts', postData)
    }
  )

  const handleAuth = async (isSignUp: boolean) => {
    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password)
    
    if (error) {
      alert(`Authentication error: ${error.message}`)
    }
  }

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content')
      return
    }

    const { error } = await createPost({ title, content })
    if (error) {
      alert(`Error creating post: ${error}`)
    } else {
      setTitle('')
      setContent('')
      refetchPosts()
    }
  }

  if (authLoading) {
    return <div className="p-4">Loading authentication...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Supabase Integration Example</h1>
      
      {/* Authentication Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        
        {user ? (
          <div className="space-y-4">
            <p>Welcome, {user.email}!</p>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-x-4">
              <button
                onClick={() => handleAuth(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuth(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts Section */}
      {user && (
        <div className="space-y-6">
          {/* Create Post Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Post content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleCreatePost}
                disabled={createLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {createLoading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            {postsLoading ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border p-4 rounded">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-gray-600 mt-2">{post.content}</p>
                    {post.created_at && (
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts found. Create your first post above!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
