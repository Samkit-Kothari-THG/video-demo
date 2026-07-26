import {randomUUID} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {NextRequest, NextResponse} from 'next/server';

export const runtime = 'nodejs';

const MAX_UPLOAD_SIZE = 5_000_000;
const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({error: 'Choose an image to upload.'}, {status: 400});
    }

    const extension = extensions[file.type];
    if (!extension) {
      return NextResponse.json({error: 'Use a JPG, PNG, or WebP image.'}, {status: 415});
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({error: 'Images must be 5 MB or smaller.'}, {status: 413});
    }

    const fileName = `${randomUUID()}.${extension}`;
    const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDirectory, {recursive: true});
    await writeFile(path.join(uploadsDirectory, fileName), Buffer.from(await file.arrayBuffer()));
    const assetPath = `uploads/${fileName}`;
    return NextResponse.json({assetPath, url: `/${assetPath}`}, {status: 201});
  } catch {
    return NextResponse.json({error: 'The image could not be uploaded.'}, {status: 500});
  }
}
