import { createClient } from "./client"

export interface UploadResult {
  url: string
  path: string
  error?: string
}

/**
 * Check if storage buckets exist and are accessible
 */
export async function checkStorageBuckets(): Promise<{ exists: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error("[v0] Error listing buckets:", error)
      return { exists: false, error: error.message }
    }

    const furnitureModelsBucket = buckets?.find((b) => b.id === "furniture-models")
    const furnitureImagesBucket = buckets?.find((b) => b.id === "furniture-images")

    if (!furnitureModelsBucket || !furnitureImagesBucket) {
      console.error("[v0] Missing storage buckets:", {
        furnitureModels: !!furnitureModelsBucket,
        furnitureImages: !!furnitureImagesBucket,
      })
      return {
        exists: false,
        error: "Storage buckets not found. Please run the setup-storage-buckets.sql script.",
      }
    }

    console.log(
      "[v0] Storage buckets verified:",
      buckets.map((b) => b.id),
    )
    return { exists: true }
  } catch (error) {
    console.error("[v0] Unexpected error checking buckets:", error)
    return { exists: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns Object containing the public URL and storage path
 */
export async function uploadFile(
  file: File,
  bucket: "furniture-models" | "furniture-images",
  folder?: string,
): Promise<UploadResult> {
  try {
    console.log("[v0] ===== FILE UPLOAD START =====")
    console.log("[v0] File details:", {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileType: file.type,
      bucket,
      folder,
    })

    const supabase = createClient()

    // Check if buckets exist first
    const bucketCheck = await checkStorageBuckets()
    if (!bucketCheck.exists) {
      console.error("[v0] Storage buckets not configured:", bucketCheck.error)
      return {
        url: "",
        path: "",
        error: `Storage not configured: ${bucketCheck.error}`,
      }
    }

    // Generate unique filename with timestamp
    const fileExt = file.name.split(".").pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}-${randomStr}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    console.log("[v0] Uploading to path:", filePath)
    console.log("[v0] Upload starting...")

    // Upload file to storage
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("[v0] ===== UPLOAD FAILED =====")
      console.error("[v0] Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      })
      return {
        url: "",
        path: "",
        error: `Upload failed: ${error.message}`,
      }
    }

    console.log("[v0] Upload successful!")
    console.log("[v0] Upload data:", data)
    console.log("[v0] Getting public URL...")

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    console.log("[v0] ===== UPLOAD COMPLETE =====")
    console.log("[v0] Public URL:", publicUrl)
    console.log("[v0] Storage path:", data.path)

    return {
      url: publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error("[v0] ===== UNEXPECTED ERROR =====")
    console.error("[v0] Error:", error)
    return {
      url: "",
      path: "",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path - The storage path of the file to delete
 * @param bucket - The storage bucket name
 */
export async function deleteFile(path: string, bucket: "furniture-models" | "furniture-images"): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("[v0] Delete error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Unexpected error during delete:", error)
    return false
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 */
export async function uploadMultipleFiles(
  files: File[],
  bucket: "furniture-models" | "furniture-images",
  folder?: string,
): Promise<UploadResult[]> {
  console.log("[v0] Uploading multiple files:", files.length)
  const uploadPromises = files.map((file) => uploadFile(file, bucket, folder))
  return Promise.all(uploadPromises)
}
