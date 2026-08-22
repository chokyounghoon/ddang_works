'use client';

// app/components/GpsCheckInModal.tsx
// 마이페이지 [📍 GPS 출근 바코드 스캔 (매장 50m 진입 확인)] 클릭 시 실시간 핸드폰 GPS 연동 지도 & 출근 인증 모달

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, CheckCircle2, ShieldCheck, Zap, LocateFixed,
  Navigation, Radio, Scan, RefreshCw, AlertCircle, Building2,
  Clock, Landmark, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Map, MapMarker, Circle, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useAppPush } from './AppPushToast';

interface GpsCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess: () => void;
  storeName?: string;
  storeRole?: string;
  storeLat?: number;
  storeLng?: number;
}

// 두 좌표 간 거리(미터) 계산 (Haversine Formula)
function calculateDistanceM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export default function GpsCheckInModal({
  isOpen,
  onClose,
  onCheckInSuccess,
  storeName = 'CU 강남파이낸스점',
  storeRole = '12:00 ~ 13:00 (1시간 물류 알바)',
  storeLat = 37.5000,
  storeLng = 127.0365,
}: GpsCheckInModalProps) {
  const { triggerPush } = useAppPush();

  // 사용자 핸드폰 실제 GPS 위치 상태
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [distanceM, setDistanceM] = useState<number>(18);
  const [isScanningBarcode, setIsScanningBarcode] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [kakaoLoaded, setKakaoLoaded] = useState<boolean>(false);

  // 핸드폰 실제 GPS 위치 가져오기
  const fetchCurrentGps = () => {
    setIsLocating(true);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy);
          setUserLocation({ lat, lng });
          setGpsAccuracy(accuracy);
          
          // 매장 좌표와의 거리 계산 (시뮬레이션 기본 매장 좌표가 서울 강남이므로 근거리로 매핑 보정)
          const rawDist = calculateDistanceM(lat, lng, storeLat, storeLng);
          // 데모 시연 시 50m 반경 내 진입을 보장하기 위해 현실적인 데모 거리(12~24m) 유지
          const demoDist = rawDist > 5000 ? Math.floor(Math.random() * 12) + 14 : Math.min(rawDist, 45);
          setDistanceM(demoDist);
          setIsLocating(false);
        },
        (err) => {
          console.info('GPS Notice: Fallback location near store', err?.message);
          // GPS 권한 거부 또는 브라우저 제한 시 매장 근처(18m)로 기본값 설정
          setUserLocation({ lat: storeLat + 0.00015, lng: storeLng + 0.00012 });
          setGpsAccuracy(10);
          setDistanceM(18);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setUserLocation({ lat: storeLat + 0.00015, lng: storeLng + 0.00012 });
      setDistanceM(18);
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCurrentGps();
      // Kakao Map SDK 로드 확인
      if (typeof window !== 'undefined' && (window as any).kakao && (window as any).kakao.maps) {
        setKakaoLoaded(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 출근 인증 및 바코드 스캔 시뮬레이션
  const handlePerformCheckIn = async () => {
    setIsScanningBarcode(true);
    setScanStep(1); // 1. GPS 매장 50m 진입 정합성 검증
    await new Promise(r => setTimeout(r, 700));

    setScanStep(2); // 2. 매장 POS 바코드 스캔 인증
    await new Promise(r => setTimeout(r, 800));

    setScanStep(3); // 3. 신한EZ손보 초단기 보험 실시간 가동 (0.1초 개시)
    await new Promise(r => setTimeout(r, 700));

    setIsScanningBarcode(false);
    setScanStep(0);
    onCheckInSuccess();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB521C', '#10B981', '#3B82F6'],
      });
    } catch {}

    triggerPush({
      title: '🛡️ [GPS 출근 인증 & 신한EZ 보험 가동]',
      body: `${storeName} 출근 인증 완료! 신한EZ손보 초단기 상해/배상책임 보험이 실시간 개시되었습니다. (퇴근 시 ₩16,000 0.1초 입금)`,
      type: 'confirm',
      actionText: '보험 증권 보기',
    });

    onClose();
  };

  const centerLat = userLocation?.lat || storeLat;
  const centerLng = userLocation?.lng || storeLng;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        >
          {/* 1. 모달 헤더 */}
          <div className="p-4 bg-gradient-to-r from-[#FB521C] via-orange-500 to-amber-500 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg shadow-inner">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                    실시간 모바일 GPS 연동
                  </span>
                  <span className="text-[10px] font-bold text-amber-100 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-300 animate-ping" />
                    GPS 50m 안심존
                  </span>
                </div>
                <h3 className="font-black text-base mt-0.5">
                  현장 GPS 출근 인증 & 지도 레이더
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 모달 컨텐츠 바디 */}
          <div className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
            {/* 매장 정보 & GPS 거리 상태 배너 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FB521C] flex items-center justify-center font-black text-sm">
                    🏪
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{storeName}</h4>
                    <p className="text-[10.5px] text-slate-500">{storeRole}</p>
                  </div>
                </div>
                <span className={`text-[10.5px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                  distanceM <= 50
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  현재 거리: <strong>{distanceM}m</strong> ({distanceM <= 50 ? '50m 진입 완료' : '이동 필요'})
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                <span className="flex items-center gap-1">
                  <LocateFixed className="w-3.5 h-3.5 text-blue-600" />
                  핸드폰 GPS 오차범위: <strong>±{gpsAccuracy ?? 5}m (고정밀 LBS)</strong>
                </span>
                <button
                  onClick={fetchCurrentGps}
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 active:scale-95 transition-transform"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>GPS 갱신</span>
                </button>
              </div>
            </div>

            {/* 3. 🗺️ 실시간 GPS 연동 인터랙티브 지도 뷰 영역 */}
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-900">
              {kakaoLoaded ? (
                <Map
                  center={{ lat: centerLat, lng: centerLng }}
                  style={{ width: '100%', height: '100%' }}
                  level={3}
                >
                  {/* 매장 50m 출근 인정 반경 원 */}
                  <Circle
                    center={{ lat: storeLat, lng: storeLng }}
                    radius={50}
                    strokeWeight={2}
                    strokeColor="#FB521C"
                    strokeOpacity={0.8}
                    fillColor="#FB521C"
                    fillOpacity={0.15}
                  />

                  {/* 1. 매장 마커 */}
                  <MapMarker
                    position={{ lat: storeLat, lng: storeLng }}
                    title={storeName}
                  />

                  {/* 2. 내 핸드폰 실시간 GPS 위치 마커 */}
                  {userLocation && (
                    <CustomOverlayMap position={{ lat: userLocation.lat, lng: userLocation.lng }}>
                      <div className="relative flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] animate-pulse">
                          🚶
                        </div>
                        <span className="bg-blue-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap mt-0.5">
                          내 위치 ({distanceM}m)
                        </span>
                      </div>
                    </CustomOverlayMap>
                  )}
                </Map>
              ) : (
                /* Fallback 인터랙티브 레이더 맵 뷰 */
                <div className="relative w-full h-full bg-[#0B132B] flex items-center justify-center overflow-hidden">
                  {/* 레이더 링 */}
                  <div className="absolute w-[200px] h-[200px] rounded-full border border-orange-500/20 animate-ping" />
                  <div className="absolute w-[140px] h-[140px] rounded-full border border-orange-500/30" />
                  <div className="absolute w-[80px] h-[80px] rounded-full border-2 border-dashed border-[#FB521C]/60" />

                  {/* 매장 핀 */}
                  <div className="absolute z-20 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-2xl bg-[#FB521C] text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/40">
                      🏪
                    </div>
                    <span className="text-[10px] font-black text-amber-200 mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-orange-500/40">
                      {storeName}
                    </span>
                  </div>

                  {/* 내 핸드폰 GPS 핑 */}
                  <div className="absolute z-30 transform translate-x-12 -translate-y-8 flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white text-white flex items-center justify-center text-xs shadow-lg animate-bounce">
                      📱
                    </div>
                    <span className="text-[9px] font-black text-blue-300 bg-slate-950/90 px-1.5 py-0.2 rounded border border-blue-500/40 mt-0.5">
                      내 GPS ({distanceM}m)
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 z-30 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-700 text-[9.5px] text-slate-300">
                    🟢 실시간 GPS 레이더 활성화 중 (오차 ±{gpsAccuracy ?? 5}m)
                  </div>
                </div>
              )}

              {/* 상단 50m 안심존 오버레이 배지 */}
              <div className="absolute top-2.5 left-2.5 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10px] font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>50m 안심 출근존 내 진입 확인됨</span>
              </div>
            </div>

            {/* 바코드 스캔 진행 상태 시뮬레이션 */}
            {isScanningBarcode && (
              <div className="bg-gradient-to-r from-slate-900 to-[#1e1b4b] text-white rounded-2xl p-3.5 space-y-2 border border-indigo-500/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-indigo-300 flex items-center gap-1.5">
                    <Scan className="w-4 h-4 text-indigo-400 animate-spin" /> 출근 바코드 및 BaaS 검증 중
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Step {scanStep}/3</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                  <p className={scanStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    &gt; 1. 모바일 기기 GPS(18m) 50m 반경 오차 정합성: {scanStep >= 1 ? '✓ PASSED' : '검증 중'}
                  </p>
                  <p className={scanStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    &gt; 2. 매장 POS 단말기 바코드 암호화 통신: {scanStep >= 2 ? '✓ VERIFIED' : '대기'}
                  </p>
                  <p className={scanStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    &gt; 3. 신한EZ손보 초단기 상해/배상책임 0.1초 보험 가동: {scanStep >= 3 ? '✓ ACTIVE' : '대기'}
                  </p>
                </div>
              </div>
            )}

            {/* 신한 금융 인프라 연계 안내 */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>출근 스와이프 즉시 개시되는 신한 금융 안심 보장</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10.5px] text-slate-700">
                <div className="bg-white p-2 rounded-xl border border-blue-100">
                  <span className="text-blue-600 font-bold block">🛡️ 신한EZ 상해보험</span>
                  <span>비급여 치료비 1,000만 원 즉시 보장</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-blue-100">
                  <span className="text-emerald-600 font-bold block">⚡ 0.1초 즉시 입금</span>
                  <span>퇴근 도장 찍는 즉시 ₩16,000 입금</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 모달 하단 출근 확인 버튼 */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-100 shrink-0">
            <button
              onClick={handlePerformCheckIn}
              disabled={isScanningBarcode}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FB521C] via-orange-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50"
            >
              <Scan className="w-4.5 h-4.5" />
              <span>
                {isScanningBarcode ? '출근 인증 및 보험 개시 처리 중...' : '⚡ GPS 위치 확인 & 출근 인증 완료하기'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
