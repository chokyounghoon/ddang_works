'use client';

// app/components/VoiceDodamModal.tsx
// 🎙️ 차세대 실시간 멀티모달 보이스 AI 어시스턴트 "보이스 도담이" (Gemini Live / Siri 스타일 3D Orb)

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, X, Sparkles, Zap, ArrowRight, Volume2,
  CheckCircle2, Store, DollarSign, Clock, MessageSquare, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface VoiceDodamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionMatch?: (query: string) => void;
  onActionCheckout?: () => void;
  onActionChat?: () => void;
}

export default function VoiceDodamModal({
  isOpen,
  onClose,
  onActionMatch,
  onActionCheckout,
  onActionChat,
}: VoiceDodamModalProps) {
  const { triggerPush } = useAppPush();
  const [isListening, setIsListening] = useState<boolean>(true);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('듣고 있어요... 원하시는 조건을 편하게 말씀해주세요.');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [actionTriggered, setActionTriggered] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setSpeaking(false);
      setTranscript('듣고 있어요... 원하시는 조건을 편하게 말씀해주세요.');
      setAiResponse('');
      setActionTriggered(null);

      // 햅틱 진동
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([20, 30]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVoiceQuery = (query: string, reply: string, actionType: 'match' | 'checkout' | 'chat') => {
    setIsListening(false);
    setTranscript(`"${query}"`);
    setSpeaking(true);
    setAiResponse(reply);
    setActionTriggered(actionType);

    // TTS 발화 (브라우저 지원 시)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([30, 50, 30]);
    }

    setTimeout(() => {
      setSpeaking(false);
    }, 2800);
  };

  const handleExecuteAction = () => {
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}

    if (actionTriggered === 'match' && onActionMatch) {
      onActionMatch('강남역 카페');
    } else if (actionTriggered === 'checkout' && onActionCheckout) {
      onActionCheckout();
    } else if (actionTriggered === 'chat' && onActionChat) {
      onActionChat();
    }

    triggerPush({
      title: '🎙️ [보이스 도담이 음성 명령 실행]',
      body: '요청하신 음성 명령이 즉시 실행되었습니다.',
      type: 'confirm',
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-b from-slate-900 via-[#0b0f19] to-slate-950 rounded-[36px] shadow-2xl border border-orange-500/30 max-w-md w-full overflow-hidden text-white flex flex-col max-h-[92vh] relative"
        >
          {/* 상단 닫기 바 */}
          <div className="p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB521C] animate-ping" />
              <span className="text-xs font-black text-white tracking-tight flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                보이스 도담이 (Gemini Live)
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 중앙 3D 글로잉 오브 (Orb) & 사운드 파동 비주얼라이저 */}
          <div className="py-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* 후광 앰비언트 글로우 */}
            <div className="absolute w-64 h-64 bg-gradient-to-tr from-[#FB521C]/30 via-purple-600/30 to-[#0046FF]/30 rounded-full blur-3xl pointer-events-none" />

            {/* 시리 / 제미나이 스타일 3D 펄싱 오브 */}
            <motion.div
              animate={{
                scale: speaking ? [1, 1.18, 0.95, 1.1, 1] : isListening ? [1, 1.08, 1] : 1,
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: speaking ? 1.5 : 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#FB521C] via-[#FF3E00] to-[#0046FF] p-1 shadow-[0_0_50px_rgba(251,82,28,0.5)] flex items-center justify-center cursor-pointer select-none"
              onClick={() => setIsListening(!isListening)}
            >
              <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
                {isListening ? (
                  <Mic className="w-10 h-10 text-[#FB521C] animate-pulse" />
                ) : speaking ? (
                  <Volume2 className="w-10 h-10 text-amber-300 animate-bounce" />
                ) : (
                  <MicOff className="w-10 h-10 text-slate-500" />
                )}
                <span className="text-[10px] font-mono text-slate-300 mt-1">
                  {speaking ? '말하는 중...' : isListening ? '듣는 중...' : '터치하여 시작'}
                </span>
              </div>
            </motion.div>

            {/* 실시간 오디오 사운드바 웨이브 */}
            <div className="flex items-center gap-1.5 mt-6 h-6">
              {[40, 70, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: speaking || isListening ? [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`] : '4px',
                  }}
                  transition={{
                    duration: 0.6 + (i % 3) * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1 bg-gradient-to-t from-[#FB521C] to-amber-300 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* 인식된 텍스트 & AI 대화창 */}
          <div className="px-5 pb-4 space-y-3 text-xs flex-1">
            <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>실시간 음성 트랜스크립트</span>
              </div>
              <p className="text-sm font-bold text-white leading-relaxed">
                {transcript}
              </p>
            </div>

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-950/40 via-purple-950/30 to-blue-950/40 rounded-2xl p-3.5 border border-orange-500/40 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-[10.5px] text-amber-300 font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>도담이의 실시간 답변</span>
                </div>
                <p className="text-xs font-medium text-slate-200 leading-relaxed">
                  {aiResponse}
                </p>

                {actionTriggered && (
                  <button
                    onClick={handleExecuteAction}
                    className="w-full py-2.5 bg-gradient-to-r from-[#FB521C] to-orange-500 hover:brightness-105 active:scale-98 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                    <span>바로 실행하기 (0.1초 원터치)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            )}

            {/* 빠른 추천 음성 프롬프트 칩 */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold block">
                💡 이렇게 말씀해보세요 (터치하면 바로 시연):
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() =>
                    handleVoiceQuery(
                      '강남역 2시간 시급 1.8만원 카페 찾아줘',
                      '반경 300m 내 스타벅스 강남2호점에서 긴급 홀서빙(시급 1.8만원)을 구인 중입니다. D-GCS 980점 우대로 0.1초 계약서를 바로 발행할까요?',
                      'match'
                    )
                  }
                  className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 rounded-xl text-left text-[11px] text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>☕ "강남역 2시간 시급 1.8만원 카페 찾아줘"</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>

                <button
                  onClick={() =>
                    handleVoiceQuery(
                      '오늘 일한 알바비 지금 당장 계좌로 땡겨줘',
                      'CU 강남파이낸스점 근무 완료건 ₩16,000원이 신한 BaaS 에스크로를 통해 0.1초 만에 조이수님의 신한 주거래 모계좌로 즉시 입금됩니다.',
                      'checkout'
                    )
                  }
                  className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 rounded-xl text-left text-[11px] text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>⚡ "오늘 일한 알바비 지금 당장 계좌로 땡겨줘"</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>

                <button
                  onClick={() =>
                    handleVoiceQuery(
                      '점주님께 10분 뒤 도착한다고 메시지 보내줘',
                      'CU 강남파이낸스점 점주님 전용 포스기와 땡톡으로 "10분 뒤 매장 도착 예정입니다" 브리핑을 0.1초 만에 전송했습니다.',
                      'chat'
                    )
                  }
                  className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 rounded-xl text-left text-[11px] text-slate-200 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>💬 "점주님께 10분 뒤 도착한다고 메시지 보내줘"</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
