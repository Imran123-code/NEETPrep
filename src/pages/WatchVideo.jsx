import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, Bookmark, ArrowLeft, ExternalLink, BookOpen, 
  Target, Clock, Eye, Share2, Check, Video, AlertCircle 
} from 'lucide-react';
import { getVideoById, getRelatedVideos, getYouTubeSearchUrl } from '../data/videos';
import { subjectColors } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';
import VideoCard from '../components/videos/VideoCard';

export default function WatchVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { videoBookmarks, toggleVideoBookmark, recordVideoWatch, addToast } = useProgress();
  const [copied, setCopied] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  const video = getVideoById(videoId);
  const isBookmarked = video ? videoBookmarks?.includes(video.id) : false;
  const relatedVideos = video ? getRelatedVideos(video, 6) : [];
  const colors = video ? (subjectColors[video.subject] || subjectColors.Physics) : null;

  // Record to watch history on visit
  useEffect(() => {
    if (video) {
      recordVideoWatch(video);
    }
  }, [video, recordVideoWatch]);

  if (!video) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
          <Video className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Video Not Found</h2>
        <p className="text-slate-500 max-w-md">
          This video ID could not be located in the curated lecture registry.
        </p>
        <Link to="/videos" className="btn-primary">
          Browse Video Library
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (addToast) addToast('Video lecture link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const directYouTubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/videos"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Videos</span>
        </Link>

        <div className="flex items-center gap-2">
          {video.chapterId && (
            <Link
              to={`/chapter/${video.chapterId}`}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline"
            >
              {video.chapterName}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Responsive 16:9 YouTube Player */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-200 dark:border-slate-800">
            {!embedError ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                onError={() => setEmbedError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
                <h3 className="font-bold text-lg">Playback Restricted by Creator</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                  This YouTube channel has restricted embedded viewing outside YouTube. You can watch it directly on YouTube.
                </p>
                <a
                  href={directYouTubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <ExternalLink className="w-4 h-4" /> Watch on YouTube
                </a>
              </div>
            )}
          </div>

          {/* Action Header Below Player */}
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-md"
                  style={{ background: `${colors.primary}15`, color: colors.primary }}
                >
                  {video.subject} · Class {video.class}
                </span>
                <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {video.videoType}
                </span>
                {video.language && (
                  <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {video.language}
                  </span>
                )}
                {video.badge && (
                  <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    {video.badge}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVideoBookmark(video.id)}
                  className={`btn-sm flex items-center gap-1.5 border ${
                    isBookmarked
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="btn-sm btn-secondary flex items-center gap-1.5"
                  title="Share link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                <a
                  href={directYouTubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sm btn-secondary flex items-center gap-1.5 text-red-600 hover:text-red-700"
                  title="Open on YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
              </div>
            </div>

            {/* Video Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {video.title}
            </h1>

            {/* Channel and Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                📺 {video.channel}
              </span>
              {video.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {video.duration}
                </span>
              )}
              {video.views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {video.views} views
                </span>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  About this Lecture
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}

            {/* Quick Practice & Study CTAs */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
              {video.chapterId && (
                <>
                  <Link
                    to={`/chapter/${video.chapterId}/mcqs`}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5" /> Practice Chapter MCQs
                  </Link>
                  <Link
                    to={`/chapter/${video.chapterId}/learn`}
                    className="btn-secondary text-xs flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Study Revision Notes
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Related & Topic Lectures (1 Col) */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center justify-between">
              <span>Related {video.subject} Lectures</span>
              <span className="text-xs font-normal text-slate-400">{relatedVideos.length} videos</span>
            </h3>

            <div className="space-y-3">
              {relatedVideos.map((r) => (
                <Link
                  key={r.id}
                  to={`/videos/${r.id}`}
                  className="group flex gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="relative w-24 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${r.youtubeId}/hqdefault.jpg`}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current opacity-80" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {r.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{r.channel}</p>
                    <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      {r.videoType} · {r.duration}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* YouTube Live Search Helper */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href={getYouTubeSearchUrl(`NEET ${video.subject} ${video.chapterName} ${video.topic}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-secondary text-xs flex items-center justify-center gap-1.5 text-red-600 hover:text-red-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Search more on YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
