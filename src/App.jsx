import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/ToastContainer';
import ScrollToTop from './components/ui/ScrollToTop';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const AboutNEET = lazy(() => import('./pages/AboutNEET'));
const Syllabus = lazy(() => import('./pages/Syllabus'));
const Subjects = lazy(() => import('./pages/Subjects'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const MCQPractice = lazy(() => import('./pages/MCQPractice'));
const ChapterTest = lazy(() => import('./pages/ChapterTest'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const QuestionBank = lazy(() => import('./pages/QuestionBank'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Revision = lazy(() => import('./pages/Revision'));
const Formulas = lazy(() => import('./pages/Formulas'));
const MockTests = lazy(() => import('./pages/MockTests'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Progress = lazy(() => import('./pages/Progress'));
const StudyPlanner = lazy(() => import('./pages/StudyPlanner'));
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Mistakes = lazy(() => import('./pages/Mistakes'));
const WeakTopics = lazy(() => import('./pages/WeakTopics'));
const AdaptivePractice = lazy(() => import('./pages/AdaptivePractice'));
const RandomPractice = lazy(() => import('./pages/RandomPractice'));
const DailyQuestion = lazy(() => import('./pages/DailyQuestion'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-neet" element={<AboutNEET />} />
                    <Route path="/syllabus" element={<Syllabus />} />
                    <Route path="/neet-syllabus" element={<Syllabus />} />
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/subject/:subject" element={<SubjectPage />} />
                    <Route path="/chapter/:chapterId" element={<ChapterPage />} />
                    <Route path="/chapter/:chapterId/learn" element={<LearnPage />} />
                    <Route path="/chapter/:chapterId/mcqs" element={<MCQPractice />} />
                    <Route path="/chapter/:chapterId/test" element={<ChapterTest />} />
                    <Route path="/result/:id" element={<ResultPage />} />
                    <Route path="/mcqs" element={<QuestionBank />} />
                    <Route path="/question-bank" element={<QuestionBank />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/mistakes" element={<Mistakes />} />
                    <Route path="/my-mistakes" element={<Mistakes />} />
                    <Route path="/weak-topics" element={<WeakTopics />} />
                    <Route path="/adaptive-practice" element={<AdaptivePractice />} />
                    <Route path="/random-practice" element={<RandomPractice />} />
                    <Route path="/daily-question" element={<DailyQuestion />} />
                    <Route path="/revision" element={<Revision />} />
                    <Route path="/formulas" element={<Formulas />} />
                    <Route path="/mock-tests" element={<MockTests />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/study-planner" element={<StudyPlanner />} />
                    <Route path="/daily-challenge" element={<DailyChallenge />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <ToastContainer />
            </div>
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
