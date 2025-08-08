import { supabase } from './supabase'

// Generic error handler
const handleError = (error: any, operation: string) => {
  console.error(`Database ${operation} error:`, error)
  throw new Error(`Failed to ${operation}: ${error.message}`)
}

// Generic fetch function
export async function fetchData<T>(
  table: string,
  options?: {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
): Promise<T[]> {
  try {
    let query = supabase.from(table).select(options?.select || '*')

    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      })
    }

    // Apply limit
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return (data as T[]) || []
  } catch (error) {
    handleError(error, `fetch from ${table}`)
    return [] as T[]
  }
}

// Generic insert function
export async function insertData<T>(
  table: string,
  data: Partial<T>
): Promise<T | null> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result
  } catch (error) {
    handleError(error, `insert into ${table}`)
    return null
  }
}

// Generic update function
export async function updateData<T>(
  table: string,
  id: string | number,
  data: Partial<T>
): Promise<T | null> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return result
  } catch (error) {
    handleError(error, `update in ${table}`)
    return null
  }
}

// Generic delete function
export async function deleteData(
  table: string,
  id: string | number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    handleError(error, `delete from ${table}`)
    return false
  }
}

// Get single record by ID
export async function getById<T>(
  table: string,
  id: string | number
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, `get by id from ${table}`)
    return null
  }
}

// Upload file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    handleError(error, 'upload file')
    return null
  }
}

// Delete file from Supabase Storage
export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    handleError(error, 'delete file')
    return false
  }
}
