'use client';

// app/components/LiveNotificationModal.tsx
// 상단 우측 🔔 알림 아이콘 클릭 시 표출되는 실시간 0.1초 정산/에스크로/보험 라이브 알림 센터 모달

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bell, Zap, Lock, ShieldCheck, TrendingUp, CheckCircle2,
  Clock, ArrowRight, Sparkles, Check
} from 'lucide-react';

export interface LiveNotificationItem {
  id: string;
  type: 'settlement' | 'escrow' | 'insurance' | 'invest' | 'cert';
  title: string;
  desc: string;
  timeAgo: string;
  amount?: string;
  badge: string;
  badgeColor: string;
  icon: any;
  iconBg: string;
}

export const LIVE_NOTIFICATION_LIST: LiveNotificationItem[] = [
  {
    id: 'n1',
    type: 'settlement',
    title: '0.1초 신한 모계좌 즉시 정산 완료',
    desc: '하남돼지집 부평역점 4시간 서빙 업무 종료 즉시 신한은행 모계좌(110-482-******)로 입금되었습니다.',
    timeAgo: '3초 전',
    amount: '₩58,000원',
    badge: '즉시정산 완료',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: Zap,
    iconBg: 'bg-emerald-600',
  },
  {
    id: 'n2',
    type: 'escrow',
    title: '신한은행 스마트 에스크로 락업 확정',
    desc: '스타벅스 강남2호점 매칭 시프트의 일당이 신한은행 BaaS 에스크로 금고에 안전하게 100% 예치되었습니다.',
    timeAgo: '2분 전',
    amount: '₩54,000원',
    badge: '에스크로 락업',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Lock,
    iconBg: 'bg-amber-600',
  },
  {
    id: 'n3',
    type: 'insurance',
    title: '신한EZ손보 초단기 마이크로 보험 가동',
    desc: '출근 스와이프 완료와 동시에 비급여 의료비 1,000만원 및 대물 배상 5,000만원 보장이 실시간 활성화되었습니다.',
    timeAgo: '5분 전',
    badge: '보험 보장 LIVE',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: ShieldCheck,
    iconBg: 'bg-cyan-600',
  },
  {
    id: 'n4',
    type: 'invest',
    title: '신한투자증권 끝전 + 점주 매칭 ETF 자동 매수',
    desc: '알바비 끝전(₩400)과 점주 5% 수수료 지원금(₩425)이 SOL 미국배당다우존스 ETF에 소수점 자동 적립되었습니다.',
    timeAgo: '12분 전',
    amount: '+₩825원',
    badge: '소수점 자동투자',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: TrendingUp,
    iconBg: 'bg-purple-600',
  },
  {
    id: 'n5',
    type: 'cert',
    title: '정부24 연동 보건증 AI Vision OCR 검증 완료',
    desc: '서울 강남구 보건소 발행 보건증(유효기간: 2027.03.14) 판독이 완료되어 음식점/카페 시프트 프리패스가 발급되었습니다.',
    timeAgo: '1시간 전',
    badge: '식품위생법 인증',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: CheckCircle2,
    iconBg: 'bg-blue-600',
  },
];

interface LiveNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveNotificationModal({
  isOpen,
  onClose,
}: LiveNotificationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden text-slate-900 flex flex-col max-h-[85vh]"
        >
          {/* 헤더 */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-amber-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white">실시간 알림 센터</h3>
                  <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-full bg-red-500 text-white">
                    {LIVE_NOTIFICATION_LIST.length}건 LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">신한 7-Core 자동 정산 & 에스크로 실시간 타임라인</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 알림 목록 바디 */}
          <div className="p-4 overflow-y-auto space-y-2.5 text-xs">
            {LIVE_NOTIFICATION_LIST.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-3.5 space-y-2 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}
                      >
                        <ItemIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 text-xs block">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {item.amount && (
                      <span className="font-black text-xs text-indigo-700 font-mono">
                        {item.amount}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded-xl border border-slate-200">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                    <span className="text-slate-400 font-mono">신한 BaaS 트랜잭션 정상</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 푸터 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[10.5px] text-slate-500">
              * 실시간 알림은 신한 슈퍼SOL 앱 푸시로 동시 발송됩니다.
            </span>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs active:scale-95 transition-all"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
