'use client';

// app/components/AppPushToast.tsx
// 모바일 네이티브 앱 푸시 알림 엔진 (iOS / Android 스타일)

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Zap, ShieldCheck, ChevronRight, X, Sparkles } from 'lucide-react';

export interface AppPushMessage {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'apply' | 'confirm' | 'escrow' | 'ai';
  actionText?: string;
  onAction?: () => void;
}

interface PushContextType {
  triggerPush: (msg: Omit<AppPushMessage, 'id' | 'time'>) => void;
  notifications: AppPushMessage[];
}

const PushContext = createContext<PushContextType>({
  triggerPush: () => {},
  notifications: [],
});

export const useAppPush = () => useContext(PushContext);

export function AppPushProvider({ children }: { children: React.ReactNode }) {
  const [activePush, setActivePush] = useState<AppPushMessage | null>(null);
  const [notifications, setNotifications] = useState<AppPushMessage[]>([]);

  const triggerPush = useCallback((msg: Omit<AppPushMessage, 'id' | 'time'>) => {
    const newPush: AppPushMessage = {
      ...msg,
      id: `push-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      time: '방금 전',
    };

    setNotifications(prev => [newPush, ...prev]);
    setActivePush(newPush);

    // 4.5초 후 자동 닫힘
    setTimeout(() => {
      setActivePush(current => (current?.id === newPush.id ? null : current));
    }, 4500);
  }, []);

  return (
    <PushContext.Provider value={{ triggerPush, notifications }}>
      {children}

      {/* 모바일 상단 네이티브 푸시 알림 토스트 (iOS Dynamic Island / Android Push Banner Style) */}
      <AnimatePresence>
        {activePush && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-[390px] z-[9999] pointer-events-auto"
          >
            <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-blue-500/40 text-white rounded-3xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex items-start gap-3 relative overflow-hidden">
              {/* 푸시 네온 글로우 */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

              {/* 아이콘 */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-500/30">
                {activePush.type === 'confirm' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                ) : activePush.type === 'escrow' ? (
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                ) : activePush.type === 'ai' ? (
                  <Sparkles className="w-5 h-5 text-indigo-300" />
                ) : (
                  <Zap className="w-5 h-5 text-amber-300" />
                )}
              </div>

              {/* 푸시 본문 */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    <Bell className="w-3 h-3 animate-bounce" /> 신한 땡겨요 웍스 · PUSH
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{activePush.time}</span>
                </div>
                <h4 className="font-black text-xs text-white truncate">{activePush.title}</h4>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{activePush.body}</p>

                {activePush.actionText && (
                  <button
                    onClick={() => {
                      activePush.onAction?.();
                      setActivePush(null);
                    }}
                    className="mt-2 text-[10px] font-black text-blue-300 hover:text-white bg-blue-500/20 border border-blue-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 active:scale-95 transition-all"
                  >
                    {activePush.actionText} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={() => setActivePush(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PushContext.Provider>
  );
}
