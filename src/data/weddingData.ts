export type StoryItem = {
  date: string;
  title: string;
  description: string;
  image?: string;
};

export type GalleryItem = {
  image: string;
  caption?: string;
  description?: string;
  alt?: string;
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
  note2?: string;
  image: string;
  imageAlt: string;
};

export const weddingData = {
  metadata: {
    title: '동균이와 은진이의 결혼식에 초대합니다',
    description: '2026년 10월 10일, 포항 더 퀸에서 은진과 동균이 결혼합니다.',
    ogImage: '/images/hero/wedding-photo.jpg'
  },
  hero: {
    image: '/images/hero/wedding-photo.jpg',
    videos: [
      '/video/covers/cover1.mp4',
      '/video/covers/cover2.mp4',
      '/video/covers/cover3.mp4'
    ],
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
      '나의 절반을 주어도\n 아깝지 않을 사람을 만났습니다.\n이제 부부라는 이름으로 새로운 페이지를 시작하려 합니다.\n소중한 분들을 모시고 그 첫날을 함께 나누고 싶습니다.',
    brideMessage:
      '절반이 아니라 전부를 주어도\n아깝지 않을 사람을 만났습니다.\n이제 그 사람과 평생 서로의 편이 되려 합니다.\n저희의 첫걸음을 함께 축복해 주세요.'
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
    intro: '결혼까지의 여정을 짧게 담아보았습니다.',
    coverImage: '/images/story/story_cover.jpg',
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
        title: '우리의 시작',
        description: '같은 학교, 같은 과 CC로 만나 여정을 시작하였습니다.',
        image: '/images/story/1.jpg'
      },
      {
        date: '2020',
        title: '졸업은 해야지',
        description: '졸업을 위해 학업에 집중하는 시간을 가졌습니다.',
        image: '/images/story/2.jpg'
      },
      {
        date: '2021',
        title: '함께하는 인턴생활',
        description: '취업에 필요한 자격증 취득 및 공부를 함께 하였습니다.',
        image: '/images/story/3.jpg'
      },
      {
        date: '2022',
        title: '우리는 직장인',
        description: '같은 시기에 취업하여 함께 사회초년생이 되었습니다.',
        image: '/images/story/4.jpg'
      },
      {
        date: '2023',
        title: '일본 달라달라병의 시작',
        description: '사귀고 가본 첫 해외여행 오사카! 일본 맥주 달라달라!',
        image: '/images/story/5.jpg'
      },
      {
        date: '2024',
        title: '둘만의 여행 전성기',
        description: '여행을 많이 다니며 잊지못할 추억들을 쌓았습니다.',
        image: '/images/story/6.jpg'
      },
      {
        date: '2025',
        title: '등가교환 성공',
        description: '서로 프로포즈를 하며 남은 인생을 함께하기로 하였습니다.',
        image: '/images/story/7.jpg'
      },
      {
        date: '2026.10.10',
        title: '우리의 다음 장',
        description: '이제 여러분들 앞에서 \n부부라는 이름으로 새로운 이야기를 시작합니다.',
        image: '/images/story/8.jpg'
      }
    ] as StoryItem[]
  },
  gallery: {
    title: '웨딩 갤러리',
    initialCount: 5,
    items: [
      // 제목/설명을 보여주고 싶은 사진만 아래처럼 선택으로 추가하면 됩니다.
      // {
      //   image: '/images/gallery/1.png',
      //   caption: '처음처럼 다정하게',
      //   description: '처음 마음을 오래 간직하고 싶은 두 사람의 사진입니다.',
      //   alt: '은진과 동균의 추억 사진 1'
      // },
      {
        image: '/images/gallery/1.png'
      },
      {
        image: '/images/gallery/2.png'
      },
      {
        image: '/images/gallery/3.png'
      },
      {
        image: '/images/gallery/4.png'
      },
      {
        image: '/images/gallery/5.png'
      },
      {
        image: '/images/gallery/1.png'
      },
      {
        image: '/images/gallery/2.png'
      },
      {
        image: '/images/gallery/3.png'
      },
      {
        image: '/images/gallery/4.png'
      },
      {
        image: '/images/gallery/5.png'
      }
    ] as GalleryItem[]
  },
  weddingInfo: {
    title: '예식 안내',
    date: '2026년 10월 10일 토요일',
    time: '오후 12시 30분',
    venue: '포항 더 퀸',
    venueSub: '(구 UA컨벤션)',
    introVenue: '포항 더 퀸 크라운홀, 5층',
    address: '경북 포항시 남구 대이로 18'
  },
  location: {
    title: '오시는 길',
    mapImage: '/images/location/pohang.png',
    mapAlt: '포항 더 퀸 주변 지도',
    mapDescription: '포항 더 퀸',
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
    kicker: 'PROFILE',
    title: '두 사람을 소개합니다',
    // subtitle: '하나의 마음으로 이어지는 작은 기록',
    people: [
      {
        role: '신랑',
        name: '김동균',
        parents: '김응국 · 이남순의 아들',
        birth: '1997년 2월 출생',
        note: '#ESTJ #광양남자',
        note2: '다정한 남편이 되겠습니다.',
        image: '/images/people/our1.jpg',
        imageAlt: '신랑 동균 사진'
      },
      {
        role: '신부',
        name: '김은진',
        parents: '김창성 · 이춘희의 딸',
        birth: '1998년 9월 출생',
        note: '#ENFP #포항여자',
        note2: '현명한 아내가 되겠습니다.',
        image: '/images/people/our2.jpg',
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
        { relation: '어머니', bank: '농협은행', number: '302-1234-5678-91', holder: '이춘희' }
      ]
    } as AccountGroup
  },
  pohangGuide: {
    title: '포항 가이드',
    intro: '연휴기간 포항에서 가볼만한 핫플레이스들을 담았습니다.'
  },
  closing: {
    image: '/images/closing/final/4.png',
    imageAlt: '감사의 마음을 전하는 은진과 동균의 사진',
    dateLabel: '2026.10.10 SAT',
    message: '소중한 걸음으로 함께해 주시는 마음\n오래도록 감사히 간직하겠습니다.',
    copyright: 'copyright: Made with love & care by the Bride ♡'
  },
  share: {
    title: '김동균 ♡ 김은진 결혼식에 초대합니다',
    description: '10월 10일 토요일 오후 12시 30분, 포항 더 퀸 5층',
    image: '/images/hero/wedding-photo.jpg'
  }
};
