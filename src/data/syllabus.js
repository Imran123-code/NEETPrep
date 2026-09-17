// Complete NEET Syllabus Data
// Source: NTA NEET Syllabus (NCERT-aligned)
// Modularized into subject/class submodules under ./syllabus/

import { physicsClass11Chapters } from './syllabus/physics11.js';
import { physicsClass12Chapters } from './syllabus/physics12.js';
import { chemistryClass11Chapters } from './syllabus/chemistry11.js';
import { chemistryClass12Chapters } from './syllabus/chemistry12.js';
import { biologyClass11Chapters } from './syllabus/biology11.js';
import { biologyClass12Chapters } from './syllabus/biology12.js';

export {
  physicsClass11Chapters,
  physicsClass12Chapters,
  chemistryClass11Chapters,
  chemistryClass12Chapters,
  biologyClass11Chapters,
  biologyClass12Chapters,
};

export const syllabus = {
  Physics: { 11: physicsClass11Chapters, 12: physicsClass12Chapters },
  Chemistry: { 11: chemistryClass11Chapters, 12: chemistryClass12Chapters },
  Biology: { 11: biologyClass11Chapters, 12: biologyClass12Chapters },
};

export const subjectColors = {
  Physics: { primary: '#3B82F6', light: '#EFF6FF', dark: '#1D4ED8', text: 'blue' },
  Chemistry: { primary: '#10B981', light: '#ECFDF5', dark: '#047857', text: 'emerald' },
  Biology: { primary: '#8B5CF6', light: '#F5F3FF', dark: '#6D28D9', text: 'violet' },
};

export const subjectIcons = {
  Physics: '⚛️',
  Chemistry: '🧪',
  Biology: '🧬',
};
