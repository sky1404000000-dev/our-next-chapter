import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isLocalAdminEnabled } from '@/lib/localAdmin';

export const runtime = 'nodejs';

const extensionByMime: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

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

    const relativeDirectory = kind === 'gallery' ? 'images/gallery' : 'images/guide/places';
    const fileName = `${kind}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    const destinationDirectory = path.join(process.cwd(), 'public', relativeDirectory);
    const destination = path.join(destinationDirectory, fileName);
    await fs.mkdir(destinationDirectory, { recursive: true });
    await fs.writeFile(destination, Buffer.from(await file.arrayBuffer()));

    return Response.json({ image: `/${relativeDirectory.replaceAll('\\', '/')}/${fileName}` });
  } catch (error) {
    console.error(error);
    return Response.json({ message: '사진 업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
