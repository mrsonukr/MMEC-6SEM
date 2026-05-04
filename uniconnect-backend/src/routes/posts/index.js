function getInsertedPostId(meta) {
  return meta?.last_row_id ?? meta?.last_rowid ?? null;
}

const PUBLIC_POST_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MEDIA_TYPES_WITH_MEDIA = ["image", "images", "video", "videos"];

function generatePublicPostId(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let value = "";
  for (const b of bytes) {
    value += PUBLIC_POST_ID_CHARS[b % PUBLIC_POST_ID_CHARS.length];
  }
  return value;
}

function normalizeMediaType(mediaType) {
  return mediaType || "text";
}

function serializePost(post) {
  return {
    post_id: post.post_id,
    caption: post.caption,
    media_type: normalizeMediaType(post.media_type),
    media_urls: post.media_urls ? JSON.parse(post.media_urls) : [],
    is_private: !!post.is_private,
    author: {
      id: post.user_id_ref,
      username: post.username,
      full_name: post.full_name
    },
    created_at: formatIndianTime(post.created_at),
    updated_at: formatIndianTime(post.updated_at)
  };
}

// Helper function to format timestamp in Indian timezone
function formatIndianTime(timestamp) {
  const date = new Date(timestamp);
  // Convert to IST (UTC+5:30)
  const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  return istTime.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);
}

// Enhanced serialize function for feed with complete author info
function serializeFeedPost(post) {
  return {
    post_id: post.post_id,
    caption: post.caption,
    media_type: normalizeMediaType(post.media_type),
    media_urls: post.media_urls ? JSON.parse(post.media_urls) : [],
    is_private: !!post.is_private,
    author: {
      id: post.user_id_ref,
      username: post.username,
      full_name: post.full_name,
      profile_picture_url: post.profile_picture_url || null
    },
    created_at: formatIndianTime(post.created_at),
    updated_at: formatIndianTime(post.updated_at)
  };
}

export async function handlePosts(request, env, url, method) {
  // Get user from session for authentication
  const authHeader = request.headers.get('Authorization');
  let currentUser = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const session_id = authHeader.substring(7);
    
    const session = await env.DB.prepare(
      `SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`
    ).bind(session_id).first();

    if (session) {
      currentUser = await env.DB.prepare(
        `SELECT id, username, full_name FROM users WHERE id = ?`
      ).bind(session.user_id).first();
    }
  }

  // CREATE post
  if (url.pathname === "/posts" && method === "POST") {
    if (!currentUser) {
      return Response.json({ 
        success: false, 
        message: "Authentication required." 
      }, { status: 401 });
    }

    const body = await request.json();
    const { caption, media_type, media_urls, is_private } = body;

    // Validation: at least caption or media_urls required
    if (!caption && (!media_urls || media_urls.length === 0)) {
      return Response.json({ 
        success: false, 
        message: "Either caption or media is required." 
      }, { status: 400 });
    }

    const hasMedia = Array.isArray(media_urls) && media_urls.length > 0;

    // If media_urls provided, media_type is required
    if (hasMedia && !media_type) {
      return Response.json({ 
        success: false, 
        message: "Media type is required when media is provided." 
      }, { status: 400 });
    }

    // Validate media_urls are R2 URLs, not base64 data
    if (hasMedia) {
      for (const url of media_urls) {
        if (typeof url !== 'string' || url.startsWith('data:')) {
          return Response.json({ 
            success: false, 
            message: "Media URLs must be R2 URLs, not base64 data. Please upload media first using /posts/media/upload endpoint." 
          }, { status: 400 });
        }
      }
    }

    // Validate media_type
    if (media_type && !MEDIA_TYPES_WITH_MEDIA.includes(media_type)) {
      return Response.json({ 
        success: false, 
        message: "Invalid media type. Must be: image, images, video, or videos." 
      }, { status: 400 });
    }

    const normalizedMediaType = hasMedia ? media_type : "text";
    const normalizedMediaUrls = hasMedia ? JSON.stringify(media_urls) : null;

    let publicPostId = null;
    let inserted = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      publicPostId = generatePublicPostId(8);
      inserted = await env.DB.prepare(`
        INSERT INTO posts (user_id_ref, caption, media_type, media_urls, is_private, post_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        currentUser.id,
        caption || null,
        normalizedMediaType,
        normalizedMediaUrls,
        is_private ? 1 : 0,
        publicPostId
      ).run().catch((error) => {
        if (String(error?.message || "").toLowerCase().includes("unique")) {
          return null;
        }
        throw error;
      });

      if (inserted) break;
    }

    if (!inserted) {
      return Response.json({ success: false, message: "Failed to generate unique post ID." }, { status: 500 });
    }

    // Get the created post with author info
    const createdPostId = getInsertedPostId(inserted.meta);
    if (!createdPostId) {
      return Response.json({ success: false, message: "Failed to create post." }, { status: 500 });
    }

    const post = await env.DB.prepare(`
      SELECT p.*, u.username, u.full_name
      FROM posts p
      JOIN users u ON p.user_id_ref = u.id
      WHERE p.id = ?
    `).bind(createdPostId).first();

    return Response.json({
      success: true,
      message: "Post created successfully.",
      data: serializePost(post)
    }, { status: 201 });
  }

  // GET feed (Instagram-like feed from mutual connections)
  if (url.pathname === "/feed" && method === "GET") {
    if (!currentUser) {
      return Response.json({ 
        success: false, 
        message: "Authentication required." 
      }, { status: 401 });
    }

    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // Get mutual connections (users who follow each other)
    const mutualConnectionsQuery = `
      SELECT DISTINCT c1.following_id as user_id
      FROM connections c1
      JOIN connections c2
        ON c1.follower_id = c2.following_id
       AND c1.following_id = c2.follower_id
      WHERE c1.follower_id = ?
    `;
    
    const mutualConnections = await env.DB.prepare(mutualConnectionsQuery)
      .bind(currentUser.id)
      .all();
    
    const mutualConnectionIds = (mutualConnections.results || []).map(c => c.user_id);
    
    // Only show posts from mutual connections, not own posts
    const allUserIds = mutualConnectionIds;
    
    // If no connections and no own posts, return empty feed
    if (allUserIds.length === 0) {
      return Response.json({
        success: true,
        data: {
          posts: [],
          pagination: {
            page,
            limit,
            total: 0,
            has_next: false
          }
        }
      });
    }

    // Build placeholders for IN clause
    const placeholders = allUserIds.map(() => '?').join(',');
    
    // Get total count of posts from mutual connections and own posts
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM posts p 
      WHERE p.deleted_at IS NULL 
        AND p.is_private = 0
        AND p.user_id_ref IN (${placeholders})
    `;
    
    const countResult = await env.DB.prepare(countQuery)
      .bind(...allUserIds)
      .first();
    const total = countResult.total;

    // Get posts with author info including profile picture
    const postsQuery = `
      SELECT 
        p.*,
        u.username,
        u.full_name,
        u.profile_picture_url
      FROM posts p
      JOIN users u ON p.user_id_ref = u.id
      WHERE p.deleted_at IS NULL 
        AND p.is_private = 0
        AND p.user_id_ref IN (${placeholders})
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const postsResult = await env.DB.prepare(postsQuery)
      .bind(...allUserIds, limit, offset)
      .all();
    const posts = postsResult.results || [];

    // Format posts for response
    const formattedPosts = posts.map((post) => serializeFeedPost(post));

    return Response.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total,
          has_next: offset + limit < total
        }
      }
    });
  }

  // GET all posts
  if (url.pathname === "/posts" && method === "GET") {
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const media_type = url.searchParams.get('media_type');
    const is_private = url.searchParams.get('is_private');
    const user_id = url.searchParams.get('user_id');
    const offset = (page - 1) * limit;

    let whereClause = "WHERE p.deleted_at IS NULL";
    let params = [];

    // User filtering logic
    if (user_id) {
      // If user_id provided, require authentication
      if (!currentUser) {
        return Response.json({ 
          success: false, 
          message: "Authentication required to view user-specific posts." 
        }, { status: 401 });
      }
      
      // If user_id matches current user, show all posts (including private)
      // If user_id is different, only show public posts
      if (user_id === currentUser.id.toString()) {
        whereClause += " AND p.user_id_ref = ?";
      } else {
        whereClause += " AND p.user_id_ref = ? AND p.is_private = 0";
      }
      params.push(user_id);
    } else {
      // No user_id provided - show only public posts (no private posts for anyone)
      whereClause += " AND p.is_private = 0";
    }

    if (media_type) {
      whereClause += " AND p.media_type = ?";
      params.push(media_type);
    }

    if (is_private !== null && is_private !== undefined) {
      // For is_private filter, only allow if user_id is provided and matches current user
      if (!user_id || (currentUser && user_id !== currentUser.id.toString())) {
        return Response.json({ 
          success: false, 
          message: "Privacy filter only allowed for your own posts." 
        }, { status: 403 });
      }
      whereClause += " AND p.is_private = ?";
      params.push(is_private === 'true' ? 1 : 0);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM posts p ${whereClause}`;
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult.total;

    // Get posts with pagination
    const postsQuery = `
      SELECT p.*, u.username, u.full_name
      FROM posts p
      JOIN users u ON p.user_id_ref = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const postsResult = await env.DB.prepare(postsQuery)
      .bind(...params, limit, offset)
      .all();
    const posts = postsResult.results || [];

    // Format posts for response
    const formattedPosts = posts.map((post) => serializePost(post));

    return Response.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total,
          has_next: offset + limit < total
        }
      }
    });
  }

  // GET single post
  if (url.pathname.startsWith("/posts/") && method === "GET") {
    const postId = url.pathname.split("/")[2];

    if (!postId) {
      return Response.json({ 
        success: false, 
        message: "Invalid post ID." 
      }, { status: 400 });
    }

    const post = await env.DB.prepare(`
      SELECT p.*, u.username, u.full_name
      FROM posts p
      JOIN users u ON p.user_id_ref = u.id
      WHERE p.post_id = ? AND p.deleted_at IS NULL
    `).bind(postId).first();

    if (!post) {
      return Response.json({ 
        success: false, 
        message: "Post not found." 
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: serializePost(post)
    });
  }

  // UPDATE post
  if (url.pathname.startsWith("/posts/") && method === "PUT") {
    if (!currentUser) {
      return Response.json({ 
        success: false, 
        message: "Authentication required." 
      }, { status: 401 });
    }

    const postId = url.pathname.split("/")[2];

    if (!postId) {
      return Response.json({ 
        success: false, 
        message: "Invalid post ID." 
      }, { status: 400 });
    }

    // Check if post exists and user is the author (excluding deleted posts)
    const existingPost = await env.DB.prepare(
      `SELECT id, user_id_ref FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!existingPost) {
      return Response.json({ 
        success: false, 
        message: "Post not found." 
      }, { status: 404 });
    }

    if (existingPost.user_id_ref !== currentUser.id) {
      return Response.json({ 
        success: false, 
        message: "You can only edit your own posts." 
      }, { status: 403 });
    }

    const body = await request.json();
    const { caption, media_type, media_urls, is_private } = body;

    // Validation: at least caption or media_urls required
    if (!caption && (!media_urls || media_urls.length === 0)) {
      return Response.json({ 
        success: false, 
        message: "Either caption or media is required." 
      }, { status: 400 });
    }

    // If media_urls provided, media_type is required
    if (media_urls && media_urls.length > 0 && !media_type) {
      return Response.json({ 
        success: false, 
        message: "Media type is required when media is provided." 
      }, { status: 400 });
    }

    // Validate media_type
    if (media_type && !MEDIA_TYPES_WITH_MEDIA.includes(media_type)) {
      return Response.json({ 
        success: false, 
        message: "Invalid media type. Must be: image, images, video, or videos." 
      }, { status: 400 });
    }

    if (media_urls && media_urls.length > 0) {
      for (const url of media_urls) {
        if (typeof url !== 'string' || url.startsWith('data:')) {
          return Response.json({
            success: false,
            message: "Media URLs must be R2 URLs, not base64 data. Please upload media first using /posts/media/upload endpoint."
          }, { status: 400 });
        }
      }
    }

    const currentPost = await env.DB.prepare(
      `SELECT caption, media_type, media_urls, is_private FROM posts WHERE id = ?`
    ).bind(existingPost.id).first();

    const nextHasMedia = media_urls !== undefined
      ? (Array.isArray(media_urls) && media_urls.length > 0)
      : !!currentPost.media_urls;

    const nextCaption = caption !== undefined ? (caption || null) : currentPost.caption;
    const nextMediaType = nextHasMedia
      ? (media_type !== undefined ? (media_type || null) : currentPost.media_type)
      : "text";
    const nextMediaUrls = media_urls !== undefined
      ? (media_urls && media_urls.length > 0 ? JSON.stringify(media_urls) : null)
      : currentPost.media_urls;
    const nextIsPrivate = is_private !== undefined ? (is_private ? 1 : 0) : currentPost.is_private;

    // Update post
    await env.DB.prepare(`
      UPDATE posts 
      SET caption = ?, media_type = ?, media_urls = ?, is_private = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      nextCaption,
      nextMediaType,
      nextMediaUrls,
      nextIsPrivate,
      existingPost.id
    ).run();

    // Get updated post
    const updatedPost = await env.DB.prepare(`
      SELECT p.*, u.username, u.full_name
      FROM posts p
      JOIN users u ON p.user_id_ref = u.id
      WHERE p.id = ?
    `).bind(existingPost.id).first();

    return Response.json({
      success: true,
      message: "Post updated successfully.",
      data: serializePost(updatedPost)
    });
  }

  // DELETE post
  if (url.pathname.startsWith("/posts/") && method === "DELETE") {
    if (!currentUser) {
      return Response.json({ 
        success: false, 
        message: "Authentication required." 
      }, { status: 401 });
    }

    const postId = url.pathname.split("/")[2];

    if (!postId) {
      return Response.json({ 
        success: false, 
        message: "Invalid post ID." 
      }, { status: 400 });
    }

    // Check if post exists and user is the author (excluding deleted posts)
    const existingPost = await env.DB.prepare(
      `SELECT id, user_id_ref FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!existingPost) {
      return Response.json({ 
        success: false, 
        message: "Post not found." 
      }, { status: 404 });
    }

    if (existingPost.user_id_ref !== currentUser.id) {
      return Response.json({ 
        success: false, 
        message: "You can only delete your own posts." 
      }, { status: 403 });
    }

    // Soft delete: Set deleted_at timestamp instead of actually deleting
    await env.DB.prepare(`UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(existingPost.id).run();

    return Response.json({
      success: true,
      message: "Post deleted successfully."
    });
  }

  return null;
}
