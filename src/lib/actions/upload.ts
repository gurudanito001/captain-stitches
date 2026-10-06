'use server'

import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    CloudinaryUploadResult,
    isCloudinaryConfigured,
} from '@/lib/services/cloudinary'

export interface UploadActionResult {
    success: boolean
    url?: string
    publicId?: string
    isSimulated?: boolean
    error?: string
}

/**
 * Server action to upload an image from FormData (e.g. from an HTML file input).
 */
export async function uploadMediaAction(
    formData: FormData,
    folder: string = 'general'
): Promise<UploadActionResult> {
    try {
        const file = formData.get('file') as File | null
        if (!file) {
            return { success: false, error: 'No file provided in form data' }
        }

        // Validate size (max 20MB for images, max 60MB for videos)
        const isVideo = file.type.startsWith('video/')
        const maxSize = isVideo ? 60 * 1024 * 1024 : 20 * 1024 * 1024

        if (file.size > maxSize) {
            return {
                success: false,
                error: `File exceeds maximum allowed size of ${isVideo ? '60MB' : '20MB'}`,
            }
        }

        // Validate mime type
        const allowedImageTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/heic',
            'image/heif',
        ]
        const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm']

        if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
            return {
                success: false,
                error: `Unsupported file format (${file.type}). Allowed formats: JPG, PNG, WEBP, HEIC, MP4, MOV.`,
            }
        }

        // Convert File to Base64 data URI for Cloudinary upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

        const uploadResult: CloudinaryUploadResult = await uploadImageToCloudinary(base64Data, {
            folder,
            filename: file.name,
            resourceType: isVideo ? 'video' : 'image',
        })

        if (!uploadResult.success) {
            return {
                success: false,
                error: uploadResult.error || 'Failed to upload media to Cloudinary',
            }
        }

        return {
            success: true,
            url: uploadResult.secureUrl || uploadResult.url,
            publicId: uploadResult.publicId,
            isSimulated: uploadResult.isSimulated,
        }
    } catch (err: any) {
        console.error('Error in uploadMediaAction:', err)
        return {
            success: false,
            error: err.message || 'Server error while processing media upload',
        }
    }
}

/**
 * Server action to upload base64 data string directly to Cloudinary.
 */
export async function uploadMediaBase64Action(params: {
    base64: string
    filename?: string
    folder?: string
    resourceType?: 'image' | 'video' | 'auto'
}): Promise<UploadActionResult> {
    try {
        const { base64, filename, folder = 'general', resourceType = 'auto' } = params

        if (!base64 || typeof base64 !== 'string') {
            return { success: false, error: 'Valid base64 data string is required' }
        }

        const uploadResult = await uploadImageToCloudinary(base64, {
            folder,
            filename,
            resourceType,
        })

        if (!uploadResult.success) {
            return {
                success: false,
                error: uploadResult.error || 'Failed to upload to Cloudinary',
            }
        }

        return {
            success: true,
            url: uploadResult.secureUrl || uploadResult.url,
            publicId: uploadResult.publicId,
            isSimulated: uploadResult.isSimulated,
        }
    } catch (err: any) {
        console.error('Error in uploadMediaBase64Action:', err)
        return { success: false, error: err.message || 'Server error uploading base64 media' }
    }
}

/**
 * Server action to delete an image from Cloudinary.
 */
export async function deleteMediaAction(
    publicId: string,
    resourceType: 'image' | 'video' = 'image'
): Promise<{ success: boolean; error?: string }> {
    return deleteImageFromCloudinary(publicId, resourceType)
}

/**
 * Check if live Cloudinary is enabled.
 */
export async function getCloudinaryStatusAction(): Promise<{
    configured: boolean
    cloudName: string
}> {
    return {
        configured: isCloudinaryConfigured(),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'captain-stitches',
    }
}
