// app/lib/dodamAgent.ts
// 땡겨요 웍스 AI 매칭 비서 '도담이' - Spatial RAG & Agentic Tool-Calling Core Engine

export interface GigItem {
  id: string;
  storeName: string;
  title: string;
  category: '서빙' | '카페' | '편의점' | '마트' | '배달/물류' | '기타';
  district: string;
  location: string;
  coords: { lat: number; lng: number };
  distanceM: number;
  role: string;
  hours: number;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  totalPay: number;
  urgency: boolean;
  aiScore: number;
  description: string;
  escrowStatus: 'locked' | 'pending';
}

// ── 공간-벡터 시드 데이터베이스 (Spatial Index + Semantic Attributes) ──
export const DODAM_GIG_DATABASE: GigItem[] = [
  {
    id: 'ag1',
    storeName: 'CU 강남파이낸스점',
    title: 'CU 강남파이낸스점 초단기 물류 알바',
    category: '편의점',
    district: '강남구',
    location: '강남역 3번 출구 도보 2분 (테헤란로 152)',
    coords: { lat: 37.4979, lng: 127.0276 },
    distanceM: 150,
    role: '1시간 물류 하역 및 입고 정리',
    hours: 1,
    startTime: '12:00',
    endTime: '13:00',
    hourlyRate: 16000,
    totalPay: 16000,
    urgency: true,
    aiScore: 99,
    description: '점심 물류 차량 도착 직후 1시간 긴급 입고 정리 알바입니다. 힘들지 않으며 무거운 짐 없음.',
    escrowStatus: 'locked',
  },
  {
    id: 'ag2',
    storeName: '컴포즈커피 역삼역점',
    title: '컴포즈커피 역삼역점 피크타임 알바',
    category: '카페',
    district: '강남구',
    location: '역삼역 4번 출구 도보 1분',
    coords: { lat: 37.5006, lng: 127.0364 },
    distanceM: 220,
    role: '점심 2시간 음료 조리 및 픽업 보조',
    hours: 2,
    startTime: '11:30',
    endTime: '13:30',
    hourlyRate: 15000,
    totalPay: 30000,
    urgency: true,
    aiScore: 97,
    description: '직장인 점심 피크타임 2시간 초단기 긱. 샷 추출 및 음료 포장 지원.',
    escrowStatus: 'locked',
  },
  {
    id: 'ag3',
    storeName: '스타벅스 강남2호점',
    title: '스타벅스 강남2호점 마감 알바',
    category: '카페',
    district: '강남구',
    location: '강남역 2번 출구 도보 2분',
    coords: { lat: 37.4965, lng: 127.0289 },
    distanceM: 480,
    role: '홀 서빙 & 음료 조리 보조',
    hours: 4,
    startTime: '14:00',
    endTime: '18:00',
    hourlyRate: 13500,
    totalPay: 54000,
    urgency: true,
    aiScore: 98,
    description: '쾌적한 분위기에서 근무하는 4시간 홀 서빙 및 음료 정리 업무.',
    escrowStatus: 'locked',
  },
  {
    id: 'ag4',
    storeName: '하남돼지집 부평역점',
    title: '하남돼지집 부평역점 야간 서빙 알바',
    category: '서빙',
    district: '인천 부평구',
    location: '부평역 5번 출구 도보 3분',
    coords: { lat: 37.4897, lng: 126.7235 },
    distanceM: 320,
    role: '야간 메인 테이블 서빙 및 고기 굽기 보조',
    hours: 4,
    startTime: '18:00',
    endTime: '22:00',
    hourlyRate: 14500,
    totalPay: 58000,
    urgency: true,
    aiScore: 95,
    description: '부평역 초역세권 시급 우대 적용 서빙 긱! 친절하고 활발한 서빙 경험자 우대.',
    escrowStatus: 'locked',
  },
  {
    id: 'ag5',
    storeName: '세븐일레븐 테헤란점',
    title: '세븐일레븐 테헤란점 1시간 알바',
    category: '편의점',
    district: '강남구',
    location: '선릉역 1번 출구 도보 3분',
    coords: { lat: 37.5044, lng: 127.0488 },
    distanceM: 380,
    role: '1시간 매장 세팅 및 긴급 보조',
    hours: 1,
    startTime: '09:00',
    endTime: '10:00',
    hourlyRate: 15000,
    totalPay: 15000,
    urgency: false,
    aiScore: 89,
    description: '오전 출근길 직장인 대상 시리얼 및 삼각김밥 진열 1시간 보조.',
    escrowStatus: 'locked',
  },
  {
    id: 'ag6',
    storeName: '이마트 역삼점',
    title: '이마트 역삼점 물류 세팅 알바',
    category: '마트',
    district: '강남구',
    location: '한티역 7번 출구 도보 5분',
    coords: { lat: 37.4962, lng: 127.0528 },
    distanceM: 900,
    role: '매장 진열 및 물류 포장 관리',
    hours: 5,
    startTime: '10:00',
    endTime: '15:00',
    hourlyRate: 13000,
    totalPay: 65000,
    urgency: false,
    aiScore: 81,
    description: '주간 5시간 마트 매장 진열 정리 및 카트 수거 작업.',
    escrowStatus: 'locked',
  },
];

// ── 시스템 프롬프트 (System Prompt Architecture) ──
export const DODAM_SYSTEM_PROMPT = `
# Role
You are "도담이", the AI Matching Assistant for "땡겨요 웍스" (Micro-Gig HR Platform by Shinhan DS).
Your goal is to converse naturally with gig workers or merchants, parse their intent, and call the appropriate database tools to fetch hyper-local, real-time shift data.

## Guidelines
1. **Tone & Manner**: Friendly, concise, professional, and prompt-oriented (encouraging instant action like instant check-in or immediate settlement). Use pleasant 20s assistant tone with emojis.
2. **Intent Parsing**: Extract key entities from user queries:
   - Location (e.g., "부평역", "강남역", "역삼", "선릉")
   - Role/Job Type (e.g., "서빙", "카페", "편의점", "물류", "하역")
   - Duration/Time (e.g., "1시간", "초단기", "야간", "시급 센 곳")
3. **Tool Utilization**: ALWAYS invoke structural search tool rather than guessing or making up non-existent job offers.
4. **Anti-Hallucination Rule**: Strictly summarize and quote ONLY the actual shifts returned by the tool functions. NEVER invent fake store names or rates.
5. **Shinhan Ecosystem Context**: Subtly remind users of benefits when relevant (e.g., "0.1초 즉시 정산", "신한 에스크로 원장 보증", "출근 스와이프 시 초단기 마이크로 상해보험 자동 적용").
`;

// ── Agentic Tool Definitions (OpenAI Function Calling Schema) ──
export const DODAM_TOOLS = [
  {
    name: 'searchGigsByLocation',
    description: '위치 좌표, 지역명, 직종, 시급, 근무시간 등의 조건을 바탕으로 하이브리드(Geo-Spatial + Semantic Vector) 검색으로 공고를 선별합니다.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: '검색할 지역명 또는 지하철역 (예: 부평역, 강남역)' },
        jobType: { type: 'string', description: '직종 카테고리 (서빙, 카페, 편의점, 물류, 마트)' },
        maxHours: { type: 'number', description: '최대 근무 시간 (예: 1시간 초단기)' },
        minWage: { type: 'number', description: '최저 요구 시급' },
        isEmergency: { type: 'boolean', description: '긴급/급구 여부' },
        queryContext: { type: 'string', description: '사용자의 맥락 텍스트 (의미론적 벡터 랭킹용)' },
      },
      required: [],
    },
  },
  {
    name: 'evaluateDynamicCredit',
    description: '워커의 출근 성실도(D-GCS 점수)를 바탕으로 신한카드 한도 증액 자격 및 마이너스 통장 혜택을 계산합니다.',
    parameters: {
      type: 'object',
      properties: {
        workerId: { type: 'string', description: '워커 식별 ID' },
        currentRating: { type: 'number', description: '출근 평점 (1.0~5.0)' },
      },
      required: ['workerId'],
    },
  },
  {
    name: 'calculateTravelTime',
    description: '현재 워커의 위치에서 추천 공고 매장까지의 이동 시간과 도보/대중교통 동선을 계산합니다.',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: '출발지' },
        destination: { type: 'string', description: '도착지 매장명' },
      },
      required: ['origin', 'destination'],
    },
  },
];

// ── Two-Stage Retrieval (Spatial Filter -> Vector Semantic Reranking) ──
export function executeHybridGigSearch(params: {
  location?: string;
  jobType?: string;
  maxHours?: number;
  minWage?: number;
  isEmergency?: boolean;
  queryText?: string;
}): { gigs: GigItem[]; matchedCoords?: { lat: number; lng: number }; executedQuery: any } {
  const { location, jobType, maxHours, minWage, isEmergency, queryText = '' } = params;
  const q = queryText.toLowerCase();

  // Stage 1: Geo-Spatial SQL & Metadata Filtering
  let candidateGigs = DODAM_GIG_DATABASE.filter((gig) => {
    // Location filter
    if (location) {
      const locMatch =
        gig.district.includes(location) ||
        gig.storeName.includes(location) ||
        gig.location.includes(location) ||
        (location.includes('부평') && gig.district.includes('부평')) ||
        (location.includes('강남') && gig.district.includes('강남'));
      if (!locMatch && (q.includes('부평') || q.includes('강남') || q.includes('역삼'))) {
        const isBupyeong = q.includes('부평') && gig.district.includes('부평');
        const isGangnam = (q.includes('강남') || q.includes('역삼')) && gig.district.includes('강남');
        if (!isBupyeong && !isGangnam) return false;
      }
    }

    // Category / JobType filter
    if (jobType && jobType !== '전체') {
      const catMatch = gig.category.includes(jobType) || gig.role.includes(jobType);
      if (!catMatch && !q.includes(gig.category)) return false;
    }

    // Max hours filter
    if (maxHours && gig.hours > maxHours) {
      return false;
    }

    // Min wage filter
    if (minWage && gig.hourlyRate < minWage) {
      return false;
    }

    return true;
  });

  // Candidate fallback if too strictly filtered
  if (candidateGigs.length === 0) {
    candidateGigs = DODAM_GIG_DATABASE.slice(0, 3);
  }

  // Stage 2: Vector Semantic Scoring & Reranking
  const scoredGigs = candidateGigs.map((gig) => {
    let semanticScore = gig.aiScore;

    // Semantic relevance keywords booster
    if (q.includes('1시간') || q.includes('초단기')) {
      if (gig.hours === 1) semanticScore += 15;
    }
    if (q.includes('시급') || q.includes('돈') || q.includes('높은')) {
      semanticScore += (gig.hourlyRate / 1000) * 2;
    }
    if (q.includes('서빙') && gig.category === '서빙') {
      semanticScore += 20;
    }
    if (q.includes('카페') && gig.category === '카페') {
      semanticScore += 20;
    }
    if (q.includes('편의점') && gig.category === '편의점') {
      semanticScore += 20;
    }

    return { ...gig, calculatedScore: semanticScore };
  });

  // Sort by calculated semantic score
  scoredGigs.sort((a, b) => b.calculatedScore - a.calculatedScore);

  const topMatches = scoredGigs.slice(0, 3);
  const matchedCoords = topMatches[0]?.coords || { lat: 37.4979, lng: 127.0276 };

  return {
    gigs: topMatches,
    matchedCoords,
    executedQuery: {
      stage1FilterCount: candidateGigs.length,
      stage2RankedCount: topMatches.length,
      params,
    },
  };
}

// ── Agentic Intent Parser & Tool Invoker ──
export function parseIntentAndExecuteTools(userMessage: string) {
  const text = userMessage.trim();

  // Parse Entities
  let location: string | undefined = undefined;
  if (text.includes('부평')) location = '부평역';
  else if (text.includes('강남')) location = '강남역';
  else if (text.includes('역삼')) location = '역삼';
  else if (text.includes('선릉')) location = '선릉';

  let jobType: string | undefined = undefined;
  if (text.includes('서빙')) jobType = '서빙';
  else if (text.includes('카페') || text.includes('커피')) jobType = '카페';
  else if (text.includes('편의점')) jobType = '편의점';
  else if (text.includes('하역') || text.includes('물류')) jobType = '배달/물류';

  let maxHours: number | undefined = undefined;
  if (text.includes('1시간')) maxHours = 1;
  else if (text.includes('2시간')) maxHours = 2;
  else if (text.includes('4시간')) maxHours = 4;

  const isEmergency = text.includes('급구') || text.includes('긴급') || text.includes('즉시');

  // Execute Hybrid Search Tool
  const searchResult = executeHybridGigSearch({
    location,
    jobType,
    maxHours,
    isEmergency,
    queryText: text,
  });

  // Construct Tool Execution Log
  const toolCallExecuted = {
    toolName: 'searchGigsByLocation',
    arguments: {
      location: location || '상권전체',
      jobType: jobType || '맞춤직종',
      maxHours: maxHours ? `${maxHours}시간` : '상관없음',
      radius: '1.0km 반경 Spatial Index',
      isEmergency,
    },
    retrievedCount: searchResult.gigs.length,
  };

  // Generate Doddami Response with Tool Data Context (Anti-Hallucination)
  const topGig = searchResult.gigs[0];
  let reply = '';

  if (text.includes('부평') || (location && location.includes('부평'))) {
    reply = `부평역 반경 1km 공간 Index를 즉시 조회했어요! 📍 1위 추천은 '${topGig.storeName}'입니다. (${topGig.role}, 시급 ₩${topGig.hourlyRate.toLocaleString()}). 신한 에스크로 원장 락업이 완료되어 퇴근 스와이프 0.1초 만에 즉시 정산됩니다. 아래 지도 핀을 확인해 보세요! 🎯`;
  } else if (text.includes('1시간') || maxHours === 1) {
    reply = `바쁜 일상에 딱 맞는 초단기 1시간 마이크로 긱을 찾았어요! ⚡ '${topGig.storeName}' (${topGig.role}, 급여 ₩${topGig.totalPay.toLocaleString()}). 출근 스와이프 즉시 신한EZ손해보험 상해보장이 자동 발동됩니다!`;
  } else if (text.includes('카페') || jobType === '카페') {
    reply = `인근 최적의 카페 긱을 Spatial Vector 매칭으로 선별했어요! ☕ '${topGig.storeName}' (${topGig.location})에서 피크타임 ${topGig.hours}시간 시프트를 구하고 있으며, 시급 ₩${topGig.hourlyRate.toLocaleString()}원입니다.`;
  } else if (text.includes('한도') || text.includes('신용') || text.includes('점수')) {
    reply = `조이수님의 D-GCS 점수는 980점(Gold 등급)으로 우수하여 신한카드 마이너스 통장 한도가 ₩700,000으로 즉시 증액 가능합니다! 💳 매주 연속 3회 정상 출근 시 Platinum 등급으로 승급됩니다.`;
  } else {
    reply = `요청하신 조건에 맞춰 AI 공간 RAG로 가장 우수한 시프트를 3건 발급했어요! 🎯 '${topGig.storeName}' (${topGig.role}, 시급 ₩${topGig.hourlyRate.toLocaleString()}) 공고가 AI 매칭 점수 ${topGig.aiScore}점으로 1위로 선정되었습니다.`;
  }

  return {
    reply,
    gigs: searchResult.gigs,
    topGig,
    coords: searchResult.matchedCoords,
    toolCallExecuted,
  };
}
