'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, Eye, Sliders,
  RefreshCw, CheckCircle2, XCircle, Lock, Radio, Activity, Zap
} from 'lucide-react';
import { useAppPush } from './AppPushToast';

interface FdsRule {
  id: string;
  name: string;
  category: string;
  description: string;
  riskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  blockedToday: number;
  isActive: boolean;
}

export default function AdminFdsScreen() {
  const { triggerPush } = useAppPush();
  const [activeFdsTab, setActiveFdsTab] = useState<'realtime' | 'rules' | 'blacklist'>('realtime');
  const [isAiScanning, setIsAiScanning] = useState(true);

  const [rules, setRules] = useState<FdsRule[]>([
    {
      id: 'rule-01',
      name: '가상 GPS 모의위치 변조 차단',
      category: '위치 조작',
      description: 'Android Mock Location / 탈옥 기기 비정상 GPS 좌표 강제 차단',
      riskLevel: 'CRITICAL',
      blockedToday: 5,
      isActive: true,
    },
    {
      id: 'rule-02',
      name: '신한EZ 10분 내 동일 사고 중복 청구 차단',
      category: '보험 사기',
      description: '단시간 내 동일 사업장/동일 부위 다중 상해 청구 패턴 FDS 감지',
      riskLevel: 'HIGH',
      blockedToday: 3,
      isActive: true,
    },
    {
      id: 'rule-03',
      name: '대리 출퇴근 및 QR 스크린샷 방어',
      category: '출퇴근 조작',
      description: '동적 타임스탬프 OTP 및 BLE 비콘 15m 지오펜스 미일치 시 차단',
      riskLevel: 'HIGH',
      blockedToday: 4,
      isActive: true,
    },
    {
      id: 'rule-04',
      name: '초단기 고액 반복 정산 이상 송금 방어',
      category: '자금 세탁',
      description: '정규 근무 시간 대비 비정상 급여 송금 시 계좌 지급 일시 보류',
      riskLevel: 'MEDIUM',
      blockedToday: 0,
      isActive: true,
    },
  ]);

  const [liveLogs, setLiveLogs] = useState([
    { time: '14:24:12', type: 'SAFE', desc: '역삼동 CU 강남파이낸스점 BLE 비콘 15m 지오펜스 일치', action: '정상 승인 (신뢰도 99.9%)', ip: '121.134.**.**', isSafe: true },
    { time: '14:22:05', type: 'BLOCK', desc: '가상 GPS 모의위치 조작 탐지 (서울 ➔ 부산 0.1초 이동)', action: 'FDS Rule #1 작동 (차단)', ip: '211.234.**.**', isSafe: false },
    { time: '14:19:30', type: 'BLOCK', desc: '신한EZ 10분 내 동일 사고 중복 접수 감지', action: 'FDS Rule #2 작동 (반려)', ip: '175.209.**.**', isSafe: false },
    { time: '14:15:20', type: 'SAFE', desc: '강남구 역삼동 래미안 P2P 의뢰 ₩30,000 에스크로 해제', action: '정상 정산 완료', ip: '220.89.**.**', isSafe: true },
    { time: '14:08:44', type: 'SAFE', desc: '빽다방 역삼역점 조이수 워커 출근 도장 타임스탬프 박제', action: '블록 #18,492,104 승인', ip: '118.235.**.**', isSafe: true },
  ]);

  // FDS 룰 ON/OFF 토글
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextVal = !r.isActive;
          triggerPush({
            title: `[FDS 보안 룰 설정] ${r.name}`,
            body: nextVal ? '보안 룰이 활성화되어 24/7 실시간 스캐닝 중입니다.' : '보안 룰이 비활성화되었습니다 (주의).',
            type: 'confirm',
          });
          return { ...r, isActive: nextVal };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-4 font-sans pb-6 text-left">
      {/* 상단 FDS 관제 요약 전광판 (솔리드 다크) */}
      <div className="bg-[#0F172A] rounded-3xl p-4 sm:p-5 border border-slate-800 text-white shadow-xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-white">신한EZ 4중 AI FDS 실시간 관제</h4>
                <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  AI ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium">고의 자해 · 허위 출퇴근 · 보험 사기 0.1초 원천 차단율 99.98%</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-800/80 p-2 sm:p-0 rounded-xl sm:bg-transparent">
            <span className="text-[10px] text-slate-400 block font-mono font-semibold">오늘 차단된 이상 시도</span>
            <span className="text-lg sm:text-xl font-black text-rose-400 font-mono">12건 (100% 방어)</span>
          </div>
        </div>

        {/* 4대 방어 지표 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-[#090D16] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">GPS 조작 차단</span>
            <span className="text-base font-black text-rose-400 font-mono">5건</span>
          </div>
          <div className="bg-[#090D16] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">중복 청구 방어</span>
            <span className="text-base font-black text-amber-400 font-mono">3건</span>
          </div>
          <div className="bg-[#090D16] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">대리 출퇴근 방어</span>
            <span className="text-base font-black text-blue-400 font-mono">4건</span>
          </div>
          <div className="bg-[#090D16] p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">누적 피해 방어액</span>
            <span className="text-base font-black text-emerald-400 font-mono">₩1.42억원</span>
          </div>
        </div>
      </div>

      {/* 탭 스위처: 실시간 스트림 VS FDS 룰셋 관리 */}
      <div className="bg-white p-2 sm:p-2.5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveFdsTab('realtime')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
              activeFdsTab === 'realtime' ? 'bg-slate-900 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            실시간 탐지 스트림
          </button>
          <button
            onClick={() => setActiveFdsTab('rules')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
              activeFdsTab === 'rules' ? 'bg-slate-900 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            보안 룰셋 ({rules.filter((r) => r.isActive).length}/{rules.length})
          </button>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center justify-center gap-1 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          신한 FDS Engine v4.2
        </span>
      </div>

      {/* 1. 실시간 스트림 뷰 (선명한 고대비 라이트 카드) */}
      {activeFdsTab === 'realtime' && (
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider block px-1">
            실시간 트랜잭션 & 이상 징후 라이브 로그 (최근)
          </span>
          <div className="space-y-2 font-mono text-[11px]">
            {liveLogs.map((log, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  log.isSafe
                    ? 'bg-white border-slate-200 hover:border-emerald-300'
                    : 'bg-rose-50/90 border-rose-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-900 font-bold shrink-0">{log.time}</span>
                  <span
                    className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md border shrink-0 ${
                      log.isSafe
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {log.type}
                  </span>
                  <span className={`truncate font-semibold ${log.isSafe ? 'text-slate-900' : 'text-rose-950 font-bold'}`}>
                    {log.desc}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-medium">IP: {log.ip}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs ${
                      log.isSafe
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {log.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FDS 보안 룰셋 제어 뷰 */}
      {activeFdsTab === 'rules' && (
        <div className="space-y-2">
          {rules.map((r) => (
            <div
              key={r.id}
              className={`p-3.5 rounded-2xl border transition-all bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                !r.isActive ? 'opacity-60 bg-slate-50' : 'border-slate-200'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                    r.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                    r.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {r.riskLevel}
                  </span>
                  <h5 className="font-black text-xs text-slate-900">{r.name}</h5>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">[{r.category}]</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{r.description}</p>
                <span className="text-[10px] text-rose-600 font-bold block">
                  오늘 차단 실적: {r.blockedToday}건
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleRule(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shrink-0 ${
                  r.isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500 shadow-xs'
                    : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                }`}
              >
                {r.isActive ? '✓ 감시 가동중 (ON)' : '감시 중지 (OFF)'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
