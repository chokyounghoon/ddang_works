'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ThumbsUp, MessageCircle, Eye, Flame, Plus, Search, Filter,
  Sparkles, CheckCircle2, Share2, Bookmark, ChevronLeft, X, Send,
  MessageSquare, Building2, ShieldCheck, TrendingUp, UserCheck, Heart,
  Award, MessageSquarePlus, PenTool, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type PostComment = {
  id: string;
  author: string;
  role: 'worker' | 'employer' | 'admin';
  content: string;
  timestamp: string;
  likes: number;
};

export type CommunityPost = {
  id: string;
  category: 'POPULAR' | 'WORKER_STORY' | 'BOSS_LOUNGE' | 'PAYOUT_REVIEW' | 'TIPS';
  categoryLabel: string;
  title: string;
  content: string;
  author: string;
  authorBadge: string;
  role: 'worker' | 'employer' | 'admin';
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  comments: PostComment[];
  views: number;
  isHot?: boolean;
  storeCategory?: string;
  image?: string;
};

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    category: 'PAYOUT_REVIEW',
    categoryLabel: '⚡ 0.1초 정산 후기',
    title: 'CU 물류알바 1시간 끝내자마자 카톡 띵동! 신한 0.1초 정산 미쳤네요 🚀',
    content: '방금 강남파이낸스점 피크타임 1시간 물류 정리 끝나고 바코드 찍어서 퇴근 처리 하자마자 신한 BaaS 계좌로 16,000원 바로 입금됨 ㅋㅋㅋ 타 알바앱은 다음 주 수요일에 주거나 한 달 뒤에 주는데 땡겨요 웍스는 퇴근 버튼 누르는 순간 바로 들어옴! 수수료도 0원이라 진짜 대만족입니다.',
    author: '강남역물류킹',
    authorBadge: 'CU 6개월차 · D-GCS 1등급',
    role: 'worker',
    timestamp: '10분 전',
    likes: 42,
    views: 312,
    isHot: true,
    storeCategory: '편의점',
    comments: [
      {
        id: 'c1-1',
        author: '역삼카페러버',
        role: 'worker',
        content: '인정 ㅋㅋㅋ 나도 컴포즈커피 2시간 대타 뛰고 바로 지갑 확인했는데 계좌 꽂혀있어서 바로 야식 시킴 갓땡겨요',
        timestamp: '8분 전',
        likes: 5,
      },
      {
        id: 'c1-2',
        author: '최신한 점주',
        role: 'employer',
        content: '지훈님 오늘 물류 정리 너무 깔끔하게 잘해주셔서 감사합니다! 담에도 피크 타임 때 땡톡으로 연락드릴게요 ㅎㅎ',
        timestamp: '5분 전',
        likes: 12,
      },
    ],
  },
  {
    id: 'post-2',
    category: 'BOSS_LOUNGE',
    categoryLabel: '🏪 점주 대나무숲',
    title: '알바몬 쓰다가 땡겨요 웍스로 갈아탔는데 인건비 수수료 0원에 지원자 수준도 미쳤음',
    content: '기존 알바몬/알바천국 유료 공고 30만원씩 내면서 구인글 올렸는데 펑크내는 애들 많아서 골머리 앓았습니다... 땡겨요 웍스는 신한 S-Bridge랑 D-GCS 신용평가 1등급으로 검증된 지원자만 AI 매칭으로 들어와서 지각 한번 안 함. 게다가 점주 인건비 결제 수수료 0원에 카드 혜택까지 대박이네요.',
    author: '역삼컴포즈점주',
    authorBadge: '컴포즈 3년차 · 신한 땡겨요 파트너',
    role: 'employer',
    timestamp: '35분 전',
    likes: 89,
    views: 740,
    isHot: true,
    storeCategory: '카페/음료',
    comments: [
      {
        id: 'c2-1',
        author: '강남올영점주',
        role: 'employer',
        content: '맞아요 사장님 ㅋㅋㅋ 특히 1시간 피크타임 긴급 대타 때 AI 땡격발 기능이 제일 유용함 3분 만에 매칭됨',
        timestamp: '25분 전',
        likes: 18,
      },
    ],
  },
  {
    id: 'post-3',
    category: 'WORKER_STORY',
    categoryLabel: '💬 알바썰/일상',
    title: '공강 2시간 활용해서 카페 대타 뛰고 30,000원 벌었음 꿀팁 공유',
    content: '학교 수업 사이 공강 2시간 남아서 땡겨요 지도 켜보니까 5분 거리에 컴포즈커피 음료 조리 2시간 대타 떴길래 지원함. 바리스타 SBT 인증서 프로필에 달아두니까 점주님이 1분 만에 수락하셔서 깔끔하게 일하고 0.1초 정산 받았습니다. 공강 시간에 놀지 말고 땡겨요 웍스 키세요 ㅋㅋㅋ',
    author: '대학생김알바',
    authorBadge: '바리스타 SBT 보유자',
    role: 'worker',
    timestamp: '1시간 전',
    likes: 31,
    views: 450,
    storeCategory: '공강/투잡',
    comments: [],
  },
  {
    id: 'post-4',
    category: 'TIPS',
    categoryLabel: '💡 알바 꿀팁/질문',
    title: 'D-GCS 신용점수 올리고 AI 매칭률 99% 만드는 법 (꿀팁 모음)',
    content: '1. 신한 슈퍼SOL 딥링크 계좌 연동하기\n2. 출퇴근 시간 정각에 버튼 누르기 (출근 지각 0회 달성 시 승급)\n3. 근무 완료 후 점주 평점 5점 받기\n이렇게 하니까 Silver에서 Gold 티어로 올라가고 AI 우수 매칭 알림 제일 먼저 옴!',
    author: '신한마스터',
    authorBadge: 'Gold 티어 · 땡격발 마스터',
    role: 'worker',
    timestamp: '3시간 전',
    likes: 67,
    views: 890,
    isHot: false,
    storeCategory: '꿀팁',
    comments: [],
  },
];

export default function AlbamonCommunityScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  // 글쓰기 모달 상태
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('WORKER_STORY');
  const [newContent, setNewContent] = useState('');
  const [userRole, setUserRole] = useState<'worker' | 'employer'>('worker');

  const selectedPost = posts.find(p => p.id === selectedPostId);

  // 좋아요 토글
  const handleLike = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
  };

  // 댓글 작성
  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedPostId) return;

    const newComment: PostComment = {
      id: `c-${Date.now()}`,
      author: userRole === 'worker' ? '나 (지원자)' : '나 (점주)',
      role: userRole,
      content: newCommentText,
      timestamp: '방금 전',
      likes: 0,
    };

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    }));

    setNewCommentText('');
  };

  // 새 글 등록
  const handleSubmitNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    let categoryLabel = '💬 알바썰/일상';
    if (newCategory === 'PAYOUT_REVIEW') categoryLabel = '⚡ 0.1초 정산 후기';
    if (newCategory === 'BOSS_LOUNGE') categoryLabel = '🏪 점주 대나무숲';
    if (newCategory === 'TIPS') categoryLabel = '💡 알바 꿀팁/질문';

    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      category: newCategory,
      categoryLabel,
      title: newTitle,
      content: newContent,
      author: userRole === 'worker' ? '신규지원자' : '신규점주',
      authorBadge: userRole === 'worker' ? '땡겨요 신규회원 · D-GCS 1등급' : '신한 파트너 점주',
      role: userRole,
      timestamp: '방금 전',
      likes: 1,
      isLiked: true,
      views: 1,
      comments: [],
    };

    setPosts(prev => [createdPost, ...prev]);

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5517', '#10B981', '#6366F1'],
    });

    setNewTitle('');
    setNewContent('');
    setShowWriteModal(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.includes(searchQuery) || post.content.includes(searchQuery) || post.author.includes(searchQuery);
    if (!matchesSearch) return false;
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'POPULAR') return post.isHot || post.likes >= 40;
    return post.category === categoryFilter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* ─── 상단 커뮤니티 헤더 ─── */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5517] via-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Users className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black tracking-tight text-white">알바 땡톡 라운지</h2>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-orange-400" /> HOT 커뮤니티
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              점주 & 지원자가 솔직하게 나누는 0.1초 정산 및 긱워크 이야기
            </p>
          </div>
        </div>

        {/* 글쓰기 버튼 */}
        <button
          onClick={() => setShowWriteModal(true)}
          className="bg-gradient-to-r from-[#FF5517] to-amber-500 hover:brightness-110 active:scale-95 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 transition-all shrink-0"
        >
          <PenTool className="w-3.5 h-3.5" /> 글쓰기
        </button>
      </div>

      {/* ─── 검색 및 카테고리 필터 바 ─── */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800/60 space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="궁금한 알바 썰, 0.1초 정산 꿀팁 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#FF5517] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: '전체피드' },
            { id: 'POPULAR', label: '🔥 실시간 인기' },
            { id: 'PAYOUT_REVIEW', label: '⚡ 0.1초 정산 후기' },
            { id: 'BOSS_LOUNGE', label: '🏪 점주 대나무숲' },
            { id: 'WORKER_STORY', label: '💬 알바썰/일상' },
            { id: 'TIPS', label: '💡 꿀팁/질문' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[#FF5517] border-[#FF5517] text-white font-black shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 메인 포스트 목록 ─── */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            검색 결과에 맞는 게시글이 없습니다.
          </div>
        ) : (
          filteredPosts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedPostId(post.id)}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 hover:border-slate-700 transition-all cursor-pointer shadow-md group relative"
            >
              {/* 상단 메타 정보 */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                    {post.categoryLabel}
                  </span>
                  {post.isHot && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-0.5 shrink-0">
                      <Flame className="w-2.5 h-2.5" /> HOT
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-bold truncate">{post.author}</span>
                </div>
                <span className="text-[9.5px] text-slate-500 shrink-0">{post.timestamp}</span>
              </div>

              {/* 제목 & 본문 요약 */}
              <h3 className="text-sm font-black text-slate-100 mb-1 group-hover:text-[#FF7744] transition-colors leading-snug line-clamp-1">
                {post.title}
              </h3>
              <p className="text-xs text-slate-300 font-normal line-clamp-2 leading-relaxed mb-3">
                {post.content}
              </p>

              {/* 하단 반응 및 댓글 수 */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-400">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
                    {post.authorBadge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className={`flex items-center gap-1 transition-colors ${
                      post.isLiked ? 'text-[#FF5517] font-bold' : 'hover:text-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-[#FF5517]' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-1 hover:text-slate-200 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{post.views}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ─── 팝업 1: 상세 게시글 및 댓글 모달 ─── */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col min-h-0 overflow-hidden"
          >
            {/* 상세 헤더 */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
              <button
                onClick={() => setSelectedPostId(null)}
                className="flex items-center gap-1 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 목록으로
              </button>
              <span className="text-xs font-black text-white">{selectedPost.categoryLabel}</span>
              <button
                onClick={() => setSelectedPostId(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 상세 본문 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* 작성자 정보 */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                    {selectedPost.author.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white">{selectedPost.author}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedPost.authorBadge}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-mono mt-0.5">작성시간: {selectedPost.timestamp}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleLike(selectedPost.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedPost.isLiked
                      ? 'bg-[#FF5517]/20 border-[#FF5517]/50 text-[#FF5517]'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${selectedPost.isLiked ? 'fill-[#FF5517]' : ''}`} />
                  <span>추천 {selectedPost.likes}</span>
                </button>
              </div>

              {/* 제목 & 본문 */}
              <div>
                <h2 className="text-base font-black text-white leading-snug mb-3">{selectedPost.title}</h2>
                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-normal bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                  {selectedPost.content}
                </div>
              </div>

              {/* 댓글 섹션 */}
              <div className="pt-2">
                <h3 className="text-xs font-black text-slate-300 mb-3 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-indigo-400" />
                  댓글 ({selectedPost.comments.length})
                </h3>

                <div className="space-y-2.5">
                  {selectedPost.comments.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4 text-center">첫 번째 댓글을 작성해 보세요!</p>
                  ) : (
                    selectedPost.comments.map(c => (
                      <div key={c.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-300">{c.author}</span>
                          <span className="text-slate-500 font-mono">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-normal leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 댓글 작성 폼 */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5517] transition-all"
              />
              <button
                onClick={handleAddComment}
                disabled={!newCommentText.trim()}
                className="p-2 rounded-xl bg-[#FF5517] disabled:bg-slate-800 text-white disabled:text-slate-600 transition-all active:scale-95 shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 팝업 2: 새 글 작성 모달 (Write Post Modal) ─── */}
      <AnimatePresence>
        {showWriteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 p-4 flex flex-col justify-center overflow-y-auto"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-[#FF5517]" />
                  <h3 className="text-sm font-black text-white">커뮤니티 글쓰기</h3>
                </div>
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitNewPost} className="space-y-3.5 flex-1 flex flex-col">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">카테고리 선택</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5517]"
                  >
                    <option value="PAYOUT_REVIEW">⚡ 0.1초 정산 후기</option>
                    <option value="BOSS_LOUNGE">🏪 점주 대나무숲</option>
                    <option value="WORKER_STORY">💬 알바썰/일상</option>
                    <option value="TIPS">💡 알바 꿀팁/질문</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">제목</label>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5517]"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">내용</label>
                  <textarea
                    placeholder="신한 0.1초 정산 후기나 알바 경험담, 점주 노하우를 솔직하게 작성해주세요."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    required
                    rows={6}
                    className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5517] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF5517] to-amber-500 hover:brightness-110 text-white font-black py-3 rounded-xl text-xs shadow-lg active:scale-98 transition-all"
                >
                  게시글 등록하기
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
