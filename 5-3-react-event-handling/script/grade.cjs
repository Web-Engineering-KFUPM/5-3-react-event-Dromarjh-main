#!/usr/bin/env node
/**
 * React Lab – Task Tracker (Event Handling)
 * Grader (CommonJS, ultra-lenient / no-state required)
 *
 * Tasks (80 pts): 4 × 20
 *   - Completeness 8, Correctness 6, Code Quality 6
 * Submission (20 pts): On time = 20, Late = 10
 * Floor: total task score >= 70/80 (submission excluded)
 *
 * Looks only for top-level signals in:
 *   - TaskApp.jsx
 *   - TaskList.jsx
 *   - TaskItem.jsx
 */

const fs = require("fs");

// ---------- helpers ----------
const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const exists = (p) => { try { return fs.existsSync(p); } catch { return false; } };
const has = (txt, pattern) => (txt ? (pattern instanceof RegExp ? pattern.test(txt) : txt.includes(pattern)) : false);
const getCommitIso = () => {
  try {
    const p = process.env.GITHUB_EVENT_PATH;
    if (p && fs.existsSync(p)) {
      const payload = JSON.parse(fs.readFileSync(p, "utf8"));
      const t = payload?.head_commit?.timestamp
        || payload?.commits?.[payload.commits?.length - 1]?.timestamp
        || payload?.repository?.pushed_at
        || payload?.workflow_run?.head_commit?.timestamp;
      if (t) return new Date(t).toISOString();
    }
  } catch {}
  try {
    const { execSync } = require("child_process");
    const iso = execSync("git log -1 --pretty=format:%cI", { encoding: "utf8" }).trim();
    if (iso) return new Date(iso).toISOString();
  } catch {}
  return new Date().toISOString();
};
const isLate = (dueIso, commitIso) => {
  try { return new Date(commitIso).getTime() > new Date(dueIso).getTime(); } catch { return false; }
};

// ---------- inputs ----------
const FILES = {
  app: ["src/TaskApp.jsx", "TaskApp.jsx"].find(exists),
  list: ["src/TaskList.jsx", "TaskList.jsx"].find(exists),
  item: ["src/TaskItem.jsx", "TaskItem.jsx"].find(exists),
};
const code = {
  app: read(FILES.app || ""),
  list: read(FILES.list || ""),
  item: read(FILES.item || ""),
};

// Fixed due date: 6 Oct 2025, 23:59:59 Asia/Riyadh (UTC+03:00)
const DEFAULT_DUE_ISO = "2025-10-06T23:59:59+03:00";
const DUE_DATE_ISO = process.env.DUE_DATE || DEFAULT_DUE_ISO;

// ---------- scoring ----------
const tasks = [
  { name: "Task 1 (Capture Input)", total: 20, completeness: 0, correctness: 0, quality: 0, notes: [] },
  { name: "Task 2 (Submit → Pass Props → Display)", total: 20, completeness: 0, correctness: 0, quality: 0, notes: [] },
  { name: "Task 3 (Delete Button)", total: 20, completeness: 0, correctness: 0, quality: 0, notes: [] },
  { name: "Task 4 (Clear All Button)", total: 20, completeness: 0, correctness: 0, quality: 0, notes: [] },
];

// ---------- Task 1 (no-state required) ----------
(function () {
  const t = tasks[0]; const a = code.app;

  // Completeness (8): input present, onChange present, some display of typed value (even commented hint), file exists
  let c = 0;
  if (FILES.app) c += 2;
  if (has(a, /<input[^>]*>/i)) c += 2;
  if (has(a, /onChange\s*=\s*{[^}]+}/)) c += 2;
  if (has(a, /\{[^}]*e\.target\.value[^}]*\}/) || has(a, /display|show|typed|current\s*text/i) || has(a, /<div[^>]*>\s*{[^}]+}\s*<\/div>/)) c += 2;
  t.completeness = Math.min(8, c);

  // Correctness (6): references e.target.value OR passes a variable from onChange
  let k = 0;
  if (has(a, /e\.target\.value/)) k += 4;
  if (has(a, /onChange\s*=\s*{[^}]*}/)) k += 2;
  t.correctness = Math.min(6, k);

  // Code Quality (6): export default present; reasonable JSX structure
  let q = 0;
  if (has(a, /export\s+default/)) q += 3;
  if (has(a, /return\s*\(\s*<section/i)) q += 3;
  t.quality = Math.min(6, q);
})();

// ---------- Task 2 ----------
(function () {
  const t = tasks[1]; const a = code.app, l = code.list, i = code.item;

  // Completeness (8): Submit button with onClick; TaskList exists; TaskItem referenced
  let c = 0;
  if (has(a, /<button[^>]*>[^<]*Submit[^<]*<\/button>/i)) c += 3;
  if (has(a, /onClick\s*=\s*{[^}]+}/)) c += 2;
  if (FILES.list && has(a, /<TaskList\b/i)) c += 2;
  if (FILES.item && has(l, /<TaskItem\b/i)) c += 1;
  t.completeness = Math.min(8, c);

  // Correctness (6): prop flows App → List → Item; Item displays prop in span
  let k = 0;
  if (has(a, /<TaskList[^>]*\b(task|tasks|text|value)\s*=\s*{[^}]+}/)) k += 2;
  if (has(l, /<TaskItem[^>]*\b(text|task)\s*=\s*{[^}]+}/)) k += 2;
  if (has(i, /<span[^>]*>\s*{[^}]*\b(text|task)\b[^}]*}\s*<\/span>/)) k += 2;
  t.correctness = Math.min(6, k);

  // Code Quality (6): props destructuring in children, map+key suggested (even if single), exports present
  let q = 0;
  if (has(l, /function\s+\w+\s*\(\s*{\s*\w+/) || has(i, /function\s+\w+\s*\(\s*{\s*\w+/)) q += 2;
  if (has(l, /\.map\s*\(/) && has(l, /key\s*=\s*{[^}]+}/)) q += 2;
  if (has(l, /export\s+default/) && has(i, /export\s+default/)) q += 2;
  t.quality = Math.min(6, q);
})();

// ---------- Task 3 ----------
(function () {
  const t = tasks[2]; const a = code.app, l = code.list, i = code.item;

  // Completeness (8): Delete button + onClick in TaskItem; delete handler recognizable in props chain
  let c = 0;
  if (has(i, /<button[^>]*>[^<]*Delete|🗑️/i)) c += 3;
  if (has(i, /onClick\s*=\s*{[^}]+}/)) c += 3;
  if (has(l, /\bonDelete\b/) || has(i, /\bonDelete\b/) || has(a, /\bonDelete\b/)) c += 2;
  t.completeness = Math.min(8, c);

  // Correctness (6): calling onDelete in item; any removal hint (filter/splice/slice or comment)
  let k = 0;
  if (has(i, /onDelete\s*\(/) || has(i, /props\.onDelete/)) k += 3;
  if (has(a, /filter\s*\(/) || has(l, /filter\s*\(/) || has(a, /splice\s*\(/) || has(l, /splice\s*\(/)) k += 3;
  t.correctness = Math.min(6, k);

  // Code Quality (6): clear imports/exports; simple, readable handlers
  let q = 0;
  if (has(i, /export\s+default/) || has(l, /export\s+default/)) q += 3;
  if (!has(a, /\/\/\s*TODO\s*3/i) || !has(i, /\/\/\s*TODO\s*3/i)) q += 3; // nudges finishing the TODO
  t.quality = Math.min(6, q);
})();

// ---------- Task 4 ----------
(function () {
  const t = tasks[3]; const a = code.app;

  // Completeness (8): Clear All button + onClick in TaskApp
  let c = 0;
  if (has(a, /<button[^>]*>[^<]*Clear\s*All[^<]*<\/button>/i)) c += 4;
  if (has(a, /onClick\s*=\s*{[^}]+}/)) c += 4;
  t.completeness = Math.min(8, c);

  // Correctness (6): any sign of clearing items (empty array literal, setting tasks prop to [], length=0, or commented plan)
  let k = 0;
  if (has(a, /\[\s*\]\s*\)/) || has(a, /\btasks\s*=\s*\[\s*\]/) || has(a, /length\s*=\s*0/)) k += 6;
  t.correctness = Math.min(6, k);

  // Code Quality (6): named/arrow function for the clear action + export default present
  let q = 0;
  if (has(a, /const\s+\w+\s*=\s*\(\)\s*=>\s*{/) || has(a, /function\s+\w+\s*\(/)) q += 3;
  if (has(a, /export\s+default/)) q += 3;
  t.quality = Math.min(6, q);
})();

// ---------- totals & floor ----------
const perTask = tasks.map(t => ({
  name: t.name,
  completeness: t.completeness,
  correctness: t.correctness,
  quality: t.quality,
  score: t.completeness + t.correctness + t.quality,
}));
let tasksTotal = perTask.reduce((s, x) => s + x.score, 0);

// Floor ≥ 70/80 (tasks only)
const FLOOR = 70;
if (tasksTotal < FLOOR) {
  let deficit = FLOOR - tasksTotal;
  const caps = perTask.map(x => 20 - x.score);
  while (deficit > 0 && caps.some(c => c > 0)) {
    for (let i = 0; i < perTask.length && deficit > 0; i++) {
      if (caps[i] > 0) { perTask[i].score += 1; caps[i] -= 1; deficit -= 1; }
    }
  }
  tasksTotal = perTask.reduce((s, x) => s + x.score, 0);
}

// submission
const commitIso = getCommitIso();
const late = isLate(DUE_DATE_ISO, commitIso);
const submissionPoints = late ? 10 : 20;

// grand total
const grandTotal = tasksTotal + submissionPoints;

// ---------- report ----------
function section(idx) {
  const t = tasks[idx], s = perTask[idx];
  const lines = [
    `### ${s.name} — ${s.score}/20`,
    `- Completeness: ${s.completeness}/8`,
    `- Correctness: ${s.correctness}/6`,
    `- Code Quality: ${s.quality}/6`,
  ];
  if (t.notes?.length) lines.push(`- Notes: ${t.notes.join(" ")}`);
  return lines.join("\n");
}

const header = `# Auto Grade Report

**Commit Time:** ${commitIso}
**Due Date:** ${DUE_DATE_ISO}
**Submission:** ${submissionPoints}/20 ${late ? "(Late submission detected)" : "(On time)"}

`;
const body = perTask.map((_, i) => section(i)).join("\n\n");
const totals = `

## Totals
- Tasks Total: **${tasksTotal}/80**
- Submission: **${submissionPoints}/20**
- **Grand Total: ${grandTotal}/100**
`;

const report = `${header}${body}${totals}\n`;
const json = {
  commitIso, dueDateIso: DUE_DATE_ISO, late, submissionPoints,
  tasks: perTask, tasksTotal, grandTotal,
};

try { fs.writeFileSync("grade-report.md", report, "utf8"); } catch {}
try { fs.writeFileSync("grade.json", JSON.stringify(json, null, 2), "utf8"); } catch {}
console.log(report);
