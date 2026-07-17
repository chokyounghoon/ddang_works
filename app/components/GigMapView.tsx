'use client';

import { useState, useEffect } from 'react';
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
};

// 가상의 점주 모드 - 워커 대기 인원 오프셋 (기준점 대비)
const WORKER_OFFSETS = [
  { id: 'w1', dLat: 0.0006, dLng: 0.0004 },
  { id: 'w2', dLat: -0.0004, dLng: -0.0006 },
  { id: 'w3', dLat: 0.0011, dLng: -0.0011 },
  { id: 'w4', dLat: -0.0019, dLng: 0.0014 },
  { id: 'w5', dLat: 0.0026, dLng: -0.0026 },
  { id: 'w6', dLat: -0.0029, dLng: 0.0009 },
  { id: 'w7', dLat: 0.0016, dLng: 0.0029 },
  { id: 'w8', dLat: 0.0036, dLng: -0.0016 },
  { id: 'w9', dLat: -0.0034, dLng: -0.0001 },
  { id: 'w10', dLat: -0.0009, dLng: -0.0036 },
  { id: 'w11', dLat: 0.0041, dLng: 0.0014 },
  { id: 'w12', dLat: 0.0009, dLng: 0.0034 },
  { id: 'w13', dLat: -0.0044, dLng: 0.0004 },
  { id: 'w14', dLat: -0.0024, dLng: -0.0021 },
  { id: 'w15', dLat: 0.0021, dLng: -0.0031 },
  { id: 'w16', dLat: 0.0031, dLng: 0.0041 },
  { id: 'w17', dLat: -0.0014, dLng: 0.0046 },
  { id: 'w18', dLat: 0.0046, dLng: -0.0041 },
  { id: 'w19', dLat: -0.0051, dLng: 0.0024 },
  { id: 'w20', dLat: -0.0039, dLng: -0.0049 },
  { id: 'w21', dLat: 0.0015, dLng: 0.0051 },
  { id: 'w22', dLat: -0.0021, dLng: -0.0054 },
  { id: 'w23', dLat: -0.0054, dLng: -0.0022 },
  { id: 'w24', dLat: 0.0055, dLng: 0.0021 },
  { id: 'w25', dLat: -0.0042, dLng: 0.0044 },
];

import { useGigStore } from '../../store/useGigStore';

export default function GigMapView({ initialCenter }: { initialCenter?: { lat: number; lng: number } }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<'worker' | 'employer'>('worker');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [showEmployerApplicant, setShowEmployerApplicant] = useState(true);

  const { appliedGig, setAppliedGig } = useGigStore();

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
        { id: 'g1', title: '인근 빽다방 오후알바', lat: lat + 0.0012, lng: lng + 0.0015, hourly_wage: 13000, is_surge: true, status: 'OPEN' },
        { id: 'g2', title: '파리바게뜨 빵 포장', lat: lat - 0.0021, lng: lng - 0.0018, hourly_wage: 11000, is_surge: false, status: 'OPEN' },
        { id: 'g3', title: 'CU 편의점 땜빵', lat: lat + 0.0035, lng: lng - 0.0025, hourly_wage: 15000, is_surge: true, status: 'OPEN' },
        { id: 'g4', title: '올리브영 재고정리', lat: lat + 0.0020, lng: lng + 0.0040, hourly_wage: 14500, is_surge: true, status: 'OPEN' },
        { id: 'g5', title: '스타벅스 리저브 마감', lat: lat - 0.0030, lng: lng + 0.0022, hourly_wage: 12500, is_surge: false, status: 'OPEN' }
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
      setShowEmployerApplicant(true);
      
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
    if (userLocation) setMapCenter(userLocation);
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
        {/* 모드 토글 (상단 플로팅 글래스모피즘) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex items-center">
          <button
            onClick={() => { setMode('worker'); setSelectedGig(null); setCheckoutResult(null); }}
            className={`relative px-5 py-2 rounded-full text-xs font-black transition-colors duration-300 ${
              mode === 'worker' ? 'text-white' : 'text-slate-200 hover:text-white'
            }`}
          >
            {mode === 'worker' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#0052FF] rounded-full shadow-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">워커 모드</span>
          </button>
          <button
            onClick={() => { setMode('employer'); setSelectedGig(null); setCheckoutResult(null); }}
            className={`relative px-5 py-2 rounded-full text-xs font-black transition-colors duration-300 ${
              mode === 'employer' ? 'text-white' : 'text-slate-200 hover:text-white'
            }`}
          >
            {mode === 'employer' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-emerald-500 rounded-full shadow-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">점주 모드</span>
          </button>
        </div>

        {/* 내 위치 가기 FAB */}
        <AnimatePresence>
          {!selectedGig && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              onClick={centerToUser}
              className="absolute bottom-6 right-4 z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 text-[#0052FF] hover:bg-white transition-colors"
            >
              <LocateFixed className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 지도 영역 */}
        {isLoaded ? (
          <Map
            center={mapCenter}
            style={{ width: '100%', height: '100%' }}
            level={4}
          >
            {/* 현재 내 위치 마커 */}
            {userLocation && (
              <CustomOverlayMap position={userLocation}>
                <div className="relative flex items-center justify-center w-6 h-6">
                  <div className="absolute w-full h-full bg-blue-400 rounded-full animate-ping opacity-75" />
                  <div className="relative w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)] border-2 border-white" />
                </div>
              </CustomOverlayMap>
            )}

            {/* 워커 모드: 긱 공고 렌더링 */}
            {mode === 'worker' && gigs.map(gig => (
              <CustomOverlayMap
                key={gig.id}
                position={{ lat: gig.lat, lng: gig.lng }}
                clickable={true}
              >
                <motion.div 
                  onClick={() => setSelectedGig(gig)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={gig.is_surge ? { y: [0, -6, 0] } : {}}
                  transition={{ repeat: gig.is_surge ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
                  className={`relative flex items-center justify-center px-3.5 py-2 rounded-full font-black text-xs shadow-xl cursor-pointer ${
                    gig.is_surge ? 'bg-gradient-to-r from-[#FF5A5F] to-[#ff3b41] text-white border border-[#ff3b41]/50' : 'bg-[#0F172A]/90 backdrop-blur-md text-white border border-slate-600'
                  }`}
                >
                  {gig.is_surge ? `🔥 ₩${gig.hourly_wage.toLocaleString()}` : `₩${gig.hourly_wage.toLocaleString()}`}
                  {/* 말풍선 꼬리 */}
                  <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                    gig.is_surge ? 'bg-[#ff3b41]' : 'bg-[#0F172A]/90 border-r border-b border-slate-600'
                  }`} />
                </motion.div>
              </CustomOverlayMap>
            ))}

            {/* 점주 모드: 펄스 이펙트 점 렌더링 */}
            {mode === 'employer' && WORKER_OFFSETS.map(w => {
              const baseLat = userLocation ? userLocation.lat : 37.4979;
              const baseLng = userLocation ? userLocation.lng : 127.0276;
              return (
                <CustomOverlayMap
                  key={w.id}
                  position={{ lat: baseLat + w.dLat, lng: baseLng + w.dLng }}
                >
                  <div className="relative flex items-center justify-center w-8 h-8">
                    {/* Pulse Effect */}
                    <div className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75" />
                    {/* Core Dot */}
                    <div className="relative w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.9)] border-[2.5px] border-white" />
                  </div>
                </CustomOverlayMap>
              );
            })}
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
                onClick={() => !checkoutResult && setSelectedGig(null)}
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
                className="absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] z-30 pb-safe"
              >
                {!checkoutResult ? (
                  <div className="p-6 pt-4">
                    {/* 드래그 핸들 */}
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-black mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AI 매칭 98%
                        </div>
                        <h3 className="text-3xl font-black text-[#0F172A] leading-tight">{selectedGig.title}</h3>
                        <p className="text-slate-500 text-sm mt-1.5 font-medium">강남역 2번 출구 · 14:00 - 18:00 (4h)</p>
                      </div>
                      <div className="text-right pl-4">
                        <p className={`text-2xl font-black ${selectedGig.is_surge ? 'text-[#FF5A5F]' : 'text-[#0052FF]'}`}>
                          ₩{selectedGig.hourly_wage.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">수수료 0원</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleApply}
                      disabled={isProcessing}
                      className="relative w-full bg-[#0052FF] disabled:bg-[#0052FF]/70 text-white font-black py-4.5 rounded-2xl text-lg flex justify-center items-center gap-2 shadow-[0_8px_30px_rgba(0,82,255,0.4)] transition-all overflow-hidden"
                    >
                      {/* 버튼 빛나는 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]" />
                      
                      {isProcessing ? (
                        <>
                          <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                          <span className="text-[15px]">사장님께 지원 알림 전송 중...</span>
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

        {/* 점주 모드: 지원자 확인 바텀 시트 */}
        <AnimatePresence>
          {mode === 'employer' && appliedGig && showEmployerApplicant && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEmployerApplicant(false)}
                className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-20"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] z-30 pb-safe"
              >
                <div className="p-6 pt-4">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                  
                  <div className="mb-6 border-b border-slate-100 pb-6">
                    <h3 className="text-2xl font-black text-[#0F172A] mb-2">{appliedGig.title}</h3>
                    <p className="text-slate-500 text-sm font-medium">새로운 지원자가 접수되었습니다!</p>
                  </div>

                  {/* 지원자 정보 카드 */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 rounded-bl-full" />
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👨‍🎓</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-black text-[#0F172A]">이지성</h4>
                          <span className="text-[10px] bg-[#0F172A] text-white px-2 py-0.5 rounded-full font-bold">24세·남</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AI 핏 매칭률 98%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">D-GCS (신용점수)</p>
                        <p className="text-base font-black text-indigo-600">872<span className="text-xs text-slate-400">/1000</span></p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">최근 한달 결근</p>
                        <p className="text-base font-black text-[#0F172A]">0<span className="text-xs text-slate-400">회</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowEmployerApplicant(false)} className="flex-1 py-4.5 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">거절</button>
                    <button 
                      onClick={() => {
                        alert('알바생 채용이 확정되었습니다!');
                        setShowEmployerApplicant(false);
                        setAppliedGig(null);
                      }}
                      className="flex-[2] py-4.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-transform active:scale-95"
                    >
                      채용 수락하기
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </>
  );
}
