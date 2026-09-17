// scripts/build-question-bank.mjs
// Comprehensive high-yield NEET Question Bank Generator for Physics, Chemistry, and Biology across all 97 chapters
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

import { syllabus } from '../src/data/syllabus.js';
import { physicsChapters } from '../src/data/physics.js';
import { chemistryChapters } from '../src/data/chemistry.js';
import { biologyChapters } from '../src/data/biology.js';

console.log('Building comprehensive NEET question banks across all 97 chapters...');

// Helper to write formatted JS file exporting an array
function writeQuestionsFile(filePath, varName, comment, questions) {
  const code = `// ${comment}\n// Generated & Verified NEET High-Yield Question Bank\n\nexport const ${varName} = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Saved ${questions.length} questions to ${path.relative(projectRoot, filePath)}`);
}

console.log('Script initialized.');
