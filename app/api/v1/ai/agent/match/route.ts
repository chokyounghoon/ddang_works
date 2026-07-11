import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as any;
    const { currentBalance, targetBalance, location, weather } = body;

    // TODO: In a real environment, use Vercel AI SDK (e.g., generateText) with OpenAI API here.
    // For now, simulate the AI generation latency (1.5s) to mimic LLM inference.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated LLM Logic
    const remaining = (targetBalance || 1500000) - (currentBalance || 1380000);
    const formattedRemaining = (remaining / 10000).toFixed(0);
    
    let aiText = `이지성님, 아이패드 구매 목표까지 ${formattedRemaining}만 원 남았어요! `;
    if (weather === 'Rainy') {
      aiText += `내일 비 예보가 있어 배달 단가가 올랐습니다. 동선이 겹치는 '스타벅스 강남점(48,000원)'을 다녀오시면 이번 주 목표 달성 확률 99%입니다.`;
    } else {
      aiText += `동선이 겹치는 '스타벅스 강남점(48,000원)'을 다녀오시면 이번 주 목표 달성 확률 99%입니다.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        message: aiText,
        recommendedGig: {
          id: "GIG_STARBUCKS_GN02",
          title: "스타벅스 강남점",
          expectedPay: 48000,
          time: "14:00 - 18:00 (4h)",
          distance: "도보 10분 거리",
          weatherPremium: weather === 'Rainy'
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
