export type StoryItem = {
  date: string;
  title: string;
  description: string;
  image?: string;
};

export type GalleryItem = {
  image: string;
  caption: string;
  description: string;
  alt: string;
};

export type AccountPerson = {
  relation: string;
  bank: string;
  number: string;
  holder: string;
};

export type AccountGroup = {
  side: string;
  people: AccountPerson[];
};

export type PohangTip = {
  label: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  feature?: string;
};

export type CalendarDay = {
  date: number;
  currentMonth: boolean;
};

export type InterviewQuestion = {
  question: string;
  answer: string;
  image?: string;
  imageAlt?: string;
};

export type AboutPerson = {
  role: string;
  name: string;
  parents: string;
  birth: string;
  note: string;
  image: string;
  imageAlt: string;
};

export const weddingData = {
  metadata: {
    title: '은진 & 동균 결혼식에 초대합니다',
    description: '2026년 10월 10일 포항 더퀸에서 은진과 동균이 결혼합니다.',
    ogImage: '/images/og-image.svg'
  },

  music: {
    src: '/audio/wedding.mp3',
    title: 'wedding music'
  },

  hero: {
    image: '/images/main.png',
    video: '/video/hero.mp4',
    introVideo: '',
    names: '은진 & 동균',
    dateLabel: '2026.10.10 토요일 오후 12:30',
    timeLabel: '포항 더퀸 (구 UA 컨벤션)',
    message: '친구에서 연인으로, 연인에서 부부로'
  },

  intro: {
    eyebrow: 'THANK YOU',
    title: '감사합니다',
    message: '소중한 마음으로\n저희의 시작을 함께해 주세요.'
  },

  invitation: {
    title: '초대합니다',
    image: '/images/invite.png',
    imageAlt: '은진과 동균의 초대 사진',
    message:
      '대학교에서 만나\n친구에서 연인으로,\n이제는 부부로 새로운 장을 시작합니다.\n소중한 분들을 초대합니다.'
  },

  calendar: {
    date: '2026-10-10T12:30:00+09:00',
    displayDate: '2026. 10. 10',
    displayTime: '토요일 오후 12시 30분',
    coupleLabel: '은진 ♥ 동균',
    days: [
      { date: 27, currentMonth: false },
      { date: 28, currentMonth: false },
      { date: 29, currentMonth: false },
      { date: 30, currentMonth: false },
      { date: 1, currentMonth: true },
      { date: 2, currentMonth: true },
      { date: 3, currentMonth: true },
      { date: 4, currentMonth: true },
      { date: 5, currentMonth: true },
      { date: 6, currentMonth: true },
      { date: 7, currentMonth: true },
      { date: 8, currentMonth: true },
      { date: 9, currentMonth: true },
      { date: 10, currentMonth: true },
      { date: 11, currentMonth: true },
      { date: 12, currentMonth: true },
      { date: 13, currentMonth: true },
      { date: 14, currentMonth: true },
      { date: 15, currentMonth: true },
      { date: 16, currentMonth: true },
      { date: 17, currentMonth: true },
      { date: 18, currentMonth: true },
      { date: 19, currentMonth: true },
      { date: 20, currentMonth: true },
      { date: 21, currentMonth: true },
      { date: 22, currentMonth: true },
      { date: 23, currentMonth: true },
      { date: 24, currentMonth: true },
      { date: 25, currentMonth: true },
      { date: 26, currentMonth: true },
      { date: 27, currentMonth: true },
      { date: 28, currentMonth: true },
      { date: 29, currentMonth: true },
      { date: 30, currentMonth: true },
      { date: 31, currentMonth: true }
    ] as CalendarDay[]
  },

  story: {
    title: '우리의 이야기',
    kicker: 'INTERVIEW',
    intro: '결혼을 앞두고 저희 두 사람의 인터뷰를 준비했습니다.',
    coverImage: '/images/1.png',
    coverAlt: '은진과 동균의 인터뷰 사진',
    buttonLabel: '신랑 & 신부의 인터뷰 읽어보기',
    questions: [
      {
        question: 'Q1. 신랑 신부를 소개해주세요',
        answer:
          '신랑 동균은 조용하지만 마음이 깊고, 맡은 일에는 끝까지 책임을 다하는 사람입니다.\n신부 은진은 밝은 에너지로 주변을 환하게 만들고, 작은 순간도 소중하게 기억하는 사람입니다.\n서로 다른 듯 닮은 두 사람이 이제 같은 방향을 바라보려 합니다.',
        image: '/images/donggyun.png',
        imageAlt: '신랑 신부 소개 사진'
      },
      {
        question: 'Q2. 두 분은 어떻게 만나게 되었나요?',
        answer:
          '서로의 이름도 몰랐던 어느 날, 지인의 모임에서 처음 마주 앉았습니다.\n처음엔 가벼운 대화로 시작했지만 시간이 지날수록 편안함이 쌓였고, 자연스럽게 연락이 이어졌습니다.',
        image: '/images/2.png',
        imageAlt: '처음 만난 날을 떠올리는 사진'
      },
      {
        question: 'Q3. 결혼을 결심한 순간은 언제인가요?',
        answer:
          '특별한 한순간보다 함께 보낸 평범한 날들이 답이 되었습니다.\n기쁜 날에도 힘든 날에도 가장 먼저 떠오르는 사람이 서로였고, 앞으로의 계절도 함께 건너고 싶다는 마음이 자연스럽게 들었습니다.',
        image: '/images/3.png',
        imageAlt: '결혼을 결심한 순간의 사진'
      }
    ] as InterviewQuestion[],
    items: [
      {
        date: '2019.11.03',
        title: '우리가 처음 만난 날',
        description:
          '가을 햇살이 따스했던 그날, 캠퍼스에서 처음 마주 앉았습니다.\n서로의 이야기에 귀 기울이며 우리의 계절이 조용히 시작되었습니다.',
        image: '/images/gallery-1.svg'
      },
      {
        date: '함께한 시간',
        title: '친구에서 연인으로',
        description:
          '익숙한 하루 끝에서 가장 편안한 사람, 가장 소중한 사람이 되었습니다.\n서로의 일상을 천천히 채워가며 같은 방향을 바라보게 되었습니다.',
        image: '/images/gallery-2.svg'
      },
      {
        date: '2026.10.10',
        title: '우리의 결혼식',
        description:
          '포항 더퀸에서 부부라는 이름으로 우리의 다음 이야기를 시작합니다.\n기쁜 날, 소중한 분들과 함께하고 싶습니다.',
        image: '/images/gallery-3.svg'
      }
    ] as StoryItem[]
  },

  gallery: {
    title: '우리의 순간들',
    initialCount: 4,
    items: [
      {
        image: '/images/1.png',
        caption: '처음처럼 다정하게',
        description: '처음 만난 날의 설렘처럼, 서로를 바라보는 마음을 오래 간직하고 싶습니다.',
        alt: '은진과 동균의 추억 사진 1'
      },
      {
        image: '/images/2.png',
        caption: '편안한 하루',
        description: '가장 평범한 하루도 함께라서 오래 기억하고 싶은 장면이 되었습니다.',
        alt: '은진과 동균의 추억 사진 2'
      },
      {
        image: '/images/3.png',
        caption: '같은 방향',
        description: '서로의 속도에 맞춰 걸으며 같은 내일을 약속합니다.',
        alt: '은진과 동균의 추억 사진 3'
      },
      {
        image: '/images/4.png',
        caption: '웃음이 닮아가는 우리',
        description: '함께 웃는 시간이 많아질수록 우리의 마음도 조금씩 더 닮아갔습니다.',
        alt: '은진과 동균의 추억 사진 4'
      },
      {
        image: '/images/5.png',
        caption: '계절을 건너',
        description: '여러 계절을 지나며 쌓인 마음으로 이제 새로운 계절을 시작합니다.',
        alt: '은진과 동균의 추억 사진 5'
      },
   {
        image: '/images/1.png',
        caption: '처음처럼 다정하게',
        description: '처음 만난 날의 설렘처럼, 서로를 바라보는 마음을 오래 간직하고 싶습니다.',
        alt: '은진과 동균의 추억 사진 1'
      },
      {
        image: '/images/2.png',
        caption: '편안한 하루',
        description: '가장 평범한 하루도 함께라서 오래 기억하고 싶은 장면이 되었습니다.',
        alt: '은진과 동균의 추억 사진 2'
      },
      {
        image: '/images/3.png',
        caption: '같은 방향',
        description: '서로의 속도에 맞춰 걸으며 같은 내일을 약속합니다.',
        alt: '은진과 동균의 추억 사진 3'
      },
      {
        image: '/images/4.png',
        caption: '웃음이 닮아가는 우리',
        description: '함께 웃는 시간이 많아질수록 우리의 마음도 조금씩 더 닮아갔습니다.',
        alt: '은진과 동균의 추억 사진 4'
      },
      {
        image: '/images/5.png',
        caption: '계절을 건너',
        description: '여러 계절을 지나며 쌓인 마음으로 이제 새로운 계절을 시작합니다.',
        alt: '은진과 동균의 추억 사진 5'
      },
        {
        image: '/images/1.png',
        caption: '처음처럼 다정하게',
        description: '처음 만난 날의 설렘처럼, 서로를 바라보는 마음을 오래 간직하고 싶습니다.',
        alt: '은진과 동균의 추억 사진 1'
      },
      {
        image: '/images/2.png',
        caption: '편안한 하루',
        description: '가장 평범한 하루도 함께라서 오래 기억하고 싶은 장면이 되었습니다.',
        alt: '은진과 동균의 추억 사진 2'
      },
      {
        image: '/images/3.png',
        caption: '같은 방향',
        description: '서로의 속도에 맞춰 걸으며 같은 내일을 약속합니다.',
        alt: '은진과 동균의 추억 사진 3'
      },
      {
        image: '/images/4.png',
        caption: '웃음이 닮아가는 우리',
        description: '함께 웃는 시간이 많아질수록 우리의 마음도 조금씩 더 닮아갔습니다.',
        alt: '은진과 동균의 추억 사진 4'
      },
      {
        image: '/images/5.png',
        caption: '계절을 건너',
        description: '여러 계절을 지나며 쌓인 마음으로 이제 새로운 계절을 시작합니다.',
        alt: '은진과 동균의 추억 사진 5'
      },
        {
        image: '/images/1.png',
        caption: '처음처럼 다정하게',
        description: '처음 만난 날의 설렘처럼, 서로를 바라보는 마음을 오래 간직하고 싶습니다.',
        alt: '은진과 동균의 추억 사진 1'
      },
      {
        image: '/images/2.png',
        caption: '편안한 하루',
        description: '가장 평범한 하루도 함께라서 오래 기억하고 싶은 장면이 되었습니다.',
        alt: '은진과 동균의 추억 사진 2'
      },
      {
        image: '/images/3.png',
        caption: '같은 방향',
        description: '서로의 속도에 맞춰 걸으며 같은 내일을 약속합니다.',
        alt: '은진과 동균의 추억 사진 3'
      },
      {
        image: '/images/4.png',
        caption: '웃음이 닮아가는 우리',
        description: '함께 웃는 시간이 많아질수록 우리의 마음도 조금씩 더 닮아갔습니다.',
        alt: '은진과 동균의 추억 사진 4'
      },
      {
        image: '/images/5.png',
        caption: '계절을 건너',
        description: '여러 계절을 지나며 쌓인 마음으로 이제 새로운 계절을 시작합니다.',
        alt: '은진과 동균의 추억 사진 5'
      },
        {
        image: '/images/1.png',
        caption: '처음처럼 다정하게',
        description: '처음 만난 날의 설렘처럼, 서로를 바라보는 마음을 오래 간직하고 싶습니다.',
        alt: '은진과 동균의 추억 사진 1'
      },
      {
        image: '/images/2.png',
        caption: '편안한 하루',
        description: '가장 평범한 하루도 함께라서 오래 기억하고 싶은 장면이 되었습니다.',
        alt: '은진과 동균의 추억 사진 2'
      },
      {
        image: '/images/3.png',
        caption: '같은 방향',
        description: '서로의 속도에 맞춰 걸으며 같은 내일을 약속합니다.',
        alt: '은진과 동균의 추억 사진 3'
      },
      {
        image: '/images/4.png',
        caption: '웃음이 닮아가는 우리',
        description: '함께 웃는 시간이 많아질수록 우리의 마음도 조금씩 더 닮아갔습니다.',
        alt: '은진과 동균의 추억 사진 4'
      },
      {
        image: '/images/5.png',
        caption: '계절을 건너',
        description: '여러 계절을 지나며 쌓인 마음으로 이제 새로운 계절을 시작합니다.',
        alt: '은진과 동균의 추억 사진 5'
      },
    ] as GalleryItem[]
  },

  weddingInfo: {
    title: '예식 안내',
    date: '2026.10.10 토요일',
    time: '오후 12:30',
    venue: '포항 더퀸',
    venueSub: '구 UA 컨벤션',
    address: '경북 포항시 남구 대이로 18'
  },

  location: {
    title: '오시는 길',
    mapImage: '/images/pohang.png',
    mapAlt: '포항 더퀸 주변 지도',
    mapDescription: '포항 더퀸',
    phone: 'Tel. 054-283-1111',
    coordinates: {
       lat: 36.0174244,
       lng: 129.3437087
    },
    links: {
      kakao: 'https://map.kakao.com/link/search/포항 더퀸',
      naver: 'https://map.naver.com/p/search/포항%20더퀸'
    },
    parking:
      '건물 내 주차 가능 / 하객 무료 주차 안내 예정\n기사님께 포항 더퀸(구 UA 컨벤션)으로 말씀해 주세요.\n포항 시내 주요 노선 이용 후 이동 가능합니다.'
  },

  aboutUs: {
    kicker: 'ABOUT US',
    title: '저희 커플을 소개합니다',
    subtitle: '하나로 이어진 두개의 우주',
    people: [
      {
        role: '신랑',
        name: '김동균',
        parents: '김응국 · 이남순의 아들',
        birth: '1997년 2월 광양 출생',
        note: '호기심 많은 손재주 왕 📽',
        image: '/images/donggyun.png',
        imageAlt: '신랑 동균 어린 시절 사진'
      },
      {
        role: '신부',
        name: '김은진',
        parents: '김창성 · 이춘희의 딸',
        birth: '1998년 9월 속초 출생',
        note: '감성 과다 제주소녀 🍊',
        image: '/images/eunjin.png',
        imageAlt: '신부 김은진 어린 시절 사진'
      }
    ] as AboutPerson[]
  },

  account: {
    title: '마음 전하실 곳',
    message:
      '참석이 어려우시거나 멀리서 마음을 전해주시는 분들을 위해 조심스레 안내드립니다.',
    groom: {
      side: '신랑 측',
      people: [
        { relation: '신랑', bank: '카카오뱅크', number: '3333-12-3456789', holder: '김동균' },
        { relation: '신랑 아버지', bank: '국민은행', number: '123456-78-901234', holder: '김아버지' },
        { relation: '신랑 어머니', bank: '우리은행', number: '1002-345-678901', holder: '박어머니' }
      ]
    } as AccountGroup,
    bride: {
      side: '신부 측',
      people: [
        { relation: '신부', bank: '신한은행', number: '110-456-789012', holder: '이은진' },
        { relation: '신부 아버지', bank: '하나은행', number: '456-910123-45607', holder: '이아버지' },
        { relation: '신부 어머니', bank: '농협은행', number: '302-1234-5678-91', holder: '최어머니' }
      ]
    } as AccountGroup
  },

  pohangGuide: {
    title: '포항 가이드',
    intro: '포항에서의 하루를 더 즐겁게 만들어 줄 추천 장소',
    items: [
      {
        label: '신부 추천',
        title: '영일대',
        description: '바다와 노을이 아름다운 포항의 대표 명소',
        feature: '산책, 바다, 야경',
        image: '/images/guide-yeongildae.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '신부 아버지 추천',
        title: '죽도시장',
        description: '싱싱한 해산물과 활기찬 포항의 전통 시장',
        feature: '해산물, 시장, 로컬 맛집',
        image: '/images/guide-market.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '맛집 추천',
        title: '물회',
        description: '포항의 바다를 담은 시원한 별미',
        feature: '식사, 별미, 시원한 맛',
        image: '/images/guide-food.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '가봐요',
        title: '스페이스워크',
        description: '하늘을 걷는 듯한 이색적인 체험 공간',
        feature: '전망, 산책, 사진 명소',
        image: '/images/guide-spacewalk.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '신부 추천',
        title: '감성 카페',
        description: '바다를 바라보며 즐기는 여유로운 시간',
        feature: '커피, 오션뷰, 쉬어가기',
        image: '/images/guide-cafe.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '꼭 가봐요',
        title: '구룡포',
        description: '시간이 멈춘 듯한 아름다운 해안 마을',
        feature: '드라이브, 마을 산책, 바다',
        image: '/images/guide-guryongpo.svg',
        link: 'https://map.naver.com/'
      }
    ] as PohangTip[]
  },

  closing:
    {
      image: '/images/5.png',
      imageAlt: '감사의 마음을 전하는 은진과 동균의 사진',
      message:
        '응원하고 격려해주신 모든 분들께 감사드리며\n행복하게 잘 살겠습니다.',
      copyright: 'Copyright 2026. FROM TODAY. All rights reserved.'
    },

  share: {
    title: '은진 & 동균 결혼식에 초대합니다',
    description: '2026년 10월 10일 토요일 오후 12시 30분, 포항 더퀸',
    image: '/images/og-image.svg'
  }
};
