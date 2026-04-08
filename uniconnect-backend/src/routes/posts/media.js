import { uploadFile } from "../../utils/r2.js";
import { generateToken } from "../../utils/crypto.js";

// Allowed file types - Images only
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/heic': '.heic'
};

// File size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// File count limits
const MAX_IMAGES = 10;

function validateFileType(fileType) {
  return ALLOWED_IMAGE_TYPES[fileType] !== undefined;
}

function getFileExtension(fileType) {
  return ALLOWED_IMAGE_TYPES[fileType];
}

function validateFileSize(fileSize) {
  return fileSize <= MAX_IMAGE_SIZE;
}

export async function uploadPostMedia(request, env) {
  try {
    // Get user from session
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ 
        success: false, 
        message: "Authentication required." 
      }, { status: 401 });
    }

    const session_id = authHeader.substring(7);
    
    // Get user from session
    const session = await env.DB.prepare(
      `SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`
    ).bind(session_id).first();

    if (!session) {
      return Response.json({ 
        success: false, 
        message: "Invalid or expired session." 
      }, { status: 401 });
    }

    // Handle multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return Response.json({ 
        success: false, 
        message: "No files provided." 
      }, { status: 400 });
    }

    // Validate files
    const mediaUrls = [];
    let imageCount = 0;

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const isImage = file.type.startsWith('image/');

      if (!isImage) {
        return Response.json({ 
          success: false, 
          message: `Invalid file type: ${file.type}. Only images are allowed.` 
        }, { status: 400 });
      }

      // Validate file type
      if (!validateFileType(file.type)) {
        return Response.json({ 
          success: false, 
          message: `Unsupported image type: ${file.type}. Allowed types: JPG, JPEG, PNG, WEBP, HEIC` 
        }, { status: 400 });
      }

      // Validate file size
      if (!validateFileSize(file.size)) {
        return Response.json({ 
          success: false, 
          message: `File too large: ${file.name}. Maximum size is 5MB.` 
        }, { status: 400 });
      }

      imageCount++;
      if (imageCount > MAX_IMAGES) {
        return Response.json({ 
          success: false, 
          message: `Maximum ${MAX_IMAGES} images allowed.` 
        }, { status: 400 });
      }
    }

    // Upload files to R2
    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Upload file to R2
      const timestamp = Date.now();
      const randomString = generateToken(8);
      const fileExtension = getFileExtension(file.type);
      const filename = `${timestamp}_${randomString}${fileExtension}`;
      
      // Store in post/media/ folder
      const objectKey = `post/media/${filename}`;

      const fileData = await file.arrayBuffer();
      console.log('Uploading file:', objectKey, 'Size:', fileData.byteLength);
      
      const uploadResult = await uploadFile(env, objectKey, fileData, {
        original_name: file.name,
        content_type: file.type,
        uploaded_by: session.user_id,
        is_temp: 'false'
      });

      console.log('Upload result:', uploadResult);

      if (!uploadResult.success) {
        return Response.json({ 
          success: false, 
          message: "Failed to upload file to storage.", 
          error: uploadResult.error 
        }, { status: 500 });
      }

      // Add download URL
      const downloadUrl = `https://backend.uniconnectmmu.workers.dev/download/${objectKey}`;
      mediaUrls.push(downloadUrl);
    }

    // Determine media type based on count
    const mediaType = imageCount > 1 ? 'images' : 'image';

    return Response.json({
      success: true,
      message: "Media uploaded successfully.",
      data: {
        media_type: mediaType,
        media_urls: mediaUrls,
        file_count: mediaUrls.length
      }
    });

  } catch (error) {
    console.error('Post media upload error:', error);
    return Response.json({ 
      success: false, 
      message: "Internal server error." 
    }, { status: 500 });
  }
}
