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

    await fs.mkdir(destinationDirectory, { recursive: true });

    if (shouldConvertToWebp) {
      try {
        await convertToWebp(sourceBuffer, extension, destination);
      } catch (error) {
        console.warn('WebP 변환에 실패하여 원본 형식으로 저장합니다.', error);
        const fallbackFileName = fileName.replace(/\.webp$/, `.${extension}`);
        const fallbackDestination = path.join(destinationDirectory, fallbackFileName);
        await fs.writeFile(fallbackDestination, sourceBuffer);

        return Response.json({ image: `/${relativeDirectory.replaceAll('\\', '/')}/${fallbackFileName}` });
      }
    } else {
      await fs.writeFile(destination, sourceBuffer);
    }

    return Response.json({ image: `/${relativeDirectory.replaceAll('\\', '/')}/${fileName}` });
  } catch (error) {
    console.error(error);
    return Response.json({ message: '사진 업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
