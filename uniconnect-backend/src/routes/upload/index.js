import { uploadFile } from "../../utils/r2.js";

export async function handleUpload(request, env) {
  const url = new URL(request.url);
  
  // Only allow POST method for upload
  if (request.method !== 'POST') {
    return Response.json({ 
      success: false, 
      message: "Only POST method allowed for uploads." 
    }, { status: 405 });
  }

  try {
    // Get form data for file upload
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ 
        success: false, 
        message: "No file provided." 
      }, { status: 400 });
    }

    // Generate unique file key
    const timestamp = Date.now();
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();
    const uniqueKey = `uploads/${timestamp}_${fileName}`;

    // Get file data as ArrayBuffer
    const fileData = await file.arrayBuffer();

    // Prepare metadata
    const metadata = {
      original_name: fileName,
      content_type: file.type || 'application/octet-stream',
      size: file.size,
      uploaded_at: new Date().toISOString()
    };

    // Upload to R2
    const result = await uploadFile(env, uniqueKey, fileData, metadata);

    if (result.success) {
      return Response.json({
        success: true,
        message: "File uploaded successfully.",
        data: {
          key: result.key,
          original_name: fileName,
          size: file.size,
          content_type: file.type,
          uploaded_at: metadata.uploaded_at,
          download_url: `https://backend.uniconnectmmu.workers.dev/download/${uniqueKey}`
        }
      }, { status: 201 });
    } else {
      return Response.json({
        success: false,
        message: "Upload failed.",
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({
      success: false,
      message: "Upload failed.",
      error: error.message
    }, { status: 500 });
  }
}
