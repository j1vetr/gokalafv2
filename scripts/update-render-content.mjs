import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd();

// ─── JSX → HTML Transformer ──────────────────────────────────────────────────
function jsx2html(jsx) {
  let h = jsx;

  // Remove JSX comment blocks
  h = h.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Section wrappers
  h = h.replace(/<div className="mt-16 pt-12 border-t border-white\/10 space-y-6">/g,
    '<section style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">');
  h = h.replace(/<div className="mt-12 space-y-6">/g,
    '<section style="margin-top:3rem">');
  h = h.replace(/<div className="mt-12 space-y-8">/g,
    '<section style="margin-top:3rem">');
  // close those sections (will handle by converting </div> at end)

  h = h.replace(/<div className="space-y-4 text-gray-400 leading-relaxed text-sm">/g,
    '<div style="margin-top:1rem">');

  // h2 headings
  h = h.replace(/<h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">/g,
    '<h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">');
  h = h.replace(/<h2 className="text-xl font-heading font-bold text-white mb-4">/g,
    '<h2 style="font-size:1.25rem;font-weight:700;color:#fff;margin:0 0 0.75rem">');

  // span.text-primary
  h = h.replace(/<span className="text-primary">/g, '<span style="color:#ccff00">');
  h = h.replace(/<span className="text-rose-400[^"]*">/g, '<span style="color:#fb7185">');
  h = h.replace(/<span className="text-amber-400[^"]*">/g, '<span style="color:#fbbf24">');
  h = h.replace(/<span className="text-emerald-400[^"]*">/g, '<span style="color:#34d399">');
  h = h.replace(/<span className="text-blue-400[^"]*">/g, '<span style="color:#60a5fa">');
  h = h.replace(/<span className="text-gray-400[^"]*">/g, '<span style="color:#9ca3af">');
  h = h.replace(/<span className="text-red-400[^"]*">/g, '<span style="color:#f87171">');
  h = h.replace(/<span className="text-green-400[^"]*">/g, '<span style="color:#4ade80">');
  h = h.replace(/<span className="text-yellow-400[^"]*">/g, '<span style="color:#facc15">');
  h = h.replace(/<span className="text-orange-400[^"]*">/g, '<span style="color:#fb923c">');
  h = h.replace(/<span className="text-cyan-400[^"]*">/g, '<span style="color:#22d3ee">');

  // strong
  h = h.replace(/<strong className="text-white">/g, '<strong style="color:#fff">');

  // h3 headings
  h = h.replace(/<h3 className="text-base font-semibold text-white[^"]*">/g,
    '<h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">');
  h = h.replace(/<h3 className="font-bold text-primary[^"]*">/g,
    '<h3 style="color:#ccff00;font-weight:700;margin:0.75rem 0">');
  h = h.replace(/<h3 className="font-bold text-rose-400[^"]*">/g,
    '<h3 style="color:#fb7185;font-weight:700;margin:0.75rem 0">');
  h = h.replace(/<h3 className="[^"]*">/g,
    '<h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">');

  // p tags
  h = h.replace(/<p>\s*/g,
    '<p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">');
  h = h.replace(/<p className="text-gray-500 text-xs leading-relaxed">/g,
    '<p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">');
  h = h.replace(/<p className="text-gray-400[^"]*">/g,
    '<p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">');
  h = h.replace(/<p className="text-xs text-gray-[456][^"]*">/g,
    '<p style="color:#9ca3af;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">');
  h = h.replace(/<p className="[^"]*">/g,
    '<p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">');

  // grid containers
  h = h.replace(/<div className="grid grid-cols-1 sm:grid-cols-3 gap-3[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">');
  h = h.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-3[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">');
  h = h.replace(/<div className="grid grid-cols-1 sm:grid-cols-3[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">');
  h = h.replace(/<div className="grid grid-cols-1 sm:grid-cols-2[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">');
  h = h.replace(/<div className="grid md:grid-cols-2[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin:1rem 0">');
  h = h.replace(/<div className="grid md:grid-cols-3[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin:1rem 0">');
  h = h.replace(/<div className="grid grid-cols-2[^"]*">/g,
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin:1rem 0">');
  h = h.replace(/<div className="grid[^"]*">/g,
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;margin:1rem 0">');

  // colored cards (bg-X-500/10 border border-X-500/20)
  const cards = [
    ['red',    'rgba(239,68,68',    '#f87171'],
    ['blue',   'rgba(59,130,246',   '#60a5fa'],
    ['green',  'rgba(34,197,94',    '#4ade80'],
    ['yellow', 'rgba(234,179,8',    '#facc15'],
    ['orange', 'rgba(249,115,22',   '#fb923c'],
    ['emerald','rgba(52,211,153',   '#34d399'],
    ['cyan',   'rgba(34,211,238',   '#22d3ee'],
    ['rose',   'rgba(251,113,133',  '#fb7185'],
    ['amber',  'rgba(251,191,36',   '#fbbf24'],
  ];

  for (const [name, rgba, hex] of cards) {
    // card containers
    h = h.replace(
      new RegExp(`<div className="bg-${name}-500\\/10 border border-${name}-500\\/20 rounded-xl p-4">`, 'g'),
      `<div style="background:${rgba},0.1);border:1px solid ${rgba},0.2);border-radius:0.75rem;padding:1rem">`
    );
    h = h.replace(
      new RegExp(`<div className="bg-${name}-500\\/10 border border-${name}-500\\/20 rounded-xl p-5">`, 'g'),
      `<div style="background:${rgba},0.1);border:1px solid ${rgba},0.2);border-radius:0.75rem;padding:1.25rem">`
    );
    // card headers
    h = h.replace(
      new RegExp(`<div className="text-${name}-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">`, 'g'),
      `<div style="color:${hex};font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">`
    );
    // inline text colors
    h = h.replace(
      new RegExp(`<div className="text-${name}-400[^"]*">`, 'g'),
      `<div style="color:${hex}">`
    );
  }

  // primary card
  h = h.replace(/<div className="bg-primary\/10 border border-primary\/20 rounded-xl p-4">/g,
    '<div style="background:rgba(204,255,0,0.1);border:1px solid rgba(204,255,0,0.2);border-radius:0.75rem;padding:1rem">');
  h = h.replace(/<div className="text-primary font-heading font-bold uppercase text-xs tracking-wider mb-1">/g,
    '<div style="color:#ccff00;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">');

  // white text bold sub-cards
  h = h.replace(/<div className="text-white font-bold text-sm[^"]*">/g,
    '<div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">');

  // zone list items (HeartRate)
  h = h.replace(/\{.*?\.map\(z => \([\s\S]*?\)\)\}/g, '');

  // bg-white/5 rounded cards
  h = h.replace(/<div className="bg-white\/5 rounded-xl p-4 border border-white\/10">/g,
    '<div style="background:rgba(255,255,255,0.05);border-radius:0.75rem;padding:1rem;border:1px solid rgba(255,255,255,0.1)">');
  h = h.replace(/<div className="bg-white\/5 rounded-xl p-4[^"]*">/g,
    '<div style="background:rgba(255,255,255,0.05);border-radius:0.75rem;padding:1rem">');
  h = h.replace(/<div className="bg-white\/5 rounded-xl p-5[^"]*">/g,
    '<div style="background:rgba(255,255,255,0.05);border-radius:0.75rem;padding:1.25rem">');

  // Remove motion.div tags
  h = h.replace(/<motion\.div[^>]*>/g, '<div>');
  h = h.replace(/<\/motion\.div>/g, '</div>');

  // ul/li
  h = h.replace(/<ul className="[^"]*">/g, '<ul style="padding-left:1.5rem;margin:0.75rem 0">');
  h = h.replace(/<li className="[^"]*">/g, '<li style="color:#a3a3a3;margin:0.4rem 0">');
  h = h.replace(/<li>/g, '<li style="color:#a3a3a3;margin:0.4rem 0">');

  // Remove all JSX expressions { ... }
  // Use a iterative approach to handle nested braces
  let prev = '';
  while (prev !== h) {
    prev = h;
    h = h.replace(/\{[^{}]*\}/g, '');
  }

  // Remove remaining className attributes
  h = h.replace(/ className="[^"]*"/g, '');

  // Remove React-specific props
  h = h.replace(/ key="[^"]*"/g, '');
  h = h.replace(/ data-testid="[^"]*"/g, '');
  h = h.replace(/ onClick="[^"]*"/g, '');
  h = h.replace(/ ref="[^"]*"/g, '');

  // Remove any remaining JSX-style inline event/prop patterns with = { }
  h = h.replace(/ \w+=\{[^}]*\}/g, '');

  // Clean up empty/excess lines
  h = h.replace(/\n{3,}/g, '\n\n');

  return h;
}

// ─── Extract content sections from TSX ───────────────────────────────────────
function extractSections(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const startMarker = '{/* İçerik Bölümü 1:';
  const endMarkers = ['<RelatedCalculators', '<CalculatorFAQ'];

  const start = src.indexOf(startMarker);
  if (start === -1) {
    console.warn(`  ⚠ No content sections found in ${filePath}`);
    return '';
  }

  let end = src.length;
  for (const m of endMarkers) {
    const idx = src.indexOf(m, start);
    if (idx !== -1 && idx < end) end = idx;
  }

  return src.slice(start, end).trim();
}

// ─── Calculator configs ───────────────────────────────────────────────────────
const CALCS = [
  { fn: 'renderVkiTool',            tsx: 'BMICalculator.tsx' },
  { fn: 'renderCalorieTool',        tsx: 'CalorieCalculator.tsx' },
  { fn: 'renderTdeeTool',           tsx: 'TDEECalculator.tsx' },
  { fn: 'renderMacroTool',          tsx: 'MacroCalculator.tsx' },
  { fn: 'renderIdealKiloTool',      tsx: 'IdealWeightCalculator.tsx' },
  { fn: 'renderVucutYagiTool',      tsx: 'BodyFatCalculator.tsx' },
  { fn: 'renderOneRepMaxTool',      tsx: 'OneRepMaxCalculator.tsx' },
  { fn: 'renderSuTuketimiTool',     tsx: 'WaterIntakeCalculator.tsx' },
  { fn: 'renderKalpAtisiTool',      tsx: 'HeartRateZonesCalculator.tsx' },
  { fn: 'renderProteinTool',        tsx: 'ProteinIntakeCalculator.tsx' },
  { fn: 'renderDinlenmeTool',       tsx: 'RestTimerCalculator.tsx' },
  { fn: 'renderBoyKiloEndeksiTool', tsx: 'BoyKiloEndeksiCalculator.tsx' },
  { fn: 'renderBelKalcaOraniTool',  tsx: 'WaistHipRatioCalculator.tsx' },
  { fn: 'renderVucutTipiTool',      tsx: 'BodyTypeCalculator.tsx' },
];

// ─── Main ────────────────────────────────────────────────────────────────────
let renderTs = readFileSync(resolve(ROOT, 'server/render.ts'), 'utf8');

for (const { fn, tsx } of CALCS) {
  const tsxPath = resolve(ROOT, 'client/src/pages/calculators', tsx);
  let rawContent;
  try {
    rawContent = extractSections(tsxPath);
  } catch (e) {
    console.error(`  ✗ Failed to read ${tsx}:`, e.message);
    continue;
  }

  if (!rawContent) {
    console.warn(`  ⚠ No content for ${fn}`);
    continue;
  }

  const htmlContent = jsx2html(rawContent);

  // Find the function in render.ts
  const fnStart = renderTs.indexOf(`export function ${fn}(`);
  if (fnStart === -1) {
    console.warn(`  ⚠ Function ${fn} not found in render.ts`);
    continue;
  }

  // Find the next function boundary
  const nextFnIdx = renderTs.indexOf('\nexport function ', fnStart + 1);
  const fnEnd = nextFnIdx !== -1 ? nextFnIdx : renderTs.length;

  // Within this function, find the calculator placeholder div:
  // '<div style="background: #0a0a0a; border: 1px solid #1a1a1a;'
  const placeholderDiv = 'background: #0a0a0a; border: 1px solid #1a1a1a;';
  let searchFrom = fnStart;
  const placeholderIdx = renderTs.indexOf(placeholderDiv, searchFrom);
  if (placeholderIdx === -1 || placeholderIdx >= fnEnd) {
    console.warn(`  ⚠ No placeholder div found in ${fn}`);
    continue;
  }

  // Find the closing </div> of the placeholder  
  const afterPlaceholder = renderTs.indexOf('</div>', placeholderIdx) + 6;

  // Find the closing </main> of this function
  const mainCloseIdx = renderTs.lastIndexOf('</main>', fnEnd - 10);
  if (mainCloseIdx === -1 || mainCloseIdx < placeholderIdx) {
    console.warn(`  ⚠ No </main> found in ${fn}`);
    continue;
  }

  // Replace content between after-placeholder and </main>
  const newContent = `\n\n${htmlContent}\n\n      `;
  renderTs = 
    renderTs.slice(0, afterPlaceholder) + 
    newContent + 
    renderTs.slice(mainCloseIdx);

  console.log(`  ✓ ${fn} ← ${tsx}`);
}

writeFileSync(resolve(ROOT, 'server/render.ts'), renderTs, 'utf8');
console.log('\n✅  render.ts updated!');
