import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// ── 긱 지도 시드 데이터베이스 (지역별 및 업종별 동적 매칭) ──
const GIG_DATABASE = [
  {
    keywords: ['부평', '인천', '부평역'],
    title: '하남돼지집 부평역점',
    category: '서빙/주방',
    wage: 14500,
    time: '18:00–22:00 (4h)',
    surge: true,
    location: '부평역 5번 출구 도보 3분',
    coords: { lat: 37.4897, lng: 126.7235 },
    reason: '부평역 초역세권 급구 야간 서빙! 우대 시급 14,500원 적용 중입니다.',
  },
  {
    keywords: ['강남', '강남역', '역삼', '카페'],
    title: '스타벅스 강남2호점',
    category: '카페/바리스타',
    wage: 13500,
    time: '14:00–18:00 (4h)',
    surge: false,
    location: '강남역 2번 출구 도보 2분',
    coords: { lat: 37.4979, lng: 127.0276 },
    reason: '강남역 피크타임 커피 음료 제조 및 매장 관리 업무입니다.',
  },
  {
    keywords: ['홍대', '마포', '신촌'],
    title: '투썸플레이스 홍대입구역점',
    category: '카페',
    wage: 13000,
    time: '12:00–16:00 (4h)',
    surge: true,
    location: '홍대입구역 9번 출구 앞',
    coords: { lat: 37.5563, lng: 126.9228 },
    reason: '주말 물량 증가로 우천 할증 인센티브 +1,000원 추가 제공!',
  },
  {
    keywords: ['서초', '교대', '양재'],
    title: '파리바게트 서초중앙점',
    category: '베이커리/매장',
    wage: 12800,
    time: '08:00–12:00 (4h)',
    surge: false,
    location: '서초역 1번 출구 도보 4분',
    coords: { lat: 37.4918, lng: 127.0079 },
    reason: '오전 마이크로 긱! 빵 포장 및 쾌적한 매장 관리 업무입니다.',
  },
  {
    keywords: ['구월', '인천시청', '남동'],
    title: 'CU 인천구월 로데오점',
    category: '편의점',
    wage: 13000,
    time: '22:00–02:00 (4h)',
    surge: true,
    location: '인천1호선 예술회관역 도보 5분',
    coords: { lat: 37.4452, lng: 126.7025 },
    reason: '심야 야간수당 포함 단기 긱. 퇴근 즉시 신한은행 모계좌 이체!',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as any;
    const { messages = [], userContext } = body || {};
    const lastUserMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || '';

    // OpenAI API Key가 환경변수에 존재하는 경우
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== 'sk-placeholder') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `당신은 '신한 땡겨요 웍스'의 AI 금융/긱 매칭 비서 '도담이'입니다.
밝고 친근한 20대 어시스턴트 톤(존댓말)으로 사용자의 알바 구직 문의나 금융 질문에 2-3문장 이내로 명확하고 도움이 되게 답변하세요.
답변 마지막에 사용자의 요구사항에 부합하는 알바를 추천하는 자연스러운 멘트를 포함하세요.`
              },
              ...messages.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.text || m.content || '',
              }))
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const replyText = data.choices[0]?.message?.content ?? '';

          // 매칭되는 긱 검색
          const matchedGig = findMatchedGig(lastUserMessage);

          return NextResponse.json({
            success: true,
            reply: replyText,
            gig: matchedGig,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('OpenAI API call failed, falling back to Doddami AI engine:', e);
      }
    }

    // ── 도담이 지능형 AI 응답 엔진 (API 키 없는 환경용) ──
    const matchedGig = findMatchedGig(lastUserMessage);
    const replyText = generateDoddamiReply(lastUserMessage, matchedGig);

    return NextResponse.json({
      success: true,
      reply: replyText,
      gig: matchedGig,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'AI 응답 처리 중 오류가 발생했습니다.',
    }, { status: 500 });
  }
}

function findMatchedGig(userText: string) {
  const text = userText.toLowerCase();
  for (const gig of GIG_DATABASE) {
    if (gig.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      return gig;
    }
  }
  // 기본값
  return GIG_DATABASE[0];
}

function generateDoddamiReply(userText: string, gig: typeof GIG_DATABASE[0]): string {
  const text = userText;

  if (text.includes('부평') || text.includes('인천')) {
    return `네! 부평지역에서 가장 평가가 좋은 급구 긱을 찾았어요! 📍 '${gig.title}'에서 오늘 야간 서빙을 구하고 있고, 시급 ${gig.wage.toLocaleString()}원으로 우대 적용 중이에요. 아래 지도에서 확인해 보세요! 😊`;
  }
  if (text.includes('카페') || text.includes('커피')) {
    return `카페 긱을 찾으시군요! ☕ '${gig.title}' 피크타임 건이 딱 맞아요. 매장 위치가 지하철역 도보 2분 거리라 동선도 깔끔하답니다! 지도에서 상세 정보를 보실 수 있어요.`;
  }
  if (text.includes('배달') || text.includes('라이더')) {
    return `오늘 날씨와 이동 동선을 계산해보니 배달 할증 긱이 아주 유망해요! 🛵 1시간당 최대 ₩18,000 수입이 기대되며, 정산금은 퇴근 즉시 신한은행 계좌로 입금돼요!`;
  }
  if (text.includes('주말') || text.includes('급구')) {
    return `주말 단기 급구 긱 목록을 뽑아드렸어요! 🔥 '${gig.title}'에서 에스크로 락업이 완료된 검증된 공고가 있어요. 퇴근 스와이프 1번으로 즉시 정산받으실 수 있답니다.`;
  }
  if (text.includes('정산') || text.includes('돈') || text.includes('급여')) {
    return `땡겨요 웍스는 퇴근 스와이프 0.1초 만에 신한은행 모계좌로 즉시 정산해 드려요! 💳 일당 끝전 1천원 미만은 신한투자증권 ETF로 자동 소수점 매수까지 연동된답니다!`;
  }

  return `조이수님, 요청하신 질문에 딱 맞는 최적의 긱을 지도에 불러왔어요! 🎯 '${gig.title}' (${gig.location}) 공고는 시급 ${gig.wage.toLocaleString()}원에 에스크로 보증금 잠금이 완료된 안전한 일자리예요!`;
}
