import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as any;
    const { applicants, weather } = body;

    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulated LLM Logic mapping array of applicants
    const predictions = applicants.map((worker: any) => {
      if (worker.id === '이지성') {
        return {
          id: worker.id,
          age: 24,
          probability: 98,
          status: "출근 확률 98%",
          type: "excellent",
          analysisText: `최근 한 달 지각 0회. 내일 ${weather === 'Rainy' ? '비' : '맑은 날씨'} 예보를 반영하여 당일 노쇼 가능성이 거의 없는 최우수 지원자입니다.`
        };
      } else {
        return {
          id: worker.id,
          age: 21,
          probability: 15,
          status: "노쇼 주의",
          type: "warning",
          analysisText: `최근 1건의 당일 취소 이력이 감지되었습니다. 채용 시 리스크가 존재합니다.`
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        predictions
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
