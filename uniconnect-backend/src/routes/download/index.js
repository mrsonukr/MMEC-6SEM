import { getFile } from "../../utils/r2.js";

export async function handleDownload(request, env) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const key = pathParts.slice(2).join('/'); // Remove /download/ from path
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  try {
    const result = await getFile(env, key);
    
    if (result.success) {
      return new Response(result.data, {
        headers: {
          'Content-Type': result.metadata?.content_type || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${result.metadata?.original_name || 'file'}"`,
          'Content-Length': result.size.toString(),
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    } else {
      return Response.json({
        success: false,
        message: "File not found.",
        error: result.error
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Download error:', error);
    return Response.json({
      success: false,
      message: "Download failed.",
      error: error.message
    }, { status: 500 });
  }
}
