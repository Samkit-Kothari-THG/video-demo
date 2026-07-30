import {randomUUID} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {parseMedia} from '@remotion/media-parser';
import {NextRequest, NextResponse} from 'next/server';

export const runtime = 'nodejs';

const MAX_IMAGE_UPLOAD_SIZE = 5_000_000;
const MAX_AUDIO_UPLOAD_SIZE = 50_000_000;
const MAX_AUDIO_DURATION_SECONDS = 600;

const imageExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

type AudioExtension = 'mp3' | 'm4a' | 'wav';

const audioMimeExtensions: Record<string, AudioExtension> = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/wave': 'wav',
};

const getAudioExtensionFromName = (
  fileName: string,
): AudioExtension | null => {
  const extension = path.extname(fileName).toLowerCase().slice(1);
  return extension === 'mp3' || extension === 'm4a' || extension === 'wav'
    ? extension
    : null;
};

const getAudioExtensionFromBytes = (
  buffer: Buffer,
): AudioExtension | null => {
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WAVE'
  ) {
    return 'wav';
  }

  if (
    buffer.length >= 3 &&
    buffer.subarray(0, 3).toString('ascii') === 'ID3'
  ) {
    return 'mp3';
  }

  if (
    buffer.length >= 2 &&
    buffer[0] === 0xff &&
    (buffer[1] & 0xe0) === 0xe0
  ) {
    return 'mp3';
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(4, 8).toString('ascii') === 'ftyp'
  ) {
    return 'm4a';
  }

  return null;
};

const uploadImage = async (file: File) => {
  const extension = imageExtensions[file.type];
  if (!extension) {
    return NextResponse.json(
      {error: 'Use a JPG, PNG, or WebP image.'},
      {status: 415},
    );
  }
  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    return NextResponse.json(
      {error: 'Images must be 5 MB or smaller.'},
      {status: 413},
    );
  }

  const fileName = `${randomUUID()}.${extension}`;
  const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDirectory, {recursive: true});
  await writeFile(
    path.join(uploadsDirectory, fileName),
    Buffer.from(await file.arrayBuffer()),
  );
  const assetPath = `uploads/${fileName}`;
  return NextResponse.json({assetPath, url: `/${assetPath}`}, {status: 201});
};

const uploadAudio = async (file: File, rightsConfirmed: boolean) => {
  if (!rightsConfirmed) {
    return NextResponse.json(
      {error: 'Confirm that you have permission to use this music.'},
      {status: 400},
    );
  }
  if (file.size > MAX_AUDIO_UPLOAD_SIZE) {
    return NextResponse.json(
      {error: 'Music files must be 50 MB or smaller.'},
      {status: 413},
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const nameExtension = getAudioExtensionFromName(file.name);
  const mimeExtension = audioMimeExtensions[file.type] ?? null;
  const contentExtension = getAudioExtensionFromBytes(buffer);
  if (
    !nameExtension ||
    !contentExtension ||
    nameExtension !== contentExtension ||
    (mimeExtension && mimeExtension !== contentExtension)
  ) {
    return NextResponse.json(
      {error: 'Use a genuine MP3, M4A, or WAV audio file.'},
      {status: 415},
    );
  }

  let media: Awaited<ReturnType<typeof parseMedia>>;
  try {
    media = await parseMedia({
      src: new Blob([buffer]),
      fields: {
        audioCodec: true,
        container: true,
        durationInSeconds: true,
        tracks: true,
      },
      acknowledgeRemotionLicense: true,
    });
  } catch {
    return NextResponse.json(
      {error: 'This audio file could not be read. Try another MP3, M4A, or WAV.'},
      {status: 415},
    );
  }

  const hasAudio = media.tracks.some((track) => track.type === 'audio');
  const hasVideo = media.tracks.some((track) => track.type === 'video');
  const durationSeconds = media.durationInSeconds;
  if (!hasAudio || hasVideo || !media.audioCodec) {
    return NextResponse.json(
      {error: 'Choose an audio-only MP3, M4A, or WAV file.'},
      {status: 415},
    );
  }
  if (
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0 ||
    durationSeconds > MAX_AUDIO_DURATION_SECONDS
  ) {
    return NextResponse.json(
      {error: 'Choose music that is no longer than 10 minutes.'},
      {status: 422},
    );
  }

  const fileName = `${randomUUID()}.${contentExtension}`;
  const uploadsDirectory = path.join(
    process.cwd(),
    'public',
    'uploads',
    'audio',
  );
  await mkdir(uploadsDirectory, {recursive: true});
  await writeFile(path.join(uploadsDirectory, fileName), buffer);
  const assetPath = `uploads/audio/${fileName}`;
  return NextResponse.json(
    {
      assetPath,
      url: `/${assetPath}`,
      durationSeconds,
      originalName: path.basename(file.name),
    },
    {status: 201},
  );
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const kind = formData.get('kind') === 'audio' ? 'audio' : 'image';
    if (!(file instanceof File)) {
      return NextResponse.json(
        {error: kind === 'audio' ? 'Choose music to upload.' : 'Choose an image to upload.'},
        {status: 400},
      );
    }

    if (kind === 'audio') {
      return uploadAudio(file, formData.get('rightsConfirmed') === 'true');
    }

    return uploadImage(file);
  } catch {
    return NextResponse.json(
      {error: 'The file could not be uploaded.'},
      {status: 500},
    );
  }
}
