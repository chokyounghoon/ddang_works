'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MapPin, DollarSign, CheckCircle2, ChevronRight, Landmark, CreditCard, ShieldCheck, TrendingUp, Cpu, LocateFixed } from 'lucide-react';
import confetti from 'canvas-confetti';

type Gig = {
  id: string;
  title: string;
  hourly_wage: number;
  is_surge: boolean;
  lat: number;
  lng: number;
  status: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
};

interface GigMapViewProps {
  initialCenter?: { lat: number; lng: number };
  onGigSelect?: (gigId: string | null) => void;
}

// 점주 모드 및 WORKER_OFFSETS 제거됨

import { useGigStore } from '../../store/useGigStore';

export default function GigMapView({ initialCenter, onGigSelect }: GigMapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);

  const { appliedGig, setAppliedGig, setSelectedMapGig, setChatTriggerMessage, highlightedGigIds } = useGigStore();

  const mapRef = useRef<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.4979, lng: 127.0276 }); // 기본 강남역
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const fetchGigs = async (lat: number, lng: number) => {
    try {
      const res = await fetch('/api/gigs.json');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = (await res.json()) as { gigs: Gig[] };
      // 상대 오프셋 데이터를 기반으로 사용자의 현재 지도 중심 좌표에 합산하여 실시간 동적 핀 완성
      const mappedGigs = (data.gigs || []).map(g => ({
        ...g,
        lat: lat + g.lat,
        lng: lng + g.lng
      }));
      setGigs(mappedGigs);
    } catch (err) {
      console.warn('Failed to fetch gigs from server, using local dynamic generation:', err);
      // 혹시 모를 네트워크 유실 대안
      const localGigs: Gig[] = [
        { id: 'g1', title: 'CU 강남파이낸스점 1시간 물류알바', lat: lat + 0.0012, lng: lng + 0.0015, hourly_wage: 16000, is_surge: true, status: 'OPEN', hours: 1, startTime: '12:00', endTime: '13:00' },
        { id: 'g2', title: '컴포즈커피 역삼역점 2시간 음료조리', lat: lat - 0.0021, lng: lng - 0.0018, hourly_wage: 15000, is_surge: false, status: 'OPEN', hours: 2, startTime: '11:30', endTime: '13:30' },
        { id: 'g3', title: '인근 빽다방 오후알바', lat: lat + 0.0035, lng: lng - 0.0025, hourly_wage: 14000, is_surge: true, status: 'OPEN', hours: 1, startTime: '14:00', endTime: '15:00' },
        { id: 'g4', title: '올리브영 재고정리', lat: lat + 0.0020, lng: lng + 0.0040, hourly_wage: 14500, is_surge: true, status: 'OPEN', hours: 4, startTime: '15:00', endTime: '19:00' },
        { id: 'g5', title: '스타벅스 리저브 마감', lat: lat - 0.0030, lng: lng + 0.0022, hourly_wage: 12500, is_surge: false, status: 'OPEN', hours: 3, startTime: '19:00', endTime: '22:00' }
      ];
      setGigs(localGigs);
    }
  };

  useEffect(() => {
    if (initialCenter) {
      setMapCenter(initialCenter);
      fetchGigs(initialCenter.lat, initialCenter.lng);
      return;
    }

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          fetchGigs(loc.lat, loc.lng);
        },
        (error) => {
          console.warn('Geolocation failed', error);
          fetchGigs(mapCenter.lat, mapCenter.lng);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      fetchGigs(mapCenter.lat, mapCenter.lng);
    }
  }, [initialCenter]);

  useEffect(() => {
    // kakao 맵 API 로드 대기
    const checkKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsLoaded(true);
        });
        clearInterval(checkKakao);
      }
    }, 100);

    return () => clearInterval(checkKakao);
  }, []);

  const handleApply = async () => {
    if (!selectedGig) return;
    setIsProcessing(true);

    // 1.5초 로딩 시연
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Simulate success instead of actual checkout
      setCheckoutResult({ success: true });
      setAppliedGig(selectedGig);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#047857', '#fbbf24']
      });
    } catch (e) {
      console.error(e);
      alert('오류 발생');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCheckout = () => {
    setCheckoutResult(null);
    setSelectedGig(null);
  };

  const centerToUser = () => {
    const map = mapRef.current;
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          if (map && window.kakao?.maps) {
            map.panTo(new window.kakao.maps.LatLng(loc.lat, loc.lng));
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          if (userLocation && map && window.kakao?.maps) {
            map.panTo(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
          } else if (map && window.kakao?.maps) {
            map.panTo(new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng));
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else if (userLocation && map && window.kakao?.maps) {
      map.panTo(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      setSelectedGig(null);
    }
  };

  const subIcons = [
    <Landmark key="bank"   className="w-5 h-5 text-blue-600" />,
    <CreditCard key="card"  className="w-5 h-5 text-red-500" />,
    <ShieldCheck key="life"  className="w-5 h-5 text-emerald-600" />,
    <TrendingUp key="inv"   className="w-5 h-5 text-amber-600" />,
    <Cpu key="ds"    className="w-5 h-5 text-violet-600" />,
  ];

  return (
    <>
      <div className="relative w-full h-full overflow-hidden bg-[#0F172A]">
        {/* 모드 토글 (제거됨) */}

        {/* 내 위치 가기 FAB */}
        <AnimatePresence>
          {!selectedGig && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              onClick={centerToUser}
              className="absolute bottom-6 right-4 z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 text-[#FF5517] hover:bg-white transition-colors"
            >
              <LocateFixed className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 지도 영역 */}
        {isLoaded ? (
          <Map
            onCreate={(map) => { mapRef.current = map; }}
            center={mapCenter}
            style={{ width: '100%', height: '100%' }}
            level={4}
          >
            {/* 현재 내 위치 마커 */}
            {userLocation && (
              <CustomOverlayMap position={userLocation}>
                <div 
                  className="relative flex items-center justify-center w-6 h-6 cursor-pointer"
                  onClick={centerToUser}
                >
                  <div className="absolute w-full h-full bg-blue-400 rounded-full animate-ping opacity-75" />
                  <div className="relative w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)] border-2 border-white" />
                </div>
              </CustomOverlayMap>
            )}

            {/* 워커 모드: 긱 공고 렌더링 */}
            {gigs.map(gig => (
              <CustomOverlayMap
                key={gig.id}
                position={{ lat: gig.lat, lng: gig.lng }}
                clickable={true}
              >
                <motion.div 
                  onClick={() => {
                    const isAlreadySelected = selectedGig?.id === gig.id;
                    const next = isAlreadySelected ? null : gig;
                    setSelectedGig(next);
                    onGigSelect?.(next ? next.id : null);
                    if (next) {
                      setSelectedMapGig(next);
                      setChatTriggerMessage(`'${next.title}' 시프트에 대해 바로 지원할 수 있게 조건 안내해줘!`);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={gig.is_surge ? { y: [0, -6, 0] } : {}}
                  transition={{ repeat: gig.is_surge ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
                  className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl shadow-xl cursor-pointer transition-all ${
                    selectedGig?.id === gig.id
                      ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110'
                      : ''
                  } ${
                    highlightedGigIds.includes(gig.id) ? 'ring-4 ring-emerald-400 ring-offset-1 scale-110 shadow-[0_0_25px_rgba(16,185,129,0.8)] z-30 animate-pulse' : ''
                  } ${
                    gig.is_surge
                      ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white border border-red-400/80 shadow-[0_4px_16px_rgba(220,38,38,0.65)] z-20'
                      : 'bg-[#09090B] text-white border border-zinc-700/90 shadow-md'
                  }`}
                >
                  {/* 상단: 금액 */}
                  <div className="font-black text-xs leading-tight tracking-tight flex items-center gap-1">
                    {gig.is_surge ? `🔥 ₩${gig.hourly_wage.toLocaleString()}` : `₩${gig.hourly_wage.toLocaleString()}`}
                  </div>

                  {/* 하단: 근무 시간대 (1시간 이내 임박: 붉은색, 1시간 이후: 검은색) */}
                  <div className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.2 rounded whitespace-nowrap tracking-tighter ${
                    gig.is_surge ? 'bg-black/50 text-yellow-300' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {gig.is_surge ? `🚨 임박 (${gig.startTime}-${gig.endTime})` : `🕐 ${gig.startTime}-${gig.endTime}`}
                  </div>

                  {/* 말풍선 꼬리 */}
                  <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 ${
                    gig.is_surge ? 'bg-rose-600 border-r border-b border-red-400' : 'bg-[#09090B] border-r border-b border-zinc-700'
                  }`} />
                </motion.div>
              </CustomOverlayMap>
            ))}
          </Map>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-[#0F172A]">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
          </div>
        )}

        {/* 바텀 시트 (Framer Motion) */}
        <AnimatePresence>
          {selectedGig && (
            <>
              {/* Dimmed Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { if (!checkoutResult) { setSelectedGig(null); onGigSelect?.(null); } }}
                className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-20"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                drag={!checkoutResult ? "y" : false}
                dragConstraints={{ top: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute bottom-0 left-0 w-full max-h-[92%] overflow-y-auto bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.25)] z-30 pb-safe custom-scrollbar"
              >
                {!checkoutResult ? (
                  <div className="p-4 pt-2.5 space-y-3">
                    {/* 드래그 핸들 */}
                    <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto cursor-grab active:cursor-grabbing" />
                    
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-black mb-1">
                          <CheckCircle2 className="w-3 h-3" /> AI 매칭 98%
                        </div>
                        <h3 className="text-base font-black text-[#0F172A] leading-snug truncate">{selectedGig.title}</h3>
                        <p className="text-slate-500 text-xs mt-0.5 font-medium truncate">강남역 2번 출구 · 14:00 - 18:00 (4h)</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-lg font-black ${selectedGig.is_surge ? 'text-[#FF5A5F]' : 'text-[#FF5517]'}`}>
                          ₩{selectedGig.hourly_wage.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">수수료 0원</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleApply}
                      disabled={isProcessing}
                      className="relative w-full bg-[#FF5517] hover:bg-[#E04106] disabled:bg-[#FF5517]/70 text-white font-black py-3 rounded-2xl text-sm flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(255,85,23,0.3)] transition-all overflow-hidden"
                    >
                      {/* 버튼 빛나는 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]" />
                      
                      {isProcessing ? (
                        <>
                          <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                          <span className="text-xs">사장님께 지원 알림 전송 중...</span>
                        </>
                      ) : (
                        '해당 긱에 지원하기'
                      )}
                    </motion.button>
                  </div>
                ) : (
                  /* 지원 완료 후 UI */
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-4 bg-slate-50 rounded-t-[32px] h-[40vh] flex flex-col items-center justify-center relative">
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
                     <div className="text-center mb-8 mt-4">
                       <motion.div 
                         initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                         className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                       >
                         <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                       </motion.div>
                       <h3 className="text-2xl font-black text-[#0F172A]">지원 알림 전송 완료!</h3>
                       <p className="text-sm font-medium text-slate-500 mt-2">
                         사장님께 푸시 알림이 전송되었습니다.<br />사장님이 수락하면 알바 매칭이 확정됩니다.
                       </p>
                     </div>

                     <motion.button
                       whileTap={{ scale: 0.96 }}
                       onClick={resetCheckout}
                       className="w-full bg-[#0F172A] text-white font-black py-4.5 rounded-2xl shadow-lg"
                     >
                       지도 화면으로 돌아가기
                     </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 점주 모드: 지원자 확인 바텀 시트 제거됨 */}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </>
  );
}
