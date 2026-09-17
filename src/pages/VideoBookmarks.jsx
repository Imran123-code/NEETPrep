import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Video, Search, RotateCcw, Play } from 'lucide-react';
import { neetVideos } from '../data/videos';
import { allChapters } from '../data/chapters';
import { useProgress } from '../context/ProgressContext';
import VideoCard from '../components/videos/VideoCard';

export default function VideoBookmarks() {
  const { videoBookmarks } = useProgress();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedChapter, setSelectedChapter] = useState('All');

  // Filter saved videos from registry
  const savedVideos = useMemo(() => {
    return neetVideos.filter(v => videoBookmarks?.includes(v.id));
  }, [videoBookmarks]);

  // Derived chapters represented in saved videos
  const availableChapters = useMemo(() => {
    let list = savedVideos;
    if (selectedSubject !== 'All') {
      list = list.filter(v => v.subject === selectedSubject);
    }
    if (selectedClass !== 'All') {
      list = list.filter(v => String(v.class) === String(selectedClass));
    }
    const chIds = [...new Set(list.map(v => v.chapterId).filter(Boolean))];
    return chIds.map(id => {
      const ch = allChapters.find(c => c.id === id);
      return { id, name: ch ? ch.name : id };
    });
  }, [savedVideos, selectedSubject, selectedClass]);

  const filtered = useMemo(() => {
    return savedVideos.filter(v => {
      if (selectedSubject !== 'All' && v.subject !== selectedSubject) return false;
      if (selectedClass !== 'All' && String(v.class) !== String(selectedClass)) return false;
      if (selectedChapter !== 'All' && v.chapterId !== selectedChapter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          v.title.toLowerCase().includes(q) ||
          v.chapterName?.toLowerCase().includes(q) ||
          v.topic?.toLowerCase().includes(q) ||
          v.channel.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [savedVideos, selectedSubject, selectedClass, selectedChapter, search]);

  const hasActiveFilters = search || selectedSubject !== 'All' || selectedClass !== 'All' || selectedChapter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setSelectedSubject('All');
    setSelectedClass('All');
    setSelectedChapter('All');
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold text-xs rounded-full mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Saved Video Lectures</span>
          </div>
          <h1 className="section-title mb-1">My Saved Videos</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {savedVideos.length} bookmarked video lectures for revision
          </p>
        </div>

        <Link to="/videos" className="btn-secondary inline-flex items-center gap-2 self-start">
          <Video className="w-4 h-4" />
          <span>Explore All Videos</span>
        </Link>
      </div>

      {/* Filter Bar */}
      {savedVideos.length > 0 && (
        <div className="card p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search saved videos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 w-full text-sm"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={e => { setSelectedSubject(e.target.value); setSelectedChapter('All'); }}
              className="input text-xs w-full sm:w-36"
            >
              <option value="All">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              value={selectedClass}
              onChange={e => { setSelectedClass(e.target.value); setSelectedChapter('All'); }}
              className="input text-xs w-full sm:w-32"
            >
              <option value="All">All Classes</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>

            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
              className="input text-xs w-full sm:w-44"
            >
              <option value="All">All Chapters ({availableChapters.length})</option>
              {availableChapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>Showing {filtered.length} of {savedVideos.length} saved lectures</span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Video Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {savedVideos.length === 0 ? 'No Saved Videos Yet' : 'No matching saved videos'}
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            {savedVideos.length === 0
              ? 'Bookmark important lectures while browsing the video library to revisit them anytime before your exam.'
              : 'Try clearing your search or filters to see all your saved videos.'}
          </p>
          {savedVideos.length === 0 ? (
            <Link to="/videos" className="btn-primary inline-flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Browse Video Lectures
            </Link>
          ) : (
            <button onClick={resetFilters} className="btn-secondary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
