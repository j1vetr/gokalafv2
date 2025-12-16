import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, BookOpen, Share2 } from "lucide-react";
import type { Article } from "@shared/schema";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20">
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

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
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
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-heading prose-headings:text-white
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:marker:text-primary"
              dangerouslySetInnerHTML={{ 
                __html: (() => {
                  const lines = article.content.split('\n');
                  let result = '';
                  let inList = false;
                  
                  for (const line of lines) {
                    if (line.startsWith('## ')) {
                      if (inList) { result += '</ul>'; inList = false; }
                      result += `<h2>${line.substring(3)}</h2>`;
                    } else if (line.startsWith('### ')) {
                      if (inList) { result += '</ul>'; inList = false; }
                      result += `<h3>${line.substring(4)}</h3>`;
                    } else if (line.startsWith('- ')) {
                      if (!inList) { result += '<ul>'; inList = true; }
                      result += `<li>${line.substring(2)}</li>`;
                    } else if (line.trim() === '') {
                      if (inList) { result += '</ul>'; inList = false; }
                      result += '<br/>';
                    } else {
                      if (inList) { result += '</ul>'; inList = false; }
                      result += `<p>${line}</p>`;
                    }
                  }
                  if (inList) result += '</ul>';
                  return result;
                })()
              }}
            />

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
    </div>
  );
}
