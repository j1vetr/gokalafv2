/**
 * İç Linkleme Graf Analizi
 * Makaleler arası benzerlik hesaplar, ilgili makaleleri çıkarır, SEO raporu üretir.
 * Çalıştırmak için: npx tsx scripts/analyze-links.ts
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { articles } from "../shared/articles-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Türkçe Stop Words ───────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "ve", "ile", "bir", "bu", "da", "de", "ki", "mi", "mu", "mü",
  "için", "ama", "ya", "ya da", "hem", "ne", "en", "çok", "daha",
  "nasıl", "neden", "hangi", "nedir", "olan", "olan", "olarak", "olan",
  "gibi", "kadar", "sonra", "önce", "ancak", "sadece", "bile", "artık",
  "her", "hiç", "bazı", "tüm", "bütün", "birçok", "bazı", "ise",
  "veya", "fakat", "lakin", "zira", "çünkü", "eğer", "şayet", "gerçi",
  "the", "and", "for", "with", "that", "this", "from", "are", "was",
  "you", "your", "can", "not", "have", "has", "will", "more", "they",
  "also", "its", "how", "what", "when", "which",
]);

// ─── Keyword Çıkarma ─────────────────────────────────────────────────────────
function extractKeywords(article: typeof articles[0]): Set<string> {
  const text = `${article.title} ${article.excerpt} ${article.category}`;
  const words = text
    .toLowerCase()
    .replace(/[^a-züğışöçâîû\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

// ─── Jaccard Benzerlik ────────────────────────────────────────────────────────
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

// ─── Slug Benzerlik Bonusu ────────────────────────────────────────────────────
// Aynı kök kelimeyi paylaşan sluglar ekstra puan alır
function slugBonus(slugA: string, slugB: string): number {
  const partsA = slugA.split("-");
  const partsB = slugB.split("-");
  const common = partsA.filter((p) => p.length > 3 && partsB.includes(p));
  return common.length * 0.05;
}

// ─── Ana Analiz ──────────────────────────────────────────────────────────────
type RelatedMap = Record<string, { slug: string; title: string; category: string; score: number }[]>;

function analyze() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊  GOKALAF — İÇ LİNKLEME GRAF ANALİZİ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const total = articles.length;
  console.log(`📚 Toplam makale: ${total}`);

  // 1. Her makale için keyword seti oluştur
  const keywordSets = new Map<string, Set<string>>();
  for (const a of articles) {
    keywordSets.set(a.slug, extractKeywords(a));
  }

  // 2. Benzerlik matrisini hesapla (her çifte karşı)
  const relatedMap: RelatedMap = {};

  for (const a of articles) {
    const scores: { slug: string; title: string; category: string; score: number }[] = [];

    for (const b of articles) {
      if (a.slug === b.slug) continue;

      const jScore = jaccard(keywordSets.get(a.slug)!, keywordSets.get(b.slug)!);
      const categoryBonus = a.category === b.category ? 0.1 : 0;
      const slugBon = slugBonus(a.slug, b.slug);
      const finalScore = jScore + categoryBonus + slugBon;

      if (finalScore > 0.05) {
        scores.push({ slug: b.slug, title: b.title, category: b.category, score: finalScore });
      }
    }

    // En yüksek 4'ü al — en az 1 farklı kategoriden seç
    scores.sort((x, y) => y.score - x.score);

    const top: typeof scores = [];
    const sameCategory = scores.filter((s) => s.category === a.category).slice(0, 3);
    const diffCategory = scores.filter((s) => s.category !== a.category).slice(0, 1);
    const combined = [...sameCategory, ...diffCategory]
      .filter((v, i, arr) => arr.findIndex((x) => x.slug === v.slug) === i)
      .sort((x, y) => y.score - x.score)
      .slice(0, 4);

    relatedMap[a.slug] = combined;
  }

  // 3. İnbound link sayısını hesapla (orphan tespiti için)
  const inboundCount: Record<string, number> = {};
  for (const a of articles) inboundCount[a.slug] = 0;

  for (const [, related] of Object.entries(relatedMap)) {
    for (const r of related) {
      inboundCount[r.slug] = (inboundCount[r.slug] || 0) + 1;
    }
  }

  // 4. Orphan makaleler (inbound link = 0)
  const orphans = articles.filter((a) => inboundCount[a.slug] === 0);

  // 5. Crawl depth — BFS, kök nokta: ilk makale
  const root = articles[0].slug;
  const depth: Record<string, number> = { [root]: 0 };
  const queue = [root];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of relatedMap[current] || []) {
      if (!(neighbor.slug in depth)) {
        depth[neighbor.slug] = depth[current] + 1;
        queue.push(neighbor.slug);
      }
    }
  }
  const deepArticles = articles.filter((a) => (depth[a.slug] ?? 99) > 3);

  // 6. Kategori kümeleri özeti
  const clusters: Record<string, string[]> = {};
  for (const a of articles) {
    if (!clusters[a.category]) clusters[a.category] = [];
    clusters[a.category].push(a.slug);
  }

  // 7. En yüksek inbound alan makaleler (hub'lar)
  const hubs = articles
    .map((a) => ({ slug: a.slug, title: a.title, inbound: inboundCount[a.slug] }))
    .sort((a, b) => b.inbound - a.inbound)
    .slice(0, 5);

  // ─── Raporu Bas ─────────────────────────────────────────────────────────
  console.log("\n📂 KATEGORİ KÜMELERİ:");
  for (const [cat, slugs] of Object.entries(clusters)) {
    console.log(`   ${cat.padEnd(12)} → ${slugs.length} makale`);
  }

  console.log("\n🏆 EN FAZLA INBOUND LİNK ALAN MAKALELER (Hub'lar):");
  for (const h of hubs) {
    console.log(`   ${h.inbound.toString().padStart(2)} inbound — ${h.slug}`);
  }

  if (orphans.length > 0) {
    console.log(`\n🔴 ORPHAN MAKALELER (hiç inbound link yok): ${orphans.length}`);
    for (const o of orphans) {
      console.log(`   ⚠️  ${o.slug} (${o.category})`);
    }
  } else {
    console.log("\n✅ Orphan makale yok — tüm makaleler en az 1 yerden linkleniyor.");
  }

  if (deepArticles.length > 0) {
    console.log(`\n⚠️  3 TIKTAN UZAK MAKALELER (crawl riski): ${deepArticles.length}`);
    for (const d of deepArticles) {
      console.log(`   Derinlik ${depth[d.slug] ?? "?"} — ${d.slug}`);
    }
  } else {
    console.log("\n✅ Tüm makaleler 3 tık içinde erişilebilir.");
  }

  console.log("\n🔗 İLGİLİ MAKALE ÖRNEKLERİ (ilk 5 makale):");
  for (const a of articles.slice(0, 5)) {
    console.log(`\n   📄 ${a.slug}`);
    for (const r of relatedMap[a.slug]) {
      console.log(`      → [${r.score.toFixed(3)}] ${r.slug} (${r.category})`);
    }
  }

  // ─── JSON Çıktısı ───────────────────────────────────────────────────────
  const outputPath = join(__dirname, "../shared/articles-related.json");
  const cleanOutput: Record<string, { slug: string; title: string; category: string }[]> = {};
  for (const [slug, related] of Object.entries(relatedMap)) {
    cleanOutput[slug] = related.map(({ slug, title, category }) => ({ slug, title, category }));
  }

  writeFileSync(outputPath, JSON.stringify(cleanOutput, null, 2), "utf-8");

  console.log(`\n✅ İlgili makale haritası kaydedildi: shared/articles-related.json`);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  return { relatedMap, orphans, deepArticles, hubs };
}

analyze();
