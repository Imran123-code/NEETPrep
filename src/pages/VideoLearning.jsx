import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Video, Play, Search, Filter, RotateCcw, Bookmark, 
  Clock, ExternalLink, Sparkles, BookOpen, Layers, CheckCircle 
} from 'lucide-react';
import { neetVideos, getYouTubeSearchUrl } from '../data/videos';
import { allChapters } from '../data/chapters';
import { subjectColors, subjectIcons } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';
import VideoCard from '../components/videos/VideoCard';

const videoTypes = [
  'All',
  'Full Chapter',
  'Concept',
  'One Shot',
  'Revision',
  'Numerical',
  'Problem Solving',
  'NCERT',
  'PYQ Discussion'
];

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const languages = ['All', 'Hindi', 'English', 'Hinglish'];

export default function VideoLearning() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { watchHistory, videoBookmarks } = useProgress();

  // URL state synchronization
  const initialSubject = searchParams.get('subject') || 'All';
  const initialClass = searchParams.get('class') || 'All';
  const initialChapter = searchParams.get('chapter') || 'All';
  const initialTopic = searchParams.get('topic') || 'All';

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync state if URL searchParams change
  useEffect(() => {
    if (searchParams.get('subject')) setSelectedSubject(searchParams.get('subject'));
    if (searchParams.get('class')) setSelectedClass(searchParams.get('class'));
    if (searchParams.get('chapter')) setSelectedChapter(searchParams.get('chapter'));
    if (searchParams.get('topic')) setSelectedTopic(searchParams.get('topic'));
  }, [searchParams]);

  // Derived chapters for the dropdown based on selected subject and class
  const availableChapters = useMemo(() => {
    let list = allChapters;
    if (selectedSubject !== 'All') {
      list = list.filter(c => c.subject.toLowerCase() === selectedSubject.toLowerCase());
    }
    if (selectedClass !== 'All') {
      const num = parseInt(selectedClass, 10);
      list = list.filter(c => c.class === num);
    }
    return list;
  }, [selectedSubject, selectedClass]);

  // Active chapter details if a specific chapter is selected
  const activeChapterObj = useMemo(() => {
    if (selectedChapter === 'All') return null;
    return allChapters.find(c => c.id === selectedChapter) || null;
  }, [selectedChapter]);

  // Derived topics for active chapter
  const availableTopics = useMemo(() => {
    if (!activeChapterObj) return [];
    return activeChapterObj.topics || [];
  }, [activeChapterObj]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return neetVideos.filter(v => {
      // Subject
      if (selectedSubject !== 'All' && v.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }
      // Class
      if (selectedClass !== 'All' && String(v.class) !== String(selectedClass)) {
        return false;
      }
      // Chapter
      if (selectedChapter !== 'All' && v.chapterId.toLowerCase() !== selectedChapter.toLowerCase()) {
        return false;
      }
      // Topic
      if (selectedTopic !== 'All') {
        const tMatch = v.topic.toLowerCase().includes(selectedTopic.toLowerCase()) ||
          v.title.toLowerCase().includes(selectedTopic.toLowerCase());
        if (!tMatch) return false;
      }
      // Video Type
      if (selectedType !== 'All' && v.videoType !== selectedType) {
        return false;
      }
      // Difficulty
      if (selectedDifficulty !== 'All' && v.difficulty !== selectedDifficulty) {
        return false;
      }
      // Language
      if (selectedLanguage !== 'All' && v.language !== selectedLanguage) {
        return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.channel.toLowerCase().includes(q) ||
          v.topic.toLowerCase().includes(q) ||
          v.chapterName?.toLowerCase().includes(q) ||
          v.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [
    selectedSubject,
    selectedClass,
    selectedChapter,
    selectedTopic,
    selectedType,
    selectedDifficulty,
    selectedLanguage,
    search,
  ]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);

  // Dynamic YouTube Search query for active filters
  const currentSearchQuery = useMemo(() => {
    const parts = [
      'NEET',
      selectedClass !== 'All' ? `Class ${selectedClass}` : '',
      selectedSubject !== 'All' ? selectedSubject : '',
      activeChapterObj ? activeChapterObj.name : '',
      selectedTopic !== 'All' ? selectedTopic : '',
      search ? search : '',
    ].filter(Boolean);
    return parts.join(' ');
  }, [selectedClass, selectedSubject, activeChapterObj, selectedTopic, search]);

  const resetFilters = () => {
    setSearch('');
    setSelectedSubject('All');
    setSelectedClass('All');
    setSelectedChapter('All');
    setSelectedTopic('All');
    setSelectedType('All');
    setSelectedDifficulty('All');
    setSelectedLanguage('All');
    setSearchParams({});
  };

  const hasActiveFilters =
    search ||
    selectedSubject !== 'All' ||
    selectedClass !== 'All' ||
    selectedChapter !== 'All' ||
    selectedTopic !== 'All' ||
    selectedType !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedLanguage !== 'All';

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs rounded-full mb-3">
          <Video className="w-3.5 h-3.5" />
          <span>NEET Video Learning</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
          NEET Video Lectures & Concept Masterclasses
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">
          Learn difficult concepts through the best available video lectures, one-shots, and NCERT deep dives.
        </p>

        {/* Global Video Search Bar */}
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="input pl-11 pr-24 py-3 w-full text-sm shadow-sm"
            placeholder="Search topic, chapter, or concept (e.g., Newton's Laws, Friction)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Continue Watching Section (if history exists) */}
      {watchHistory && watchHistory.length > 0 && !hasActiveFilters && (
        <div className="card p-5 mb-8 bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">Continue Watching</h2>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View in Dashboard →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {watchHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="card p-3 flex items-center gap-3 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="relative w-20 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {item.subject} · {item.chapterName || item.chapterId}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <Link
                    to={`/videos/${item.id}`}
                    className="text-[11px] font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                  >
                    Resume lecture →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject & Class Quick Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { name: 'Physics', icon: '⚛️', count: neetVideos.filter(v => v.subject === 'Physics').length, color: '#3B82F6', desc: 'Mechanics, Electrodynamics, Optics & Modern Physics' },
          { name: 'Chemistry', icon: '🧪', count: neetVideos.filter(v => v.subject === 'Chemistry').length, color: '#10B981', desc: 'Physical, Organic, and Inorganic Chemistry lectures' },
          { name: 'Biology', icon: '🧬', count: neetVideos.filter(v => v.subject === 'Biology').length, color: '#8B5CF6', desc: 'Botany, Zoology, Physiology & NCERT Line-by-Line' },
        ].map((sub) => {
          const isSelected = selectedSubject === sub.name;
          return (
            <button
              key={sub.name}
              onClick={() => {
                setSelectedSubject(isSelected ? 'All' : sub.name);
                setSelectedChapter('All');
                setSelectedTopic('All');
              }}
              className={`card p-5 text-left transition-all border-2 ${
                isSelected
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{sub.icon}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${sub.color}15`, color: sub.color }}
                >
                  {sub.count} Videos
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{sub.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {['All', '11', '12'].map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setSelectedChapter('All');
                setSelectedTopic('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {cls === 'All' ? 'All Classes' : `Class ${cls}`}
            </button>
          ))}
        </div>

        {videoBookmarks.length > 0 && (
          <Link
            to="/video-bookmarks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>My Saved Videos ({videoBookmarks.length})</span>
          </Link>
        )}
      </div>

      {/* Chapter Focus Header (if a chapter is active) */}
      {activeChapterObj && (
        <div className="card p-5 mb-6 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-bold text-xs">
                {activeChapterObj.subject} · Class {activeChapterObj.class}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {activeChapterObj.name} — Video Lectures
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Curated concept masterclasses, one-shots, and problem solving sessions for this chapter.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/chapter/${activeChapterObj.id}`}
                className="btn-secondary py-2 text-xs flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> Chapter Hub
              </Link>
              <Link
                to={`/chapter/${activeChapterObj.id}/mcqs`}
                className="btn-primary py-2 text-xs flex items-center gap-1.5"
              >
                Practice MCQs
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filter Bar */}
      <div className="card p-4 mb-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Chapter Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Chapter ({availableChapters.length})
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedTopic('All');
              }}
              className="input text-xs w-full py-2"
            >
              <option value="All">All Chapters</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={availableTopics.length === 0 && selectedChapter === 'All'}
              className="input text-xs w-full py-2 disabled:opacity-50"
            >
              <option value="All">All Topics</option>
              {availableTopics.map((t) => (
                <option key={t.id || t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Video Type Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Video Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input text-xs w-full py-2"
            >
              {videoTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input text-xs w-full py-2"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'All' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex-wrap gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Showing {Math.min(visibleCount, filteredVideos.length)} of {filteredVideos.length} videos
          </span>

          <div className="flex items-center gap-2">
            <a
              href={getYouTubeSearchUrl(currentSearchQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
              title="Search live videos on YouTube"
            >
              <span>Search YouTube Live</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium ml-2"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No video lectures found for this criteria
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            You can search YouTube live for currently available and trending lectures on this exact syllabus topic.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a
              href={getYouTubeSearchUrl(currentSearchQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Search "{currentSearchQuery}" on YouTube</span>
            </a>
            <button onClick={resetFilters} className="btn-secondary text-xs">
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredVideos.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="btn-secondary px-8 py-3 text-sm font-semibold shadow-xs"
              >
                Load More Videos ({filteredVideos.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
