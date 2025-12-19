import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, BookOpen, Share2, ChevronDown, Lightbulb, AlertCircle, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Article } from "@shared/schema";
import MarkdownIt from "markdown-it";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
}).enable(['table']);

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

function parseInfoBoxes(html: string): string {
  return html
    .replace(/<p>💡 (.+?)<\/p>/g, '<div class="info-box tip"><span class="icon">💡</span><span>$1</span></div>')
    .replace(/<p>⚠️ (.+?)<\/p>/g, '<div class="info-box warning"><span class="icon">⚠️</span><span>$1</span></div>')
    .replace(/<p>✅ (.+?)<\/p>/g, '<div class="info-box success"><span class="icon">✅</span><span>$1</span></div>')
    .replace(/<p>📌 (.+?)<\/p>/g, '<div class="info-box note"><span class="icon">📌</span><span>$1</span></div>');
}

export default function ArticleDetail() {
  const [, params] = useRoute("/yazilar/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", slug],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${slug}`);
      if (!res.ok) throw new Error("Article not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { mainContent, faqs, renderedHtml } = useMemo(() => {
    if (!article) return { mainContent: '', faqs: [], renderedHtml: '' };
    
    const { mainContent, faqs } = parseFAQs(article.content);
    let html = md.render(mainContent);
    html = parseInfoBoxes(html);
    
    return { mainContent, faqs, renderedHtml: html };
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const categoryLabels: Record<string, string> = {
    'takviye': 'Takviye',
    'beslenme': 'Beslenme',
    'antrenman': 'Antrenman',
    'saglik': 'Sağlık',
  };
  const categoryLabel = categoryLabels[article.categoryId || ''] || 'Fitness';

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
            "name": "Gokalaf",
            "url": "https://gokalaf.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gokalaf",
            "logo": {
              "@type": "ImageObject",
              "url": "https://gokalaf.com/logo.png"
            }
          },
          "datePublished": article.publishedAt,
          "dateModified": article.updatedAt || article.publishedAt,
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
            
            <div className="flex items-center gap-4 mb-4">
              {article.publishedAt && (
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors text-sm"
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </button>
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

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <div 
              className="article-content prose prose-invert prose-lg md:prose-xl max-w-none
                prose-headings:font-heading prose-headings:text-white prose-headings:scroll-mt-24 prose-headings:leading-tight
                prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-primary/30
                prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-primary
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
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10 pb-4 border-b border-primary/30">
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
        
        .article-content table {
          width: 100%;
          max-width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 40px 0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: block;
          overflow-x: auto;
        }
        .article-content thead {
          background: linear-gradient(135deg, rgba(204, 255, 0, 0.2) 0%, rgba(204, 255, 0, 0.1) 100%);
        }
        .article-content th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 700;
          color: #fff;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          border-bottom: 2px solid rgba(204, 255, 0, 0.3);
          white-space: nowrap;
        }
        .article-content td {
          padding: 16px 20px;
          color: #d1d5db;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 1rem;
        }
        .article-content tbody tr {
          background: rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }
        .article-content tbody tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.05);
        }
        .article-content tbody tr:hover {
          background: rgba(204, 255, 0, 0.05);
        }
        .article-content tbody tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
