import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronRight, Sparkles, Dumbbell, Utensils, Pill, Search } from "lucide-react";
import type { Article, ArticleCategory } from "@shared/schema";

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
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Bilgi Merkezi</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tight">
              YAZILAR
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Fitness, beslenme ve takviyeler hakkında kapsamlı rehberler. 
              Bilgi güçtür, gücünü artır.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Yazılarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                data-testid="input-search"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-6 sticky top-16 z-20 bg-[#050505]/80 backdrop-blur-lg border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                !selectedCategory
                  ? "bg-primary text-black shadow-lg shadow-primary/25"
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
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.slug
                      ? "bg-primary text-black shadow-lg shadow-primary/25"
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

      {/* Top CTA Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 rounded-3xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-white font-heading font-bold text-2xl mb-2">
                  Bilgi Yetmez, Aksiyon Şart!
                </h3>
                <p className="text-gray-400">
                  Profesyonel koçluk ile kişiselleştirilmiş program al, sonuç garantisi yakala.
                </p>
              </div>
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-lg h-14 px-10 whitespace-nowrap shadow-lg shadow-primary/25" data-testid="button-hero-packages">
                  Paketleri İncele
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 rounded-3xl h-80"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20" data-testid="articles-empty-state">
              <BookOpen className="w-20 h-20 text-gray-700 mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                {searchQuery ? "Sonuç bulunamadı" : selectedCategory ? "Bu kategoride yazı yok" : "Henüz yazı yok"}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery ? "Farklı kelimelerle aramayı deneyin." : selectedCategory ? "Başka bir kategori seçin veya tüm yazıları görüntüleyin." : "Yakında yeni içerikler eklenecek."}
              </p>
              {(selectedCategory || searchQuery) && (
                <Button 
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                  className="bg-primary text-black hover:bg-primary/90"
                  data-testid="button-show-all-articles"
                >
                  Tüm Yazıları Göster
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => {
                const category = categories.find(c => c.id === article.categoryId || c.slug === article.categoryId);
                const colorClass = categoryColors[category?.slug || "default"] || categoryColors.default;
                const Icon = categoryIcons[category?.slug || "default"] || categoryIcons.default;
                
                return (
                  <Link key={article.id} href={`/yazilar/${article.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group h-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                      data-testid={`article-card-${article.id}`}
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        {article.heroImage ? (
                          <img
                            src={article.heroImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-primary/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                        
                        {/* Category Badge */}
                        {category && (
                          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r ${colorClass} backdrop-blur-sm flex items-center gap-1.5`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                            <span className="text-white text-xs font-medium">{category.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {article.publishedAt && (
                          <span className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(article.publishedAt).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                        )}
                        
                        <h3 className="text-lg font-heading font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                          Devamını Oku
                          <ChevronRight className="w-4 h-4" />
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/10 p-8 md:p-12">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                    Teoriden Pratiğe Geç
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Okumak güzel, uygulamak daha güzel. Profesyonel rehberlik ile hedeflerine sistematik ulaş.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/paketler">
                    <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold h-14 px-8 shadow-lg shadow-primary/25" data-testid="button-mid-cta">
                      Paketleri İncele
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8" data-testid="button-whatsapp-mid">
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
      <section className="py-20 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              Hedefine Ulaşmak İçin
              <span className="text-primary"> Profesyonel Destek</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Kişiselleştirilmiş antrenman ve beslenme programı, haftalık takip ve 7/24 WhatsApp desteği.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold text-lg h-16 px-12 shadow-xl shadow-primary/30" data-testid="button-bottom-cta">
                  Paketleri İncele
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-heading text-lg h-16 px-12" data-testid="button-whatsapp-cta">
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
