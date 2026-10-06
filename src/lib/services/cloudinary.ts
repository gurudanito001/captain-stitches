import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

// Configure Cloudinary from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'captain-stitches'
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (apiKey && apiSecret) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    })
}

/**
 * Returns true if real Cloudinary API credentials are provided.
 */
export function isCloudinaryConfigured(): boolean {
    return Boolean(apiKey && apiSecret && apiKey.trim() !== '' && apiSecret.trim() !== '')
}

export interface CloudinaryUploadOptions {
    folder?: string
    filename?: string
    tags?: string[]
    transformation?: any[]
    resourceType?: 'image' | 'video' | 'auto'
}

export interface CloudinaryUploadResult {
    success: boolean
    url?: string
    secureUrl?: string
    publicId?: string
    format?: string
    width?: number
    height?: number
    bytes?: number
    isSimulated?: boolean
    error?: string
}

/**
 * Uploads an image or video to Cloudinary with automatic fallback
 * when API keys are pending configuration.
 */
export async function uploadImageToCloudinary(
    fileDataUriOrPath: string,
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
    try {
        const folder = `captain-stitches/${options.folder || 'general'}`
        const resourceType = options.resourceType || 'auto'

        if (isCloudinaryConfigured()) {
            const uploadParams: any = {
                folder,
                resource_type: resourceType,
                tags: options.tags || ['captain-stitches', 'atelier'],
            }

            if (options.filename) {
                // Remove file extension for public_id
                uploadParams.public_id = options.filename.replace(/\.[^/.]+$/, '')
            }

            if (options.transformation) {
                uploadParams.transformation = options.transformation
            }

            const res: UploadApiResponse = await cloudinary.uploader.upload(fileDataUriOrPath, uploadParams)

            return {
                success: true,
                url: res.url,
                secureUrl: res.secure_url,
                publicId: res.public_id,
                format: res.format,
                width: res.width,
                height: res.height,
                bytes: res.bytes,
                isSimulated: false,
            }
        }

        // Graceful Simulated CDN Fallback (Dev/Testing/Offline)
        const sanitizedFilename = (options.filename || `asset-${Date.now()}`)
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-')
        const publicId = `${folder}/${sanitizedFilename}`
        const simulatedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v${Date.now()}/${publicId}.jpg`

        // If file data URI was provided, preserve it for instant client preview if needed,
        // or return the simulated Cloudinary CDN URL.
        const returnedUrl = fileDataUriOrPath.startsWith('data:') && fileDataUriOrPath.length < 500000
            ? fileDataUriOrPath
            : simulatedUrl

        console.info(`[Cloudinary Service] Upload simulated -> ${simulatedUrl} (Configure CLOUDINARY_API_KEY in .env for live Cloudinary uploads)`)

        return {
            success: true,
            url: returnedUrl,
            secureUrl: returnedUrl,
            publicId,
            format: 'jpg',
            width: 1200,
            height: 1600,
            bytes: fileDataUriOrPath.length,
            isSimulated: true,
        }
    } catch (error: any) {
        console.error('[Cloudinary Service] Upload error:', error)
        return {
            success: false,
            error: error.message || 'Failed to upload media to Cloudinary',
        }
    }
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 */
export async function deleteImageFromCloudinary(
    publicId: string,
    resourceType: 'image' | 'video' = 'image'
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!isCloudinaryConfigured()) {
            return { success: true }
        }

        const res = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        })

        return { success: res.result === 'ok' || res.result === 'not found' }
    } catch (error: any) {
        console.error('[Cloudinary Service] Delete error:', error)
        return { success: false, error: error.message || 'Failed to delete asset from Cloudinary' }
    }
}

/**
 * Helper to construct responsive and optimized image URLs using Cloudinary transforms.
 */
export function getOptimizedCloudinaryUrl(
    urlOrPublicId: string,
    options: { width?: number; height?: number; quality?: string | number; crop?: string } = {}
): string {
    if (!urlOrPublicId) return ''

    // If it's already an absolute URL not from Cloudinary, return as-is
    if (urlOrPublicId.startsWith('http') && !urlOrPublicId.includes('res.cloudinary.com')) {
        return urlOrPublicId
    }

    if (urlOrPublicId.startsWith('data:')) {
        return urlOrPublicId
    }

    const { width, height, quality = 'auto', crop = 'fill' } = options
    const transforms: string[] = [`f_auto`, `q_${quality}`]

    if (width) transforms.push(`w_${width}`)
    if (height) transforms.push(`h_${height}`)
    if (width && height) transforms.push(`c_${crop}`)

    const transformStr = transforms.join(',')

    if (urlOrPublicId.includes('/upload/')) {
        return urlOrPublicId.replace('/upload/', `/upload/${transformStr}/`)
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${urlOrPublicId}`
}
