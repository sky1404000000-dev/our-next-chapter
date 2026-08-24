import { promises as fs } from 'node:fs';
import {
  galleryDataPath,
  guideDataPath,
  isGalleryData,
  isGuideData,
  isLocalAdminEnabled,
  removeUnusedImages,
  writeJson
} from '@/lib/localAdmin';

export const runtime = 'nodejs';

function unavailable() {
  return Response.json({ message: '로컬 개발 환경에서만 사용할 수 있습니다.' }, { status: 404 });
}

export async function GET() {
  if (!isLocalAdminEnabled()) return unavailable();

  const [gallerySource, guideSource] = await Promise.all([
    fs.readFile(galleryDataPath, 'utf8'),
    fs.readFile(guideDataPath, 'utf8')
  ]);

  return Response.json({
    gallery: JSON.parse(gallerySource),
    guide: JSON.parse(guideSource)
  });
}

export async function PUT(request: Request) {
  if (!isLocalAdminEnabled()) return unavailable();

  try {
    const body = await request.json() as Record<string, unknown>;
    if (!isGalleryData(body.gallery) || !isGuideData(body.guide)) {
      return Response.json({ message: '저장할 데이터 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const incompletePlace = body.guide
      .flatMap((folder) => folder.items)
      .find((item) => !item.title.trim() || !item.image.trim() || !item.description.trim());
    if (incompletePlace) {
      return Response.json({ message: '장소 이름, 사진, 설명은 모두 입력해주세요.' }, { status: 400 });
    }

    if (body.gallery.some((item) => !item.image.trim())) {
      return Response.json({ message: '갤러리 사진 경로가 비어 있습니다.' }, { status: 400 });
    }

    await Promise.all([
      writeJson(galleryDataPath, body.gallery),
      writeJson(guideDataPath, body.guide)
    ]);

    const usedImages = new Set([
      ...body.gallery.map((item) => item.image),
      ...body.guide.flatMap((folder) => folder.items.map((item) => item.image))
    ]);
    const deletedImages = Array.isArray(body.deletedImages)
      ? body.deletedImages.filter((item): item is string => typeof item === 'string')
      : [];
    await removeUnusedImages(deletedImages, usedImages);

    return Response.json({ message: '프로젝트 파일에 저장했습니다.' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
