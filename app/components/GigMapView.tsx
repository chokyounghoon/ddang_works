'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, CustomOverlayMap, MarkerClusterer } from 'react-kakao-maps-sdk';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MapPin, DollarSign, CheckCircle2, ChevronRight, Landmark, CreditCard, ShieldCheck, TrendingUp, Cpu, LocateFixed, Layers, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

type Gig = {
  id: string;
  title: string;
  storeName: string;
  hourly_wage: number;
  is_surge: boolean;
  lat: number;
  lng: number;
  status: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
  category?: string;
  district?: string;
};

interface GigMapViewProps {
  initialCenter?: { lat: number; lng: number };
  onGigSelect?: (gigId: string | null, gigInfo?: Gig | null) => void;
  selectedGigId?: string | null;
  onAreaGigsLoaded?: (areaName: string, gigs: Gig[]) => void;
}

// 점주 모드 및 WORKER_OFFSETS 제거됨

import { useGigStore } from '../../store/useGigStore';

export function resolveAreaNameSync(lat: number, lng: number): string {
  if (lat < 37.51 && lng < 126.85) return '부평';
  if (lat > 37.53 && lat < 37.57 && lng > 126.90 && lng < 126.96) return '홍대';
  if (lat > 37.36 && lat < 37.42 && lng > 127.08 && lng < 127.15) return '판교';
  if (lat > 37.24 && lat < 37.33 && lng > 126.98 && lng < 127.06) return '수원';
  if (lat > 37.51 && lat < 37.54 && lng > 126.90 && lng < 126.95) return '여의도';
  if (lat > 37.55 && lat < 37.59 && lng > 126.96 && lng < 127.02) return '종로';
  if (lat > 37.48 && lat < 37.52 && lng > 127.01 && lng < 127.07) return '강남';
  return '역세권';
}

export function generateLocalStoreName(rawTitle: string, areaName: string): string {
  let brand = '스토어';
  if (rawTitle.includes('CU')) brand = 'CU';
  else if (rawTitle.includes('컴포즈')) brand = '컴포즈커피';
  else if (rawTitle.includes('스타벅스')) brand = '스타벅스';
  else if (rawTitle.includes('올리브영')) brand = '올리브영';
  else if (rawTitle.includes('하남돼지')) brand = '하남돼지집';
  else if (rawTitle.includes('세븐일레븐')) brand = '세븐일레븐';
  else if (rawTitle.includes('이마트24')) brand = '이마트24';
  else if (rawTitle.includes('이마트')) brand = '이마트';
  else if (rawTitle.includes('쉑쉑')) brand = '쉑쉑버거';
  else if (rawTitle.includes('메가커피')) brand = '메가커피';
  else if (rawTitle.includes('교보문고')) brand = '교보문고';
  else if (rawTitle.includes('CGV')) brand = 'CGV';
  else if (rawTitle.includes('무신사')) brand = '무신사 스탠다드';
  else if (rawTitle.includes('얌샘김밥')) brand = '얌샘김밥';
  else if (rawTitle.includes('투썸')) brand = '투썸플레이스';
  else if (rawTitle.includes('맘스터치')) brand = '맘스터치';
  else if (rawTitle.includes('서브웨이')) brand = '서브웨이';
  else if (rawTitle.includes('다이소')) brand = '다이소';
  else if (rawTitle.includes('GS25')) brand = 'GS25';
  else if (rawTitle.includes('버거킹')) brand = '버거킹';
  else if (rawTitle.includes('배스킨')) brand = '배스킨라빈스';
  else if (rawTitle.includes('롭스')) brand = '롭스';
  else if (rawTitle.includes('쉐이크쉑')) brand = '쉐이크쉑';
  else if (rawTitle.includes('롯데리아')) brand = '롯데리아';
  else if (rawTitle.includes('노브랜드')) brand = '노브랜드버거';
  else if (rawTitle.includes('아리따움')) brand = '아리따움';
  else if (rawTitle.includes('이디야')) brand = '이디야커피';
  else if (rawTitle.includes('롤링파스타')) brand = '롤링파스타';
  else if (rawTitle.includes('맥도날드')) brand = '맥도날드';
  else if (rawTitle.includes('블루보틀')) brand = '블루보틀';
  else if (rawTitle.includes('시코르')) brand = '시코르';
  else if (rawTitle.includes('ZARA')) brand = 'ZARA';
  else if (rawTitle.includes('빽다방')) brand = '빽다방';
  else if (rawTitle.includes('하이오')) brand = '하이오커피';
  else if (rawTitle.includes('감성커피')) brand = '감성커피';

  if (areaName === '강남') {
    if (brand === 'CU') return 'CU 강남파이낸스점';
    if (brand === '컴포즈커피') return '컴포즈커피 역삼역점';
    if (brand === '스타벅스') return '스타벅스 강남2호점';
    if (brand === '올리브영') return '올리브영 강남대로점';
    if (brand === '하남돼지집') return '하남돼지집 부평역점';
  }

  return `${brand} ${areaName}점`;
}

export default function GigMapView({ initialCenter, onGigSelect, selectedGigId, onAreaGigsLoaded }: GigMapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);

  const { appliedGig, setAppliedGig, setSelectedMapGig, highlightedGigIds } = useGigStore();

  const mapRef = useRef<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.4979, lng: 127.0276 }); // 기본 강남역
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isClustered, setIsClustered] = useState(true);
  const [pinMode, setPinMode] = useState<'compact' | 'detailed'>('compact');
  const [zoomLevel, setZoomLevel] = useState(4);

  useEffect(() => {
    if (!selectedGigId) {
      setSelectedGig(null);
      return;
    }
    const targetId = selectedGigId.replace('ag', 'g');
    const found = gigs.find(g => g.id === selectedGigId || g.id === targetId);
    if (found) {
      setSelectedGig(found);
    }
  }, [selectedGigId, gigs]);

  const formatWageCompact = (wage: number) => {
    if (wage >= 10000) {
      const man = wage / 10000;
      return `${man % 1 === 0 ? man : man.toFixed(2).replace(/\.?0+$/, '')}만`;
    }
    return `${wage.toLocaleString()}원`;
  };

  const fetchGigs = async (lat: number, lng: number) => {
    try {
      const res = await fetch('/api/gigs.json');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = (await res.json()) as { gigs: Gig[] };
      let area = resolveAreaNameSync(lat, lng);

      const processArea = (areaName: string) => {
        const mappedGigs: Gig[] = (data.gigs || []).map((g) => {
          const storeName = generateLocalStoreName(g.title, areaName);
          const title = `${storeName} ${g.hours || 1}시간 알바`;
          return {
            ...g,
            storeName,
            title,
            lat: lat + g.lat,
            lng: lng + g.lng,
            district: areaName,
          };
        });
        setGigs(mappedGigs);
        onAreaGigsLoaded?.(areaName, mappedGigs);
      };

      processArea(area);

      if (typeof window !== 'undefined' && (window as any).kakao?.maps?.services?.Geocoder) {
        const geocoder = new (window as any).kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(lng, lat, (result: any, status: any) => {
          if (status === (window as any).kakao.maps.services.Status.OK && result && result.length > 0) {
            const r = result[0];
            const dist = r.region_2depth_name || r.region_3depth_name || '';
            if (dist) {
              const exactArea = dist.replace(/(구|동|시)$/, '');
              processArea(exactArea);
            }
          }
        });
      }
    } catch (err) {
      console.warn('Failed to fetch gigs:', err);
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
          console.info('Geolocation notice: Using default center (Gangnam).', error?.message || error);
          fetchGigs(mapCenter.lat, mapCenter.lng);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
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
          console.info('Geolocation notice: Center fallback to default.', error?.message || error);
          if (userLocation && map && window.kakao?.maps) {
            map.panTo(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
          } else if (map && window.kakao?.maps) {
            map.panTo(new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng));
          }
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
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
      <div className="relative w-full h-full overflow-hidden bg-slate-100">
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
              className="absolute bottom-6 right-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-slate-200 text-[#1D4ED8] hover:bg-white transition-colors"
            >
              <LocateFixed className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 상단 초슬림 스마트 지도 컨트롤 바 (땡겨요 시그니처 화이트 & 레드) */}
        {isLoaded && (
          <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full p-0.5 shadow-xs pointer-events-auto">
              <button
                onClick={() => setPinMode(pinMode === 'compact' ? 'detailed' : 'compact')}
                className={`px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 transition-all text-[9.5px] ${
                  pinMode === 'compact'
                    ? 'bg-[#FB521C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pinMode === 'compact' ? <Minimize2 className="w-2.5 h-2.5" /> : <Maximize2 className="w-2.5 h-2.5" />}
                <span>{pinMode === 'compact' ? '콤팩트' : '상세'}</span>
              </button>

              <button
                onClick={() => setIsClustered(!isClustered)}
                className={`px-2 py-0.5 rounded-full font-black flex items-center gap-1 transition-all text-[9.5px] ${
                  isClustered
                    ? 'bg-orange-50 text-[#FB521C] border border-orange-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>{isClustered ? '그룹 ON' : '그룹 OFF'}</span>
              </button>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-2.5 py-0.5 text-[9.5px] font-bold text-slate-700 shadow-xs pointer-events-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span><strong className="text-[#FB521C] font-black">{gigs.length}개</strong> 긱 가동</span>
            </div>
          </div>
        )}

        {/* 지도 영역 */}
        {isLoaded ? (
          <Map
            onCreate={(map) => { mapRef.current = map; }}
            center={mapCenter}
            style={{ width: '100%', height: '100%' }}
            level={4}
            onZoomChanged={(map) => setZoomLevel(map.getLevel())}
            onDragEnd={(map) => {
              const c = map.getCenter();
              fetchGigs(c.getLat(), c.getLng());
            }}
            onClick={() => {
              setSelectedGig(null);
              onGigSelect?.(null);
            }}
          >
            {/* 현재 내 위치 마커 */}
            {userLocation && (
              <CustomOverlayMap position={userLocation}>
                <div 
                  className="relative flex items-center justify-center w-6 h-6 cursor-pointer"
                  onClick={centerToUser}
                >
                  <div className="absolute w-full h-full bg-orange-400 rounded-full animate-ping opacity-75" />
                  <div className="relative w-3 h-3 bg-[#FB521C] rounded-full shadow-[0_0_10px_rgba(251,82,28,0.8)] border-2 border-white" />
                </div>
              </CustomOverlayMap>
            )}

            {/* 긱 마커 클러스터링 및 오버레이 렌더링 (땡겨요 스타일) */}
            {(() => {
              const markerElements = gigs.map(gig => {
                const isSelected = selectedGig?.id === gig.id || (selectedGigId && (gig.id === selectedGigId || gig.id === selectedGigId.replace('ag', 'g')));
                const isHighlighted = highlightedGigIds.includes(gig.id);
                // 콤팩트 모드: 선택되지 않았고 지정된 핀이 아닌 경우 간소화된 슬림 뱃지 적용
                const showCompact = (pinMode === 'compact' || zoomLevel >= 5) && !isSelected && !isHighlighted;

                return (
                  <CustomOverlayMap
                    key={gig.id}
                    position={{ lat: gig.lat, lng: gig.lng }}
                    clickable={true}
                  >
                    <motion.div 
                      onClick={() => {
                        const next = isSelected ? null : gig;
                        setSelectedGig(next);
                        onGigSelect?.(next ? next.id : null, next);
                        if (next) {
                          setSelectedMapGig(next);
                        }
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      animate={gig.is_surge ? { y: [0, -4, 0] } : {}}
                      transition={{ repeat: gig.is_surge ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
                      className={`relative flex flex-col items-center justify-center cursor-pointer transition-all ${
                        showCompact ? 'px-2.5 py-1 rounded-full' : 'px-3 py-1.5 rounded-2xl'
                      } ${
                        isSelected
                          ? 'ring-4 ring-[#FB521C] ring-offset-2 ring-offset-white scale-125 z-40 shadow-[0_4px_25px_rgba(251,82,28,0.4)]'
                          : ''
                      } ${
                        isHighlighted ? 'ring-4 ring-emerald-500 ring-offset-1 scale-110 shadow-[0_4px_20px_rgba(16,185,129,0.4)] z-30' : ''
                      } ${
                        gig.is_surge
                          ? 'bg-gradient-to-r from-[#FB521C] via-[#F97316] to-[#EF4444] text-white border-2 border-white shadow-[0_4px_16px_rgba(251,82,28,0.4)] z-20'
                          : 'bg-white text-slate-900 border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:border-[#FB521C]'
                      }`}
                    >
                      {/* 금액 및 타이틀 */}
                      <div className={`font-black text-xs leading-tight tracking-tight flex items-center gap-1 ${
                        gig.is_surge ? 'text-white' : 'text-slate-900'
                      }`}>
                        {showCompact ? (
                          gig.is_surge ? `🔥 ${formatWageCompact(gig.hourly_wage)}` : `₩${formatWageCompact(gig.hourly_wage)}`
                        ) : (
                          gig.is_surge ? `🔥 ₩${gig.hourly_wage.toLocaleString()}` : `₩${gig.hourly_wage.toLocaleString()}`
                        )}
                      </div>

                      {/* 상세 모드에서만 시간대 텍스트 표시 */}
                      {!showCompact && (
                        <div className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.2 rounded whitespace-nowrap tracking-tighter ${
                          gig.is_surge ? 'bg-black/20 text-yellow-100' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {gig.is_surge ? `🚨 임박 (${gig.startTime}-${gig.endTime})` : `🕐 ${gig.startTime}-${gig.endTime}`}
                        </div>
                      )}

                      {/* 말풍선 꼬리 */}
                      <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 ${
                        gig.is_surge ? 'bg-[#EF4444] border-r border-b border-white' : 'bg-white border-r border-b border-slate-200'
                      }`} />
                    </motion.div>
                  </CustomOverlayMap>
                );
              });

              return isClustered ? (
                <MarkerClusterer
                  averageCenter={true}
                  minLevel={3}
                  minClusterSize={2}
                  gridSize={60}
                  styles={[
                    {
                      width: '46px',
                      height: '46px',
                      background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                      borderRadius: '23px',
                      color: '#ffffff',
                      textAlign: 'center',
                      fontWeight: '900',
                      lineHeight: '46px',
                      fontSize: '13px',
                      boxShadow: '0 8px 24px rgba(29,78,216,0.45), 0 0 0 3px rgba(255,255,255,0.95)',
                      cursor: 'pointer',
                    }
                  ]}
                >
                  {markerElements}
                </MarkerClusterer>
              ) : (
                markerElements
              );
            })()}
          </Map>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-100">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
          </div>
        )}

        {/* 핀 선택 팝업 제거됨 (지도 하단 하단 목록에 해당 업체 카드로 매핑되어 노출) */}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </>
  );
}
