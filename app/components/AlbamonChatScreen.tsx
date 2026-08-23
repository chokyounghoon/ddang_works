'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, CheckCircle2, Clock, MapPin, Phone,
  ShieldCheck, Sparkles, Store, User, Search, Plus, ChevronLeft,
  CreditCard, ChevronRight, Image as ImageIcon, FileText, AlertCircle,
  ThumbsUp, Zap, Building2, Filter, Check, ArrowRight, ShieldAlert, Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGigStore } from '../../store/useGigStore';
import { GENERATED_200_CHAT_ROOMS } from '../lib/chatRoomsData';

export type ChatMessage = {
  id: string;
  sender: 'worker' | 'employer' | 'system';
  text: string;
  timestamp: string;
  isRead?: boolean;
  cardType?: 'gig_offer' | 'baas_payout' | 'location_share' | 'contract_confirm';
  cardData?: any;
};

export type ChatRoom = {
  id: string;
  gigId: string;
  storeName: string;
  category: string;
  employerName: string;
  applicantName: string;
  wage: number;
  shiftTime: string;
  aiMatchScore: number;
  status: 'APPLIED' | 'CONTRACT_CONFIRMED' | 'WORKING' | 'COMPLETED';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isSurge: boolean;
  avatarBg: string;
  messages: ChatMessage[];
};

export default function AlbamonChatScreen() {
  const [rooms, setRooms] = useState<ChatRoom[]>(GENERATED_200_CHAT_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'confirmed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewRole, setViewRole] = useState<'worker' | 'employer'>('worker');
  const [isReplying, setIsReplying] = useState(false);

  const { appliedGig } = useGigStore();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (activeRoomId) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rooms, activeRoomId, isReplying]);

  // If user applied to a gig from map/list, check if room exists or auto create/select
  useEffect(() => {
    if (appliedGig) {
      const existing = rooms.find(r => r.gigId === appliedGig.id);
      if (existing) {
        setActiveRoomId(existing.id);
      } else {
        const newRoomId = `room-${Date.now()}`;
        const newRoom: ChatRoom = {
          id: newRoomId,
          gigId: appliedGig.id,
          storeName: appliedGig.title,
          category: '급구 긱워크',
          employerName: '매장 사장님',
          applicantName: '나 (지원자)',
          wage: appliedGig.hourly_wage,
          shiftTime: `${appliedGig.startTime || '12:00'} ~ ${appliedGig.endTime || '13:00'} (${appliedGig.hours || 1}시간)`,
          aiMatchScore: 99,
          status: 'APPLIED',
          lastMessage: '⚡ 지원이 완료되었습니다. 사장님과의 1:1 대화방이 생성되었습니다.',
          lastMessageTime: '방금 전',
          unreadCount: 0,
          isSurge: appliedGig.is_surge || false,
          avatarBg: 'bg-orange-500',
          messages: [
            {
              id: 'm-init-1',
              sender: 'system',
              text: `⚡ [AI 땡격발 지원] '${appliedGig.title}' 공고에 지원이 성공적으로 완료되었습니다!`,
              timestamp: '방금 전',
            },
            {
              id: 'm-init-2',
              sender: 'employer',
              text: `안녕하세요! '${appliedGig.title}' 지원 확인했습니다. 궁금하신 사항이나 출근 확정 문의를 남겨주세요!`,
              timestamp: '방금 전',
              isRead: true,
            },
          ],
        };
        setRooms(prev => [newRoom, ...prev]);
        setActiveRoomId(newRoomId);
      }
    }
  }, [appliedGig]);

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const handleSendMessage = (customText?: string, cardType?: any, cardData?: any) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !cardType) return;
    if (!activeRoomId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: viewRole,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      cardType,
      cardData,
    };

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        return {
          ...r,
          lastMessage: textToSend || '카드 메시지를 보냈습니다.',
          lastMessageTime: '방금 전',
          messages: [...r.messages, newMsg],
        };
      }
      return r;
    }));

    if (!customText) setInputText('');

    // Simulate realistic AI counterpart response
    setIsReplying(true);
    setTimeout(() => {
      setIsReplying(false);
      const replySender = viewRole === 'worker' ? 'employer' : 'worker';
      let autoReplyText = '';

      if (viewRole === 'worker') {
        const replies = [
          '네, 확인했습니다! 신한 0.1초 퇴근 정산 조건으로 출근 확정 진행해드릴게요. 👍',
          '알겠습니다! 매장에 10분 전에 도착해주시면 바로 준비 도와드리겠습니다.',
          '감사합니다! D-GCS 신용 우수자로 인증되셔서 바로 매칭 승인되었습니다.',
          '네 점주입니다. 매장 위치는 강남역 2번 출구 앞이며, 오시면 포스기 쪽으로 찾아오시면 됩니다.',
        ];
        autoReplyText = replies[Math.floor(Math.random() * replies.length)];
      } else {
        const replies = [
          '네 사장님! 지연 없이 정확한 시간에 맞춰 도착하겠습니다. 0.1초 정산 감사합니다!',
          '확인했습니다! 보관된 땡겨요 SBT 이력서 참고 부탁드립니다.',
          '감사합니다 점주님! 오늘 최선을 다해 근무하겠습니다.',
        ];
        autoReplyText = replies[Math.floor(Math.random() * replies.length)];
      }

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: replySender,
        text: autoReplyText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };

      setRooms(prev => prev.map(r => {
        if (r.id === activeRoomId) {
          return {
            ...r,
            lastMessage: autoReplyText,
            lastMessageTime: '방금 전',
            messages: [...r.messages, replyMsg],
          };
        }
        return r;
      }));
    }, 1200);
  };

  const handleConfirmContract = () => {
    if (!activeRoomId) return;
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5517', '#10B981', '#3B82F6', '#F59E0B'],
    });

    const confirmMsg: ChatMessage = {
      id: `confirm-${Date.now()}`,
      sender: 'system',
      text: '🎉 [채용 확정 완료] 점주님과 지원자 간 긱계약이 체결되었습니다. 근무 완료 후 0.1초 이내 정산금이 신한 BaaS 계좌로 자동 전송됩니다.',
      timestamp: '방금 전',
      cardType: 'contract_confirm',
      cardData: { wage: activeRoom?.wage, hours: 1, total: activeRoom?.wage },
    };

    setRooms(prev => prev.map(r => {
      if (r.id === activeRoomId) {
        return {
          ...r,
          status: 'CONTRACT_CONFIRMED',
          lastMessage: '🎉 채용이 최종 확정되었습니다!',
          messages: [...r.messages, confirmMsg],
        };
      }
      return r;
    }));
  };

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.storeName.includes(searchQuery) || r.employerName.includes(searchQuery) || r.applicantName.includes(searchQuery);
    if (!matchesSearch) return false;
    if (filter === 'unread') return r.unreadCount > 0;
    if (filter === 'confirmed') return r.status === 'CONTRACT_CONFIRMED';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
      {/* ─── 상단 서브 헤더 (Instawork 스타일 땡톡) ─── */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {activeRoomId && (
            <button
              onClick={() => setActiveRoomId(null)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FB521C] to-amber-500 flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black tracking-tight text-slate-900">
                  {activeRoomId ? activeRoom?.storeName : '땡톡 1:1 채팅'}
                </h2>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-50 text-[#FB521C] border border-orange-200">
                  실시간 LBS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {activeRoomId ? `${activeRoom?.employerName} · ${activeRoom?.category}` : '점주 & 지원자 간 0.1초 즉시 소통'}
              </p>
            </div>
          </div>
        </div>

        {/* 지원자 뷰 / 점주 뷰 스위처 버튼 */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewRole('worker')}
            className={`text-[9.5px] font-bold px-2 py-1 rounded-lg transition-all ${
              viewRole === 'worker'
                ? 'bg-[#FB521C] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            지원자 모드
          </button>
          <button
            onClick={() => setViewRole('employer')}
            className={`text-[9.5px] font-bold px-2 py-1 rounded-lg transition-all ${
              viewRole === 'employer'
                ? 'bg-slate-900 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            점주 모드
          </button>
        </div>
      </div>

      {/* ─── 메인 영역 ─── */}
      {!activeRoomId ? (
        /* 1. 채팅방 목록 화면 (Chat Room List) */
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-slate-50/50">
          {/* 검색 및 필터 바 */}
          <div className="p-3.5 bg-white border-b border-slate-100 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="매장명 또는 점주/지원자 이름 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FB521C] transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilter('all')}
                className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
                  filter === 'all'
                    ? 'bg-[#FB521C] border-[#FB521C] text-white font-black'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                전체 ({rooms.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
                  filter === 'unread'
                    ? 'bg-[#FB521C] border-[#FB521C] text-white font-black'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                안읽음 ({rooms.filter(r => r.unreadCount > 0).length})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
                  filter === 'confirmed'
                    ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white font-black'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                채용 확정 ({rooms.filter(r => r.status === 'CONTRACT_CONFIRMED').length})
              </button>
            </div>
          </div>

          {/* 채팅 목록 아이템들 */}
          <div className="divide-y divide-slate-100 bg-white">
            {filteredRooms.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                대화 내역이 없습니다.
              </div>
            ) : (
              filteredRooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    // Mark as read
                    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
                  }}
                  className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative group"
                >
                  <div className={`w-11 h-11 rounded-2xl ${room.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs relative`}>
                    <Store className="w-5 h-5" />
                    {room.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <h3 className="text-xs font-black text-slate-900 truncate">{room.storeName}</h3>
                        {room.isSurge && (
                          <span className="text-[8.5px] font-black px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                            🔥 긴급대타
                          </span>
                        )}
                      </div>
                      <span className="text-[9.5px] text-slate-400 shrink-0">{room.lastMessageTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mb-1">
                      <span>{viewRole === 'worker' ? room.employerName : room.applicantName}</span>
                      <span>·</span>
                      <span className="text-[#1D4ED8] font-bold">₩{room.wage.toLocaleString()}/h</span>
                      <span>·</span>
                      <span className="text-emerald-600 font-bold">AI {room.aiMatchScore}%</span>
                    </div>

                    <p className="text-xs text-slate-600 truncate font-normal leading-relaxed">
                      {room.lastMessage}
                    </p>

                    {/* 하단 상태 태그 */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {room.status === 'CONTRACT_CONFIRMED' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 채용 확정 완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-[#1D4ED8] border border-blue-200">
                          <Clock className="w-2.5 h-2.5" /> 매칭 협의 중
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        <ShieldCheck className="w-2.5 h-2.5 text-[#1D4ED8]" /> 0.1초 정산 가능
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors self-center shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* 2. 1:1 대화 상세 화면 (Chat Room Detail) */
        <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
          {/* 상단 긱 공고 요약 컨텍스트 바 */}
          {activeRoom && (
            <div className="bg-white border-b border-slate-200 p-2.5 px-3.5 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-[#1D4ED8] flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 truncate">{activeRoom.storeName}</span>
                    <span className="text-[9px] font-bold text-[#1D4ED8] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 shrink-0">
                      ₩{activeRoom.wage.toLocaleString()}/h
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-medium truncate">
                    근무: {activeRoom.shiftTime} · 수수료 0원 0.1초 정산
                  </p>
                </div>
              </div>

              {/* 계약 체결 버튼 */}
              {activeRoom.status !== 'CONTRACT_CONFIRMED' ? (
                <button
                  onClick={handleConfirmContract}
                  className="bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-95 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 shrink-0 transition-all"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {viewRole === 'employer' ? '채용 확정하기' : '출근 확정하기'}
                </button>
              ) : (
                <span className="text-[9.5px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" /> 계약 완료
                </span>
              )}
            </div>
          )}

          {/* 메시지 리스트 영역 */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
            {activeRoom?.messages.map((msg) => {
              const isSelf = msg.sender === viewRole;
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="bg-blue-50/90 border border-blue-200 text-blue-950 text-[10.5px] px-3.5 py-2 rounded-2xl max-w-[92%] text-center shadow-2xs space-y-1">
                      <p className="font-medium leading-normal">{msg.text}</p>
                      {msg.cardType === 'contract_confirm' && (
                        <div className="mt-1.5 pt-1.5 border-t border-blue-200/80 flex items-center justify-between text-[9.5px] font-mono text-[#1D4ED8]">
                          <span>시급: ₩{msg.cardData?.wage?.toLocaleString()}원</span>
                          <span>신한 BaaS 계좌 자동입금 픽스</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  {!isSelf && (
                    <div className="w-7 h-7 rounded-xl bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                      {msg.sender === 'employer' ? '점' : '지'}
                    </div>
                  )}

                  <div className={`max-w-[78%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                    {!isSelf && (
                      <span className="text-[9px] text-slate-500 font-bold mb-0.5 ml-1">
                        {msg.sender === 'employer' ? activeRoom.employerName : activeRoom.applicantName}
                      </span>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isSelf
                          ? 'bg-[#FB521C] text-white rounded-br-xs shadow-xs font-medium'
                          : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200/90 shadow-2xs font-normal'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[8.5px] text-slate-400 font-mono">{msg.timestamp}</span>
                      {isSelf && (
                        <span className="text-[8.5px] text-[#FB521C] font-bold">읽음</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isReplying && (
              <div className="flex justify-start items-center gap-2 text-slate-500 text-xs my-2">
                <span className="animate-spin w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-500 rounded-full" />
                <span className="text-[10px]">상대방이 메시지를 작성하고 있습니다...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* 알바몬 스마트 톡 퀵 액션 칩들 */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => handleSendMessage('📍 매장 위치 확인 완료했습니다. 10분 전 사전 도착하겠습니다!')}
              className="text-[9.5px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 whitespace-nowrap active:scale-95 transition-all"
            >
              📍 위치 확인
            </button>
            <button
              onClick={() => handleSendMessage('⏰ 오늘 피크타임 출퇴근 스케줄 변경 가능한가요?')}
              className="text-[9.5px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 whitespace-nowrap active:scale-95 transition-all"
            >
              ⏰ 시간 문의
            </button>
            <button
              onClick={() => handleSendMessage('💳 신한 0.1초 퇴근 정산 보증계좌로 바로 체결 요청합니다.')}
              className="text-[9.5px] font-bold px-2.5 py-1 rounded-xl bg-orange-50 text-[#FB521C] border border-orange-200 hover:bg-orange-100 whitespace-nowrap active:scale-95 transition-all"
            >
              💳 0.1초 정산 요청
            </button>
            <button
              onClick={() => handleSendMessage('🎉 채용 확정해 주시면 즉시 근무 준비 완료합니다!')}
              className="text-[9.5px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 whitespace-nowrap active:scale-95 transition-all"
            >
              🎉 확정 요청
            </button>
          </div>

          {/* 메시지 입력 폼 */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSendMessage('📸 [이미지 전달] 보건증 및 신분인증 사본 전송 완료')}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="사진/파일 첨부"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={`${viewRole === 'worker' ? '점주님' : '지원자'}에게 메시지 보내기...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FB521C] transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#FB521C] disabled:bg-slate-200 text-white disabled:text-slate-400 transition-all active:scale-95 shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
