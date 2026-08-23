'use client';

// app/components/GlobalTranslateChatModal.tsx
// 🌐 10개국어 AI 실시간 동시통역 글로벌 안심채팅 (Global Multi-lingual Chat)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Globe, Volume2, Send, CheckCircle2, Sparkles, MessageSquare,
  ArrowRight, ShieldCheck, Check, RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface GlobalTranslateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  workerName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'worker' | 'employer';
  textOriginal: string;
  textTranslated: string;
  langOriginal: string;
  langTarget: string;
  time: string;
}

const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', label: '베트남어' },
  { code: 'en', name: 'English', flag: '🇺🇸', label: '영어' },
  { code: 'zh', name: '中文', flag: '🇨🇳', label: '중국어' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', label: '일본어' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', label: '태국어' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳', label: '몽골어' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', label: '러시아어' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', label: '한국어' },
];

export default function GlobalTranslateChatModal({
  isOpen,
  onClose,
  storeName = '스타벅스 강남2호점 점주님',
  workerName = '조이수 (Nguyen Van A)',
}: GlobalTranslateChatModalProps) {
  const { triggerPush } = useAppPush();
  const [selectedLang, setSelectedLang] = useState<string>('vi'); // 기본 베트남어
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'employer',
      textOriginal: '안녕하세요! 오늘 14시 홀서빙 업무 오실 때 보건증 지참 부탁드립니다.',
      textTranslated: 'Xin chào! Khi bạn đến làm phục vụ sảnh lúc 14:00 hôm nay, vui lòng mang theo giấy chứng nhận sức khỏe.',
      langOriginal: 'ko',
      langTarget: 'vi',
      time: '13:10',
    },
    {
      id: 'm2',
      sender: 'worker',
      textOriginal: 'Vâng, tôi đã tải giấy khám sức khỏe lên ứng dụng rồi ạ. Tôi sẽ đến đúng giờ!',
      textTranslated: '네, 보건증은 앱에 이미 등록해 두었습니다. 정시에 도착하겠습니다!',
      langOriginal: 'vi',
      langTarget: 'ko',
      time: '13:12',
    },
  ]);

  if (!isOpen) return null;

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 간단한 AI 번역 시뮬레이션
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'worker',
      textOriginal: inputText,
      textTranslated: `[AI 번역: ${inputText}]`,
      langOriginal: selectedLang,
      langTarget: 'ko',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    triggerPush({
      title: '🌐 [실시간 AI 동시통역 전송]',
      body: `"${inputText}" 메시지가 점주님께 한국어로 실시간 번역되어 전송되었습니다.`,
      type: 'confirm',
    });
  };

  const handleSpeakText = (text: string, lang: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ko' ? 'ko-KR' : lang === 'vi' ? 'vi-VN' : lang === 'en' ? 'en-US' : 'ko-KR';
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  const handleQuickSend = (orig: string, trans: string) => {
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'worker',
      textOriginal: orig,
      textTranslated: trans,
      langOriginal: selectedLang,
      langTarget: 'ko',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);

    triggerPush({
      title: '🌐 [안심 퀵 메시지 전송]',
      body: `"${trans}" 메시지가 전송되었습니다.`,
      type: 'confirm',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl border border-blue-200 max-w-lg w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 글로벌 헤더 */}
          <div className="p-4.5 bg-gradient-to-r from-[#FB521C] via-[#0046FF] to-slate-950 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-lg shadow-inner border border-white/30">
                🌐
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30 tracking-tight">
                    10개국어 AI 실시간 동시통역
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-200">
                    Zero-Language Barrier
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-0.5 text-white tracking-tight">
                  글로벌 1:1 라이브 안심채팅
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 언어 선택 탭 바 (10개국어) */}
          <div className="bg-slate-100 p-2 border-b border-slate-200 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  selectedLang === lang.code
                    ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          {/* 3. 대화창 본문 */}
          <div className="p-4 overflow-y-auto space-y-3 text-xs flex-1 bg-slate-50">
            <div className="text-center my-2">
              <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">
                🔒 신한DS 온체인 보호 및 근로기준법 다국어 표준 준수
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender === 'worker';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isMe ? workerName : storeName} · {msg.time}
                  </span>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl shadow-xs space-y-1.5 ${
                      isMe
                        ? 'bg-gradient-to-r from-[#FB521C] to-orange-500 text-white rounded-tr-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* 원문 */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-xs leading-relaxed">{msg.textOriginal}</p>
                      <button
                        onClick={() => handleSpeakText(msg.textOriginal, msg.langOriginal)}
                        className={`p-1 rounded-lg transition-colors shrink-0 ${
                          isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="발음 듣기"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 실시간 번역문 */}
                    <div
                      className={`pt-1.5 border-t text-[11px] font-medium flex items-center justify-between gap-1.5 ${
                        isMe ? 'border-white/20 text-amber-100' : 'border-slate-100 text-blue-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{msg.textTranslated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. 원클릭 퀵 스마트 회신 칩 */}
          <div className="px-3 pt-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <button
              onClick={() => handleQuickSend('Tôi sẽ đến sau 10 phút ạ!', '10분 뒤에 매장에 도착합니다!')}
              className="py-1 px-2.5 bg-slate-100 hover:bg-orange-50 hover:text-[#FB521C] rounded-lg text-[10.5px] font-bold text-slate-600 whitespace-nowrap transition-colors cursor-pointer"
            >
              🚶 10분 뒤 도착
            </button>
            <button
              onClick={() => handleQuickSend('Tôi đã hoàn thành ca làm việc ạ.', '오늘 근무 완료했습니다.')}
              className="py-1 px-2.5 bg-slate-100 hover:bg-orange-50 hover:text-[#FB521C] rounded-lg text-[10.5px] font-bold text-slate-600 whitespace-nowrap transition-colors cursor-pointer"
            >
              ✅ 근무 완료 보고
            </button>
            <button
              onClick={() => handleQuickSend('Vị trí chính xác của cửa hàng ở đâu ạ?', '매장의 정확한 위치가 어디인가요?')}
              className="py-1 px-2.5 bg-slate-100 hover:bg-orange-50 hover:text-[#FB521C] rounded-lg text-[10.5px] font-bold text-slate-600 whitespace-nowrap transition-colors cursor-pointer"
            >
              📍 위치 문의
            </button>
          </div>

          {/* 5. 입력창 푸터 */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${currentLangObj.name} 또는 한국어로 입력하면 실시간 번역됩니다...`}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-[#FB521C]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-2xl bg-[#FB521C] hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
