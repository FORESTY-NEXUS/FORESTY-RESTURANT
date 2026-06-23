import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { getSession, requireRoles } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { user, errorResponse } = await getSession(req);
    if (errorResponse) return errorResponse;

    const roleError = requireRoles(user, 'admin');
    if (roleError) return roleError;

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using promise wrapper around upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'foresty_menu' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
  }
}
