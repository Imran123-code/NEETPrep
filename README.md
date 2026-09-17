# 🩺 NEETPrep — Comprehensive NEET UG Preparation Platform

> **"Learn. Practice. Improve. Crack NEET."**

NEETPrep is a modern, responsive, student-friendly NEET preparation web application designed for Class 11 and Class 12 aspirants covering **Physics, Chemistry, and Biology** with NCERT-aligned syllabus tracking, chapter-wise learning, a high-yield MCQ question bank, full-syllabus mock tests, personalized analytics, and mistake tracking.

---

## ✨ Features

- 📚 **Complete 97-Chapter NEET Syllabus**: Fully mapped NCERT Class 11 and Class 12 curriculum for Physics (29 chapters), Chemistry (30 chapters), and Biology (38 chapters).
- 🧠 **Chapter-Wise Learning**: Structured study topics, key concepts, formulas, and high-yield NEET tips for every chapter.
- 🎯 **Large NEET MCQ Question Bank**:
  - Balanced difficulties: Easy (30%), Medium (50%), Hard (20%).
  - Step-by-step numerical solutions for Physics & Physical Chemistry.
  - Organic reaction mechanisms and NCERT Inorganic periodic trends.
  - Line-by-line NCERT conceptual statements and Assertion-Reason questions for Biology.
- ⚡ **Adaptive Practice Modes**:
  - Quick Practice presets: Practice 10, Practice 25, Practice 50, and Practice All.
  - Random Practice and Weak Topics practice.
  - Daily Question rotation across Physics, Chemistry, and Biology.
  - Daily Challenge with streak rewards.
- 🧪 **Custom Mock Test Generator**:
  - Timed test engine for Class 11, Class 12, or Full Syllabus.
  - Subject-level mock tests (Physics, Chemistry, Biology, Mixed).
- 📊 **Comprehensive Analytics & Result Breakdown**:
  - Detailed score cards with accuracy, time taken, and subject breakdowns.
  - Automatic weak topic and strong area detection.
- 📓 **My Mistakes & Bookmarks**:
  - Automatically records incorrectly answered questions for targeted replay.
  - Multi-criteria question bookmarking.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, React Router v7
- **Styling**: Tailwind CSS, Vanilla CSS design system (Glassmorphism, dark mode)
- **Icons**: Lucide React
- **State & Storage**: React Context API, LocalStorage persistence

---

## 🛠️ Getting Started Locally

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Imran123-code/NEETPREP.git
   cd NEETPREP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
NEETPREP/
├── src/
│   ├── components/       # Layout, Navigation, UI components
│   ├── context/          # Auth, Progress, and Theme Contexts
│   ├── data/
│   │   ├── chapters.js   # Unified 97-chapter registry
│   │   ├── syllabus.js   # Class 11 & 12 NCERT curriculum
│   │   └── questions/    # Modular MCQ banks (Physics, Chemistry, Biology)
│   ├── pages/            # App routes and views
│   ├── App.jsx           # Routing architecture
│   └── index.css         # Design system & tokens
├── scripts/              # Question bank generators & verification scripts
└── test-suite.mjs        # Automated verification suite
```

---

## 📜 License

This project is licensed under the MIT License.
