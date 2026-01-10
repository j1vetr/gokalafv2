import type { Article, Package, Exercise } from "@shared/schema";

function formatDateISO(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    try {
      return new Date(date).toISOString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  schema?: string;
}

const BASE_URL = "https://gokalaf.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function generateHomeMeta(): MetaTags {
  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Gokalaf",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/favicon.png`,
        "width": 512,
        "height": 512
      },
      "image": `${BASE_URL}/og-image.png`,
      "description": "Türkiye'nin önde gelen online fitness ve vücut geliştirme koçluğu platformu.",
      "telephone": "+905312822402",
      "email": "alafcoaching@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "TR",
        "addressLocality": "Türkiye"
      },
      "sameAs": [
        "https://www.instagram.com/gokalaf",
        "https://www.youtube.com/@gokalaf",
        "https://kick.com/gokalaf",
        "https://twitter.com/gokalaf",
        "https://www.tiktok.com/@gokalaf"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+905312822402",
        "contactType": "customer service",
        "availableLanguage": ["Turkish"]
      },
      "foundingDate": "2024",
      "areaServed": "TR"
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "name": "Gokalaf",
      "url": BASE_URL,
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "inLanguage": "tr-TR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/araclar?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      "url": BASE_URL,
      "name": "Gokalaf | Online Fitness & Vücut Geliştirme Koçluğu",
      "description": "Gokalaf ile profesyonel online fitness ve vücut geliştirme koçluğu. Kişiselleştirilmiş antrenman ve beslenme programları.",
      "isPartOf": { "@id": `${BASE_URL}/#website` },
      "about": { "@id": `${BASE_URL}/#organization` },
      "inLanguage": "tr-TR"
    }
  ]);

  return {
    title: "Gokalaf | Online Fitness & Vücut Geliştirme Koçluğu",
    description: "Gokalaf ile profesyonel online fitness ve vücut geliştirme koçluğu. Kişiselleştirilmiş antrenman ve beslenme programları, haftalık takip ve uzman rehberliği ile hedeflerinize ulaşın.",
    keywords: "online fitness koçluğu, vücut geliştirme, personal trainer, beslenme programı, antrenman programı, online pt, fitness koçu, kilo verme, kas yapma, gokalaf",
    ogTitle: "Gokalaf | Online Fitness & Vücut Geliştirme Koçluğu",
    ogDescription: "Bedenini, beslenmeni ve antrenmanlarını veri odaklı sistemle yönet. Gokalaf ile profesyonel online koçluk hizmeti.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: BASE_URL,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Gokalaf | Online Fitness & Vücut Geliştirme Koçluğu",
    twitterDescription: "Bedenini, beslenmeni ve antrenmanlarını veri odaklı sistemle yönet. Gokalaf ile profesyonel online koçluk.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: BASE_URL,
    schema,
  };
}

export function generatePackagesMeta(packages: Package[]): MetaTags {
  const activePackages = packages.filter(p => p.isActive);
  const weekOptions = activePackages.map(p => `${p.weeks} hafta`).join(", ");
  const prices = activePackages.map(p => Number(p.price));
  const priceRange = activePackages.length > 0
    ? `${Math.min(...prices).toLocaleString('tr-TR')} - ${Math.max(...prices).toLocaleString('tr-TR')} TL`
    : "";

  const faqItems = [
    { question: "Online fitness koçluğu nasıl çalışır?", answer: "Paket satın aldıktan sonra size özel antrenman ve beslenme programı hazırlanır. Haftalık check-in'lerle ilerlemeniz takip edilir, WhatsApp üzerinden 7/24 iletişim kurabilirsiniz." },
    { question: "Hangi paketi seçmeliyim?", answer: "Hedeflerinize bağlı olarak değişir. 8 haftalık paket hızlı sonuç isteyenler için, 12-16 hafta orta vadeli hedefler için, 24 hafta ise uzun vadeli dönüşüm için idealdir." },
    { question: "Paket süresince ne sıklıkla iletişim kurabilirim?", answer: "WhatsApp üzerinden 7/24 iletişim kurabilirsiniz. Ayrıca haftalık check-in görüşmeleri ve form analizi geri bildirimleri alırsınız." },
    { question: "Beslenme programı da dahil mi?", answer: "Evet, tüm paketlerde kişiselleştirilmiş beslenme planı, makro hesaplaması ve supplement önerileri dahildir." },
    { question: "Ödeme seçenekleri nelerdir?", answer: "Kredi kartı ile güvenli ödeme yapabilirsiniz. Taksit seçenekleri mevcuttur." }
  ];

  const offers = activePackages.map(pkg => ({
    "@type": "Offer",
    "name": pkg.name,
    "description": `${pkg.weeks} haftalık kişiselleştirilmiş fitness koçluğu`,
    "price": pkg.price,
    "priceCurrency": "TRY",
    "availability": "https://schema.org/InStock",
    "url": `${BASE_URL}/paketler`,
    "itemOffered": {
      "@type": "Service",
      "name": `${pkg.name} - Online Fitness Koçluğu`,
      "description": `${pkg.weeks} haftalık kişiselleştirilmiş antrenman ve beslenme programı`,
      "provider": { "@id": `${BASE_URL}/#organization` },
      "serviceType": "Online Fitness Koçluğu"
    }
  }));

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "@id": `${BASE_URL}/paketler#catalog`,
      "name": "Gokalaf Online Fitness Koçluk Paketleri",
      "description": `Profesyonel online fitness koçluğu paketleri. ${weekOptions} seçenekleri.`,
      "url": `${BASE_URL}/paketler`,
      "numberOfOffers": activePackages.length,
      "itemListElement": offers
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    }
  ]);

  return {
    title: "Online Fitness Koçluk Paketleri - Fiyatlar ve İçerikler | Gokalaf",
    description: `Profesyonel online fitness koçluğu paketleri. ${weekOptions} seçenekleri ile kişiselleştirilmiş antrenman programı, beslenme danışmanlığı ve 7/24 WhatsApp desteği.${priceRange ? ` Fiyatlar: ${priceRange}` : ''}`,
    keywords: "online fitness koçluğu fiyat, personal trainer online, pt paketi, antrenman programı satın al, beslenme danışmanlığı paket, fitness koçu fiyatları, 8 haftalık program, 12 haftalık program, 16 haftalık program, 24 haftalık program, gokalaf paket",
    ogTitle: "Online Fitness Koçluk Paketleri | Gokalaf",
    ogDescription: `${weekOptions} seçenekleri. Kişisel antrenman ve beslenme programı, haftalık takip, 7/24 destek.${priceRange ? ` ${priceRange}` : ''}`,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/paketler`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Online Fitness Koçluk Paketleri | Gokalaf",
    twitterDescription: `Profesyonel online koçluk. ${weekOptions} paket seçenekleri.`,
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/paketler`,
    schema,
  };
}

export function generateArticlesListMeta(articles: Article[]): MetaTags {
  const publishedArticles = articles.filter(a => a.status === 'published' && a.slug);
  const articleCount = publishedArticles.length;
  const categories = Array.from(new Set(publishedArticles.map(a => a.categoryId).filter(Boolean)));
  
  const categoryNames: Record<string, string> = {
    'takviye': 'supplement',
    'beslenme': 'beslenme',
    'antrenman': 'antrenman',
    'saglik': 'sağlık'
  };
  const categoryKeywords = categories.map(c => categoryNames[c || ''] || '').filter(Boolean).join(', ');

  const faqItems = [
    { question: "Gokalaf blogda hangi konularda yazılar var?", answer: "Fitness, vücut geliştirme, beslenme, supplement kullanımı, egzersiz teknikleri ve sağlıklı yaşam konularında detaylı makaleler bulabilirsiniz." },
    { question: "Makaleler kimler tarafından yazılıyor?", answer: "Tüm makaleler Gokalaf koçluk ekibi tarafından, güncel bilimsel araştırmalar ve deneyimler ışığında hazırlanmaktadır." },
    { question: "Blog yazıları ücretsiz mi?", answer: "Evet, tüm blog yazılarımız tamamen ücretsizdir. Fitness yolculuğunuzda size yardımcı olacak bilgilere özgürce erişebilirsiniz." },
    { question: "Yeni yazılar ne sıklıkla ekleniyor?", answer: "Düzenli olarak yeni içerikler ekliyoruz. En güncel makaleler için sayfamızı takip edebilirsiniz." }
  ];

  const blogPosts = publishedArticles.slice(0, 10).map((article, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "BlogPosting",
      "headline": article.title,
      "url": `${BASE_URL}/yazilar/${article.slug}`,
      "description": article.excerpt || article.title,
      "image": article.heroImage ? (article.heroImage.startsWith('http') ? article.heroImage : `${BASE_URL}${article.heroImage}`) : DEFAULT_OG_IMAGE,
      "datePublished": formatDateISO(article.publishedAt),
      "author": { "@id": `${BASE_URL}/#organization` }
    }
  }));

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${BASE_URL}/yazilar#blog`,
      "name": "Gokalaf Blog - Fitness, Beslenme ve Antrenman Rehberi",
      "description": `${articleCount} uzman makale ile fitness, beslenme ve sağlık hakkında kapsamlı bilgiler.`,
      "url": `${BASE_URL}/yazilar`,
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "blogPost": blogPosts,
      "inLanguage": "tr-TR"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    }
  ]);

  return {
    title: "Fitness ve Beslenme Yazıları - Uzman Makaleler | Gokalaf Blog",
    description: `${articleCount}+ uzman makale ile fitness, vücut geliştirme, beslenme ve supplement rehberleri. Egzersiz teknikleri, diyet önerileri ve sağlıklı yaşam ipuçları.`,
    keywords: `fitness blog, beslenme rehberi, antrenman makaleleri, supplement kullanımı, egzersiz teknikleri, kilo verme, kas yapma, sağlıklı yaşam, protein takviyesi, kreatin, ${categoryKeywords}, gokalaf blog`,
    ogTitle: "Fitness ve Beslenme Yazıları | Gokalaf Blog",
    ogDescription: `${articleCount}+ uzman makale. Fitness, beslenme, antrenman ve supplement rehberleri.`,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/yazilar`,
    ogType: "blog",
    twitterCard: "summary_large_image",
    twitterTitle: "Fitness ve Beslenme Yazıları | Gokalaf Blog",
    twitterDescription: `${articleCount}+ uzman fitness ve beslenme makalesi.`,
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/yazilar`,
    schema,
  };
}

export function generateArticleDetailMeta(article: Article): MetaTags {
  const rawTitle = article.seoTitle || article.title;
  const title = rawTitle.replace(/\s*\|\s*Gokalaf\s*$/i, '');
  const description = article.seoDescription || article.excerpt || article.title;
  const ogImage = article.heroImage
    ? (article.heroImage.startsWith("http") ? article.heroImage : `${BASE_URL}${article.heroImage}`)
    : DEFAULT_OG_IMAGE;

  const categoryLabels: Record<string, string> = {
    'takviye': 'Takviye ve Supplement',
    'beslenme': 'Beslenme',
    'antrenman': 'Antrenman',
    'saglik': 'Sağlık',
  };
  const categoryLabel = categoryLabels[article.categoryId || ''] || 'Fitness';

  const keywordsByCategory: Record<string, string> = {
    'takviye': 'protein tozu, kreatin, bcaa, supplement, takviye rehberi',
    'beslenme': 'diyet, kalori, makro besin, sağlıklı beslenme, sporcu beslenmesi',
    'antrenman': 'egzersiz, antrenman programı, kas yapma, güç antrenmanı',
    'saglik': 'sağlıklı yaşam, wellness, uyku, stres yönetimi',
  };
  const categoryKeywords = keywordsByCategory[article.categoryId || ''] || 'fitness, spor';
  const keywords = `${article.title}, ${categoryLabel.toLowerCase()}, ${categoryKeywords}, gokalaf blog`;

  const publishedDate = formatDateISO(article.publishedAt);
  const modifiedDate = formatDateISO(article.updatedAt) || publishedDate;
  
  const wordCount = article.content ? article.content.split(/\s+/).length : 800;

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${BASE_URL}/yazilar/${article.slug}#article`,
      "headline": title,
      "description": description,
      "image": {
        "@type": "ImageObject",
        "url": ogImage,
        "width": 1200,
        "height": 675,
        "caption": `${title} - ${categoryLabel} rehberi görseli`
      },
      "url": `${BASE_URL}/yazilar/${article.slug}`,
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "wordCount": wordCount,
      "author": {
        "@type": "Person",
        "name": "Gokalaf Editör",
        "url": `${BASE_URL}/hakkimizda`,
        "jobTitle": "Fitness İçerik Editörü"
      },
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "mainEntityOfPage": `${BASE_URL}/yazilar/${article.slug}`,
      "articleSection": categoryLabel,
      "inLanguage": "tr-TR",
      "keywords": keywords,
      "isAccessibleForFree": true
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Ana Sayfa",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Yazılar",
          "item": `${BASE_URL}/yazilar`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": categoryLabel,
          "item": `${BASE_URL}/yazilar?kategori=${article.categoryId || 'fitness'}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": title,
          "item": `${BASE_URL}/yazilar/${article.slug}`
        }
      ]
    }
  ]);

  return {
    title: `${title} | Gokalaf`,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: `${BASE_URL}/yazilar/${article.slug}`,
    ogType: "article",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    canonical: `${BASE_URL}/yazilar/${article.slug}`,
    articlePublishedTime: publishedDate,
    articleModifiedTime: modifiedDate,
    articleAuthor: "Gokalaf",
    articleSection: categoryLabel,
    schema,
  };
}

export function generateAboutMeta(): MetaTags {
  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${BASE_URL}/hakkimizda#aboutpage`,
      "name": "Hakkımızda | Gokalaf",
      "description": "Gokalaf'ın hikayesi, vizyonu ve fitness felsefesi. Profesyonel online koçluk hizmeti sunan ekibimizi tanıyın.",
      "url": `${BASE_URL}/hakkimizda`,
      "mainEntity": { "@id": `${BASE_URL}/hakkimizda#person` },
      "inLanguage": "tr-TR"
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE_URL}/hakkimizda#person`,
      "name": "Göktuğ Alaf",
      "alternateName": "Gokalaf",
      "jobTitle": "Online Fitness ve Vücut Geliştirme Koçu",
      "description": "6+ yıllık koçluk deneyimi, 1000+ başarılı dönüşüm hikayesi. Profesyonel online fitness ve vücut geliştirme koçu.",
      "url": `${BASE_URL}/hakkimizda`,
      "image": `${BASE_URL}/goktug-alaf.jpg`,
      "worksFor": { "@id": `${BASE_URL}/#organization` },
      "knowsAbout": [
        "Fitness",
        "Vücut Geliştirme",
        "Beslenme",
        "Antrenman Programı",
        "Kilo Verme",
        "Kas Yapma"
      ],
      "sameAs": [
        "https://instagram.com/gokalaf",
        "https://youtube.com/@gokalaf",
        "https://kick.com/gokalaf"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "İstanbul",
        "addressCountry": "TR"
      }
    }
  ]);

  return {
    title: "Göktuğ Alaf Kimdir? | Online Fitness Koçu | Gokalaf",
    description: "Göktuğ Alaf - Profesyonel online fitness ve vücut geliştirme koçu. 6+ yıllık deneyim, 1000+ başarılı dönüşüm hikayesi. Kişiye özel antrenman ve beslenme programları.",
    keywords: "Göktuğ Alaf, Gokalaf, online fitness koçu, vücut geliştirme koçu, personal trainer, kişisel antrenör, fitness koçluğu, beslenme koçu, online PT, spor koçu",
    ogTitle: "Göktuğ Alaf - Online Fitness Koçu | Gokalaf",
    ogDescription: "Göktuğ Alaf - 6+ yıllık deneyim, 1000+ başarılı dönüşüm. Profesyonel online fitness ve vücut geliştirme koçu.",
    ogImage: `${BASE_URL}/goktug-alaf.jpg`,
    ogUrl: `${BASE_URL}/hakkimizda`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Göktuğ Alaf - Online Fitness Koçu | Gokalaf",
    twitterDescription: "6+ yıllık deneyim, 1000+ başarılı dönüşüm. Profesyonel online fitness koçu.",
    twitterImage: `${BASE_URL}/goktug-alaf.jpg`,
    canonical: `${BASE_URL}/hakkimizda`,
    schema,
  };
}

export function generateToolsMeta(): MetaTags {
  const tools = [
    { name: "VKİ Hesaplayıcı", desc: "Vücut kitle indeksinizi hesaplayın", path: "vki" },
    { name: "Kalori Hesaplayıcı", desc: "Günlük kalori ihtiyacınızı hesaplayın", path: "kalori" },
    { name: "TDEE Hesaplayıcı", desc: "Toplam günlük enerji harcamanızı hesaplayın", path: "tdee" },
    { name: "Makro Hesaplayıcı", desc: "Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın", path: "makro" },
    { name: "İdeal Kilo Hesaplayıcı", desc: "Boyunuza göre ideal kilonuzu hesaplayın", path: "ideal-kilo" },
    { name: "Vücut Yağ Oranı", desc: "Vücut yağ yüzdenizi hesaplayın", path: "vucut-yagi" },
    { name: "1RM Hesaplayıcı", desc: "Maksimum kaldırma kapasitesini hesaplayın", path: "bir-tekrar-max" },
    { name: "Su İhtiyacı", desc: "Günlük su ihtiyacınızı hesaplayın", path: "su-tuketimi" },
    { name: "Kalp Hızı Bölgeleri", desc: "Antrenman kalp hızı bölgelerini hesaplayın", path: "kalp-atisi" },
    { name: "Protein İhtiyacı", desc: "Günlük protein ihtiyacınızı hesaplayın", path: "protein" },
    { name: "Dinlenme Süresi", desc: "Setler arası dinlenme süresini hesaplayın", path: "dinlenme" }
  ];

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/araclar#toolspage`,
    "name": "Fitness Araçları | Gokalaf",
    "description": "Ücretsiz fitness hesaplayıcıları: VKİ, kalori, TDEE, makro, ideal kilo ve daha fazlası.",
    "url": `${BASE_URL}/araclar`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tools.length,
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": tool.name,
        "url": `${BASE_URL}/araclar/${tool.path}`
      }))
    },
    "inLanguage": "tr-TR"
  });

  return {
    title: "Fitness Araçları - Ücretsiz Hesaplayıcılar | Gokalaf",
    description: "Ücretsiz fitness hesaplayıcıları: VKİ, kalori, TDEE, makro, ideal kilo, vücut yağ oranı, 1RM ve daha fazlası. Antrenman ve beslenme planlaması için kullanışlı araçlar.",
    keywords: "vki hesaplama, bmi hesaplama, kalori hesaplama, tdee hesaplama, makro hesaplama, ideal kilo, vücut yağ oranı, one rep max, protein hesaplama, fitness hesaplayıcı",
    ogTitle: "Fitness Araçları - Ücretsiz Hesaplayıcılar | Gokalaf",
    ogDescription: "11 ücretsiz fitness hesaplayıcısı: VKİ, kalori, TDEE, makro, ideal kilo ve daha fazlası.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Fitness Araçları | Gokalaf",
    twitterDescription: "11 ücretsiz fitness hesaplayıcısı ile antrenman ve beslenme planlaması.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar`,
    schema,
  };
}

export function generateVkiToolMeta(): MetaTags {
  const faqItems = [
    { question: "Vücut Kitle İndeksi (VKİ) nedir?", answer: "Vücut Kitle İndeksi (VKİ veya BMI), kilonuzun boyunuza göre sağlıklı bir aralıkta olup olmadığını gösteren bir ölçüttür. Kilonuzun (kg) boyunuzun karesine (m²) bölünmesiyle hesaplanır." },
    { question: "Normal VKİ değeri kaçtır?", answer: "Dünya Sağlık Örgütü'ne göre normal VKİ aralığı 18.5-24.9 arasındadır. 18.5'in altı zayıf, 25-29.9 fazla kilolu, 30 ve üzeri obez olarak değerlendirilir." },
    { question: "VKİ hesaplama formülü nedir?", answer: "VKİ = Kilo (kg) / Boy² (m²) formülü ile hesaplanır. Örneğin, 70 kg ağırlığında ve 1.75 m boyunda birinin VKİ değeri 70 / (1.75 × 1.75) = 22.9 olur." },
    { question: "VKİ kas kütlesini dikkate alır mı?", answer: "Hayır, VKİ yağ ve kas kütlesini ayırt edemez. Bu nedenle sporcular ve kas kütlesi yüksek kişilerde yanıltıcı sonuçlar verebilir. Daha doğru analiz için vücut yağ oranı ölçümü önerilir." },
    { question: "Çocuklar için VKİ nasıl değerlendirilir?", answer: "Çocuk ve ergenlerde VKİ yaşa ve cinsiyete göre persentil grafikleri kullanılarak değerlendirilir. Yetişkin kategorileri çocuklar için geçerli değildir." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/vki#app`,
      "name": "VKİ Hesaplayıcı - Vücut Kitle İndeksi",
      "description": "Vücut kitle indeksinizi (VKİ/BMI) hesaplayın. Boy ve kilonuza göre sağlıklı kilo aralığınızı öğrenin.",
      "url": `${BASE_URL}/araclar/vki`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "VKİ Hesaplayıcı", "item": `${BASE_URL}/araclar/vki` }
      ]
    }
  ]);

  return {
    title: "VKİ Hesaplayıcı - Vücut Kitle İndeksi (BMI) Hesaplama | Gokalaf",
    description: "Ücretsiz VKİ hesaplayıcı ile vücut kitle indeksinizi hesaplayın. Boy ve kilonuza göre ideal kilo aralığınızı öğrenin. Zayıf, normal, kilolu veya obez kategorinizi belirleyin.",
    keywords: "vki hesaplama, bmi hesaplama, vücut kitle indeksi, ideal kilo hesaplama, beden kitle endeksi, kilo boy oranı, sağlıklı kilo, boy kilo hesaplama",
    ogTitle: "VKİ Hesaplayıcı - Vücut Kitle İndeksi | Gokalaf",
    ogDescription: "Vücut kitle indeksinizi hesaplayın. İdeal kilo aralığınızı öğrenin.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/vki`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "VKİ Hesaplayıcı | Gokalaf",
    twitterDescription: "Vücut kitle indeksinizi hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/vki`,
    schema,
  };
}

export function generateCalorieToolMeta(): MetaTags {
  const faqItems = [
    { question: "Günlük kalori ihtiyacı nasıl hesaplanır?", answer: "Günlük kalori ihtiyacı, bazal metabolizma hızı (BMH) ile aktivite seviyesi çarpılarak hesaplanır. Yaş, cinsiyet, boy, kilo ve günlük aktivite düzeyi bu hesaplamada temel faktörlerdir." },
    { question: "Kilo vermek için kaç kalori almalıyım?", answer: "Kilo vermek için günlük kalori ihtiyacınızdan 300-500 kalori açık oluşturmanız önerilir. Haftada 0.5-1 kg kilo kaybı sağlıklı bir hedeftir. Aşırı kalori kısıtlaması metabolizmayı yavaşlatabilir." },
    { question: "Bazal Metabolizma Hızı (BMH) nedir?", answer: "Bazal Metabolizma Hızı, vücudunuzun tamamen dinlenme halindeyken temel yaşam fonksiyonlarını sürdürmek için harcadığı kalori miktarıdır. Nefes alma, kan dolaşımı ve hücre yenilenmesi gibi işlemler BMH'yi oluşturur." },
    { question: "Kalori açığı nedir ve nasıl oluşturulur?", answer: "Kalori açığı, aldığınız kaloriden daha fazla kalori harcamanızdır. Daha az yemek, daha fazla hareket etmek veya her ikisini birleştirerek kalori açığı oluşturabilirsiniz." },
    { question: "Kas yapmak için kaç kalori almalıyım?", answer: "Kas yapmak için günlük kalori ihtiyacınızın 200-300 kalori üzerinde beslenmeli ve yeterli protein almalısınız. Bu kalori fazlası kas yapım sürecini destekler." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/kalori#app`,
      "name": "Kalori Hesaplayıcı",
      "description": "Günlük kalori ihtiyacınızı hesaplayın. Kilo vermek, korumak veya almak için gereken kalori miktarını öğrenin.",
      "url": `${BASE_URL}/araclar/kalori`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Kalori Hesaplayıcı", "item": `${BASE_URL}/araclar/kalori` }
      ]
    }
  ]);

  return {
    title: "Kalori Hesaplayıcı - Günlük Kalori İhtiyacı Hesaplama | Gokalaf",
    description: "Ücretsiz kalori hesaplayıcı ile günlük kalori ihtiyacınızı hesaplayın. Kilo vermek, korumak veya almak için kaç kalori almanız gerektiğini öğrenin. Bilimsel formüllerle doğru sonuç.",
    keywords: "kalori hesaplama, günlük kalori ihtiyacı, kalori hesaplayıcı, diyet kalori, kilo verme kalori, bazal metabolizma, BMH hesaplama, kalori açığı",
    ogTitle: "Kalori Hesaplayıcı - Günlük Kalori İhtiyacı | Gokalaf",
    ogDescription: "Günlük kalori ihtiyacınızı hesaplayın. Kilo yönetimi için doğru kalori hedefini öğrenin.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/kalori`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Kalori Hesaplayıcı | Gokalaf",
    twitterDescription: "Günlük kalori ihtiyacınızı hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/kalori`,
    schema,
  };
}

export function generateTdeeToolMeta(): MetaTags {
  const faqItems = [
    { question: "TDEE nedir?", answer: "TDEE (Total Daily Energy Expenditure), Toplam Günlük Enerji Harcaması anlamına gelir. Bazal metabolizma hızınız ve günlük aktivitelerinizin toplamından oluşan, bir günde harcadığınız toplam kalori miktarıdır." },
    { question: "TDEE nasıl hesaplanır?", answer: "TDEE, bazal metabolizma hızınız (BMH) ile aktivite faktörünüzün çarpılmasıyla hesaplanır. Aktivite faktörü hareketsiz yaşamdan çok aktif yaşama kadar 1.2 ile 1.9 arasında değişir." },
    { question: "TDEE ve BMR arasındaki fark nedir?", answer: "BMR (Bazal Metabolizma Hızı) vücudunuzun dinlenme halinde harcadığı kaloridir. TDEE ise BMR'ye günlük aktivitelerinizin eklenmesiyle oluşur. TDEE her zaman BMR'den yüksektir." },
    { question: "TDEE ne için kullanılır?", answer: "TDEE, kilo yönetimi için temel referans noktasıdır. Kilo vermek için TDEE'nin altında, kilo almak için üzerinde kalori almalısınız. Vücut kompozisyonu hedeflerinize göre kalori planı yapmanızı sağlar." },
    { question: "Aktivite seviyemi nasıl belirlerim?", answer: "Hareketsiz: Masa başı iş, egzersiz yok. Hafif aktif: Haftada 1-3 gün hafif egzersiz. Orta aktif: Haftada 3-5 gün orta yoğunlukta egzersiz. Çok aktif: Haftada 6-7 gün yoğun egzersiz. Aşırı aktif: Günde 2 antrenman veya fiziksel iş." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/tdee#app`,
      "name": "TDEE Hesaplayıcı",
      "description": "Toplam Günlük Enerji Harcaması (TDEE) hesaplayıcı. Aktivite seviyenize göre yakmanız gereken kaloriyi öğrenin.",
      "url": `${BASE_URL}/araclar/tdee`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "TDEE Hesaplayıcı", "item": `${BASE_URL}/araclar/tdee` }
      ]
    }
  ]);

  return {
    title: "TDEE Hesaplayıcı - Toplam Günlük Enerji Harcaması | Gokalaf",
    description: "Ücretsiz TDEE hesaplayıcı ile toplam günlük enerji harcamanızı hesaplayın. Aktivite seviyenize göre yakmanız gereken kalori miktarını öğrenin. Kilo yönetimi için temel referans.",
    keywords: "tdee hesaplama, toplam günlük enerji harcaması, enerji harcama hesaplama, aktivite kalori, metabolizma hızı, günlük kalori yakımı",
    ogTitle: "TDEE Hesaplayıcı - Toplam Günlük Enerji Harcaması | Gokalaf",
    ogDescription: "Toplam günlük enerji harcamanızı hesaplayın. Aktivite seviyenize göre kalori yakımınızı öğrenin.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/tdee`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "TDEE Hesaplayıcı | Gokalaf",
    twitterDescription: "Toplam günlük enerji harcamanızı hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/tdee`,
    schema,
  };
}

export function generateMacroToolMeta(): MetaTags {
  const faqItems = [
    { question: "Makro besinler nelerdir?", answer: "Makro besinler vücudumuzun enerji kaynağı olan üç temel besin grubudur: Protein (1g = 4 kalori), karbonhidrat (1g = 4 kalori) ve yağ (1g = 9 kalori). Her birinin vücutta farklı işlevleri vardır." },
    { question: "Günlük protein ihtiyacı nasıl hesaplanır?", answer: "Protein ihtiyacı hedefinize göre değişir. Sedanter bireyler için kg başına 0.8-1g, aktif bireyler için 1.2-1.6g, kas yapmak isteyenler için 1.6-2.2g protein önerilir." },
    { question: "Karbonhidrat ve yağ oranı ne olmalı?", answer: "Genel öneri toplam kalorinin %45-65'i karbonhidrat, %20-35'i yağ olmalıdır. Düşük karbonhidrat diyetlerinde bu oran değişebilir. Hedefinize göre makro dağılımı ayarlanmalıdır." },
    { question: "Makro takibi neden önemli?", answer: "Sadece kalori saymak yeterli değildir. Doğru makro dağılımı kas kaybını önler, enerji seviyenizi dengeler, hormon üretimini destekler ve fitness hedeflerinize daha etkili ulaşmanızı sağlar." },
    { question: "Makro hesaplarken nelere dikkat etmeliyim?", answer: "Önce günlük kalori ihtiyacınızı belirleyin. Ardından hedefinize göre makro yüzdeleri seçin. Protein ve yağ ihtiyacınızı sabitleyip kalan kaloriyi karbonhidrata ayırabilirsiniz." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/makro#app`,
      "name": "Makro Hesaplayıcı",
      "description": "Günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize uygun makro besin dağılımını öğrenin.",
      "url": `${BASE_URL}/araclar/makro`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Makro Hesaplayıcı", "item": `${BASE_URL}/araclar/makro` }
      ]
    }
  ]);

  return {
    title: "Makro Hesaplayıcı - Protein, Karbonhidrat, Yağ Hesaplama | Gokalaf",
    description: "Ücretsiz makro hesaplayıcı ile günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Kas yapma, yağ yakma veya kilo koruma hedeflerinize uygun makro dağılımını öğrenin.",
    keywords: "makro hesaplama, protein hesaplama, karbonhidrat hesaplama, yağ hesaplama, makro besin, diyet makro, makro oranları, beslenme planı",
    ogTitle: "Makro Hesaplayıcı - Protein, Karbonhidrat, Yağ | Gokalaf",
    ogDescription: "Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize uygun makro dağılımını öğrenin.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/makro`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Makro Hesaplayıcı | Gokalaf",
    twitterDescription: "Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/makro`,
    schema,
  };
}

export function generateIdealKiloToolMeta(): MetaTags {
  const faqItems = [
    { question: "İdeal kilo nasıl hesaplanır?", answer: "İdeal kilo, boy, cinsiyet ve vücut yapısına göre çeşitli formüllerle hesaplanır. En yaygın formüller Devine, Robinson, Miller ve Hamwi formülleridir. Her formül farklı sonuçlar verebilir." },
    { question: "İdeal kilo formülleri nelerdir?", answer: "Devine formülü erkekler için 50 + 2.3 × (boy inç - 60), kadınlar için 45.5 + 2.3 × (boy inç - 60). Robinson, Miller ve Hamwi formülleri de benzer mantıkla farklı katsayılar kullanır." },
    { question: "İdeal kilo herkes için aynı mıdır?", answer: "Hayır, ideal kilo kişiden kişiye değişir. Kas kütlesi, kemik yapısı, yaş ve genel sağlık durumu ideal kiloyu etkiler. Formüller genel bir rehber niteliğindedir." },
    { question: "İdeal kilomdan uzaksam ne yapmalıyım?", answer: "Öncelikle sağlıklı ve sürdürülebilir bir plan oluşturun. Haftada 0.5-1 kg kayıp veya artış hedefleyin. Beslenme ve egzersiz dengesi kurarak kademeli değişiklikler yapın." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/ideal-kilo#app`,
      "name": "İdeal Kilo Hesaplayıcı",
      "description": "Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın. Devine, Robinson, Miller ve Hamwi formülleriyle sonuç alın.",
      "url": `${BASE_URL}/araclar/ideal-kilo`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "İdeal Kilo Hesaplayıcı", "item": `${BASE_URL}/araclar/ideal-kilo` }
      ]
    }
  ]);

  return {
    title: "İdeal Kilo Hesaplayıcı - Boy ve Cinsiyete Göre | Gokalaf",
    description: "Ücretsiz ideal kilo hesaplayıcı ile boyunuza ve cinsiyetinize göre ideal kilonuzu öğrenin. Devine, Robinson, Miller ve Hamwi formülleriyle bilimsel hesaplama.",
    keywords: "ideal kilo hesaplama, boy kilo oranı, sağlıklı kilo, ideal ağırlık, kilo hedefi, Devine formülü, Robinson formülü",
    ogTitle: "İdeal Kilo Hesaplayıcı | Gokalaf",
    ogDescription: "Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/ideal-kilo`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "İdeal Kilo Hesaplayıcı | Gokalaf",
    twitterDescription: "Boyunuza göre ideal kilonuzu hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/ideal-kilo`,
    schema,
  };
}

export function generateVucutYagiToolMeta(): MetaTags {
  const faqItems = [
    { question: "Vücut yağ oranı nedir?", answer: "Vücut yağ oranı, toplam vücut ağırlığınızın yüzde kaçının yağ dokusundan oluştuğunu gösterir. Sağlıklı aralık erkeklerde %10-20, kadınlarda %18-28 arasındadır." },
    { question: "Vücut yağ oranı nasıl hesaplanır?", answer: "US Navy formülü ile boyun, bel ve kalça ölçüleri kullanılarak hesaplanır. Bu yöntem profesyonel ölçüm cihazlarına yakın sonuçlar verir ve evde kolayca uygulanabilir." },
    { question: "Yağsız kütle nedir?", answer: "Yağsız kütle (Lean Body Mass), vücudunuzun yağ dışındaki tüm dokularının ağırlığıdır: kaslar, kemikler, organlar ve su. Kas kütlenizi değerlendirmek için önemli bir göstergedir." },
    { question: "Erkek ve kadın için ideal yağ oranı nedir?", answer: "Atletler için: Erkek %6-13, Kadın %14-20. Fitness: Erkek %14-17, Kadın %21-24. Kabul edilebilir: Erkek %18-24, Kadın %25-31. Obez: Erkek %25+, Kadın %32+." },
    { question: "Vücut yağ oranını düşürmek için ne yapmalıyım?", answer: "Kalori açığı oluşturun, yeterli protein alın, direnç antrenmanı yapın ve yeterli uyuyun. Haftada %0.5-1 yağ kaybı sağlıklı bir hedeftir." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/vucut-yagi#app`,
      "name": "Vücut Yağ Oranı Hesaplayıcı",
      "description": "US Navy formülüyle vücut yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın.",
      "url": `${BASE_URL}/araclar/vucut-yagi`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Vücut Yağ Oranı Hesaplayıcı", "item": `${BASE_URL}/araclar/vucut-yagi` }
      ]
    }
  ]);

  return {
    title: "Vücut Yağ Oranı Hesaplayıcı - US Navy Formülü | Gokalaf",
    description: "Ücretsiz vücut yağ oranı hesaplayıcı ile yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın. US Navy formülü ile evde kolayca ölçün.",
    keywords: "vücut yağ oranı, yağ yüzdesi hesaplama, US Navy formülü, yağsız kütle, lean body mass, vücut kompozisyonu",
    ogTitle: "Vücut Yağ Oranı Hesaplayıcı | Gokalaf",
    ogDescription: "Vücut yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/vucut-yagi`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Vücut Yağ Oranı Hesaplayıcı | Gokalaf",
    twitterDescription: "Vücut yağ yüzdenizi hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/vucut-yagi`,
    schema,
  };
}

export function generateOneRepMaxToolMeta(): MetaTags {
  const faqItems = [
    { question: "1RM (One Rep Max) nedir?", answer: "1RM, bir harekette tek seferde kaldırabileceğiniz maksimum ağırlıktır. Antrenman programlaması ve güç seviyenizi ölçmek için kullanılan temel göstergedir." },
    { question: "1RM nasıl hesaplanır?", answer: "Epley formülü ile: 1RM = Ağırlık × (1 + Tekrar/30). Brzycki formülü: 1RM = Ağırlık × (36 / (37 - Tekrar)). 10 tekrarın altındaki setler daha doğru sonuç verir." },
    { question: "1RM bilgisini nasıl kullanmalıyım?", answer: "Antrenman yoğunluğunu belirlemek için kullanın. Güç için %85-95, hipertrofi için %65-85, dayanıklılık için %50-65 1RM ile çalışın." },
    { question: "1RM testini ne sıklıkla yapmalıyım?", answer: "Her 4-8 haftada bir 1RM testi yapabilirsiniz. Formül ile hesaplama daha güvenlidir ve sakatlanma riskini azaltır." },
    { question: "1RM hesaplamak için ideal tekrar sayısı nedir?", answer: "3-5 tekrar en doğru sonucu verir. 10 tekrarın üzerindeki setlerde hata payı artar. Mümkünse ağır bir setle test edin." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/bir-tekrar-max#app`,
      "name": "One Rep Max (1RM) Hesaplayıcı",
      "description": "Kaldırdığınız ağırlık ve tekrar sayısından maksimum kaldırma kapasiteni hesaplayın.",
      "url": `${BASE_URL}/araclar/bir-tekrar-max`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "1RM Hesaplayıcı", "item": `${BASE_URL}/araclar/bir-tekrar-max` }
      ]
    }
  ]);

  return {
    title: "One Rep Max (1RM) Hesaplayıcı - Maksimum Güç | Gokalaf",
    description: "Ücretsiz 1RM hesaplayıcı ile maksimum kaldırma kapasiteni hesaplayın. Epley ve Brzycki formülleriyle güç seviyenizi ölçün.",
    keywords: "1rm hesaplama, one rep max, maksimum güç, ağırlık hesaplama, bench press 1rm, squat 1rm, Epley formülü",
    ogTitle: "One Rep Max (1RM) Hesaplayıcı | Gokalaf",
    ogDescription: "Maksimum kaldırma kapasiteni hesaplayın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/bir-tekrar-max`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "1RM Hesaplayıcı | Gokalaf",
    twitterDescription: "Maksimum kaldırma kapasiteni hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/bir-tekrar-max`,
    schema,
  };
}

export function generateSuTuketimiToolMeta(): MetaTags {
  const faqItems = [
    { question: "Günlük ne kadar su içmeliyim?", answer: "Genel öneri kg başına 30-35 ml sudur. 70 kg bir kişi günde 2.1-2.5 litre su içmelidir. Aktivite seviyesi ve iklim bu miktarı artırabilir." },
    { question: "Egzersiz yaparken ne kadar su içmeliyim?", answer: "Egzersiz öncesi 500ml, egzersiz sırasında her 15-20 dakikada 150-250ml, egzersiz sonrası kaybedilen her 0.5 kg için 500-750ml su içmelisiniz." },
    { question: "Susuzluk belirtileri nelerdir?", answer: "Koyu renk idrar, baş ağrısı, yorgunluk, konsantrasyon güçlüğü, kuru cilt ve dudaklar, kas krampları susuzluk belirtileridir. Susadığınızda zaten hafif dehidrate olmuşsunuzdur." },
    { question: "Çok su içmenin zararı var mı?", answer: "Aşırı su tüketimi (hiponatremi) elektrolit dengesizliğine yol açabilir. Günde 4-5 litreden fazla su içmekten kaçının. Elektrolit takviyesi gerekebilir." },
    { question: "Kahve ve çay su yerine geçer mi?", answer: "Kafeinli içecekler hafif diüretik etkiye sahiptir ancak günlük sıvı alımına katkıda bulunur. Yine de saf su içmek en iyisidir." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/su-tuketimi#app`,
      "name": "Su İhtiyacı Hesaplayıcı",
      "description": "Kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın.",
      "url": `${BASE_URL}/araclar/su-tuketimi`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Su İhtiyacı Hesaplayıcı", "item": `${BASE_URL}/araclar/su-tuketimi` }
      ]
    }
  ]);

  return {
    title: "Su İhtiyacı Hesaplayıcı - Günlük Su Tüketimi | Gokalaf",
    description: "Ücretsiz su ihtiyacı hesaplayıcı ile kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı öğrenin. Sağlıklı hidrasyon için doğru miktar.",
    keywords: "su ihtiyacı hesaplama, günlük su tüketimi, hidrasyon, su içme miktarı, sporcu su ihtiyacı, sıvı alımı",
    ogTitle: "Su İhtiyacı Hesaplayıcı | Gokalaf",
    ogDescription: "Günlük su ihtiyacınızı hesaplayın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/su-tuketimi`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Su İhtiyacı Hesaplayıcı | Gokalaf",
    twitterDescription: "Günlük su ihtiyacınızı hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/su-tuketimi`,
    schema,
  };
}

export function generateKalpAtisiToolMeta(): MetaTags {
  const faqItems = [
    { question: "Maksimum kalp atış hızı nasıl hesaplanır?", answer: "En yaygın formül: Maksimum Kalp Atış Hızı = 220 - Yaş. 30 yaşında biri için maksimum kalp hızı 190 atım/dakikadır." },
    { question: "Kalp atış hızı bölgeleri nelerdir?", answer: "Bölge 1 (%50-60): Toparlanma. Bölge 2 (%60-70): Yağ yakımı. Bölge 3 (%70-80): Aerobik. Bölge 4 (%80-90): Anaerobik. Bölge 5 (%90-100): Maksimum efor." },
    { question: "Yağ yakmak için hangi bölgede çalışmalıyım?", answer: "Yağ yakımı için Bölge 2-3 (%60-80) idealdir. Bu bölgelerde vücut enerji için yağları kullanır. Ancak toplam kalori yakımı daha yoğun egzersizlerde fazladır." },
    { question: "Dinlenme kalp atış hızı ne olmalı?", answer: "Sağlıklı yetişkinlerde 60-100 atım/dakika normaldir. Atletlerde 40-60 olabilir. Düşük dinlenme kalp hızı genellikle iyi kardiyovasküler sağlığın göstergesidir." },
    { question: "Kalp atış hızı nasıl ölçülür?", answer: "Bileğinizden veya boynunuzdan nabzınızı sayın. 15 saniye sayıp 4 ile çarpın. Akıllı saatler ve göğüs bantları daha doğru sürekli ölçüm sağlar." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/kalp-atisi#app`,
      "name": "Kalp Hızı Bölgeleri Hesaplayıcı",
      "description": "Yaşınıza göre antrenman kalp hızı bölgelerinizi hesaplayın. Yağ yakımı, aerobik ve anaerobik bölgelerini öğrenin.",
      "url": `${BASE_URL}/araclar/kalp-atisi`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Kalp Hızı Bölgeleri", "item": `${BASE_URL}/araclar/kalp-atisi` }
      ]
    }
  ]);

  return {
    title: "Kalp Hızı Bölgeleri Hesaplayıcı - Antrenman Bölgeleri | Gokalaf",
    description: "Ücretsiz kalp hızı bölgeleri hesaplayıcı ile yaşınıza göre antrenman bölgelerinizi öğrenin. Yağ yakımı, aerobik ve maksimum efor bölgelerini hesaplayın.",
    keywords: "kalp hızı bölgeleri, maksimum kalp atış hızı, yağ yakım bölgesi, aerobik bölge, kardio antrenman, nabız hesaplama",
    ogTitle: "Kalp Hızı Bölgeleri Hesaplayıcı | Gokalaf",
    ogDescription: "Antrenman kalp hızı bölgelerinizi hesaplayın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/kalp-atisi`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Kalp Hızı Bölgeleri Hesaplayıcı | Gokalaf",
    twitterDescription: "Antrenman kalp hızı bölgelerinizi hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/kalp-atisi`,
    schema,
  };
}

export function generateProteinToolMeta(): MetaTags {
  const faqItems = [
    { question: "Günlük protein ihtiyacı ne kadardır?", answer: "Sedanter bireyler için kg başına 0.8g, aktif bireyler için 1.2-1.6g, kas yapımı hedefleyenler için 1.6-2.2g protein önerilir. Vücut ağırlığınız ve aktivite seviyenize göre değişir." },
    { question: "Protein ne zaman alınmalı?", answer: "Protein gün boyunca eşit aralıklarla dağıtılmalıdır. Her öğünde 20-40g protein ideal. Antrenman sonrası 30 dakika içinde protein almak kas onarımını destekler." },
    { question: "En iyi protein kaynakları nelerdir?", answer: "Hayvansal: tavuk, hindi, balık, yumurta, süt ürünleri, kırmızı et. Bitkisel: mercimek, nohut, kinoa, tofu, tempeh. Takviye: whey, kazein, bitkisel protein tozları." },
    { question: "Çok protein almanın zararı var mı?", answer: "Sağlıklı bireylerde yüksek protein (2.2g/kg'a kadar) genellikle güvenlidir. Böbrek hastalığı olanlar dikkatli olmalı. Yeterli su tüketimi önemlidir." },
    { question: "Protein eksikliği belirtileri nelerdir?", answer: "Kas kaybı, yorgunluk, saç dökülmesi, yavaş yara iyileşmesi, zayıf bağışıklık, sürekli açlık hissi protein eksikliği belirtileri olabilir." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/protein#app`,
      "name": "Protein İhtiyacı Hesaplayıcı",
      "description": "Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı hesaplayın.",
      "url": `${BASE_URL}/araclar/protein`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Protein İhtiyacı Hesaplayıcı", "item": `${BASE_URL}/araclar/protein` }
      ]
    }
  ]);

  return {
    title: "Protein İhtiyacı Hesaplayıcı - Günlük Protein | Gokalaf",
    description: "Ücretsiz protein ihtiyacı hesaplayıcı ile hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı hesaplayın. Kas yapımı için doğru miktar.",
    keywords: "protein ihtiyacı hesaplama, günlük protein, kas yapımı protein, protein kaynakları, sporcu proteini, protein hesaplama",
    ogTitle: "Protein İhtiyacı Hesaplayıcı | Gokalaf",
    ogDescription: "Günlük protein ihtiyacınızı hesaplayın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/protein`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Protein İhtiyacı Hesaplayıcı | Gokalaf",
    twitterDescription: "Günlük protein ihtiyacınızı hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/protein`,
    schema,
  };
}

export function generateDinlenmeToolMeta(): MetaTags {
  const faqItems = [
    { question: "Setler arasında ne kadar dinlenmeliyim?", answer: "Güç antrenmanı için 3-5 dakika, hipertrofi için 60-90 saniye, dayanıklılık için 30-60 saniye dinlenme önerilir. Hedeflerinize göre dinlenme süresi değişir." },
    { question: "Kısa dinlenme mi uzun dinlenme mi daha iyi?", answer: "Kas büyümesi için 60-90 saniye metabolik stres oluşturur. Güç artışı için 3-5 dakika tam toparlanma gerekir. Yağ yakımı için kısa dinlenme kalori yakımını artırır." },
    { question: "Kas grupları arasında kaç gün dinlenmeliyim?", answer: "Aynı kas grubunu tekrar çalıştırmadan önce 48-72 saat bekleyin. Büyük kas grupları (bacak, sırt) daha uzun toparlanma gerektirir." },
    { question: "Fazla dinlenmek antrenmanı etkiler mi?", answer: "Evet, uzun dinlenme kasları soğutur ve metabolik etkiyi azaltır. Ancak güç antrenmanlarında tam toparlanma performansı artırır." },
    { question: "Aktif dinlenme nedir?", answer: "Aktif dinlenme, setler arasında tamamen durgunluk yerine hafif hareket yapmaktır. Kan dolaşımını artırır ve toparlanmayı hızlandırabilir." }
  ];

  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${BASE_URL}/araclar/dinlenme#app`,
      "name": "Dinlenme Süresi Hesaplayıcı",
      "description": "Antrenman tipinize göre ideal set arası dinlenme sürenizi öğrenin.",
      "url": `${BASE_URL}/araclar/dinlenme`,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "provider": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Araçlar", "item": `${BASE_URL}/araclar` },
        { "@type": "ListItem", "position": 3, "name": "Dinlenme Süresi Hesaplayıcı", "item": `${BASE_URL}/araclar/dinlenme` }
      ]
    }
  ]);

  return {
    title: "Dinlenme Süresi Hesaplayıcı - Set Arası Dinlenme | Gokalaf",
    description: "Ücretsiz dinlenme süresi hesaplayıcı ile antrenman tipinize göre ideal set arası dinlenme sürenizi öğrenin. Güç, hipertrofi ve dayanıklılık için öneriler.",
    keywords: "dinlenme süresi hesaplama, set arası dinlenme, antrenman dinlenme, toparlanma süresi, kas dinlenmesi, rest time",
    ogTitle: "Dinlenme Süresi Hesaplayıcı | Gokalaf",
    ogDescription: "Antrenman tipinize göre ideal dinlenme sürenizi öğrenin.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/dinlenme`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Dinlenme Süresi Hesaplayıcı | Gokalaf",
    twitterDescription: "Antrenman tipinize göre ideal dinlenme sürenizi öğrenin.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/dinlenme`,
    schema,
  };
}

export function injectMeta(html: string, meta: MetaTags): string {
  let result = html;

  result = result.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  result = result.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  result = result.replace(
    /<meta name="keywords" content=".*?" \/>/,
    `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`
  );

  result = result.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${meta.canonical}" />`
  );

  result = result.replace(
    /<meta property="og:type" content=".*?" \/>/,
    `<meta property="og:type" content="${meta.ogType}" />`
  );

  result = result.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${meta.ogUrl}" />`
  );

  result = result.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`
  );

  result = result.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`
  );

  result = result.replace(
    /<meta property="og:image" content=".*?" \/>/,
    `<meta property="og:image" content="${meta.ogImage}" />`
  );

  result = result.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(meta.twitterTitle)}" />`
  );

  result = result.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(meta.twitterDescription)}" />`
  );

  result = result.replace(
    /<meta name="twitter:image" content=".*?" \/>/,
    `<meta name="twitter:image" content="${meta.twitterImage}" />`
  );

  if (meta.ogType === "article" && meta.articlePublishedTime) {
    const articleMeta = `
    <meta property="article:published_time" content="${meta.articlePublishedTime}" />
    ${meta.articleModifiedTime ? `<meta property="article:modified_time" content="${meta.articleModifiedTime}" />` : ""}
    ${meta.articleAuthor ? `<meta property="article:author" content="${meta.articleAuthor}" />` : ""}
    ${meta.articleSection ? `<meta property="article:section" content="${meta.articleSection}" />` : ""}`;
    
    result = result.replace(
      /<meta property="og:site_name"/,
      `${articleMeta}\n    <meta property="og:site_name"`
    );
  }

  if (meta.schema) {
    result = result.replace(
      /<\/head>/,
      `  <script type="application/ld+json">${meta.schema}</script>\n  </head>`
    );
  }

  return result;
}

export function injectBody(html: string, bodyContent: string): string {
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${bodyContent}</div>`
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const muscleLabels: Record<string, string> = {
  abdominals: "Karın",
  abductors: "Dış Bacak",
  adductors: "İç Bacak",
  biceps: "Biceps",
  calves: "Baldır",
  chest: "Göğüs",
  forearms: "Ön Kol",
  glutes: "Kalça",
  hamstrings: "Arka Bacak",
  lats: "Sırt",
  "lower back": "Alt Sırt",
  "middle back": "Orta Sırt",
  neck: "Boyun",
  quadriceps: "Ön Bacak",
  shoulders: "Omuz",
  traps: "Trapez",
  triceps: "Triceps",
};

const levelLabels: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  expert: "İleri",
};

export function generateExercisesListMeta(total: number): MetaTags {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/egzersiz-akademisi#webpage`,
    "url": `${BASE_URL}/egzersiz-akademisi`,
    "name": "Egzersiz Akademisi - 800+ Fitness Hareketi | Gokalaf",
    "description": `${total}+ fitness egzersizi ve hareket rehberi. Kas gruplarına, ekipmana ve zorluk seviyesine göre doğru egzersizleri öğrenin.`,
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": { "@id": `${BASE_URL}/#organization` },
    "inLanguage": "tr-TR"
  });

  return {
    title: `Egzersiz Akademisi - ${total}+ Fitness Hareketi | Gokalaf`,
    description: `${total}'den fazla fitness egzersizi ve hareket rehberi. Kas gruplarına, ekipmana ve zorluk seviyesine göre filtreleme yaparak doğru egzersizleri öğrenin.`,
    keywords: "egzersiz, fitness hareketleri, gym egzersizleri, kas çalışma, antrenman rehberi, egzersiz akademisi, vücut geliştirme hareketleri",
    ogTitle: `Egzersiz Akademisi - ${total}+ Fitness Hareketi | Gokalaf`,
    ogDescription: `${total}+ fitness egzersizi. Kas gruplarına göre filtreleyerek doğru tekniği öğrenin.`,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/egzersiz-akademisi`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: `Egzersiz Akademisi | Gokalaf`,
    twitterDescription: `${total}+ fitness egzersizi rehberi.`,
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/egzersiz-akademisi`,
    schema,
  };
}

export function generateExerciseDetailMeta(exercise: Exercise): MetaTags {
  const muscles = exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(", ");
  const secondaryMuscles = exercise.secondaryMuscles?.map(m => muscleLabels[m] || m).join(", ") || "";
  const level = levelLabels[exercise.level] || exercise.level;
  const imageUrl = exercise.images[0] ? `${BASE_URL}${exercise.images[0]}` : DEFAULT_OG_IMAGE;
  const allImages = exercise.images.map(img => `${BASE_URL}${img}`);
  const primaryMuscle = exercise.primaryMuscles[0];
  const muscleLabel = muscleLabels[primaryMuscle] || primaryMuscle;
  const instructions = exercise.instructionsTr || exercise.instructionsEn;

  const steps = instructions.map((step, i) => ({
    "@type": "HowToStep",
    "position": i + 1,
    "name": `Adım ${i + 1}: ${step.substring(0, 50)}${step.length > 50 ? '...' : ''}`,
    "text": step,
    "url": `${BASE_URL}/egzersiz-akademisi/${exercise.slug}#step-${i + 1}`,
    "image": {
      "@type": "ImageObject",
      "url": allImages[i % allImages.length] || imageUrl,
      "width": 800,
      "height": 600
    }
  }));

  // Schema yapısı: Article (ana) + HowTo (destekleyici) + BreadcrumbList
  // ExerciseAction/AnatomicalStructure kaldırıldı (SERP etkisi yok)
  // Organization ayrı değil, Article.publisher içinde
  const schema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${BASE_URL}/egzersiz-akademisi/${exercise.slug}#article`,
      "headline": `${exercise.name} - Doğru Teknik ve Talimatlar`,
      "description": `${exercise.name} egzersizi nasıl yapılır? ${instructions.length} adımda doğru teknik. Hedef: ${muscles}. Seviye: ${level}. Set/Tekrar: 3-4 set, 8-12 tekrar.`,
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 675
      },
      "author": {
        "@type": "Person",
        "name": "Gokalaf Editör",
        "url": `${BASE_URL}/hakkimizda`,
        "jobTitle": "Fitness İçerik Editörü"
      },
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "datePublished": "2024-01-01T00:00:00+03:00",
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": `${BASE_URL}/egzersiz-akademisi/${exercise.slug}`,
      "articleSection": "Egzersiz Rehberi",
      "wordCount": instructions.join(" ").split(" ").length + 200,
      "inLanguage": "tr-TR"
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${BASE_URL}/egzersiz-akademisi/${exercise.slug}#howto`,
      "name": `${exercise.name} Nasıl Yapılır?`,
      "description": `${exercise.name} egzersizi için adım adım rehber. Hedef kaslar: ${muscles}. Önerilen: 3-4 set, 8-12 tekrar, 60-90 sn dinlenme.`,
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 800,
        "height": 600
      },
      "totalTime": "PT5M",
      "tool": exercise.equipment ? [{
        "@type": "HowToTool",
        "name": exercise.equipment
      }] : [],
      "step": steps,
      "inLanguage": "tr-TR"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Egzersiz Akademisi", "item": `${BASE_URL}/egzersiz-akademisi` },
        { "@type": "ListItem", "position": 3, "name": muscleLabel, "item": `${BASE_URL}/egzersiz-akademisi?muscle=${primaryMuscle}` },
        { "@type": "ListItem", "position": 4, "name": exercise.name, "item": `${BASE_URL}/egzersiz-akademisi/${exercise.slug}` }
      ]
    }
  ]);

  return {
    title: `${exercise.name} - Egzersiz Rehberi | Gokalaf`,
    description: `${exercise.name} egzersizi nasıl yapılır? Adım adım talimatlar, hedef kaslar (${muscles}) ve doğru teknik bilgisi. Seviye: ${level}.`,
    keywords: `${exercise.name}, ${muscles}, egzersiz, fitness, ${exercise.equipment || ''}, ${level}`,
    ogTitle: `${exercise.name} - Egzersiz Rehberi | Gokalaf`,
    ogDescription: `${exercise.name} nasıl yapılır? Hedef kaslar: ${muscles}. ${level} seviye.`,
    ogImage: imageUrl,
    ogUrl: `${BASE_URL}/egzersiz-akademisi/${exercise.slug}`,
    ogType: "article",
    twitterCard: "summary_large_image",
    twitterTitle: `${exercise.name} | Gokalaf Egzersiz Akademisi`,
    twitterDescription: `${exercise.name} egzersizi. Hedef: ${muscles}.`,
    twitterImage: imageUrl,
    canonical: `${BASE_URL}/egzersiz-akademisi/${exercise.slug}`,
    schema,
  };
}
