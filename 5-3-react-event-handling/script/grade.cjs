#!/usr/bin/env node
/**
 * React Lab – Task Tracker (Event Handling)
 * Grader (CommonJS) — attempt-aware, NO "grace" shown in report
 *
 * Policy for tasks (out of 80):
 * - No attempt:           0/80
 * - Attempted (partial):  minimum 60/80
 * - Fully complete:       award actual earned (up to 80/80)
 *
 * Per task: Completeness 8, Correctness 6, Code Quality 6 = 20
 * Submission: 20 (on time) / 10 (late)
 * Report shows Achieved/Missed checks; DOES NOT mention boosts.
 */

const fs = require("fs");

// ---------- helpers ----------
const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const exists = (p) => { try { return fs.existsSync(p); } catch { return false; } };
const has = (txt, pattern) => (txt ? (pattern instanceof RegExp ? pattern.test(txt) : txt.includes(pattern)) : false);

const nowIso = () => new Date().toISOString();
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
  return nowIso();
};
const isLate = (dueIso, commitIso) => {
  try { return new Date(commitIso).getTime() > new Date(dueIso).getTime(); } catch { return false; }
};

// ---------- inputs ----------
const FILES = {
  app: ["src/components/TaskApp.jsx", "src/TaskApp.jsx", "TaskApp.jsx"].find(exists),
  list: ["src/components/TaskList.jsx", "src/TaskList.jsx", "TaskList.jsx"].find(exists),
  item: ["src/components/TaskItem.jsx", "src/TaskItem.jsx", "TaskItem.jsx"].find(exists),
};

const code = {
  app: read(FILES.app || ""),
  list: read(FILES.list || ""),
  item: read(FILES.item || ""),
};

// Fixed due date: 6 Oct 2025, 23:59:59 Asia/Riyadh (UTC+03:00)
const DEFAULT_DUE_ISO = "2025-10-06T23:59:59+03:00";
const DUE_DATE_ISO = process.env.DUE_DATE || DEFAULT_DUE_ISO;

// ---------- scoring model ----------
function runChecks(checks, maxPoints) {
  // Each check: {desc, test: boolean, pts}
  let earned = 0;
  const achieved = [];
  const missed = [];
  for (const c of checks) {
    if (c.test) { earned += c.pts; achieved.push(`✅ ${c.desc}`); }
    else { missed.push(`❌ ${c.desc}`); }
  }
  return {
    earned: Math.min(maxPoints, earned),
    achieved,
    missed,
    passedCount: achieved.length,
    totalCount: checks.length,
  };
}

function taskSection(name, completeness, correctness, quality, finalScore) {
  const lines = [];
  lines.push(`### ${name} — ${finalScore}/20`);
  lines.push(`- Completeness: ${completeness.earned}/8`);
  lines.push(`- Correctness: ${correctness.earned}/6`);
  lines.push(`- Code Quality: ${quality.earned}/6`);

  if (completeness.achieved.length) {
    lines.push(`\n**What you achieved (Completeness):**`);
    lines.push(...completeness.achieved.map(s => `  - ${s}`));
  }
  if (completeness.missed.length) {
    lines.push(`\n**What to improve (Completeness):**`);
    lines.push(...completeness.missed.map(s => `  - ${s}`));
  }

  if (correctness.achieved.length) {
    lines.push(`\n**What you achieved (Correctness):**`);
    lines.push(...correctness.achieved.map(s => `  - ${s}`));
  }
  if (correctness.missed.length) {
    lines.push(`\n**What to improve (Correctness):**`);
    lines.push(...correctness.missed.map(s => `  - ${s}`));
  }

  if (quality.achieved.length) {
    lines.push(`\n**What you achieved (Code Quality):**`);
    lines.push(...quality.achieved.map(s => `  - ${s}`));
  }
  if (quality.missed.length) {
    lines.push(`\n**What to improve (Code Quality):**`);
    lines.push(...quality.missed.map(s => `  - ${s}`));
  }

  return lines.join("\n");
}

// ---------- Task checks (lenient, no state required) ----------

// Task 1: Capture Input
const t1Completeness = runChecks([
  { desc: "An input field is present", test: has(code.app, /<input[^>]*>/i), pts: 3 },
  { desc: "Input has an onChange handler", test: has(code.app, /onChange\s*=\s*{[^}]+}/), pts: 3 },
  { desc: "Typed text is shown (preview or similar)", test: has(code.app, /typedPreview|You typed:|aria-live|preview/i), pts: 2 },
], 8);
const t1Correctness = runChecks([
  { desc: "Change handler uses an event parameter (e or event)", test: has(code.app, /onChange\s*=\s*{\s*\(?(e|event)\)?\s*=>/), pts: 2 },
  { desc: "Change handler reads e.target.value (or event.target.value)", test: has(code.app, /e\.target\.value|event\.target\.value/), pts: 2 },
  { desc: "Rendered value appears in the DOM (textContent/innerHTML/JSX)", test: has(code.app, /textContent|innerHTML|\{[^}]*typed|You typed:/), pts: 2 },
], 6);
const t1Quality = runChecks([
  { desc: "TaskApp is exported (export default)", test: has(code.app, /export\s+default/), pts: 3 },
  { desc: "Clean JSX structure around input row", test: has(code.app, /<div\s+className="inputRow">[\s\S]*<\/div>/), pts: 3 },
], 6);

// Task 2: Submit → Pass Props → Display
const t2Completeness = runChecks([
  { desc: "A Submit button exists", test: has(code.app, /<button[^>]*>[^<]*Submit[^<]*<\/button>/i), pts: 3 },
  { desc: "Submit button has an onClick handler", test: has(code.app, /onClick\s*=\s*{[^}]+}/), pts: 3 },
  { desc: "TaskList is rendered from TaskApp", test: has(code.app, /<TaskList\b[^>]*>/), pts: 2 },
], 8);
const t2Correctness = runChecks([
  { desc: "TaskApp passes any task-like prop to TaskList (or appends LI via DOM)", test: has(code.app, /<TaskList[^>]*(tasks|task|text|value)\s*=/) || has(code.app, /document\.createElement\(['"]li['"]\)/), pts: 3 },
  { desc: "TaskList renders TaskItem (map or direct) OR UL receives appended children", test: has(code.list, /<TaskItem\b/) || has(code.list, /\.map\s*\(/) || has(code.app, /appendChild\(li\)/), pts: 3 },
], 6);
const t2Quality = runChecks([
  { desc: "TaskList and TaskItem exported", test: has(code.list, /export\s+default/) && has(code.item, /export\s+default/), pts: 3 },
  { desc: "If mapping, a key is used (or comments indicate intent)", test: has(code.list, /key\s*=\s*{[^}]+}/) || has(code.list, /map.*TaskItem/) || has(code.list, /TODO\s*2.*map/i), pts: 3 },
], 6);

// Task 3: Delete Button
const t3Completeness = runChecks([
  { desc: "Delete button present in TaskItem", test: has(code.item, /<button[^>]*>[^<]*Delete|🗑️/i), pts: 4 },
  { desc: "Delete button wired (onClick or addEventListener)", test: has(code.item, /onClick\s*=\s*{[^}]+}/) || has(code.app, /addEventListener\(\s*['"]click['"]/), pts: 4 },
], 8);
const t3Correctness = runChecks([
  { desc: "Deleting removes the matching item (removeChild / filter / splice / onDelete)", test: has(code.app, /removeChild|filter\s*\(|splice\s*\(/) || has(code.item, /onDelete\(|props\.onDelete/), pts: 6 },
], 6);
const t3Quality = runChecks([
  { desc: "Components exported properly", test: has(code.item, /export\s+default/) || has(code.list, /export\s+default/), pts: 3 },
  { desc: "Delete handler is a small function/arrow or listener", test: has(code.item, /const\s+\w+\s*=\s*\(\)\s*=>|function\s+\w+\s*\(/) || has(code.app, /addEventListener\(/), pts: 3 },
], 6);

// Task 4: Clear All
const t4Completeness = runChecks([
  { desc: "Clear All button exists", test: has(code.app, /<button[^>]*>[^<]*Clear\s*All[^<]*<\/button>/i), pts: 4 },
  { desc: "Clear All button has onClick handler", test: has(code.app, /onClick\s*=\s*{[^}]+}/), pts: 4 },
], 8);
const t4Correctness = runChecks([
  { desc: "Clear All empties the list (innerHTML='', [], or length=0)", test: has(code.app, /innerHTML\s*=\s*['"]{0,1}['"]{0,1}/) || has(code.app, /\btasks\s*=\s*\[\s*\]/) || has(code.app, /length\s*=\s*0/), pts: 6 },
], 6);
const t4Quality = runChecks([
  { desc: "Clear handler defined as simple function/arrow", test: has(code.app, /const\s+\w+\s*=\s*\(\)\s*=>\s*{/) || has(code.app, /function\s+\w+\s*\(/), pts: 3 },
  { desc: "TaskApp exported", test: has(code.app, /export\s+default/), pts: 3 },
], 6);

// ---------- compute raw per task ----------
const perTaskRaw = [
  { name: "Task 1 (Capture Input)", c: t1Completeness, k: t1Correctness, q: t1Quality },
  { name: "Task 2 (Submit → Pass Props → Display)", c: t2Completeness, k: t2Correctness, q: t2Quality },
  { name: "Task 3 (Delete Button)", c: t3Completeness, k: t3Correctness, q: t3Quality },
  { name: "Task 4 (Clear All Button)", c: t4Completeness, k: t4Correctness, q: t4Quality },
];

let perTask = perTaskRaw.map(x => ({
  name: x.name,
  completeness: x.c.earned,
  correctness: x.k.earned,
  quality: x.q.earned,
  raw: x.c.earned + x.k.earned + x.q.earned,
  cDetail: x.c,
  kDetail: x.k,
  qDetail: x.q,
}));

let tasksTotalRaw = perTask.reduce((s, t) => s + t.raw, 0);

// ---------- attempt policy ----------
const attemptDetected =
  has(code.app, /onChange\s*=\s*{[^}]+}/) ||
  has(code.app, /onClick\s*=\s*{[^}]+}/) ||
  has(code.item, /onClick\s*=\s*{[^}]+}/) ||
  has(code.app, /addEventListener\(\s*['"]click['"]/) ||
  has(code.app, /<TaskList\b/) ||
  has(code.list, /<TaskItem\b/);

const t1Full = t1Completeness.earned >= 7 && t1Correctness.earned >= 5;
const t2Full = t2Completeness.earned >= 7 && t2Correctness.earned >= 5;
const t3Full = t3Completeness.earned >= 7 && t3Correctness.earned >= 5;
const t4Full = t4Completeness.earned >= 7 && t4Correctness.earned >= 5;
const allFull = t1Full && t2Full && t3Full && t4Full;

const MIN_ATTEMPT_TOTAL = 60;
let tasksTotalFinal = tasksTotalRaw;

if (!allFull && attemptDetected && tasksTotalRaw < MIN_ATTEMPT_TOTAL) {
  // Raise total to 60/80 without exposing how; distribute silently
  let deficit = MIN_ATTEMPT_TOTAL - tasksTotalRaw;
  const room = perTask.map(t => 20 - t.raw);
  while (deficit > 0 && room.some(r => r > 0)) {
    for (let i = 0; i < perTask.length && deficit > 0; i++) {
      if (room[i] > 0) {
        perTask[i].raw += 1;   // silently bump final per-task score
        room[i] -= 1;
        deficit -= 1;
      }
    }
  }
  tasksTotalFinal = perTask.reduce((s, t) => s + t.raw, 0);
}

// ---------- submission ----------
const commitIso = getCommitIso();
const late = isLate(DUE_DATE_ISO, commitIso);
const submissionPoints = late ? 10 : 20;

// ---------- report ----------
const header = `# Auto Grade Report

**Commit Time:** ${commitIso}
**Due Date:** ${DUE_DATE_ISO}
**Submission:** ${submissionPoints}/20 ${late ? "(Late submission detected)" : "(On time)"}  
`;

const sections = perTask.map(t => {
  return taskSection(
    t.name,
    t.cDetail,
    t.kDetail,
    t.qDetail,
    t.raw // final per-task score shown; no mention of boosts
  );
}).join("\n\n");

const totals = `
## Totals
- Tasks Total: **${tasksTotalFinal}/80**
- Submission: **${submissionPoints}/20**
- **Grand Total: ${tasksTotalFinal + submissionPoints}/100**
`;

const report = `${header}\n${sections}\n\n${totals}\n`;

// Keep JSON minimal and student-friendly too (no boost fields).
const json = {
  commitIso,
  dueDateIso: DUE_DATE_ISO,
  late,
  submissionPoints,
  tasks: perTask.map(t => ({
    name: t.name,
    completeness: t.completeness,
    correctness: t.correctness,
    quality: t.quality,
    final: t.raw,
    achieved: {
      completeness: t.cDetail.achieved,
      correctness: t.kDetail.achieved,
      quality: t.qDetail.achieved,
    },
    missed: {
      completeness: t.cDetail.missed,
      correctness: t.kDetail.missed,
      quality: t.qDetail.missed,
    },
  })),
  tasksTotal: tasksTotalFinal,
  grandTotal: tasksTotalFinal + submissionPoints,
  attemptDetected,        // informational only; no marks shown as "grace"
  allTasksFullyComplete: allFull,
};

try { fs.writeFileSync("grade-report.md", report, "utf8"); } catch {}
try { fs.writeFileSync("grade.json", JSON.stringify(json, null, 2), "utf8"); } catch {}
console.log(report);
