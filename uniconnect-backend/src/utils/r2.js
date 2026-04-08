/**
 * R2 Storage Utility Functions for UniConnect
 */

/**
 * Upload file to R2 bucket
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} key - File key/path in bucket
 * @param {ArrayBuffer} data - File data
 * @param {Object} metadata - Optional metadata
 * @returns {Promise<Object>} Upload result
 */
export async function uploadFile(env, key, data, metadata = {}) {
  try {
    const result = await env.R2.put(key, data, {
      customMetadata: {
        ...metadata,
        uploaded_at: new Date().toISOString()
      }
    });
    
    return {
      success: true,
      key: result.key,
      etag: result.etag,
      size: result.size
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get file from R2 bucket
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} key - File key/path in bucket
 * @returns {Promise<Object>} File data
 */
export async function getFile(env, key) {
  try {
    const object = await env.R2.get(key);
    
    if (!object) {
      return {
        success: false,
        error: "File not found"
      };
    }

    return {
      success: true,
      data: await object.arrayBuffer(),
      metadata: object.customMetadata,
      etag: object.etag,
      size: object.size
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete file from R2 bucket
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} key - File key/path in bucket
 * @returns {Promise<Object>} Delete result
 */
export async function deleteFile(env, key) {
  try {
    await env.R2.delete(key);
    
    return {
      success: true,
      message: "File deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List files in R2 bucket
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} prefix - Optional prefix to filter files
 * @param {number} limit - Maximum number of files to return
 * @returns {Promise<Object>} List of files
 */
export async function listFiles(env, prefix = '', limit = 100) {
  try {
    const result = await env.R2.list({
      prefix,
      limit
    });
    
    return {
      success: true,
      files: result.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        etag: obj.etag,
        lastModified: obj.uploaded,
        metadata: obj.customMetadata
      }))
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate presigned URL for file upload
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} key - File key/path in bucket
 * @param {number} expiresIn - URL expiration in seconds (default: 3600)
 * @returns {Promise<Object>} Presigned URL
 */
export async function getPresignedUploadUrl(env, key, expiresIn = 3600) {
  try {
    const url = await env.R2.presignedUrl({
      method: 'PUT',
      key,
      expiresIn
    });
    
    return {
      success: true,
      url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate presigned URL for file download
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} key - File key/path in bucket
 * @param {number} expiresIn - URL expiration in seconds (default: 3600)
 * @returns {Promise<Object>} Presigned URL
 */
export async function getPresignedDownloadUrl(env, key, expiresIn = 3600) {
  try {
    const url = await env.R2.presignedUrl({
      method: 'GET',
      key,
      expiresIn
    });
    
    return {
      success: true,
      url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if file exists in R2 bucket
 * @param {Object} env - Worker environment with R2 binding
 * @param {string} key - File key/path in bucket
 * @returns {Promise<Object>} Existence check result
 */
export async function fileExists(env, key) {
  try {
    const object = await env.R2.head(key);
    
    return {
      success: true,
      exists: !!object,
      size: object?.size || 0,
      etag: object?.etag || null
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      exists: false
    };
  }
}
