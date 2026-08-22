'use client';

// app/components/ApplicantLiveGpsModal.tsx
// 점주 및 개인 의뢰인을 위한 고도화된 실시간 지원자 GPS 관제 & AI 지각·노쇼 조기방어 시스템

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Navigation, Clock, ShieldCheck, Phone, MessageSquare,
  Sparkles, RefreshCw, AlertCircle, CheckCircle2, Battery, Radio,
  Send, Compass, Zap, Building2, User, Activity, AlertTriangle,
  Flame, ChevronRight, Volume2, Mic, Check, ArrowRight, ShieldAlert,
  Bike, Footprints, Train
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Map, MapMarker, Circle, CustomOverlayMap, Polyline } from 'react-kakao-maps-sdk';
import { useAppPush } from './AppPushToast';

interface ApplicantLiveGpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName?: string;
  applicantRole?: string;
  storeName?: string;
  targetStartTime?: string;
  storeLat?: number;
  storeLng?: number;
  initialWorkerLat?: number;
  initialWorkerLng?: number;
}

export default function ApplicantLiveGpsModal({
  isOpen,
  onClose,
  applicantName = '조이수',
  applicantRole = '오후 피크타임 바리스타 & 홀 서빙 (14:00~18:00)',
  storeName = '스타벅스 강남2호점',
  targetStartTime = '14:00',
  storeLat = 37.5002,
  storeLng = 127.0365,
  initialWorkerLat = 37.4972,
  initialWorkerLng = 127.0312,
}: ApplicantLiveGpsModalProps) {
  const { triggerPush } = useAppPush();

  // 지원자 실시간 GPS 좌표 (초단위 이동 시뮬레이션)
  const [workerLat, setWorkerLat] = useState(initialWorkerLat);
  const [workerLng, setWorkerLng] = useState(initialWorkerLng);
  const [distanceM, setDistanceM] = useState(480);
  const [etaMinutes, setEtaMinutes] = useState(5);
  const [speedKmh, setSpeedKmh] = useState(4.8);
  const [transportMode, setTransportMode] = useState<'walk' | 'bike' | 'transit'>('walk');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [geofenceEntered, setGeofenceEntered] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupTriggered, setBackupTriggered] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);

  // 안심 채팅창 상태
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: applicantName,
      text: '사장님 안녕하세요! 지하철 강남역 도착해서 매장으로 걸어가는 중입니다. 5분 내 도착합니다! 🏃',
      time: '13:51',
    },
  ]);
  const [inputChat, setInputChat] = useState('');

  // 카카오 맵 SDK 로드 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkKakao = () => {
        if ((window as any).kakao && (window as any).kakao.maps) {
          setKakaoLoaded(true);
        } else {
          setTimeout(checkKakao, 300);
        }
      };
      checkKakao();
    }
  }, []);

  // 이동 수단 변경 시 속도 및 ETA 재계산
  const handleTransportChange = (mode: 'walk' | 'bike' | 'transit') => {
    setTransportMode(mode);
    if (mode === 'walk') {
      setSpeedKmh(4.8);
      setEtaMinutes(Math.max(1, Math.round(distanceM / 80)));
    } else if (mode === 'bike') {
      setSpeedKmh(14.2);
      setEtaMinutes(Math.max(1, Math.round(distanceM / 230)));
    } else {
      setSpeedKmh(22.5);
      setEtaMinutes(Math.max(1, Math.round(distanceM / 350)));
    }
  };

  // 실시간 이동 시뮬레이션 (초단위로 매장 방향으로 전진)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setWorkerLat((prevLat) => {
        const stepRatio = transportMode === 'bike' ? 0.12 : transportMode === 'transit' ? 0.16 : 0.07;
        const delta = (storeLat - prevLat) * stepRatio;
        return prevLat + delta;
      });
      setWorkerLng((prevLng) => {
        const stepRatio = transportMode === 'bike' ? 0.12 : transportMode === 'transit' ? 0.16 : 0.07;
        const delta = (storeLng - prevLng) * stepRatio;
        return prevLng + delta;
      });

      setDistanceM((prev) => {
        const nextDist = Math.max(18, Math.round(prev * 0.91));
        if (nextDist <= 50 && !geofenceEntered) {
          setGeofenceEntered(true);
          confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
          triggerPush({
            title: `📍 [50m 지오펜스 진입 감지] ${applicantName} 지원자`,
            body: `${storeName} 반경 50m 내에 성공적으로 진입했습니다. 출근 체크인 준비 완료!`,
            type: 'confirm',
          });
        }
        return nextDist;
      });

      setEtaMinutes((prev) => Math.max(1, Math.round(prev * 0.91)));
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, storeLat, storeLng, geofenceEntered, transportMode, applicantName, storeName, triggerPush]);

  // 실시간 GPS 수동 핑 갱신
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerPush({
        title: '🛰️ [신한 안심관제 GPS 고정밀 핑 갱신]',
        body: `${applicantName} 지원자 좌표 수신 완료 (매장 잔여 ${distanceM}m, 정밀도 ±1.8m).`,
        type: 'confirm',
      });
    }, 500);
  };

  // 출근 독려 진동 푸시 발송
  const handleSendUrgePush = () => {
    triggerPush({
      title: '📢 [출근 알림톡 전송 완료]',
      body: `${applicantName} 지원자에게 "출근 10분 전 매장 50m 진입 안내"가 전송되었습니다.`,
      type: 'escrow',
    });
  };

  // 빠른 프리셋 메시지 전송
  const handleSendPreset = (presetText: string) => {
    const newMsg = {
      sender: '점주(나)',
      text: presetText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: applicantName,
          text: '확인했습니다 사장님! 곧 도착하겠습니다 🫡',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  // 일반 채팅 전송
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    handleSendPreset(inputChat.trim());
    setInputChat('');
  };

  // AI 음성 안내 재생
  const handlePlayVoice = () => {
    setVoicePlaying(true);
    setTimeout(() => setVoicePlaying(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[94vh]"
        >
          {/* 1. 상단 관제 헤더 */}
          <div className="p-4 bg-gradient-to-r from-[#0b0f19] via-[#111827] to-[#0b0f19] text-white flex items-center justify-between shrink-0 border-b border-indigo-900/40">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-md shrink-0 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                  alt={applicantName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-base text-white">{applicantName} 실시간 GPS 레이더</h3>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 font-mono">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    LIVE 5초 주기
                  </span>
                  {geofenceEntered && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/50 animate-bounce">
                      🎯 50m 지오펜스 진입
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-indigo-300 font-medium truncate mt-0.5">
                  {storeName} · 출근 {targetStartTime} (약 {etaMinutes}분 후 도착 예상)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleManualRefresh}
                title="GPS 위치 수동 갱신"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. 메인 스크롤 콘텐츠 영역 */}
          <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
            {/* 🏃 이동 수단 스위처 & 실시간 속도계 HUD */}
            <div className="bg-slate-900 text-white rounded-2xl p-2.5 flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
                <button
                  onClick={() => handleTransportChange('walk')}
                  className={`px-2.5 py-1 rounded-lg font-black text-[10.5px] flex items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'walk' ? 'bg-[#0046FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Footprints className="w-3 h-3" />
                  <span>도보</span>
                </button>
                <button
                  onClick={() => handleTransportChange('bike')}
                  className={`px-2.5 py-1 rounded-lg font-black text-[10.5px] flex items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'bike' ? 'bg-[#0046FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-3 h-3" />
                  <span>따릉이/자전거</span>
                </button>
                <button
                  onClick={() => handleTransportChange('transit')}
                  className={`px-2.5 py-1 rounded-lg font-black text-[10.5px] flex items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'transit' ? 'bg-[#0046FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Train className="w-3 h-3" />
                  <span>대중교통</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pr-2 font-mono text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  {speedKmh} km/h
                </span>
                <span className="text-amber-400 font-black">
                  잔여 {distanceM}m
                </span>
              </div>
            </div>

            {/* 🗺️ 3. 실시간 고정밀 지도 레이더 영역 */}
            <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
              {kakaoLoaded ? (
                <Map
                  center={{
                    lat: (storeLat + workerLat) / 2,
                    lng: (storeLng + workerLng) / 2,
                  }}
                  style={{ width: '100%', height: '100%' }}
                  level={4}
                >
                  {/* 매장 지오펜스 반경 50m 원 (출근 인정 영역) */}
                  <Circle
                    center={{ lat: storeLat, lng: storeLng }}
                    radius={50}
                    strokeWeight={2}
                    strokeColor="#FB521C"
                    strokeOpacity={0.9}
                    fillColor="#FB521C"
                    fillOpacity={0.18}
                  />

                  {/* 100m 사전 감지 원 */}
                  <Circle
                    center={{ lat: storeLat, lng: storeLng }}
                    radius={120}
                    strokeWeight={1}
                    strokeColor="#0046FF"
                    strokeOpacity={0.5}
                    fillColor="#0046FF"
                    fillOpacity={0.06}
                  />

                  {/* 실시간 이동 경로 점선 */}
                  <Polyline
                    path={[
                      { lat: workerLat, lng: workerLng },
                      { lat: storeLat, lng: storeLng },
                    ]}
                    strokeWeight={3.5}
                    strokeColor="#0046FF"
                    strokeOpacity={0.8}
                    strokeStyle="shortdash"
                  />

                  {/* 매장 마커 (도착지) */}
                  <CustomOverlayMap position={{ lat: storeLat, lng: storeLng }}>
                    <div className="px-2.5 py-1 bg-slate-950 text-white rounded-xl shadow-xl border-2 border-[#FB521C] text-[10.5px] font-black flex items-center gap-1 whitespace-nowrap -translate-y-8">
                      <Building2 className="w-3.5 h-3.5 text-[#FB521C]" />
                      <span>{storeName} (50m 출근지오펜스)</span>
                    </div>
                  </CustomOverlayMap>

                  {/* 지원자 실시간 GPS 이동 마커 */}
                  <CustomOverlayMap position={{ lat: workerLat, lng: workerLng }}>
                    <div className="relative flex flex-col items-center -translate-y-9">
                      <div className="px-2.5 py-1 bg-gradient-to-r from-[#0046FF] to-indigo-600 text-white rounded-xl shadow-xl border-2 border-white text-[10.5px] font-black flex items-center gap-1.5 whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>🏃 {applicantName} ({speedKmh}km/h)</span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-indigo-600 rotate-45 -mt-1 shadow-sm" />
                    </div>
                  </CustomOverlayMap>
                </Map>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4 space-y-2">
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  <p className="text-xs font-bold">카카오 고정밀 실시간 GPS 레이더 로딩 중...</p>
                </div>
              )}

              {/* 플로팅 ETA & 지오펜스 상태 바 */}
              <div className="absolute top-2.5 left-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md text-white p-2.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black">
                    <Navigation className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-white">매장까지 {distanceM}m</span>
                      <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                        도착 {etaMinutes}분 전
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-300 block mt-0.5">
                      현재 강남대로 방면 이동 중 · 정시 출근 확률 <strong>99.9%</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] text-slate-400 block font-mono">출근 시간</span>
                  <span className="text-xs font-black text-amber-400 font-mono">{targetStartTime}</span>
                </div>
              </div>

              {/* 지도 우측 하단 신한 안심관제 인프라 배지 */}
              <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-slate-200 text-[9px] font-mono text-slate-700 shadow-md z-10 flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  신한 안심관제 ON
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-0.5 text-slate-600 font-bold">
                  <Battery className="w-3 h-3 text-emerald-500" />
                  84%
                </span>
              </div>
            </div>

            {/* 4. 🔮 신한 AI 지각·노쇼 조기 경보 & 긴급 대체 워커 대기열 카드 */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 space-y-2.5 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-white flex items-center gap-1.5">
                      신한 AI 지각·노쇼 조기 방어 시스템
                    </h5>
                    <p className="text-[10px] text-indigo-300">
                      실시간 이동 속도 & GPS 궤적 머신러닝 분석: <strong>정상 출근 안정권</strong>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                  위험도 0.1%
                </span>
              </div>

              {/* 긴급 대체 인력 0초 콜 버튼 */}
              <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400">
                  만약 지원자 미도착 시? 반경 500m 즉시 투입 인원: <strong className="text-white">3명 대기 중</strong>
                </span>

                <button
                  onClick={() => {
                    setShowBackupModal(true);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-300 font-black text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>비상 대체 대기열 확인</span>
                </button>
              </div>
            </div>

            {/* 5. 🛡️ 신한EZ [출퇴근길 실시간 안심 상해보험] 라이브 보장 카드 */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-emerald-950">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h6 className="font-black text-xs text-emerald-900">
                    신한EZ손보 출근 이동 중 마이크로 상해보험 가동 중
                  </h6>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    집/역 ➔ 매장 이동 중 교통사고·상해 최대 ₩10,000,000 무상 보장 (점주·워커 0원 부담)
                  </p>
                </div>
              </div>
              <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono shrink-0">
                보증 활성
              </span>
            </div>

            {/* 6. 💬 점주 ↔ 지원자 실시간 안심톡 & 1초 빠른 프리셋 버튼 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  실시간 지원자 안심톡 & 빠른 안내
                </span>
                <span className="text-[9.5px] font-bold text-slate-400">0504 안심번호 암호화 연결</span>
              </div>

              {/* 빠른 프리셋 전송 칩들 */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {[
                  '🚪 매장 후문으로 들어오세요!',
                  '☕ 유니폼 준비해둘게요.',
                  '🚦 횡단보도 조심히 오세요!',
                  '📍 도착하시면 카운터로 와주세요.',
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPreset(preset)}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-bold text-[10px] transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* 메시지 리스트 */}
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === '점주(나)' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[11px] leading-relaxed ${
                        msg.sender === '점주(나)'
                          ? 'bg-[#0046FF] text-white rounded-tr-none shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                      }`}
                    >
                      <span className="text-[9px] font-bold block opacity-70 mb-0.5">{msg.sender}</span>
                      {msg.text}
                    </div>
                    <span className="text-[8.5px] text-slate-400 mt-0.5 px-1 font-mono">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* 메시지 입력창 & 음성 안내 */}
              <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  title="도담 AI 음성 변환 안내"
                  className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    voicePlaying
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="지원자에게 빠른 메시지를 입력하세요"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] font-medium text-slate-900 focus:outline-none focus:border-[#0046FF]"
                />

                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0046FF] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* 7. 안심 통화 & 출근 독려 알림 버튼 바 */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  alert('0504-****-1289 (신한 안심번호)로 안전하게 연결되었습니다.');
                }}
                className="py-2.5 px-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 active:scale-98 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>안심번호 전화 연결</span>
              </button>

              <button
                onClick={handleSendUrgePush}
                className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-200" />
                <span>출근 독려 알림톡 전송</span>
              </button>
            </div>
          </div>

          {/* 8. 푸터 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-slate-500 font-medium">
              * 매장 반경 50m 진입 시 점주 스마트폰으로 [출근 인증 가능] 푸시가 자동 전송됩니다.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs active:scale-98 transition-all cursor-pointer"
            >
              관제 닫기
            </button>
          </div>
        </motion.div>

        {/* 🚨 비상 1순위 대체 인력 대기열 팝업 모달 */}
        {showBackupModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-slate-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h4 className="font-black text-sm text-slate-900">비상 대체 워커 풀 (500m 이내)</h4>
                </div>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                현재 매장 인근 500m 내에서 <strong>즉시 투입 가능한 검증된 Top Pro 워커</strong> 목록입니다. 지각/노쇼 시 0초 원클릭으로 대체 요청할 수 있습니다.
              </p>

              <div className="space-y-2">
                {[
                  { name: '박민지', dist: '250m (도보 3분)', dgcs: 975, role: '카페 바리스타 1년+' },
                  { name: '최준혁', dist: '410m (도보 5분)', dgcs: 960, role: '식음료 홀서빙 6개월+' },
                  { name: '이지은', dist: '490m (도보 6분)', dgcs: 985, role: '스타벅스/투썸 경력자' },
                ].map((worker, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-slate-900">{worker.name}</span>
                        <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold font-mono">
                          D-GCS {worker.dgcs}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{worker.role} · {worker.dist}</p>
                    </div>

                    <button
                      onClick={() => {
                        setBackupTriggered(true);
                        setShowBackupModal(false);
                        triggerPush({
                          title: `⚡ [비상 대체 워커 자동 호출] ${worker.name}`,
                          body: `${worker.name} 워커에게 긴급 매칭 호출이 전달되었습니다 (5분 내 도착 대기).`,
                          type: 'confirm',
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10.5px] cursor-pointer"
                    >
                      즉시 호출
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
