import { generateToken } from "../../utils/crypto.js";

// Allowed file types for profile pictures
const ALLOWED_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg', 
  'image/png': '.png',
  'image/webp': '.webp',
  'image/heic': '.heic'
};

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadProfilePicture(request, env) {
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

    // Get user details
    const user = await env.DB.prepare(
      `SELECT id FROM users WHERE id = ?`
    ).bind(session.user_id).first();

    if (!user) {
      return Response.json({ 
        success: false, 
        message: "User not found." 
      }, { status: 404 });
    }

    // Handle file upload
    const contentType = request.headers.get('Content-Type');
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle multipart form data
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file) {
        return Response.json({ 
          success: false, 
          message: "No file provided." 
        }, { status: 400 });
      }

      // Validate file type
      const fileType = file.type;
      if (!ALLOWED_FILE_TYPES[fileType]) {
        return Response.json({ 
          success: false, 
          message: `Invalid file type. Allowed types: ${Object.values(ALLOWED_FILE_TYPES).join(', ')}` 
        }, { status: 400 });
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return Response.json({ 
          success: false, 
          message: "File too large. Maximum size is 5MB." 
        }, { status: 400 });
      }

      // Generate unique filename
      const fileExtension = ALLOWED_FILE_TYPES[fileType];
      const uniqueFilename = `${user.id}_${Date.now()}_${generateToken(8)}${fileExtension}`;
      const objectKey = `users/${user.id}/profile/${uniqueFilename}`;

      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      const uploadResult = await env.R2.put(objectKey, arrayBuffer, {
        httpMetadata: {
          contentType: fileType,
        },
        customMetadata: {
          userId: user.id.toString(),
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      });

      if (!uploadResult) {
        return Response.json({ 
          success: false, 
          message: "Failed to upload file to storage." 
        }, { status: 500 });
      }

      // Get public URL (using backend URL)
      const publicUrl = `https://backend.uniconnectmmu.workers.dev/download/${objectKey}`;

      // Update user's profile picture URL in database
      await env.DB.prepare(
        `UPDATE users SET profile_picture_url = ? WHERE id = ?`
      ).bind(publicUrl, user.id).run();

      return Response.json({
        success: true,
        message: "Profile picture uploaded successfully.",
        data: {
          url: publicUrl,
          filename: uniqueFilename,
          size: file.size,
          type: fileType
        }
      });

    } else {
      // Handle direct binary upload
      const contentLength = request.headers.get('Content-Length');
      const fileType = request.headers.get('Content-Type');

      if (!contentLength || parseInt(contentLength) > MAX_FILE_SIZE) {
        return Response.json({ 
          success: false, 
          message: "File too large. Maximum size is 5MB." 
        }, { status: 400 });
      }

      if (!ALLOWED_FILE_TYPES[fileType]) {
        return Response.json({ 
          success: false, 
          message: `Invalid file type. Allowed types: ${Object.values(ALLOWED_FILE_TYPES).join(', ')}` 
        }, { status: 400 });
      }

      // Generate unique filename
      const fileExtension = ALLOWED_FILE_TYPES[fileType];
      const uniqueFilename = `${user.id}_${Date.now()}_${generateToken(8)}${fileExtension}`;
      const objectKey = `users/${user.id}/profile/${uniqueFilename}`;

      // Upload to R2
      const arrayBuffer = await request.arrayBuffer();
      const uploadResult = await env.R2.put(objectKey, arrayBuffer, {
        httpMetadata: {
          contentType: fileType,
        },
        customMetadata: {
          userId: user.id.toString(),
          uploadedAt: new Date().toISOString()
        }
      });

      if (!uploadResult) {
        return Response.json({ 
          success: false, 
          message: "Failed to upload file to storage." 
        }, { status: 500 });
      }

      // Get public URL
      const publicUrl = `https://backend.uniconnectmmu.workers.dev/download/${objectKey}`;

      // Update user's profile picture URL in database
      await env.DB.prepare(
        `UPDATE users SET profile_picture_url = ? WHERE id = ?`
      ).bind(publicUrl, user.id).run();

      return Response.json({
        success: true,
        message: "Profile picture uploaded successfully.",
        data: {
          url: publicUrl,
          filename: uniqueFilename,
          size: parseInt(contentLength),
          type: fileType
        }
      });
    }

  } catch (error) {
    console.error('Profile picture upload error:', error);
    return Response.json({ 
      success: false, 
      message: "Internal server error." 
    }, { status: 500 });
  }
}

export async function getProfilePicture(request, env, url) {
  try {
    let userId;

    // Check if this is /users/me/profile endpoint
    if (url.pathname === "/users/me/profile") {
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

      userId = session.user_id;
    } else {
      // Extract user ID from URL path /users/:id/profile
      const pathSegments = url.pathname.split('/');
      userId = pathSegments[pathSegments.length - 2]; // Get ID from /users/:id/profile

      if (!userId) {
        return Response.json({ 
          success: false, 
          message: "User ID required." 
        }, { status: 400 });
      }
    }

    // Get user's profile picture URL from database
    const user = await env.DB.prepare(
      `SELECT profile_picture_url FROM users WHERE id = ?`
    ).bind(userId).first();

    if (!user || !user.profile_picture_url) {
      return Response.json({ 
        success: false, 
        message: "Profile picture not found." 
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: {
        url: user.profile_picture_url
      }
    });

  } catch (error) {
    console.error('Get profile picture error:', error);
    return Response.json({ 
      success: false, 
      message: "Internal server error." 
    }, { status: 500 });
  }
}
