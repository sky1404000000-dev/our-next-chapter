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
    title: '동균이와 은진이의 결혼식에 초대합니다',
    description: '2026년 10월 10일, 포항 더퀸에서 은진과 동균이 결혼합니다.',
    ogImage: '/images/hero/main.png'
  },
  music: {
    src: '/audio/wedding.mp3',
    title: 'Wedding music'
  },
  hero: {
    image: '/images/hero/main.png',
    video: '/video/hero.mp4',
    names: '김동균 · 김은진',
    dateLabel: '2026.10.10 SATURDAY',
    timeLabel: '12:30 PM',
    message: '친구에서 연인으로,\n연인에서 부부로\n우리의 다음 장이 시작됩니다.'
  },
  invitation: {
    title: '초대합니다',
    image: '/images/invitation/invite.png',
    imageAlt: '은진과 동균의 초대 사진',
    groomMessage:
      '같은 계절을 지나며 서로에게 \n가장 편안한 사람이 되었습니다.\n이제 부부라는 이름으로 새로운 페이지를 시작하려 합니다.\n소중한 분들을 모시고 그 첫날을 함께 나누고 싶습니다.',
    brideMessage:
      '같은 계절을 지나며 서로에게 \n가장 편안한 사람이 되었습니다.\n이제 부부라는 이름으로 새로운 페이지를 시작하려 합니다.\n소중한 분들을 모시고 그 첫날을 함께 나누고 싶습니다.'
  },
  calendar: {
    date: '2026-10-10T12:30:00+09:00',
    displayDate: '2026. 10. 10',
    displayTime: '토요일 오후 12시 30분',
    coupleLabel: '동균, 은진',
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
    kicker: 'OUR STORY',
    intro: '결혼을 앞두고 서로에게 남기고 싶은 마음을 짧은 편지처럼 담았습니다.',
    coverImage: '/images/gallery/1.png',
    coverAlt: '은진과 동균의 추억 사진',
    buttonLabel: '우리 이야기 읽어보기',
    questions: [
      {
        question: 'Q1. 서로는 어떤 사람인가요?',
        answer:
          '동균은 조용하지만 마음이 깊고, 작은 약속도 오래 기억하는 사람입니다.\n은진은 밝은 에너지로 주변을 환하게 만들고, 평범한 하루도 특별하게 바꾸는 사람입니다.',
        image: '/images/people/donggyun.png',
        imageAlt: '동균 소개 사진'
      },
      {
        question: 'Q2. 함께하며 가장 좋았던 순간은요?',
        answer:
          '거창한 날보다 함께 걷고 밥 먹고 웃던 평범한 날들이 가장 오래 남았습니다.\n서로의 일상에 자연스럽게 스며든 시간이 우리의 확신이 되었습니다.',
        image: '/images/gallery/2.png',
        imageAlt: '함께한 추억 사진'
      },
      {
        question: 'Q3. 앞으로 어떤 부부가 되고 싶나요?',
        answer:
          '완벽하기보다 다정한 사람이 되고 싶습니다.\n서로의 속도를 존중하며, 긴 계절을 함께 건너는 든든한 편이 되겠습니다.',
        image: '/images/gallery/3.png',
        imageAlt: '결혼을 앞둔 두 사람'
      }
    ] as InterviewQuestion[],
    items: [
      {
        date: '2019.11.03',
        title: '처음 만난 날',
        description: '작은 인연이 천천히 자라 서로의 계절이 되었습니다.',
        image: '/images/gallery/1.png'
      },
      {
        date: '함께한 시간',
        title: '친구에서 연인으로',
        description: '가장 편안한 사람, 가장 소중한 사람이 되었습니다.',
        image: '/images/gallery/2.png'
      },
      {
        date: '2026.10.10',
        title: '우리의 다음 장',
        description: '포항에서 부부라는 이름으로 새로운 이야기를 시작합니다.',
        image: '/images/gallery/3.png'
      }
    ] as StoryItem[]
  },
  gallery: {
    title: '우리의 순간들',
    initialCount: 4,
    items: [
      {
        image: '/images/gallery/1.png',
        caption: '처음처럼 다정하게',
        description: '처음 마음을 오래 간직하고 싶은 두 사람의 사진입니다.',
        alt: '은진과 동균의 추억 사진 1'
      },
      {
        image: '/images/gallery/2.png',
        caption: '편안한 하루',
        description: '함께라서 더 오래 기억하고 싶은 평범한 하루입니다.',
        alt: '은진과 동균의 추억 사진 2'
      },
      {
        image: '/images/gallery/3.png',
        caption: '같은 방향',
        description: '서로의 속도를 맞추며 같은 내일을 약속합니다.',
        alt: '은진과 동균의 추억 사진 3'
      },
      {
        image: '/images/gallery/4.png',
        caption: '웃음이 닮아가는 우리',
        description: '함께 웃는 시간이 많아질수록 마음도 더 가까워졌습니다.',
        alt: '은진과 동균의 추억 사진 4'
      },
      {
        image: '/images/gallery/5.png',
        caption: '계절을 건너',
        description: '여러 계절을 지나 이제 새로운 계절을 시작합니다.',
        alt: '은진과 동균의 추억 사진 5'
      }
    ] as GalleryItem[]
  },
  weddingInfo: {
    title: '예식 안내',
    date: '2026년 10월 10일 토요일',
    time: '오후 12시 30분',
    venue: '포항 더퀸',
    venueSub: '(구 UA컨벤션)',
    introVenue: '포항 더퀸 크라운홀, 5층',
    address: '경북 포항시 남구 대이로 18'
  },
  location: {
    title: '오시는 길',
    mapImage: '/images/location/pohang.png',
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
      '건물 내 주차장을 이용하실 수 있습니다.\n주말 교통 상황에 따라 여유 있게 도착해 주세요.'
  },
  aboutUs: {
    kicker: 'ABOUT US',
    title: '두 사람을 소개합니다',
    subtitle: '하나의 마음으로 이어지는 작은 기록',
    people: [
      {
        role: '신랑',
        name: '김동균',
        parents: '김응국 · 이남순의 아들',
        birth: '1997년 2월 출생',
        note: 'ESTJ 가끔은 F주장러',
        image: '/images/people/donggyun.png',
        imageAlt: '신랑 동균 사진'
      },
      {
        role: '신부',
        name: '김은진',
        parents: '김창성 · 이춘희의 딸',
        birth: '1998년 9월 출생',
        note: 'ENFP 가끔은 T주장러',
        image: '/images/people/eunjin.png',
        imageAlt: '신부 은진 사진'
      }
    ] as AboutPerson[]
  },
  account: {
    title: '마음 전하실 곳',
    message:
      '참석이 어려우신 분들을 위해\n계좌번호를 기재하였습니다.\n너그러운 마음으로 양해 부탁드립니다.',
    groom: {
      side: '신랑측',
      people: [
        { relation: '신랑', bank: '카카오뱅크', number: '3333-12-3456789', holder: '김동균' },
        { relation: '아버지', bank: '국민은행', number: '123456-78-901234', holder: '김영국' },
        { relation: '어머니', bank: '우리은행', number: '1002-345-678901', holder: '이남숙' }
      ]
    } as AccountGroup,
    bride: {
      side: '신부측',
      people: [
        { relation: '신부', bank: '신한은행', number: '110-456-789012', holder: '김은진' },
        { relation: '아버지', bank: '하나은행', number: '456-910123-45607', holder: '김창성' },
        { relation: '어머니', bank: '농협은행', number: '302-1234-5678-91', holder: '이춘자' }
      ]
    } as AccountGroup
  },
  pohangGuide: {
    title: '포항 가이드',
    intro: '멀리서 와주시는 분들을 위해 예식 전후 들르기 좋은 곳을 모았습니다.',
    items: [
      {
        label: '바다',
        title: '영일대 해수욕장',
        description: '포항 바다를 가장 편하게 만날 수 있는 대표 명소입니다.',
        feature: '바다, 산책, 사진',
        image: '/images/guide/yeongildae.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '시장',
        title: '죽도시장',
        description: '포항의 활기와 해산물을 함께 느낄 수 있는 전통 시장입니다.',
        feature: '해산물, 로컬 맛집',
        image: '/images/guide/market.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '풍경',
        title: '스페이스워크',
        description: '하늘을 걷는 듯한 독특한 풍경을 남길 수 있는 공간입니다.',
        feature: '전망, 산책, 사진',
        image: '/images/guide/spacewalk.svg',
        link: 'https://map.naver.com/'
      },
      {
        label: '마을',
        title: '구룡포',
        description: '시간이 천천히 흐르는 듯한 해안 마을입니다.',
        feature: '드라이브, 바다',
        image: '/images/guide/guryongpo.svg',
        link: 'https://map.naver.com/'
      }
    ] as PohangTip[]
  },
  closing: {
    image: '/images/gallery/5.png',
    imageAlt: '감사의 마음을 전하는 은진과 동균의 사진',
    dateLabel: '2026.10.10 SAT',
    message: '소중한 걸음으로 함께해 주시는 마음\n오래도록 감사히 간직하겠습니다.',
    copyright: 'copyright: Made with love & care by the Bride ♡'
  },
  share: {
    title: '은진 & 동균 결혼식에 초대합니다',
    description: '2026년 10월 10일 토요일 오후 12시 30분, 포항 더퀸',
    image: '/images/hero/main.png'
  }
};
