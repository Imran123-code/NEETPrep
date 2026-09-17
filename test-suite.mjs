// Comprehensive Automated Verification Suite for NEETPrep
import { allChapters, getChapterById, getChaptersBySubject, getChaptersByClass, getChaptersBySubjectAndClass } from './src/data/chapters.js';
import { syllabus, subjectColors, subjectIcons } from './src/data/syllabus.js';
import {
  allQuestions,
  getAllQuestions,
  getQuestionsBySubject,
  getQuestionsByClass,
  getQuestionsByChapter,
  filterQuestions,
} from './src/data/questions/index.js';
import { getMCQsByChapter, getMCQsBySubject } from './src/data/mcqs.js';

console.log('🚀 Running NEETPrep Verification Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Check Chapters Registry
console.log('--- 1. Chapters Registry Verification ---');
assert(allChapters.length === 97, `Master chapters count is 97 (Actual: ${allChapters.length})`);

const phyChapters = getChaptersBySubject('Physics');
const chemChapters = getChaptersBySubject('Chemistry');
const bioChapters = getChaptersBySubject('Biology');
assert(phyChapters.length === 29, `Physics total chapters is 29 (Actual: ${phyChapters.length})`);
assert(chemChapters.length === 30, `Chemistry total chapters is 30 (Actual: ${chemChapters.length})`);
assert(bioChapters.length === 38, `Biology total chapters is 38 (Actual: ${bioChapters.length})`);

const phy11 = getChaptersBySubjectAndClass('Physics', 11);
const phy12 = getChaptersBySubjectAndClass('Physics', 12);
assert(phy11.length === 15, `Physics Class 11 chapters is 15 (Actual: ${phy11.length})`);
assert(phy12.length === 14, `Physics Class 12 chapters is 14 (Actual: ${phy12.length})`);

// 2. Check Every Single Chapter Lookup & Properties
console.log('\n--- 2. Chapter Properties & Fallback Integrity ---');
let allChaptersHaveValidTopics = true;
let allChaptersHaveValidMeta = true;

allChapters.forEach(ch => {
  if (!ch.id || !ch.name || !ch.subject || !ch.class || !ch.color) {
    allChaptersHaveValidMeta = false;
    console.error(`Invalid metadata on chapter:`, ch);
  }
  if (!Array.isArray(ch.topics) || ch.topics.length === 0) {
    allChaptersHaveValidTopics = false;
    console.error(`Missing topics on chapter: ${ch.id} (${ch.name})`);
  }
  const lookup = getChapterById(ch.id);
  if (!lookup || lookup.id !== ch.id) {
    allChaptersHaveValidMeta = false;
    console.error(`Failed lookup for chapter: ${ch.id}`);
  }
});
assert(allChaptersHaveValidMeta, 'All 97 chapters have valid ID, name, subject, class, and colors');
assert(allChaptersHaveValidTopics, 'All 97 chapters have structured topics for learning mode');

// 3. Check Questions Registry
console.log('\n--- 3. Questions Bank & Query Engine ---');
const totalQuestions = getAllQuestions();
assert(totalQuestions.length > 0, `Total questions loaded: ${totalQuestions.length}`);

const phyQ = getQuestionsBySubject('Physics');
const chemQ = getQuestionsBySubject('Chemistry');
const bioQ = getQuestionsBySubject('Biology');
assert(phyQ.length > 0, `Physics questions loaded: ${phyQ.length}`);
assert(chemQ.length > 0, `Chemistry questions loaded: ${chemQ.length}`);
assert(bioQ.length > 0, `Biology questions loaded: ${bioQ.length}`);

// 4. Test Filters & MCQs Retrieval
console.log('\n--- 4. Filters & Practice Engines ---');
const easyQuestions = filterQuestions({ difficulty: 'Easy' });
const mediumQuestions = filterQuestions({ difficulty: 'Medium' });
const hardQuestions = filterQuestions({ difficulty: 'Hard' });
assert(easyQuestions.length > 0, `Filter Easy questions working: ${easyQuestions.length}`);
assert(mediumQuestions.length > 0, `Filter Medium questions working: ${mediumQuestions.length}`);
assert(hardQuestions.length > 0, `Filter Hard questions working: ${hardQuestions.length}`);

// 5. Test Question Schema Completeness
let allQuestionsValid = true;
totalQuestions.forEach((q, idx) => {
  if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number' || !q.explanation) {
    allQuestionsValid = false;
    console.error(`Invalid question schema at index ${idx}:`, q);
  }
});
assert(allQuestionsValid, 'All questions have id, 4 options, numeric correctAnswer index, and explanation');

// 6. Test Subject Colors & Icons
console.log('\n--- 5. UI Subject Constants ---');
assert(Boolean(subjectColors.Physics && subjectColors.Chemistry && subjectColors.Biology), 'Subject colors defined for Physics, Chemistry, Biology');
assert(Boolean(subjectIcons.Physics && subjectIcons.Chemistry && subjectIcons.Biology), 'Subject icons defined for Physics, Chemistry, Biology');

// 7. Video Learning Registry Verification
console.log('\n--- 6. Video Learning Registry Verification ---');
const { neetVideos, getAllVideos, getVideoById, getVideosBySubject, getVideosByClass, getVideosByChapter } = await import('./src/data/videos.js');

assert(Array.isArray(neetVideos) && neetVideos.length >= 20, `Curated video library loaded (${neetVideos.length} videos)`);

let allVideosValid = true;
neetVideos.forEach((v, idx) => {
  if (!v.id || !v.title || !v.youtubeId || !v.subject || !v.class || !v.channel || !v.videoType) {
    allVideosValid = false;
    console.error(`Invalid video schema at index ${idx}:`, v);
  }
});
assert(allVideosValid, 'All video entries have valid ID, title, youtubeId, subject, class, channel, and videoType');

const phyVideos = getVideosBySubject('Physics');
const chemVideos = getVideosBySubject('Chemistry');
const bioVideos = getVideosBySubject('Biology');
assert(phyVideos.length > 0, `Physics video lectures indexed: ${phyVideos.length}`);
assert(chemVideos.length > 0, `Chemistry video lectures indexed: ${chemVideos.length}`);
assert(bioVideos.length > 0, `Biology video lectures indexed: ${bioVideos.length}`);

const class11Videos = getVideosByClass(11);
const class12Videos = getVideosByClass(12);
assert(class11Videos.length > 0, `Class 11 video lectures indexed: ${class11Videos.length}`);
assert(class12Videos.length > 0, `Class 12 video lectures indexed: ${class12Videos.length}`);

const sampleVideo = neetVideos[0];
const lookupVid = getVideoById(sampleVideo.id);
assert(lookupVid && lookupVid.id === sampleVideo.id, `Video lookup by ID working for ${sampleVideo.id}`);

console.log(`\n========================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
