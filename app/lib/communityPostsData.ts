import { CommunityPost } from '../components/AlbamonCommunityScreen';

export const INITIAL_POSTS_100: CommunityPost[] = [
  // ── 1 ~ 25: ⚡ 0.1초 정산 / 금융 / ETF / 무상보험 후기 ──
  {
    id: 'post-1',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '⚡ 0.1초 정산 후기',
    title: 'CU 물류알바 1시간 끝내자마자 카톡 띵동! 신한 0.1초 정산 미쳤네요 🚀',
    content: '방금 강남파이낸스점 피크타임 1시간 물류 정리 끝나고 바코드 찍어서 퇴근 처리 하자마자 신한 BaaS 계좌로 16,000원 바로 입금됨 ㅋㅋㅋ 타 알바앱은 다음 주 수요일에 주거나 한 달 뒤에 주는데 땡겨요 웍스는 퇴근 버튼 누르는 순간 바로 들어옴! 수수료도 0원이라 진짜 대만족입니다.',
    author: '강남역물류킹',
    authorBadge: 'CU 6개월차 · D-GCS 1등급',
    role: 'worker',
    timestamp: '10분 전',
    likes: 142,
    views: 1312,
    isHot: true,
    storeCategory: '편의점',
    comments: [
      { id: 'c1-1', author: '역삼카페러버', role: 'worker', content: '인정 ㅋㅋㅋ 나도 컴포즈커피 2시간 대타 뛰고 바로 지갑 확인했는데 계좌 꽂혀있어서 야식 바로 시킴', likes: 15, timestamp: '8분 전' },
      { id: 'c1-2', author: '최신한 점주', role: 'employer', content: '지훈님 오늘 물류 정리 너무 깔끔하게 잘해주셔서 감사합니다! 담에도 피크 타임 때 땡톡으로 연락드릴게요 ㅎㅎ', likes: 22, timestamp: '5분 전' }
    ]
  },
  {
    id: 'post-ez-1',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '🛡️ 신한EZ 무상보험 후기',
    title: '카페 서빙하다 살짝 데였는데, 출근 즉시 100% 무상 상해보험으로 치료비 당일 환급 😭',
    content: '역삼역 투썸 마감 알바 뛰다가 스틱 픽업 과정에서 손등에 살짝 화상 입었습니다... 타 알바앱으로 뛰었으면 4대보험도 없어서 제 돈으로 병원비 낼 뻔했는데, 땡겨요 웍스는 출근 스와이프하자마자 신한EZ손해보험 비급여 상해보험이 무상 자동 가입되더라고요! 피부과 치료비 48,000원 나온 거 앱에서 클릭 한 번으로 당일 100% 환급받았습니다. 알바생 안전 진짜 제대로 챙겨주네요 ㅠㅠ',
    author: '바리스타지은',
    authorBadge: '투썸 마감조 · 신한EZ 보장인증',
    role: 'worker',
    timestamp: '22분 전',
    likes: 195,
    views: 1820,
    isHot: true,
    storeCategory: '카페/음료',
    comments: [
      { id: 'cez-1', author: '신한EZ케어', role: 'admin', content: '지은님 손등 치료 잘 되셔서 다행입니다! 땡겨요 웍스 근로자분들은 본인 부담금 0원으로 무상 안전 케어를 받으실 수 있습니다. 빠른 쾌유를 빕니다.', likes: 44, timestamp: '15분 전' }
    ]
  },
  {
    id: 'post-etf-1',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '📈 ETF 자동투자 성공기',
    title: '알바비 잔돈(825원) KODEX 미국S&P500 자동투자했더니 한 달 만에 3만원 쏠쏠 📈',
    content: '일당 54,000원, 16,000원 받을 때 잔돈 825원, 425원 나오는 걸 신한투자증권 소수점 매수 연동해뒀거든요. 매수 수수료 100% 무료인데다가 점주 시너지 적립금까지 1:1로 얹어줘서 미국 주식 지수 ETF에 계속 모였습니다. 매달 노는 잔돈 모으기만 했는데 수익률 +4.2% 찍히고 첫 자산 형성 시드 포인트까지 받아갑니다!',
    author: '스마트알바생',
    authorBadge: '신한투자증권 STO 연동 · Gold 티어',
    role: 'worker',
    timestamp: '45분 전',
    likes: 228,
    views: 2140,
    isHot: true,
    storeCategory: '재테크/투자',
    comments: [
      { id: 'cetf-1', author: '대학생김알바', role: 'worker', content: '우와 잔돈 소수점 투자가 이렇게 크다니 저도 오늘부터 100% 자동 매수 켜야겠네요 대박!', likes: 24, timestamp: '30분 전' }
    ]
  },
  {
    id: 'post-pr-2',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '⚡ 0.1초 정산 후기',
    title: '심야 편의점 1시간 수불 끝내고 나오면서 교통카드 충전 완료! 0.1초 즉시 입금 실화냐 💳',
    content: '야간 23:00~24:00 1시간 수불 알바 17,000원 정산금을 퇴근 스와이프하자마자 신한 SOL 페이 지갑으로 바로 쐈습니다. 지하철 막차 타기 전에 교통카드 잔액 모자랐는데 길거리에서 바로 충전하고 무사 귀가했네요. 주휴수당 핑계대며 미루던 과거 알바들과 차원이 다릅니다.',
    author: '야간수불파이터',
    authorBadge: 'GS25 야간전담 · D-GCS 950점',
    role: 'worker',
    timestamp: '1시간 전',
    likes: 88,
    views: 920,
    storeCategory: '편의점',
    comments: []
  },
  {
    id: 'post-pr-3',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '📈 SOL 미국배당 ETF 후기',
    title: 'SOL 미국배당다우존스 월배당 주식에 알바 정산금 자동 매수 설정해뒀더니 첫 배금 입금됨 💰',
    content: '주말 쉑쉑버거 홀서빙 일당 36,000원 정산받을 때 매번 20%씩 SOL 미국배당다우존스 ETF로 리밸런싱되도록 설정했습니다. 이번 달에 첫 달러 기반 월배당금 카톡 알림 들어왔는데 알바하면서 진짜 소형 자산가 되는 기분이에요! 신한투자증권 계좌 딥링크 연결 강추합니다.',
    author: '서빙왕제임스',
    authorBadge: 'SOL 미국배당 보유자 · Gold',
    role: 'worker',
    timestamp: '2시간 전',
    likes: 134,
    views: 1250,
    isHot: true,
    storeCategory: '재테크/투자',
    comments: []
  },
  {
    id: 'post-pr-4',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '🛡️ 신한EZ 상해보험 후기',
    title: '올리브영 재고 박스 무겁게 들다 무릎 살짝 삐끗했는데, 병원비 32,000원 바로 환급 처리됨!',
    content: '매장 진열대 정리하다가 무릎 통증으로 물리치료 받았는데 땡겨요 웍스 무상 단기상해보험 혜택 적용되어서 실비 신청 1분 만에 접수 완료되었습니다. 소상공인 점주님한테 눈치 안 보여서 너무 좋아요!',
    author: '올영메이트',
    authorBadge: '올리브영 8개월차 · EZ안심',
    role: 'worker',
    timestamp: '3시간 전',
    likes: 76,
    views: 710,
    storeCategory: '마트/리테일',
    comments: []
  },
  {
    id: 'post-pr-5',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '⚡ 0.1초 정산 후기',
    title: '하루에 미니 알바 3개 뛰고 98,000원 당일 삼분할 즉시 정산받았습니다 ㅋㅋㅋ',
    content: '오전 세븐일레븐 1시간(15,000원) + 점심 맘스터치 2시간(31,000원) + 저녁 하남돼지집 4시간(58,000원) 3탕 뛰었습니다. 각 일정이 끝날 때마다 통장에 0.1초 만에 꽂혀서 하루 만에 10만원 가깝게 현금 확보했네요. 땡겨요 웍스 없었으면 어떻게 살았나 싶음.',
    author: 'N잡러김프로',
    authorBadge: '하루 3탕 N잡러 · D-GCS 980점',
    role: 'worker',
    timestamp: '4시간 전',
    likes: 210,
    views: 2050,
    isHot: true,
    storeCategory: 'N잡/투잡',
    comments: []
  },
  {
    id: 'post-pr-6',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '📈 STO 조각투자 후기',
    title: '신한 STO 강남 타워 건물 조각투자에 알바비 적립했더니 월 임대 배당금 쏠쏠하게 들어오네요 🏢',
    content: '강남역 근처 상가 건물 부동산 STO 상품에 매번 5천원씩 자동 분할 투자했습니다. 매달 건물 임대 수익 배당금이 알바 계좌로 정산되는데, 내가 일하는 강남 건물 지분을 갖고 일한다는 기분이 들어서 일도 더 즐겁게 하게 됩니다.',
    author: '건물주꿈나무',
    authorBadge: '신한 STO 조각투자자',
    role: 'worker',
    timestamp: '5시간 전',
    likes: 112,
    views: 1040,
    storeCategory: '재테크/투자',
    comments: []
  },
  {
    id: 'post-pr-7',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '⚡ 0.1초 정산 후기',
    title: '타 구인앱 주급 정산 기다리다 피말랐는데... 0.1초 즉시 입금은 자영업자와 알바생 모두의 구원임',
    content: '급전 필요할 때 단기 알바 뛰는 건데 14일 뒤 정산은 솔직히 말도 안 되죠. 땡겨요 웍스는 에스크로 계좌에 금액이 미리 예치되어 있어서 점주 지각 확인이나 펑크 우려 없이 즉시 입금됩니다. 보안이랑 신뢰도가 차원이 다릅니다.',
    author: '급전해결사',
    authorBadge: '단기알바 2년차',
    role: 'worker',
    timestamp: '6시간 전',
    likes: 94,
    views: 890,
    storeCategory: '금융/정산',
    comments: []
  },
  {
    id: 'post-pr-8',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '🛡️ 신한EZ 상해보험 후기',
    title: '하남돼지집 불판 정리하다 손가락 데였을 때 신한EZ 100% 무상 보장받은 후기',
    content: '고깃집 서빙 피크타임 때 불판 닦다가 손가락 경미한 화상 입었는데 땡겨요 웍스 앱 내 무상 보험 접수로 30분 만에 치료비 송금받았습니다. 진짜 안전장치 확실해서 부모님도 안심하세요.',
    author: '불판마스터',
    authorBadge: '하남돼지 서빙조',
    role: 'worker',
    timestamp: '7시간 전',
    likes: 64,
    views: 620,
    storeCategory: '식당/서빙',
    comments: []
  },
  {
    id: 'post-pr-9',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '📈 KODEX 반도체 ETF 후기',
    title: '반도체 뉴스 보고 알바비 소수점 투자 연동해뒀는데 수익률 8% 넘었습니다 🚀',
    content: '컴포즈커피 음료 조리 2시간 뛰고 받은 30,000원 중 5,000원을 KODEX AI전력핵심설비 및 반도체 ETF로 자동 분수한 지 3주 만에 수익률 +8.4% 달성했습니다. 일도 하고 주식 공부도 되네요.',
    author: '반도체주식러',
    authorBadge: 'KODEX ETF 주주',
    role: 'worker',
    timestamp: '8시간 전',
    likes: 145,
    views: 1380,
    storeCategory: '재테크/투자',
    comments: []
  },
  {
    id: 'post-pr-10',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '⚡ 0.1초 정산 후기',
    title: '어버이날 카네이션 꽃다발 0.1초 정산금으로 당일 사드렸습니다 💐',
    content: '어버이날 용돈 모자라서 아침에 이디야커피 2시간 피크 알바 뛰고 받은 29,000원으로 부모님 카네이션 사서 들어갔습니다. 0.1초 정산 아니었으면 당일 선물도 못 사드릴 뻔했어요. 감사합니다 땡겨요 웍스!',
    author: '효도하는알바생',
    authorBadge: '이디야 3개월차',
    role: 'worker',
    timestamp: '9시간 전',
    likes: 280,
    views: 2450,
    isHot: true,
    storeCategory: '일상/효도',
    comments: []
  },

  // ── 26 ~ 50: 🏪 점주 대나무숲 / 점주 상생 / 수수료 0원 ──
  {
    id: 'post-2',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '알바몬 쓰다가 땡겨요 웍스로 갈아탔는데 인건비 수수료 0원에 지원자 수준도 미쳤음',
    content: '기존 알바몬/알바천국 유료 공고 30만원씩 내면서 구인글 올렸는데 펑크내는 애들 많아서 골머리 앓았습니다... 땡겨요 웍스는 신한 S-Bridge랑 D-GCS 신용평가 1등급으로 검증된 지원자만 AI 매칭으로 들어와서 지각 한번 안 함. 게다가 점주 인건비 결제 수수료 0원에 카드 혜택까지 대박이네요.',
    author: '역삼컴포즈점주',
    authorBadge: '컴포즈 3년차 · 신한 땡겨요 파트너',
    role: 'employer',
    timestamp: '55분 전',
    likes: 189,
    views: 1740,
    isHot: true,
    storeCategory: '카페/음료',
    comments: [
      { id: 'c2-1', author: '강남올영점주', role: 'employer', content: '맞아요 사장님 ㅋㅋㅋ 특히 1시간 피크타임 긴급 대타 때 AI 땡격발 기능이 제일 유용함 3분 만에 매칭됨', likes: 28, timestamp: '25분 전' }
    ]
  },
  {
    id: 'post-boss-1',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '3년 만에 처음으로 가족 여행 다녀왔습니다... D-GCS 990점 성실 청년 알바생을 만나고 눈물 흘린 사연 😭',
    content: '혼자서 15시간씩 일하느라 아이 졸업식도 못 가고 가게를 지켰던 자영업자입니다. 기존 알바 플랫폼에서 구했던 애들은 수시로 당일 펑크내서 주말 여행은 꿈도 못 꿨는데, 땡겨요 웍스 D-GCS 1등급 신용 뱃지 받은 24살 조이수 군을 만났습니다. 하루도 지각 없이 책임감 있게 마감을 전담해준 덕분에 지난 주말 3년 만에 아내와 아이를 데리고 속초 바다를 보고 왔습니다. 퇴근할 때 고맙다며 건넨 따뜻한 한 끼와 0.1초 즉시 정산 알림을 보며 서로 눈시울을 적셨네요. 상생이란 게 이런 거군요...',
    author: '부평하남돼지사장',
    authorBadge: '자영업 7년차 · D-GCS 우수 업장',
    role: 'employer',
    timestamp: '1시간 전',
    likes: 314,
    views: 2890,
    isHot: true,
    storeCategory: '식당/서빙',
    comments: [
      { id: 'cb1-1', author: '최신한 점주', role: 'employer', content: '사장님 사연 보고 저도 가슴이 뭉클하네요 ㅠㅠ 성실한 청년과 자영업자가 함께 웃는 플랫폼이 진짜 필요했습니다.', likes: 52, timestamp: '45분 전' },
      { id: 'cb1-2', author: '조이수', role: 'worker', content: '사장님! 오히려 저를 믿고 마감을 맡겨주셔서 감사했습니다. 0.1초 정산금으로 어버이날 부모님 선물 잘 받았습니다!', likes: 68, timestamp: '30분 전' }
    ]
  },
  {
    id: 'post-boss-2',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '매달 알바몬 유료 공고비 45만원씩 날리며 가슴 찢어졌는데, 땡겨요 웍스 공고료 0원 + 신한 사업자 대출 우대금리 혜택으로 숨통이 트였습니다 💸',
    content: '원자재값 상승에 임대료 압박까지 겹쳐서 지난달 매장 문을 닫아야 하나 심각하게 고민했습니다. 알바 플랫폼들에 수수료와 유료 공고비로만 매달 40~50만원씩 뜯기던 게 가장 억울했는데요. 신한 땡겨요 웍스로 바꾸고 공고료 수수료 0원에, 땡겨요 파트너 연동으로 신한은행 사업자 대출 금리까지 -1.5%p 감면받았습니다. 절감된 인건비와 이자로 성실한 알바생들에게 피크타임 특별 시급(16,000원)을 주니 가게 분위기도 싹 바뀌고 매출도 30% 올랐습니다.',
    author: '테헤란로CU점주',
    authorBadge: '신한 땡겨요 가맹점 · 수수료 0원',
    role: 'employer',
    timestamp: '2시간 전',
    likes: 278,
    views: 2450,
    isHot: true,
    storeCategory: '편의점',
    comments: [
      { id: 'cb2-1', author: '역삼컴포즈점주', role: 'employer', content: '맞습니다. 자영업자 피를 빨아먹는 구인앱 수수료 대신 그 돈이 알바생 시급으로 돌아가니 진정한 위윈이네요!', likes: 45, timestamp: '1시간 전' }
    ]
  },
  {
    id: 'post-boss-3',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '알바생이 일하다 손 데였을 때 가슴이 철렁했는데... 신한EZ 100% 무상 상해보험 덕분에 미안함 덜고 서로 꼭 안아줬습니다 🩹',
    content: '주방에서 버거 튀김 조리하다가 대학생 알바생이 기름이 튀어 데였습니다. 소상공인 형편에 산재 처리 과정도 복잡하고 치료비 부담 때문에 속으로 너무 미안해서 잠을 못 잘 지경이었는데, 땡겨요 웍스는 출근 스와이프하자마자 신한EZ손해보험 비급여 상해보험이 무상 자동 적용되어 피부과 치료비 62,000원이 전액 당일 환급되더라고요. 미안해하는 저에게 "사장님 땡겨요 보험 덕분에 제 돈 안 들었어요!" 웃어주는 학생을 보며 눈물핑 돌았습니다.',
    author: '강남맘스터치점주',
    authorBadge: '맘스터치 4년차 · 신한EZ 케어',
    role: 'employer',
    timestamp: '3시간 전',
    likes: 295,
    views: 2620,
    isHot: true,
    storeCategory: '패스트푸드',
    comments: [
      { id: 'cb3-1', author: '신한EZ케어', role: 'admin', content: '사장님과 근로자분 모두 마음고생 없으셔서 다행입니다! 소상공인과 긱 워커의 든든한 무상 울타리가 되겠습니다.', likes: 58, timestamp: '2시간 전' }
    ]
  },
  {
    id: 'post-boss-4',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '점심 1시간 기습 단체주문 폭주... 땡겨요 웍스 3분 초단기 땡격발로 가게 대혼란 막아낸 실화 ⚡',
    content: '오늘 12시에 근처 회사에서 아메리카노 80잔 기습 단체 주문이 들어와 홀과 주방이 마비되기 직전이었습니다. 땡겨요 웍스 "AI 1시간 땡격발" 버튼 누르자마자 300m 거리에서 공강 중이던 바리스타 SBT 보유 대학생 알바생이 3분 만에 출근해 1시간 동안 음료 팩맨 세팅을 완벽하게 끝내줬습니다. 퇴근 버튼 누르자마자 0.1초 정산(16,000원)에 보너스 쿠폰까지 쥐어주며 보냈네요. 땡겨요 웍스 없었으면 오늘 단골 다 잃을 뻔했습니다!',
    author: '역삼GFC투썸점주',
    authorBadge: '투썸플레이스 · 땡격발 마스터',
    role: 'employer',
    timestamp: '4시간 전',
    likes: 242,
    views: 2180,
    isHot: false,
    storeCategory: '카페/음료',
    comments: [
      { id: 'cb4-1', author: '강남포스코점주', role: 'employer', content: 'AI 땡격발 진짜 미쳤죠 ㅋㅋㅋ 피크타임 긴급 수불 구인할 때 갓기능입니다.', likes: 32, timestamp: '3시간 전' }
    ]
  },
  {
    id: 'post-boss-5',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '신한 땡겨요 배달앱 + 땡겨요 웍스 연동 시너지... 배달 픽업 지체 제로로 일매출 신기록 320만원 찍었습니다 🛵',
    content: '땡겨요 배달 앱으로 주말 주문이 봇물 터지듯 몰렸을 때, 라이더 픽업 지연과 포장 지연을 막기 위해 땡겨요 웍스로 2시간 포장 전담 긱워커를 구했습니다. 신한 금융 생태계 안에서 배달과 HR이 실시간 연동되니 라이더분들도 기다리지 않고 빠른 배달이 가능했고, 덕분에 땡겨요 맛집 평점 5.0 만점 찍고 일매출 신기록 320만원 돌파했습니다. 자영업자 살리는 신한 금융-HR 시너지 최고입니다.',
    author: '강남쉑쉑점주',
    authorBadge: '땡겨요 파트너 · 일매출 320만',
    role: 'employer',
    timestamp: '5시간 전',
    likes: 268,
    views: 2390,
    isHot: false,
    storeCategory: '배달/시너지',
    comments: [
      { id: 'cb5-1', author: '신한 땡겨요 팀', role: 'admin', content: '사장님의 매출 신기록 달성을 진심으로 축하드립니다! 신한 배달&HR 시너지로 더 높이 도약하도록 돕겠습니다.', likes: 41, timestamp: '4시간 전' }
    ]
  },
  {
    id: 'post-boss-6',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '노쇼 걱정에 잠 못 들던 나날들... D-GCS 신용평가 시스템 덕분에 마음 편히 퇴근합니다',
    content: '예전에는 알바생이 당일 아침에 문자 하나 남기고 펑크내거나 잠수타서 직접 매장 튀김기 앞에 서야 했던 적이 한두 번이 아니었습니다. 땡겨요 웍스는 노쇼 이행률 100% 검증된 지원자만 매칭해주니 마음이 너무 편합니다.',
    author: '뱅뱅사거리버거킹',
    authorBadge: 'D-GCS 검증업장',
    role: 'employer',
    timestamp: '6시간 전',
    likes: 175,
    views: 1650,
    storeCategory: '패스트푸드',
    comments: []
  },
  {
    id: 'post-boss-7',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '1시간 알바 구인이 과연 될까 반신반의했는데... 피크타임 입고 정리만 딱 도와주니 효율 대박입니다',
    content: '물류 차량 오는 오후 12:00~13:00 1시간만 일해줄 알바생 구하는 게 제일 어려웠습니다. 풀타임 뽑기는 부담스럽고 혼자 하기엔 허리 아팠는데 땡겨요 웍스 1시간 긱으로 대학생이 와서 깔끔히 정리해주니 서로에게 신세계네요.',
    author: '선릉역세븐점주',
    authorBadge: '세븐일레븐 5년차',
    role: 'employer',
    timestamp: '7시간 전',
    likes: 198,
    views: 1820,
    isHot: true,
    storeCategory: '편의점',
    comments: []
  },

  // ── 51 ~ 80: 💬 땡썰 / 일상 / 대학생 / 공강 / N잡 스토리 ──
  {
    id: 'post-bank-1',
    category: 'WORKER_STORY',
    categoryLabel: '🏦 신한은행 대출우대 썰',
    title: '노쇼 0건 3달 연속 달성했더니 D-GCS Platinum 승급되고 신한은행 대출 우대금리 -1.2% 감면 받았습니다!',
    content: '주말마다 편의점이랑 마트 알바 성실하게 뛰면서 블록체인 SBT 근태 기록 쌓았더니 D-GCS 점수 990점 달성했습니다. 이번에 전세자금대출 상담받으러 신한은행 영업점 갔는데 땡겨요 웍스 성실 근태 우수자 데이터 연동되어 있다고 우대금리 -1.2%p 즉시 할인 적용해주시더라고요! 연 이자만 40만원 절감됩니다 ㅠㅠ 성실 출근이 돈이 되는 세상입니다.',
    author: '성실파이팅',
    authorBadge: 'D-GCS 990점 · Platinum 승급자',
    role: 'worker',
    timestamp: '1시간 전',
    likes: 356,
    views: 3420,
    isHot: true,
    storeCategory: '금융/대출',
    comments: [
      { id: 'cbank-1', author: '신한은행금융매니저', role: 'admin', content: '성실 근태 데이터는 신한금융의 최고 자산입니다! 1금융권 우대 신용 혜택을 마음껏 누리세요 :)', likes: 61, timestamp: '40분 전' }
    ]
  },
  {
    id: 'post-3',
    category: 'WORKER_STORY',
    categoryLabel: '💬 땡썰/일상',
    title: '공강 2시간 활용해서 카페 대타 뛰고 30,000원 벌었음 꿀팁 공유',
    content: '학교 수업 사이 공강 2시간 남아서 땡겨요 지도 켜보니까 5분 거리에 컴포즈커피 음료 조리 2시간 대타 떴길래 지원함. 바리스타 SBT 인증서 프로필에 달아두니까 점주님이 1분 만에 수락하셔서 깔끔하게 일하고 0.1초 정산 받았습니다. 공강 시간에 놀지 말고 땡겨요 웍스 키세요 ㅋㅋㅋ',
    author: '대학생김알바',
    authorBadge: '바리스타 SBT 보유자',
    role: 'worker',
    timestamp: '3시간 전',
    likes: 131,
    views: 1450,
    storeCategory: '공강/투잡',
    comments: []
  },
  {
    id: 'post-ws-1',
    category: 'WORKER_STORY',
    categoryLabel: '💬 땡썰/일상',
    title: '시험기간 용돈 고갈이었는데 1시간 물류 알바로 16,000원 벌어서 독서실비 냈습니다',
    content: '시험 공부하다가 중간에 머리 식힐 겸 1시간 입고 알바 다녀왔는데 상체 스트레칭도 되고 돈도 즉시 꽂혀서 독서실 일주일 연장했습니다. 시간을 자유롭게 조율해서 일할 수 있는 게 제일 큰 장점이네요.',
    author: '취준생파이팅',
    authorBadge: 'Silver 티어 · 열공중',
    role: 'worker',
    timestamp: '4시간 전',
    likes: 92,
    views: 980,
    storeCategory: '공부/시험',
    comments: []
  },
  {
    id: 'post-ws-2',
    category: 'WORKER_STORY',
    categoryLabel: '💬 땡썰/일상',
    title: '투잡 뛰는 직장인인데 퇴근길 1시간 긱워크로 한 달 커피값 30만원 아낀 후기',
    content: '칼퇴하고 집에 가는 길에 역전 편의점 1시간 물류 보조 뛰고 16,000~17,000원 정산받는 생활을 한 달 동안 유지했더니 34만원 벌었습니다. 퇴근길 버려지는 시간에 가볍게 일하니까 스트레스도 전혀 없네요.',
    author: '직장인N잡러',
    authorBadge: '퇴근길 N잡러 · Gold',
    role: 'worker',
    timestamp: '5시간 전',
    likes: 184,
    views: 1720,
    isHot: true,
    storeCategory: '투잡/직장인',
    comments: []
  },

  // ── 81 ~ 100: 💡 알바 꿀팁 / D-GCS 신용점수 / 세무 팁 ──
  {
    id: 'post-4',
    category: 'TIPS',
    categoryLabel: '💡 알바 꿀팁/질문',
    title: 'D-GCS 신용점수 올리고 AI 매칭률 99% 만드는 법 (꿀팁 모음)',
    content: '1. 신한 슈퍼SOL 딥링크 계좌 연동하기\n2. 출퇴근 시간 정각에 버튼 누르기 (출근 지각 0회 달성 시 승급)\n3. 근무 완료 후 점주 평점 5점 받기\n이렇게 하니까 Silver에서 Gold 티어로 올라가고 AI 우수 매칭 알림 제일 먼저 옴!',
    author: '신한마스터',
    authorBadge: 'Gold 티어 · 땡격발 마스터',
    role: 'worker',
    timestamp: '4시간 전',
    likes: 167,
    views: 1890,
    isHot: false,
    storeCategory: '꿀팁',
    comments: []
  },
  {
    id: 'post-life-1',
    category: 'TIPS',
    categoryLabel: '🧬 신한라이프 & 카드 혜택',
    title: '일당 1% 자동 마이크로 연금 적립되고 신한 체크카드로 땡겨요 배달 시키니까 10% 캐시백 혜택 개꿀 🍔',
    content: '퇴근 후 야식 시킬 때 땡겨요 웍스 정산계좌 연동 신한 체크카드로 결제하면 땡겨요 앱 10% 캐시백 바로 꽂힙니다. 거기다 근무할 때 신한라이프 헬스케어 걸음수 포인트도 모여서 하루 만보 걸으면 1,000원 적립금 생김 ㅋㅋㅋ 알바하면서 체력도 키우고 연금도 모으고 맛있는 것도 먹네요.',
    author: '야식매니아',
    authorBadge: '신한카드 10% 캐시백 · 마이크로 연금',
    role: 'worker',
    timestamp: '2시간 전',
    likes: 174,
    views: 1680,
    isHot: false,
    storeCategory: '카드/혜택',
    comments: []
  },
  {
    id: 'post-tip-1',
    category: 'TIPS',
    categoryLabel: '💡 알바 꿀팁/질문',
    title: '초단기 긱워크 3.3% 원천징수 세금 5월 종합소득세 때 100% 환급받는 방법 📄',
    content: '1년 동안 땡겨요 웍스에서 번 3.3% 알바비 세금 환급 팁입니다. 5월 종합소득세 신고 때 홈택스 연결하면 소득 기준 150만원 이하 학생/취준생은 원천징수된 3.3% 전액 환급받으실 수 있어요. 국세청 자동 연동 서류 발급법 정리해드립니다!',
    author: '세무왕알바생',
    authorBadge: '세무 꿀팁러 · 100% 환급',
    role: 'worker',
    timestamp: '6시간 전',
    likes: 245,
    views: 2310,
    isHot: true,
    storeCategory: '세무/환급',
    comments: []
  }
];

// 100개풍부한 샘플 동적 확장 데이터셋 생성기
export const GENERATED_100_POSTS: CommunityPost[] = Array.from({ length: 100 }, (_, i) => {
  if (i < INITIAL_POSTS_100.length) {
    return INITIAL_POSTS_100[i];
  }

  const idx = i + 1;
  const categories: CommunityPost['category'][] = ['BOSS_LOUNGE', 'PAYOUT_REVIEW', 'WORKER_STORY', 'TIPS'];
  const cat = categories[idx % categories.length];

  if (cat === 'BOSS_LOUNGE') {
    const titles = [
      `유료 공고비로 매달 30만원씩 날리다 땡겨요 웍스 수수료 0원으로 절약하고 시급 인상해준 후기 (${idx})`,
      `노쇼 0건 D-GCS 성실 뱃지 지원자 덕분에 매장 관리 시름 털어냈습니다 (${idx})`,
      `신한 땡겨요 배달 앱과 1시간 초단기 긱워크 연동으로 주말 대란 극복 썰 (${idx})`,
      `알바생이 일하다 살짝 다쳤는데 신한EZ 무상 상해보험으로 즉시 치료 지원받은 감동 사연 (${idx})`,
      `AI 1시간 땡격발 기능으로 기습 단체주문 5분 만에 해결한 실화 (${idx})`,
      `신한은행 사업자 대출 금리 우대(-1.5%p) 감면받고 매장 리모델링 성공했습니다 (${idx})`,
      `청년 알바생과 나눈 따뜻한 한 끼 식사와 0.1초 정산의 감동 상생 이야기 (${idx})`
    ];
    const authors = ['강남역점주', '부평역사장님', '역삼카페대표', '홍대올영사장', '수원맘스터치점주', '판교투썸사장', '여의도CU점주'];
    const roles: ('employer' | 'admin' | 'worker')[] = ['employer'];
    const authorBadges = ['신한 땡겨요 파트너', 'D-GCS 우수 업장', '수수료 0원 가맹점', '신한EZ 케어 가맹점'];

    return {
      id: `post-gen-${idx}`,
      category: 'BOSS_LOUNGE',
      categoryLabel: '🏪 점주 대나무숲',
      title: titles[idx % titles.length],
      content: `저희 매장 운영하면서 가장 큰 고민이 구인 광고비용과 알바생 노쇼 문제였는데, 땡겨요 웍스를 도입한 후 신한 S-Bridge 검증 시스템으로 무결점 성실 알바생들만 매칭되어 시름을 크게 덜었습니다. 인건비 결제 수수료도 0원이라 절감된 비용을 성실 근로자들에게 정당하게 보상할 수 있어 상생 효과가 확실합니다!`,
      author: authors[idx % authors.length],
      authorBadge: authorBadges[idx % authorBadges.length],
      role: roles[0],
      timestamp: `${idx % 12 + 1}시간 전`,
      likes: 50 + (idx * 3) % 200,
      views: 300 + (idx * 17) % 1500,
      isHot: idx % 3 === 0,
      storeCategory: '점주/상생',
      comments: [
        {
          id: `c-gen-${idx}`,
          author: '최신한 점주',
          role: 'employer',
          content: '공감합니다 사장님! 소상공인에게 진짜 필요한 혁신이네요 👏',
          likes: 12 + idx % 10,
          timestamp: '30분 전'
        }
      ]
    };
  } else if (cat === 'PAYOUT_REVIEW') {
    const titles = [
      `퇴근 스와이프하자마자 카톡 입금 알림 띵동! 0.1초 즉시 정산은 신세계입니다 (${idx})`,
      `알바비 잔돈 800원 모아 SOL 미국배당다우존스 ETF 매수했더니 달러 배당금 꽂힘 (${idx})`,
      `출근 스와이프 동시에 신한EZ 무상 상해보험 자동 가입되어 안심하고 근무했습니다 (${idx})`,
      `공강 1시간 활용해서 16,000원 당일 입금받고 친구랑 맛있는 점심 먹었네요 (${idx})`,
      `D-GCS 980점 달성하고 신한은행 저금리 대출 우대 할인받아 이자 40만원 아꼈습니다 (${idx})`
    ];
    return {
      id: `post-gen-${idx}`,
      category: 'PAYOUT_REVIEW',
      categoryLabel: '⚡ 0.1초 정산 후기',
      title: titles[idx % titles.length],
      content: `퇴근 후 정산금 기다릴 필요 없이 0.1초 만에 계좌로 바로 들어오고 잔돈은 소수점 ETF로 자동 리밸런싱되니 알바하면서 자연스럽게 금융 자산이 증식되는 느낌입니다. 1금융권 신한의 보안과 편의성은 최고네요!`,
      author: `스마트알바러${idx}`,
      authorBadge: '0.1초 정산 완결 · Gold',
      role: 'worker',
      timestamp: `${idx % 12 + 1}시간 전`,
      likes: 60 + (idx * 5) % 180,
      views: 400 + (idx * 21) % 1800,
      isHot: idx % 4 === 0,
      storeCategory: '정산/금융',
      comments: []
    };
  } else if (cat === 'WORKER_STORY') {
    return {
      id: `post-gen-${idx}`,
      category: 'WORKER_STORY',
      categoryLabel: '💬 땡썰/일상',
      title: `대학생 공강 2시간 쪼개서 집 앞 매장 알바 뛰고 3만원 번 썰 (${idx})`,
      content: `수업 공강 시간에 지도 앱 켜서 근처 1~2시간 알바 찾아서 다녀왔습니다. 프로필에 등록된 바리스타 SBT 덕분에 점주님이 빠르게 승인해주셨고, 깔끔하게 일하고 0.1초 만에 지갑으로 입금받아 하루 알차게 보냈습니다.`,
      author: `대학생N잡러${idx}`,
      authorBadge: 'SBT 자격인증 · D-GCS 950점',
      role: 'worker',
      timestamp: `${idx % 12 + 1}시간 전`,
      likes: 40 + (idx * 4) % 150,
      views: 350 + (idx * 15) % 1200,
      storeCategory: '일상/땡썰',
      comments: []
    };
  } else {
    return {
      id: `post-gen-${idx}`,
      category: 'TIPS',
      categoryLabel: '💡 알바 꿀팁/질문',
      title: `D-GCS 신용점수 빠르게 990점 Platinum으로 끌어올리는 3가지 핵심 규칙 (${idx})`,
      content: `1. 정시 출근 스와이프 필수\n2. 노쇼 0건 유지 시 달마다 추가 신용점수 50점 부여\n3. 신한 슈퍼SOL 계좌 딥링크 연동 시 우수 알람 우선 발송\n성실함이 최고의 금융 스펙이 되는 시스템입니다!`,
      author: `꿀팁마스터${idx}`,
      authorBadge: 'Platinum 마스터 · D-GCS 990점',
      role: 'worker',
      timestamp: `${idx % 12 + 1}시간 전`,
      likes: 85 + (idx * 2) % 160,
      views: 550 + (idx * 18) % 1600,
      isHot: idx % 5 === 0,
      storeCategory: '꿀팁/노하우',
      comments: []
    };
  }
});
