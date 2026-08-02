import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as any;
    const { clockIn, clockOut, employerRating } = body;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated LLM Logic evaluating the worker's performance
    const creditScoreUp = 5;
    const limitUp = 500000;
    
    // In a real LLM scenario, the prompt would instruct it to identify patterns like "3 consecutive early clock-ins"
    const analysisText = `✨ AI 근태 분석 결과: 3일 연속 10분 조기 출근! 성실함이 입증되어 신한카드 긱 워커 마이너스 통장 한도가 +${(limitUp / 10000).toFixed(0)}만 원 증액되었습니다.`;

    return NextResponse.json({
      success: true,
      data: {
        analysisText,
        creditScoreUp,
        limitUp,
        newTotalLimit: 2000000
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
