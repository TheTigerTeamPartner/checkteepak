import { supabase } from "./supabase"

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string
    contentType?: string
    upsert?: boolean
  },
) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: options?.cacheControl || "3600",
      upsert: options?.upsert || false,
      contentType: options?.contentType || file.type,
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function deleteFile(bucket: string, paths: string[]) {
  try {
    const { data, error } = await supabase.storage.from(bucket).remove(paths)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}

export async function createSignedUrl(bucket: string, path: string, expiresIn = 3600) {
  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Helper function to upload multiple files
export async function uploadMultipleFiles(
  bucket: string,
  files: { path: string; file: File }[],
  options?: {
    cacheControl?: string
    upsert?: boolean
  },
) {
  try {
    const uploadPromises = files.map(({ path, file }) =>
      uploadFile(bucket, path, file, {
        ...options,
        contentType: file.type,
      }),
    )

    const results = await Promise.all(uploadPromises)

    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      throw new Error(`Failed to upload ${errors.length} files`)
    }

    return {
      data: results.map((result) => result.data).filter(Boolean),
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}
