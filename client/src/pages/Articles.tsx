import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronRight, Sparkles, Dumbbell, Utensils, Pill, Search } from "lucide-react";
import type { Article, ArticleCategory } from "@shared/schema";
import SEO from "@/components/SEO";

const categoryIcons: Record<string, any> = {
  "antrenman": Dumbbell,
  "beslenme": Utensils,
  "takviye": Pill,
  "default": BookOpen,
};

const categoryColors: Record<string, string> = {
  "antrenman": "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  "beslenme": "from-green-500/20 to-green-600/10 border-green-500/30",
  "takviye": "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  "default": "from-primary/20 to-primary/10 border-primary/30",
};

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-28">
      <SEO
        title="Fitness ve Beslenme Yazıları - Uzman Makaleler | Gokalaf Blog"
        description={`${articles.length}+ uzman makale ile fitness, vücut geliştirme, beslenme ve supplement rehberleri. Egzersiz teknikleri, diyet önerileri ve sağlıklı yaşam ipuçları.`}
        keywords="fitness blog, beslenme rehberi, antrenman makaleleri, supplement kullanımı, egzersiz teknikleri, kilo verme, kas yapma, sağlıklı yaşam, gokalaf blog"
        canonical="https://gokalaf.com/yazilar"
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Gokalaf Blog - Fitness, Beslenme ve Antrenman Rehberi",
          "description": "Fitness, vücut geliştirme, beslenme ve sağlık hakkında kapsamlı bilgiler.",
          "url": "https://gokalaf.com/yazilar",
          "publisher": {
            "@type": "Organization",
            "name": "Gokalaf",
            "url": "https://gokalaf.com"
          }
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-black text-white mb-4 tracking-tight">
              YAZILAR
            </h1>
            
            <p className="text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed">
              Fitness, beslenme ve takviyeler hakkında kapsamlı rehberler. 
              Bilgi güçtür, gücünü artır.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Yazılarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                data-testid="input-search"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-4 sticky top-16 z-20 bg-[#050505]/80 backdrop-blur-lg border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-primary text-black shadow-md shadow-primary/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              data-testid="filter-all"
            >
              Tüm Yazılar
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || categoryIcons.default;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedCategory === category.slug
                      ? "bg-primary text-black shadow-md shadow-primary/25"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`filter-${category.slug}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top CTA Banner */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/20 rounded-2xl p-4 md:p-5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-white font-heading font-bold text-lg mb-1">
                  Bilgi Yetmez, Aksiyon Şart!
                </h3>
                <p className="text-gray-400 text-sm">
                  Profesyonel koçluk ile kişiselleştirilmiş program al.
                </p>
              </div>
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-sm h-10 px-6 whitespace-nowrap shadow-md shadow-primary/20" data-testid="button-hero-packages">
                  Paketleri İncele
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 rounded-2xl h-64"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16" data-testid="articles-empty-state">
              <BookOpen className="w-14 h-14 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                {searchQuery ? "Sonuç bulunamadı" : selectedCategory ? "Bu kategoride yazı yok" : "Henüz yazı yok"}
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                {searchQuery ? "Farklı kelimelerle aramayı deneyin." : selectedCategory ? "Başka bir kategori seçin veya tüm yazıları görüntüleyin." : "Yakında yeni içerikler eklenecek."}
              </p>
              {(selectedCategory || searchQuery) && (
                <Button 
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                  className="bg-primary text-black hover:bg-primary/90 text-sm h-9"
                  data-testid="button-show-all-articles"
                >
                  Tüm Yazıları Göster
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredArticles.map((article, index) => {
                const category = categories.find(c => c.id === article.categoryId || c.slug === article.categoryId);
                const colorClass = categoryColors[category?.slug || "default"] || categoryColors.default;
                const Icon = categoryIcons[category?.slug || "default"] || categoryIcons.default;
                
                return (
                  <Link key={article.id} href={`/yazilar/${article.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group h-full bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                      data-testid={`article-card-${article.id}`}
                    >
                      {/* Image */}
                      <div className="relative h-36 overflow-hidden">
                        {article.heroImage ? (
                          <img
                            src={article.heroImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-primary/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70"></div>
                        
                        {/* Category Badge */}
                        {category && (
                          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full bg-gradient-to-r ${colorClass} backdrop-blur-sm flex items-center gap-1`}>
                            <Icon className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] font-medium">{category.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {article.publishedAt && (
                          <span className="flex items-center gap-1 text-gray-500 text-[10px] mb-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        )}
                        
                        <h3 className="text-sm font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                          Devamını Oku
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Mid CTA Section */}
      {filteredArticles.length > 3 && (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/10 p-5 md:p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="text-center md:text-left max-w-lg">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
                    Teoriden Pratiğe Geç
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Okumak güzel, uygulamak daha güzel. Profesyonel rehberlik ile hedeflerine ulaş.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/paketler">
                    <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-sm h-10 px-6 shadow-md shadow-primary/20" data-testid="button-mid-cta">
                      Paketleri İncele
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                  <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm h-10 px-6" data-testid="button-whatsapp-mid">
                      WhatsApp'tan Sor
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      <section className="py-12 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[80px] translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Hedefine Ulaşmak İçin
              <span className="text-primary"> Profesyonel Destek</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Kişiselleştirilmiş antrenman ve beslenme programı, haftalık takip ve 7/24 WhatsApp desteği.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-sm h-11 px-8 shadow-lg shadow-primary/25" data-testid="button-bottom-cta">
                  Paketleri İncele
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-heading text-sm h-11 px-8" data-testid="button-whatsapp-cta">
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
