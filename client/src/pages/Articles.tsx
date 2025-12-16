import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronRight, Dumbbell, Utensils, Brain, Target, Zap } from "lucide-react";
import type { Article, ArticleCategory } from "@shared/schema";

const categoryIcons: Record<string, any> = {
  "antrenman": Dumbbell,
  "beslenme": Utensils,
  "motivasyon": Brain,
  "hedef": Target,
  "default": BookOpen,
};

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<ArticleCategory[]>({
    queryKey: ["/api/articles/categories"],
    queryFn: async () => {
      const res = await fetch("/api/articles/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/articles?category=${selectedCategory}` 
        : "/api/articles";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch articles");
      return res.json();
    },
  });

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Bilgi Merkezi</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              YAZILAR
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Antrenman, beslenme ve motivasyon hakkında uzman içerikler. 
              Hedeflerine ulaşmak için ihtiyacın olan bilgiler burada.
            </p>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h3 className="text-white font-heading font-bold text-xl mb-1">
                    Profesyonel Koçluk ile Fark Yarat
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Kişiselleştirilmiş program ve 7/24 destek ile hedeflerine ulaş.
                  </p>
                </div>
                <Link href="/paketler">
                  <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold whitespace-nowrap" data-testid="button-hero-packages">
                    Paketleri İncele
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                !selectedCategory
                  ? "bg-primary text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              data-testid="filter-all"
            >
              Tümü
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || categoryIcons.default;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-primary text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`filter-${category.slug}`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Link href={`/yazilar/${featuredArticle.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/30 transition-all cursor-pointer"
                data-testid={`article-featured-${featuredArticle.id}`}
              >
                <div className="flex flex-col lg:flex-row">
                  {featuredArticle.heroImage && (
                    <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                      <img
                        src={featuredArticle.heroImage}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        Öne Çıkan
                      </span>
                      {featuredArticle.publishedAt && (
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(featuredArticle.publishedAt).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      Devamını Oku
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      {/* Mid-page CTA */}
      <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-heading font-bold text-lg">
                  Bilgi yetmez, aksiyon şart!
                </h3>
                <p className="text-gray-400 text-sm">
                  Profesyonel rehberlik ile sonuç al.
                </p>
              </div>
            </div>
            <Link href="/paketler">
              <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold px-8" data-testid="button-mid-cta">
                Hemen Başla
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 rounded-2xl h-64"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16" data-testid="articles-empty-state">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                {selectedCategory ? "Bu kategoride yazı bulunamadı" : "Henüz yazı yok"}
              </h3>
              <p className="text-gray-400 mb-6">
                {selectedCategory ? "Başka bir kategori seçin veya tüm yazıları görüntüleyin." : "Yakında yeni içerikler eklenecek."}
              </p>
              {selectedCategory ? (
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-primary text-black hover:bg-primary/90"
                  data-testid="button-show-all-articles"
                >
                  Tüm Yazıları Göster
                </Button>
              ) : (
                <Link href="/paketler">
                  <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-explore-packages">
                    Paketleri İncele
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredArticle ? otherArticles : articles).map((article, index) => (
                <Link key={article.id} href={`/yazilar/${article.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                    data-testid={`article-card-${article.id}`}
                  >
                    {article.heroImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.heroImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                      <h3 className="text-lg font-heading font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-primary text-sm font-medium">
                        Oku
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Bilgiden Eyleme Geç
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Okumak güzel ama uygulamak daha güzel. Profesyonel koçluk ile 
              hedeflerine sistematik bir şekilde ulaş.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-lg h-14 px-10" data-testid="button-bottom-cta">
                  Paketleri İncele
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-heading font-bold text-lg h-14 px-10" data-testid="button-whatsapp-cta">
                  WhatsApp'tan Sor
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
