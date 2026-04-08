import { uploadFile, getFile, deleteFile, listFiles, getPresignedUploadUrl, getPresignedDownloadUrl, fileExists } from "../../utils/r2.js";

export async function handleR2Upload(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  if (request.method !== 'PUT' && request.method !== 'POST') {
    return Response.json({ 
      success: false, 
      message: "Only PUT or POST methods allowed." 
    }, { status: 405 });
  }

  const data = await request.arrayBuffer();
  const metadata = {
    content_type: request.headers.get('content-type') || 'application/octet-stream',
    uploaded_by: 'api'
  };

  const result = await uploadFile(env, key, data, metadata);
  
  if (result.success) {
    return Response.json(result, { status: 201 });
  } else {
    return Response.json(result, { status: 500 });
  }
}

export async function handleR2Download(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  const result = await getFile(env, key);
  
  if (result.success) {
    return new Response(result.data, {
      headers: {
        'Content-Type': result.metadata?.content_type || 'application/octet-stream',
        'ETag': result.etag,
        'Content-Length': result.size.toString()
      }
    });
  } else {
    return Response.json(result, { status: 404 });
  }
}

export async function handleR2Delete(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  const result = await deleteFile(env, key);
  
  if (result.success) {
    return Response.json(result);
  } else {
    return Response.json(result, { status: 500 });
  }
}

export async function handleR2List(request, env) {
  const url = new URL(request.url);
  const prefix = url.searchParams.get('prefix') || '';
  const limit = parseInt(url.searchParams.get('limit')) || 100;

  const result = await listFiles(env, prefix, limit);
  
  if (result.success) {
    return Response.json(result);
  } else {
    return Response.json(result, { status: 500 });
  }
}

export async function handleR2PresignedUpload(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const expiresIn = parseInt(url.searchParams.get('expiresIn')) || 3600;
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  const result = await getPresignedUploadUrl(env, key, expiresIn);
  
  if (result.success) {
    return Response.json(result);
  } else {
    return Response.json(result, { status: 500 });
  }
}

export async function handleR2PresignedDownload(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const expiresIn = parseInt(url.searchParams.get('expiresIn')) || 3600;
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  const result = await getPresignedDownloadUrl(env, key, expiresIn);
  
  if (result.success) {
    return Response.json(result);
  } else {
    return Response.json(result, { status: 500 });
  }
}

export async function handleR2Exists(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  
  if (!key) {
    return Response.json({ 
      success: false, 
      message: "File key is required." 
    }, { status: 400 });
  }

  const result = await fileExists(env, key);
  
  if (result.success) {
    return Response.json(result);
  } else {
    return Response.json(result, { status: 500 });
  }
}
