# Supabase Integration Setup

This guide explains how to use the Supabase integration in your Alice project.

## What's Been Set Up

1. **Supabase Client** (`app/lib/supabase.ts`)
   - Configured with your environment variables
   - Includes TypeScript types for type safety
   - Error handling for missing environment variables

2. **Database Utilities** (`app/lib/database.ts`)
   - Generic CRUD operations (fetch, insert, update, delete)
   - File upload/delete functions for Supabase Storage
   - Comprehensive error handling

3. **React Hooks** (`app/lib/useSupabase.ts`)
   - `useAuth()` - Authentication state management
   - `useSupabaseQuery()` - Data fetching with loading states
   - `useSupabaseRecord()` - Single record operations
   - `useSupabaseMutation()` - Data mutations (create, update, delete)

4. **Example Component** (`app/components/SupabaseExample.tsx`)
   - Demonstrates authentication flow
   - Shows how to create and display posts
   - Includes loading states and error handling

## Environment Variables

The following environment variables have been configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uyqlxsfiilasvezyqjoc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cWx4c2ZpaWxhc3Zlenlxam9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mzk0NzAsImV4cCI6MjA2OTExNTQ3MH0.aWbPQcEbJ_go78s-7TqWCjL9NYdCiRWXxrbVwYRqdz8
```

## Usage Examples

### 1. Authentication

```tsx
import { useAuth } from '../lib/useSupabase'

function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={() => signIn('user@example.com', 'password')}>
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}
```

### 2. Fetching Data

```tsx
import { useSupabaseQuery } from '../lib/useSupabase'
import { fetchData } from '../lib/database'

interface Post {
  id: string
  title: string
  content: string
  created_at: string
}

function PostsList() {
  const { data: posts, loading, error, refetch } = useSupabaseQuery(
    () => fetchData<Post>('posts', {
      orderBy: { column: 'created_at', ascending: false },
      limit: 10
    }),
    []
  )

  if (loading) return <div>Loading posts...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}
```

### 3. Creating Data

```tsx
import { useSupabaseMutation } from '../lib/useSupabase'
import { insertData } from '../lib/database'

function CreatePost() {
  const { mutate: createPost, loading } = useSupabaseMutation(
    async (postData) => {
      return await insertData('posts', postData)
    }
  )

  const handleSubmit = async (formData) => {
    const { error } = await createPost({
      title: formData.title,
      content: formData.content
    })
    
    if (error) {
      console.error('Error creating post:', error)
    } else {
      // Success! Refresh the posts list
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Post title" />
      <textarea name="content" placeholder="Post content" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

### 4. File Upload

```tsx
import { uploadFile } from '../lib/database'

function FileUpload() {
  const handleFileUpload = async (file: File) => {
    const url = await uploadFile('my-bucket', `uploads/${file.name}`, file)
    if (url) {
      console.log('File uploaded:', url)
    }
  }

  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
      }}
    />
  )
}
```

## Database Schema

To use the example component, you'll need to create a `posts` table in your Supabase database:

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

## TypeScript Types

For better type safety, you can generate types from your Supabase database:

1. Install the Supabase CLI
2. Run: `supabase gen types typescript --project-id YOUR_PROJECT_ID > app/lib/database.types.ts`
3. Import and use the generated types in your components

## Next Steps

1. **Install Dependencies**: Run `pnpm install` to install the Supabase client
2. **Set Up Database**: Create the necessary tables in your Supabase dashboard
3. **Test Integration**: Use the example component to test the integration
4. **Customize**: Modify the types and functions to match your specific needs

## Security Notes

- The anon key is safe to use in client-side code
- Row Level Security (RLS) should be enabled on your tables
- Create appropriate policies for your use case
- Never expose service role keys in client-side code

## Troubleshooting

- **Environment variables not loading**: Make sure `.env.local` is in the root directory
- **Authentication errors**: Check that email confirmation is properly configured in Supabase
- **Database errors**: Verify your table schema and RLS policies
- **Type errors**: Generate and import the correct types from your Supabase project
