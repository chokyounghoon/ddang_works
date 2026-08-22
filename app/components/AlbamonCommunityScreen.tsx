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
import { GENERATED_100_POSTS } from '../lib/communityPostsData';

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

const INITIAL_POSTS: CommunityPost[] = GENERATED_100_POSTS;

export default function AlbamonCommunityScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>(GENERATED_100_POSTS);
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

    let categoryLabel = '💬 땡썰/일상';
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
    if (categoryFilter === 'HEARTWARMING') {
      return post.id.startsWith('post-heart-') || post.title.includes('실화') || post.title.includes('감동') || post.title.includes('눈물') || post.categoryLabel.includes('💖');
    }
    return post.category === categoryFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
      {/* ─── 상단 커뮤니티 헤더 ─── */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-blue-500 flex items-center justify-center shadow-xs">
            <Users className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black tracking-tight text-slate-900">땡썰 라운지</h2>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-amber-500" /> HOT 커뮤니티
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              점주 & 지원자가 나누는 0.1초 정산 및 긱워크 생생 후기
            </p>
          </div>
        </div>

        {/* 글쓰기 버튼 */}
        <button
          onClick={() => setShowWriteModal(true)}
          className="bg-[#FB521C] hover:bg-[#E4410E] active:scale-95 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all shrink-0"
        >
          <PenTool className="w-3.5 h-3.5" /> 글쓰기
        </button>
      </div>

      {/* ─── 💖 심금을 울리는 땡겨요 웍스 5대 상생 감동 스토리 스포트라이트 ─── */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-3.5 text-white shrink-0 border-b border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-rose-500/30 border border-rose-400/50 flex items-center justify-center text-rose-300 text-xs">
              💖
            </span>
            <span className="text-[11px] font-black text-white tracking-tight">
              심금을 울리는 땡겨요 웍스 기적의 실화 & 상생 가치
            </span>
          </div>
          <span className="text-[9.5px] font-bold text-rose-300">실화 5선</span>
        </div>

        {/* 가로 스크롤 감동 스토리 칩 카드 */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'post-heart-1', tag: '🍼 미혼부의 눈물', title: '0.1초 정산이 구한 아기 해열제와 분유', color: 'from-rose-500/20 to-pink-500/20 border-rose-400/40 text-rose-200' },
            { id: 'post-heart-2', tag: '🍗 점주의 감사', title: '알바몬 60만원 노쇼 지옥 ➔ 8개월 노쇼 0건', color: 'from-amber-500/20 to-orange-500/20 border-amber-400/40 text-amber-200' },
            { id: 'post-heart-3', tag: '🏥 무상 안전망', title: '손가락 부상 당일 병원비 100% 무상 케어', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-200' },
            { id: 'post-heart-4', tag: '🌱 청년 자립', title: '알바비 끝전(800원) 모아 대학교 등록금 완납', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-200' },
            { id: 'post-heart-5', tag: '👵 할머니의 편지', title: '73세 백반집 폐업 위기 막은 세무 100% 자동 대행', color: 'from-purple-500/20 to-indigo-500/20 border-purple-400/40 text-purple-200' },
          ].map(story => (
            <button
              key={story.id}
              onClick={() => setSelectedPostId(story.id)}
              className={`bg-gradient-to-r ${story.color} border rounded-xl px-2.5 py-1.5 text-left shrink-0 max-w-[200px] hover:brightness-125 active:scale-95 transition-all cursor-pointer shadow-xs`}
            >
              <span className="text-[9px] font-black block tracking-wider opacity-90">{story.tag}</span>
              <p className="text-[10.5px] font-black text-white truncate mt-0.5">{story.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ─── 검색 및 카테고리 필터 바 ─── */}
      <div className="p-3 bg-white border-b border-slate-100 space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="궁금한 알바 썰, 0.1초 정산 꿀팁 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FB521C] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: '전체피드' },
            { id: 'HEARTWARMING', label: '💖 감동 실화' },
            { id: 'POPULAR', label: '🔥 실시간 인기' },
            { id: 'PAYOUT_REVIEW', label: '⚡ 0.1초 정산 후기' },
            { id: 'BOSS_LOUNGE', label: '🏪 점주 대나무숲' },
            { id: 'WORKER_STORY', label: '💬 땡썰/일상' },
            { id: 'TIPS', label: '💡 꿀팁/질문' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[#FB521C] border-[#FB521C] text-white font-black shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 메인 포스트 목록 ─── */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar bg-slate-50/50">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            검색 결과에 맞는 게시글이 없습니다.
          </div>
        ) : (
          filteredPosts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedPostId(post.id)}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-[#FB521C] hover:shadow-md transition-all cursor-pointer shadow-xs group relative"
            >
              {/* 상단 메타 정보 */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-orange-50 text-[#FB521C] border border-orange-100 shrink-0">
                    {post.categoryLabel}
                  </span>
                  {post.isHot && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-0.5 shrink-0">
                      <Flame className="w-2.5 h-2.5" /> HOT
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-bold truncate">{post.author}</span>
                </div>
                <span className="text-[9.5px] text-slate-400 shrink-0">{post.timestamp}</span>
              </div>

              {/* 제목 & 본문 요약 */}
              <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-[#FB521C] transition-colors leading-snug line-clamp-1">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 font-normal line-clamp-2 leading-relaxed mb-3">
                {post.content}
              </p>

              {/* 하단 반응 및 댓글 수 */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    {post.authorBadge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className={`flex items-center gap-1 transition-colors ${
                      post.isLiked ? 'text-[#1D4ED8] font-bold' : 'hover:text-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-[#1D4ED8]' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-1 hover:text-slate-800 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
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
            className="absolute inset-0 bg-white z-30 flex flex-col min-h-0 overflow-hidden"
          >
            {/* 상세 헤더 */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0 shadow-2xs">
              <button
                onClick={() => setSelectedPostId(null)}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 목록으로
              </button>
              <span className="text-xs font-black text-slate-900">{selectedPost.categoryLabel}</span>
              <button
                onClick={() => setSelectedPostId(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 상세 본문 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
              {/* 작성자 정보 */}
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-xs">
                    {selectedPost.author.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900">{selectedPost.author}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
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
                      ? 'bg-blue-50 border-blue-200 text-[#1D4ED8]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${selectedPost.isLiked ? 'fill-[#1D4ED8]' : ''}`} />
                  <span>추천 {selectedPost.likes}</span>
                </button>
              </div>

              {/* 제목 & 본문 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                <h2 className="text-base font-black text-slate-900 leading-snug">{selectedPost.title}</h2>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                  {selectedPost.content}
                </div>
              </div>

              {/* 댓글 섹션 */}
              <div className="pt-2">
                <h3 className="text-xs font-black text-slate-700 mb-3 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-[#1D4ED8]" />
                  댓글 ({selectedPost.comments.length})
                </h3>

                <div className="space-y-2.5">
                  {selectedPost.comments.length === 0 ? (
                    <p className="text-slate-400 text-xs py-4 text-center bg-white border border-slate-200 rounded-xl">첫 번째 댓글을 작성해 보세요!</p>
                  ) : (
                    selectedPost.comments.map(c => (
                      <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 shadow-2xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-800">{c.author}</span>
                          <span className="text-slate-400 font-mono">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-normal leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 댓글 작성 폼 */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] transition-all"
              />
              <button
                onClick={handleAddComment}
                disabled={!newCommentText.trim()}
                className="p-2 rounded-xl bg-[#1D4ED8] disabled:bg-slate-200 text-white disabled:text-slate-400 transition-all active:scale-95 shadow-xs shrink-0"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 p-4 flex flex-col justify-center overflow-y-auto"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-[#1D4ED8]" />
                  <h3 className="text-sm font-black text-slate-900">커뮤니티 글쓰기</h3>
                </div>
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitNewPost} className="space-y-3.5 flex-1 flex flex-col">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">카테고리 선택</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                  >
                    <option value="PAYOUT_REVIEW">⚡ 0.1초 정산 후기</option>
                    <option value="BOSS_LOUNGE">🏪 점주 대나무숲</option>
                    <option value="WORKER_STORY">💬 땡썰/일상</option>
                    <option value="TIPS">💡 알바 꿀팁/질문</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">제목</label>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">내용</label>
                  <textarea
                    placeholder="신한 0.1초 정산 후기나 알바 경험담, 점주 노하우를 솔직하게 작성해주세요."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    required
                    rows={6}
                    className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black py-3 rounded-xl text-xs shadow-md active:scale-98 transition-all"
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
