import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, BookOpen, ChevronDown, Lightbulb, AlertCircle, CheckCircle, Calculator, User, RefreshCw } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getArticleBySlug, categories } from "@shared/articles-data";
import articlesRelated from "@shared/articles-related.json";
import MarkdownIt from "markdown-it";
import { useMemo, useState, useEffect, useCallback } from "react";
import SEO from "@/components/SEO";

const fitnessTools = [
  { name: "VKİ Hesaplama", path: "/araclar/vki", desc: "Vücut kitle indeksini hesapla" },
  { name: "Kalori Hesaplama", path: "/araclar/kalori", desc: "Günlük kalori ihtiyacını öğren" },
  { name: "TDEE Hesaplama", path: "/araclar/tdee", desc: "Toplam enerji harcamanı hesapla" },
  { name: "Makro Hesaplama", path: "/araclar/makro", desc: "Protein, yağ, karbonhidrat oranlarını bul" },
  { name: "İdeal Kilo", path: "/araclar/ideal-kilo", desc: "Sağlıklı kilo aralığını öğren" },
  { name: "Vücut Yağı", path: "/araclar/vucut-yagi", desc: "Vücut yağ oranını hesapla" },
  { name: "1RM Hesaplama", path: "/araclar/bir-tekrar-max", desc: "Maksimum kaldırma kapasiteni bul" },
  { name: "Su Tüketimi", path: "/araclar/su-tuketimi", desc: "Günlük su ihtiyacını hesapla" },
  { name: "Kalp Atış Hızı", path: "/araclar/kalp-atisi", desc: "Hedef kalp atış hızını öğren" },
  { name: "Protein İhtiyacı", path: "/araclar/protein", desc: "Günlük protein ihtiyacını hesapla" },
];

function getRandomTools(count: number) {
  const shuffled = [...fitnessTools].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface FAQ {
  question: string;
  answer: string;
}

function parseFAQs(content: string): { mainContent: string; faqs: FAQ[] } {
  const faqMatch = content.match(/## Sıkça Sorulan Sorular([\s\S]*?)(?=## |$)/i);
  if (!faqMatch) {
    return { mainContent: content, faqs: [] };
  }
  
  const faqSection = faqMatch[1];
  const mainContent = content.replace(/## Sıkça Sorulan Sorular[\s\S]*?(?=## |$)/i, '');
  
  const faqs: FAQ[] = [];
  const questionRegex = /### (.+?)\n([\s\S]*?)(?=### |$)/g;
  let match;
  while ((match = questionRegex.exec(faqSection)) !== null) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim()
    });
  }
  
  return { mainContent, faqs };
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractTocAndAddIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();

  const result = html.replace(/<h([2-3])>(.*?)<\/h[2-3]>/g, (match, level, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    let id = slugify(cleanText);
    if (usedIds.has(id)) {
      let counter = 2;
      while (usedIds.has(`${id}-${counter}`)) counter++;
      id = `${id}-${counter}`;
    }
    usedIds.add(id);
    toc.push({ id, text: cleanText, level: parseInt(level) });
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  return { html: result, toc };
}

function parseInfoBoxes(html: string): string {
  let result = html
    .replace(/<p>💡 (.+?)<\/p>/g, '<div class="info-box tip"><span class="icon">💡</span><span>$1</span></div>')
    .replace(/<p>⚠️ (.+?)<\/p>/g, '<div class="info-box warning"><span class="icon">⚠️</span><span>$1</span></div>')
    .replace(/<p>✅ (.+?)<\/p>/g, '<div class="info-box success"><span class="icon">✅</span><span>$1</span></div>')
    .replace(/<p>📌 (.+?)<\/p>/g, '<div class="info-box note"><span class="icon">📌</span><span>$1</span></div>');
  result = result.replace(/<table>/g, '<div class="table-wrapper"><table>').replace(/<\/table>/g, '</table></div>');
  return result;
}

export default function ArticleDetail() {
  const [, params] = useRoute("/yazilar/:slug");
  const slug = params?.slug;

  const article = slug ? getArticleBySlug(slug) : undefined;

  const { mainContent, faqs, renderedHtml, toc } = useMemo(() => {
    if (!article) return { mainContent: '', faqs: [], renderedHtml: '', toc: [] };
    
    const { mainContent, faqs } = parseFAQs(article.content);
    let html = md.render(mainContent);
    html = parseInfoBoxes(html);
    const { html: htmlWithIds, toc } = extractTocAndAddIds(html);
    
    if (faqs.length > 0) {
      toc.push({ id: 'sikca-sorulan-sorular', text: 'Sıkça Sorulan Sorular', level: 2 });
    }
    
    return { mainContent, faqs, renderedHtml: htmlWithIds, toc };
  }, [article]);

  const [activeId, setActiveId] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );
    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28">
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-white mb-4">
            Makale Bulunamadı
          </h1>
          <p className="text-gray-400 mb-6">
            Aradığınız içerik mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/yazilar">
            <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-error-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Yazılara Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = `https://gokalaf.com/yazilar/${article.slug}`;

  const categoryLabels: Record<string, string> = {
    'takviyeler': 'Takviye',
    'beslenme': 'Beslenme',
    'antrenman': 'Antrenman',
  };
  const categoryLabel = categoryLabels[article.category] || 'Fitness';

  return (
    <div className="min-h-screen bg-[#050505] pt-28">
      <SEO
        title={`${article.seoTitle || article.title} | Gokalaf`}
        description={article.seoDescription || article.excerpt || article.title}
        keywords={`${article.title}, ${categoryLabel.toLowerCase()}, fitness, beslenme, gokalaf blog`}
        canonical={`https://gokalaf.com/yazilar/${article.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.seoDescription || article.excerpt,
          "image": article.heroImage ? (article.heroImage.startsWith("http") ? article.heroImage : `https://gokalaf.com${article.heroImage}`) : "https://gokalaf.com/og-image.png",
          "author": {
            "@type": "Organization",
            "name": "Fitness Bilgi",
            "url": "https://gokalaf.com/hakkimizda",
            "logo": "https://gokalaf.com/logo.png",
            "description": "Gokalaf Editör Ekibi - Bilime dayalı fitness ve beslenme içerikleri."
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gokalaf",
            "url": "https://gokalaf.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://gokalaf.com/logo.png"
            }
          },
          "datePublished": article.publishedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://gokalaf.com/yazilar/${article.slug}`
          }
        }}
      />
      {/* Hero */}
      <section className="relative">
        {article.heroImage && (
          <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10 -mt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Link href="/yazilar" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6" data-testid="link-back-to-articles">
              <ArrowLeft className="w-4 h-4" />
              Yazılara Dön
            </Link>
            
            {/* Author & Date Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-white/10">
              <Link href="/hakkimizda" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">FB</span>
                </div>
                <div>
                  <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">Fitness Bilgi</span>
                  <span className="block text-gray-500 text-xs">Gokalaf Editör Ekibi</span>
                </div>
              </Link>
              
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {article.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.publishedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              
              <div className="ml-auto">
                <ShareButtons 
                  url={shareUrl}
                  title={article.title}
                  description={article.excerpt || ''}
                />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-400">
              {article.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      {toc.length > 2 && (
        <section className="pb-4">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <nav aria-label="İçindekiler" className="toc-nav bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                  data-testid="button-toc-toggle"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-heading font-bold text-white text-lg">İçindekiler</span>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{toc.length} bölüm</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: tocOpen ? 'auto' : 0, opacity: tocOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <ol className="px-6 pb-5 space-y-1 list-none" data-testid="toc-list">
                    {toc.map((item, index) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(item.id);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              window.history.replaceState(null, '', `#${item.id}`);
                            }
                          }}
                          className={`group flex items-start gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                            activeId === item.id
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          } ${item.level === 3 ? 'ml-6' : ''}`}
                          data-testid={`toc-link-${item.id}`}
                        >
                          <span className={`text-xs font-mono mt-1 flex-shrink-0 ${
                            activeId === item.id ? 'text-primary' : 'text-gray-600'
                          }`}>
                            {item.level === 2 ? `${toc.filter((t, i) => t.level === 2 && i <= index).length}.` : '—'}
                          </span>
                          <span className={`text-sm leading-snug ${item.level === 2 ? 'font-medium' : 'font-normal'}`}>
                            {item.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </nav>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <div 
              className="article-content prose prose-invert prose-lg md:prose-xl max-w-none
                prose-headings:font-heading prose-headings:text-white prose-headings:scroll-mt-24 prose-headings:leading-tight
                prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-primary/30
                prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-primary/30
                prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-primary
                prose-h4:text-xl prose-h4:md:text-2xl prose-h4:mt-10 prose-h4:mb-4 prose-h4:text-primary
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-gray-300 prose-ol:text-gray-300 prose-ul:my-6 prose-ol:my-6 prose-ul:text-lg prose-ol:text-lg
                prose-li:marker:text-primary prose-li:mb-3"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div className="mt-20">
                <h2 id="sikca-sorulan-sorular" className="text-3xl md:text-4xl font-heading font-bold text-white mb-10 pb-4 border-b border-primary/30">
                  Sıkça Sorulan Sorular
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`faq-${index}`}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                    >
                      <AccordionTrigger 
                        className="px-6 py-4 text-left text-white font-medium hover:no-underline hover:bg-white/5 [&[data-state=open]]:bg-primary/10"
                        data-testid={`faq-trigger-${index}`}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-300 prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-p:leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: md.render(faq.answer) }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Article CTA */}
            {article.ctaText && article.ctaLink && (
              <div className="mt-12 p-8 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl text-center">
                <h3 className="text-2xl font-heading font-bold text-white mb-4">
                  Harekete Geç!
                </h3>
                <p className="text-gray-400 mb-6">
                  Bu bilgileri uygulamak için profesyonel destek al.
                </p>
                <Link href={article.ctaLink}>
                  <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-lg h-12 px-8" data-testid="button-article-cta">
                    {article.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {(() => {
        const related = (articlesRelated as Record<string, { slug: string; title: string; category: string }[]>)[article.slug];
        if (!related || related.length === 0) return null;
        const catColors: Record<string, string> = {
          antrenman: "text-blue-400 bg-blue-400/10",
          beslenme: "text-green-400 bg-green-400/10",
          takviyeler: "text-purple-400 bg-purple-400/10",
        };
        const catNames: Record<string, string> = {
          antrenman: "Antrenman",
          beslenme: "Beslenme",
          takviyeler: "Takviyeler",
        };
        return (
          <section className="py-12 border-t border-white/5">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                    İlgili Makaleler
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="flex">
                      <div className="group flex flex-col w-full bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 w-fit ${catColors[r.category] || "text-gray-400 bg-white/10"}`}>
                          {catNames[r.category] || r.category}
                        </span>
                        <h4 className="text-white font-medium text-sm md:text-base leading-snug group-hover:text-primary transition-colors flex-1">
                          {r.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-4 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Okumaya Devam Et <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Fitness Tools Section */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-primary" />
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                Fitness Araçlarımız
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getRandomTools(6).map((tool) => (
                <Link key={tool.path} href={tool.path}>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <h4 className="font-heading font-bold text-white text-sm md:text-base group-hover:text-primary transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/araclar">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  Tüm Araçları Gör <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              Profesyonel Koçluk ile Sonuç Al
            </h2>
            <p className="text-gray-400 mb-8">
              Kişiselleştirilmiş antrenman ve beslenme programı, haftalık takip ve 7/24 destek.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold h-12 px-8" data-testid="button-detail-packages">
                  Paketleri İncele
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/yazilar">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8" data-testid="button-detail-other-articles">
                  Diğer Yazılar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .article-content {
          overflow-x: hidden;
          max-width: 100%;
        }
        .article-content .info-box {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 16px;
          margin: 32px 0;
          font-size: 1.1rem;
        }
        @media (max-width: 640px) {
          .article-content .info-box {
            padding: 14px 16px;
            gap: 10px;
            font-size: 0.95rem;
          }
        }
        .article-content .info-box .icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .article-content .info-box.tip {
          background: rgba(204, 255, 0, 0.1);
          border: 1px solid rgba(204, 255, 0, 0.3);
        }
        .article-content .info-box.warning {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .article-content .info-box.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .article-content .info-box.note {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .article-content .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 40px 0;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .article-content table {
          width: 100% !important;
          min-width: 400px !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
          display: table !important;
          table-layout: auto !important;
        }
        .article-content thead {
          display: table-header-group !important;
          background: linear-gradient(135deg, rgba(204, 255, 0, 0.2) 0%, rgba(204, 255, 0, 0.1) 100%) !important;
        }
        .article-content tbody {
          display: table-row-group !important;
        }
        .article-content tr {
          display: table-row !important;
        }
        .article-content th {
          display: table-cell !important;
          padding: 14px 16px !important;
          text-align: left !important;
          font-weight: 700 !important;
          color: #fff !important;
          font-family: 'Oswald', sans-serif !important;
          text-transform: uppercase !important;
          font-size: 0.8rem !important;
          letter-spacing: 0.05em !important;
          border-bottom: 2px solid rgba(204, 255, 0, 0.3) !important;
          white-space: nowrap !important;
          background: transparent !important;
        }
        .article-content td {
          display: table-cell !important;
          padding: 14px 16px !important;
          color: #d1d5db !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          font-size: 0.9rem !important;
          background: transparent !important;
        }
        .article-content tbody tr {
          background: rgba(255, 255, 255, 0.02) !important;
          transition: background 0.2s ease !important;
        }
        .article-content tbody tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .article-content tbody tr:hover {
          background: rgba(204, 255, 0, 0.05) !important;
        }
        .article-content tbody tr:last-child td {
          border-bottom: none !important;
        }

        .article-content blockquote {
          border-left: 4px solid rgba(204, 255, 0, 0.5) !important;
          background: rgba(204, 255, 0, 0.05) !important;
          padding: 16px 20px !important;
          border-radius: 0 12px 12px 0 !important;
          margin: 24px 0 !important;
        }
        .article-content blockquote p {
          margin: 0 !important;
        }

        .article-content img {
          border-radius: 16px !important;
          margin: 32px 0 !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
        }

        .article-content hr {
          border-color: rgba(204, 255, 0, 0.2) !important;
          margin: 48px 0 !important;
        }

        .article-content ul {
          list-style: none !important;
          padding-left: 0 !important;
        }
        .article-content ul li {
          position: relative;
          padding-left: 24px !important;
        }
        .article-content ul li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #ccff00;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
