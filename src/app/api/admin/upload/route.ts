import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { isLocalAdminEnabled } from '@/lib/localAdmin';

export const runtime = 'nodejs';

const execFileAsync = promisify(execFile);

const extensionByMime: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

const webpConvertibleMimeTypes = new Set(['image/jpeg', 'image/png']);

function readJpegSize(source: Buffer) {
  let offset = 2;

  while (offset < source.length) {
    if (source[offset] !== 0xff) return null;

    const marker = source[offset + 1];
    const length = source.readUInt16BE(offset + 2);
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        width: source.readUInt16BE(offset + 7),
        height: source.readUInt16BE(offset + 5)
      };
    }

    offset += 2 + length;
  }

  return null;
}

function readPngSize(source: Buffer) {
  const pngSignature = '89504e470d0a1a0a';
  if (source.subarray(0, 8).toString('hex') !== pngSignature) return null;

  return {
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20)
  };
}

function readWebpSize(source: Buffer) {
  for (let offset = 12; offset + 8 <= source.length;) {
    const type = source.toString('ascii', offset, offset + 4);
    const length = source.readUInt32LE(offset + 4);
    const payloadOffset = offset + 8;

    if (type === 'VP8X') {
      return {
        width: 1 + source.readUIntLE(payloadOffset + 4, 3),
        height: 1 + source.readUIntLE(payloadOffset + 7, 3)
      };
    }

    if (type === 'VP8 ') {
      return {
        width: source.readUInt16LE(payloadOffset + 6) & 0x3fff,
        height: source.readUInt16LE(payloadOffset + 8) & 0x3fff
      };
    }

    if (type === 'VP8L') {
      const bits = source.readUInt32LE(payloadOffset + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1
      };
    }

    offset = payloadOffset + length + (length % 2);
  }

  return null;
}

function readImageSize(source: Buffer, mimeType: string) {
  if (mimeType === 'image/jpeg') return readJpegSize(source);
  if (mimeType === 'image/png') return readPngSize(source);
  if (mimeType === 'image/webp') return readWebpSize(source);
  return null;
}

async function convertToWebp(source: Buffer, extension: string, destination: string) {
  const tempSource = path.join(os.tmpdir(), `wedding-upload-${randomUUID()}.${extension}`);

  await fs.writeFile(tempSource, source);

  try {
    await execFileAsync('cwebp', ['-q', '95', '-m', '6', tempSource, '-o', destination], {
      windowsHide: true
    });
  } finally {
    await fs.rm(tempSource, { force: true });
  }
}

export async function POST(request: Request) {
  if (!isLocalAdminEnabled()) {
    return Response.json({ message: '로컬 개발 환경에서만 사용할 수 있습니다.' }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const kind = formData.get('kind');

    if (!(file instanceof File) || (kind !== 'gallery' && kind !== 'guide')) {
      return Response.json({ message: '사진과 저장 위치를 확인해주세요.' }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return Response.json({ message: '사진은 한 장당 20MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
    }

    const extension = extensionByMime[file.type];
    if (!extension) {
      return Response.json({ message: 'JPG, PNG, WEBP, GIF 사진만 사용할 수 있습니다.' }, { status: 400 });
    }

    const shouldConvertToWebp = webpConvertibleMimeTypes.has(file.type);
    const relativeDirectory = kind === 'gallery' ? 'images/gallery' : 'images/guide/places';
    const fileExtension = shouldConvertToWebp ? 'webp' : extension;
    const fileName = `${kind}-${Date.now()}-${randomUUID().slice(0, 8)}.${fileExtension}`;
    const destinationDirectory = path.join(process.cwd(), 'public', relativeDirectory);
    const destination = path.join(destinationDirectory, fileName);
    const sourceBuffer = Buffer.from(await file.arrayBuffer());
    const imageSize = readImageSize(sourceBuffer, file.type);

    await fs.mkdir(destinationDirectory, { recursive: true });

    if (shouldConvertToWebp) {
      try {
        await convertToWebp(sourceBuffer, extension, destination);
      } catch (error) {
        console.warn('WebP 변환에 실패하여 원본 형식으로 저장합니다.', error);
        const fallbackFileName = fileName.replace(/\.webp$/, `.${extension}`);
        const fallbackDestination = path.join(destinationDirectory, fallbackFileName);
        await fs.writeFile(fallbackDestination, sourceBuffer);

        return Response.json({
          image: `/${relativeDirectory.replaceAll('\\', '/')}/${fallbackFileName}`,
          width: imageSize?.width,
          height: imageSize?.height
        });
      }
    } else {
      await fs.writeFile(destination, sourceBuffer);
    }

    return Response.json({
      image: `/${relativeDirectory.replaceAll('\\', '/')}/${fileName}`,
      width: imageSize?.width,
      height: imageSize?.height
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: '사진 업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
