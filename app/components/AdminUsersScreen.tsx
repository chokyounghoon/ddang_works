'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Store, ShieldCheck, Search, Filter, CheckCircle2,
  XCircle, AlertTriangle, Star, Award, RefreshCw, FileText, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppPush } from './AppPushToast';

interface WorkerUser {
  id: string;
  name: string;
  age: number;
  gender: string;
  role: string;
  dgcsScore: number;
  tier: 'Platinum' | 'Gold' | 'Silver';
  healthCert: boolean;
  healthCertExpiry: string;
  identityVerified: boolean;
  completedGigs: number;
  status: 'active' | 'suspended' | 'pending';
}

interface StoreItem {
  id: string;
  name: string;
  district: string;
  ownerName: string;
  shinhanCardAffiliate: boolean;
  activePostings: number;
  totalSettlement: number;
  status: 'verified' | 'pending' | 'review';
}

export default function AdminUsersScreen() {
  const [activeSubTab, setActiveSubTab] = useState<'workers' | 'stores' | 'blacklist'>('workers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHealthOnly, setFilterHealthOnly] = useState(false);
  const { triggerPush } = useAppPush();

  const [workers, setWorkers] = useState<WorkerUser[]>([
    {
      id: 'w-101',
      name: '조이수',
      age: 24,
      gender: '남성',
      role: '바리스타 / 홀서빙',
      dgcsScore: 990,
      tier: 'Platinum',
      healthCert: true,
      healthCertExpiry: '2027-02-15',
      identityVerified: true,
      completedGigs: 48,
      status: 'active',
    },
    {
      id: 'w-102',
      name: '김서연',
      age: 23,
      gender: '여성',
      role: 'P2P 돌봄 / 반려동물',
      dgcsScore: 985,
      tier: 'Platinum',
      healthCert: true,
      healthCertExpiry: '2026-11-20',
      identityVerified: true,
      completedGigs: 42,
      status: 'active',
    },
    {
      id: 'w-103',
      name: '박민우',
      age: 26,
      gender: '남성',
      role: '편의점 / 물류적재',
      dgcsScore: 910,
      tier: 'Gold',
      healthCert: false,
      healthCertExpiry: '만료됨',
      identityVerified: true,
      completedGigs: 19,
      status: 'pending',
    },
    {
      id: 'w-104',
      name: '최지훈',
      age: 29,
      gender: '남성',
      role: '가구조립 / 심부름',
      dgcsScore: 840,
      tier: 'Silver',
      healthCert: true,
      healthCertExpiry: '2026-08-30',
      identityVerified: true,
      completedGigs: 8,
      status: 'active',
    },
    {
      id: 'w-105',
      name: '강태양',
      age: 22,
      gender: '남성',
      role: '단기 서빙',
      dgcsScore: 520,
      tier: 'Silver',
      healthCert: false,
      healthCertExpiry: '미제출',
      identityVerified: true,
      completedGigs: 2,
      status: 'suspended',
    },
  ]);

  const [stores, setStores] = useState<StoreItem[]>([
    {
      id: 's-01',
      name: 'CU 강남파이낸스점',
      district: '강남구 역삼동',
      ownerName: '홍길동',
      shinhanCardAffiliate: true,
      activePostings: 2,
      totalSettlement: 4850000,
      status: 'verified',
    },
    {
      id: 's-02',
      name: '빽다방 역삼역점',
      district: '강남구 역삼동',
      ownerName: '이영희',
      shinhanCardAffiliate: true,
      activePostings: 1,
      totalSettlement: 3200000,
      status: 'verified',
    },
    {
      id: 's-03',
      name: 'GS25 선릉아이파크점',
      district: '강남구 삼성동',
      ownerName: '박준호',
      shinhanCardAffiliate: false,
      activePostings: 0,
      totalSettlement: 1100000,
      status: 'pending',
    },
  ]);

  // 워커 보건증 원클릭 승인/토글
  const handleToggleHealthCert = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextVal = !w.healthCert;
          triggerPush({
            title: `[보건증 상태 변경] ${w.name}`,
            body: nextVal ? '보건증 검증이 승인 완료되었습니다.' : '보건증 인증이 해제되었습니다.',
            type: 'confirm',
          });
          return { ...w, healthCert: nextVal, healthCertExpiry: nextVal ? '2027-08-23' : '미제출' };
        }
        return w;
      })
    );
  };

  // 워커 상태 토글 (정지/활성)
  const handleToggleWorkerStatus = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextStatus = w.status === 'active' ? 'suspended' : 'active';
          triggerPush({
            title: `[워커 계정 제어] ${w.name}`,
            body: nextStatus === 'suspended' ? '계정이 일시 정지 처리되었습니다.' : '계정이 정상 활성화되었습니다.',
            type: 'confirm',
          });
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  // 가맹점 신한카드 가맹 제휴 승인 토글
  const handleToggleStoreAffiliate = (id: string) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextVal = !s.shinhanCardAffiliate;
          if (nextVal) confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          triggerPush({
            title: `[가맹점 제휴] ${s.name}`,
            body: nextVal ? '신한카드 0% 수수료 우대 가맹점으로 승인되었습니다.' : '가맹 제휴가 해제되었습니다.',
            type: 'confirm',
          });
          return { ...s, shinhanCardAffiliate: nextVal, status: nextVal ? 'verified' : 'review' };
        }
        return s;
      })
    );
  };

  const filteredWorkers = workers.filter((w) => {
    const matchName = w.name.includes(searchQuery) || w.role.includes(searchQuery);
    if (activeSubTab === 'blacklist') return w.status === 'suspended' || w.dgcsScore < 700;
    if (filterHealthOnly) return matchName && w.healthCert;
    return matchName;
  });

  const filteredStores = stores.filter((s) => s.name.includes(searchQuery) || s.ownerName.includes(searchQuery));

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* 상단 통합 통계 지표 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 block font-medium">총 등록 긱워커</span>
          <span className="text-base font-black text-slate-900">142,580명</span>
          <span className="text-[9.5px] text-emerald-600 font-bold block mt-0.5">+12.4% MoM</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 block font-medium">인증 가맹점</span>
          <span className="text-base font-black text-[#FB521C]">8,420개소</span>
          <span className="text-[9.5px] text-orange-600 font-bold block mt-0.5">신한카드 100% 연동</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 block font-medium">보건증 검증률</span>
          <span className="text-base font-black text-blue-600">98.4%</span>
          <span className="text-[9.5px] text-blue-500 font-bold block mt-0.5">식품위생 무결</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 block font-medium">평균 D-GCS 점수</span>
          <span className="text-base font-black text-emerald-600">942점</span>
          <span className="text-[9.5px] text-emerald-500 font-bold block mt-0.5">노쇼 0.01% 극저위험</span>
        </div>
      </div>

      {/* 서브 탭 스위처 & 검색창 */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveSubTab('workers')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'workers' ? 'bg-slate-900 text-white font-black shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              워커 관리
            </button>
            <button
              onClick={() => setActiveSubTab('stores')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'stores' ? 'bg-slate-900 text-white font-black shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              가맹점 관리
            </button>
            <button
              onClick={() => setActiveSubTab('blacklist')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'blacklist' ? 'bg-rose-600 text-white font-black shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              블랙리스트/위험군
            </button>
          </div>

          {activeSubTab === 'workers' && (
            <button
              onClick={() => setFilterHealthOnly(!filterHealthOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-bold border transition-all shrink-0 cursor-pointer ${
                filterHealthOnly ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              ✓ 보건증 보유만
            </button>
          )}
        </div>

        {/* 검색 인풋 */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeSubTab === 'stores' ? '가맹점명 또는 점주명 검색...' : '워커 성명 또는 직무 검색...'}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#FB521C]"
          />
        </div>
      </div>

      {/* 리스트 뷰: 워커 관리 */}
      {activeSubTab !== 'stores' && (
        <div className="space-y-2">
          {filteredWorkers.map((w) => (
            <div
              key={w.id}
              className={`p-3.5 rounded-2xl border transition-all bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                w.status === 'suspended' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {w.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="font-black text-xs text-slate-900">{w.name}</h5>
                    <span className="text-[10px] text-slate-400">({w.age}세·{w.gender})</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                      w.tier === 'Platinum' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      w.tier === 'Gold' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {w.tier} {w.dgcsScore}점
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      w.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {w.status === 'active' ? '정상' : '이용제한'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10.5px] text-slate-500">
                    <span>직무: <strong className="text-slate-700">{w.role}</strong></span>
                    <span>·</span>
                    <span>완료 긱: <strong className="text-slate-700">{w.completedGigs}건</strong></span>
                    <span>·</span>
                    <span>보건증: <strong className={w.healthCert ? 'text-emerald-600' : 'text-rose-500'}>{w.healthCert ? `인증 (${w.healthCertExpiry})` : '미보유'}</strong></span>
                  </div>
                </div>
              </div>

              {/* 액션 컨트롤 버튼들 */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleHealthCert(w.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-black border transition-all cursor-pointer ${
                    w.healthCert ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {w.healthCert ? '✓ 보건증 완료' : '보건증 승인'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleWorkerStatus(w.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-black border transition-all cursor-pointer ${
                    w.status === 'active' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {w.status === 'active' ? '계정 정지' : '정지 해제'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 리스트 뷰: 가맹점 관리 */}
      {activeSubTab === 'stores' && (
        <div className="space-y-2">
          {filteredStores.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FB521C] border border-orange-200 flex items-center justify-center font-black text-xs shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="font-black text-xs text-slate-900">{s.name}</h5>
                    <span className="text-[10px] text-slate-400">({s.district} · 대표: {s.ownerName})</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      s.shinhanCardAffiliate ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.shinhanCardAffiliate ? '신한카드 우대가맹' : '일반가맹'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10.5px] text-slate-500">
                    <span>진행중 공고: <strong className="text-[#FB521C]">{s.activePostings}건</strong></span>
                    <span>·</span>
                    <span>누적 알바비 정산: <strong className="text-slate-800 font-mono">₩{s.totalSettlement.toLocaleString()}원</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleStoreAffiliate(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black border transition-all cursor-pointer ${
                    s.shinhanCardAffiliate ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-[#FB521C] text-white border-[#FB521C] hover:brightness-105'
                  }`}
                >
                  {s.shinhanCardAffiliate ? '✓ 신한 가맹제휴 활성' : '신한카드 제휴 승인'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
