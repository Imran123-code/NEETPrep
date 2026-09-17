import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Bookmark, Clock, Eye, ExternalLink } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { subjectColors } from '../../data/syllabus';

export default function VideoCard({ video, onSelect }) {
  const { videoBookmarks, toggleVideoBookmark } = useProgress();
  if (!video) return null;

  const isBookmarked = videoBookmarks?.includes(video.id);
  const colors = subjectColors[video.subject] || subjectColors.Physics;
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <div className="card group overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200">
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img
          src={thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Play Button Overlay */}
        <Link
          to={`/videos/${video.id}`}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Watch ${video.title}`}
        >
          <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
          {video.badge && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
              {video.badge}
            </span>
          )}
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs">
            {video.videoType || 'Lecture'}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleVideoBookmark(video.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-amber-500 text-white'
              : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-white'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Save Video'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Duration / Views Bar at bottom */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 pointer-events-none">
          {video.duration && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-black/75 text-white flex items-center gap-1 backdrop-blur-xs">
              <Clock className="w-3 h-3" /> {video.duration}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: `${colors.primary}15`, color: colors.primary }}
            >
              {video.subject} · Class {video.class}
            </span>
            {video.language && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {video.language}
              </span>
            )}
            {video.views && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                <Eye className="w-3 h-3" /> {video.views}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/videos/${video.id}`} className="block">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {video.title}
            </h3>
          </Link>

          {/* Channel */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {video.channel}
          </p>

          {/* Chapter & Topic */}
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium text-slate-900 dark:text-slate-200">
              {video.chapterName || video.chapterId}
            </span>
            {video.topic && (
              <span className="text-slate-400"> · {video.topic}</span>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Link
            to={`/videos/${video.id}`}
            className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Watch Now
          </Link>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Open on YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
