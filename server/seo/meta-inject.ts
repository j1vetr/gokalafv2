import type { Article, Package } from "@shared/schema";

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
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    "url": BASE_URL,
    "name": "Gokalaf | Online Fitness & Vücut Geliştirme Koçluğu",
    "description": "Gokalaf ile profesyonel online fitness ve vücut geliştirme koçluğu. Kişiselleştirilmiş antrenman ve beslenme programları.",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": { "@id": `${BASE_URL}/#organization` },
    "inLanguage": "tr-TR"
  });

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
  const description = activePackages.length > 0
    ? `Gokalaf koçluk paketleri: ${weekOptions}. Profesyonel antrenman ve beslenme programları ile fitness hedeflerinize ulaşın.`
    : "Gokalaf koçluk paketleri ile profesyonel antrenman ve beslenme programları.";

  const offers = activePackages.map(pkg => ({
    "@type": "Offer",
    "name": pkg.name,
    "description": `${pkg.weeks} haftalık kişiselleştirilmiş fitness koçluğu`,
    "price": pkg.price,
    "priceCurrency": "TRY",
    "availability": "https://schema.org/InStock",
    "url": `${BASE_URL}/paketler`,
    "seller": { "@id": `${BASE_URL}/#organization` }
  }));

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Gokalaf Koçluk Paketleri",
    "description": description,
    "url": `${BASE_URL}/paketler`,
    "numberOfItems": activePackages.length,
    "itemListElement": offers.map((offer, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": offer
    }))
  });

  return {
    title: "Koçluk Paketleri | Gokalaf",
    description,
    keywords: "fitness koçluk paketi, online pt fiyat, antrenman programı fiyat, beslenme danışmanlığı, 8 haftalık program, 12 haftalık program",
    ogTitle: "Koçluk Paketleri | Gokalaf",
    ogDescription: priceRange ? `${description} Fiyatlar: ${priceRange}` : description,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/paketler`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Koçluk Paketleri | Gokalaf",
    twitterDescription: description,
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/paketler`,
    schema,
  };
}

export function generateArticlesListMeta(articles: Article[]): MetaTags {
  const publishedArticles = articles.filter(a => a.status === 'published' && a.slug);
  const latestTitles = publishedArticles.slice(0, 3).map(a => a.title).join(", ");
  const description = publishedArticles.length > 0
    ? `Fitness, beslenme ve sağlık hakkında uzman makaleler. ${latestTitles} ve daha fazlası.`
    : "Fitness, beslenme ve sağlık hakkında uzman makaleler. Gokalaf blog yazıları.";

  const blogPosts = publishedArticles.slice(0, 10).map((article, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "BlogPosting",
      "headline": article.title,
      "url": `${BASE_URL}/yazilar/${article.slug}`,
      "description": article.excerpt || article.title,
      "image": article.heroImage || DEFAULT_OG_IMAGE,
      "datePublished": formatDateISO(article.publishedAt),
      "author": { "@id": `${BASE_URL}/#organization` }
    }
  }));

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE_URL}/yazilar#blog`,
    "name": "Gokalaf Blog - Fitness ve Beslenme Yazıları",
    "description": description,
    "url": `${BASE_URL}/yazilar`,
    "publisher": { "@id": `${BASE_URL}/#organization` },
    "blogPost": blogPosts,
    "inLanguage": "tr-TR"
  });

  return {
    title: "Yazılar | Gokalaf Blog",
    description,
    keywords: "fitness blog, beslenme makaleleri, antrenman ipuçları, sağlıklı yaşam, kas yapma, kilo verme, supplement, takviye",
    ogTitle: "Yazılar | Gokalaf Blog",
    ogDescription: description,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/yazilar`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Yazılar | Gokalaf Blog",
    twitterDescription: description,
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/yazilar`,
    schema,
  };
}

export function generateArticleDetailMeta(article: Article): MetaTags {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || article.title;
  const keywords = `${article.title}, fitness, beslenme, gokalaf`;
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

  const publishedDate = formatDateISO(article.publishedAt);
  const modifiedDate = formatDateISO(article.updatedAt) || publishedDate;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE_URL}/yazilar/${article.slug}#article`,
    "headline": title,
    "description": description,
    "image": ogImage,
    "url": `${BASE_URL}/yazilar/${article.slug}`,
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": "Gokalaf",
      "url": `${BASE_URL}/hakkimizda`
    },
    "publisher": { "@id": `${BASE_URL}/#organization` },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/yazilar/${article.slug}`
    },
    "articleSection": categoryLabel,
    "inLanguage": "tr-TR",
    "keywords": keywords
  });

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
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/hakkimizda#aboutpage`,
    "name": "Hakkımızda | Gokalaf",
    "description": "Gokalaf'ın hikayesi, vizyonu ve fitness felsefesi. Profesyonel online koçluk hizmeti sunan ekibimizi tanıyın.",
    "url": `${BASE_URL}/hakkimizda`,
    "mainEntity": { "@id": `${BASE_URL}/#organization` },
    "inLanguage": "tr-TR"
  });

  return {
    title: "Hakkımızda | Gokalaf",
    description: "Gokalaf'ın hikayesi, vizyonu ve fitness felsefesi. Profesyonel online koçluk hizmeti sunan ekibimizi tanıyın.",
    keywords: "gokalaf, fitness koçu, online pt, hakkımızda, vücut geliştirme koçu, beslenme danışmanı",
    ogTitle: "Hakkımızda | Gokalaf",
    ogDescription: "Gokalaf'ın hikayesi, vizyonu ve fitness felsefesi. Profesyonel online koçluk hizmeti sunan ekibimizi tanıyın.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/hakkimizda`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Hakkımızda | Gokalaf",
    twitterDescription: "Gokalaf'ın hikayesi, vizyonu ve fitness felsefesi.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/hakkimizda`,
    schema,
  };
}

export function generateToolsMeta(): MetaTags {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/araclar#toolspage`,
    "name": "Fitness Araçları | Gokalaf",
    "description": "Ücretsiz fitness hesaplayıcıları: BMI, kalori, TDEE ve makro hesaplayıcı.",
    "url": `${BASE_URL}/araclar`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": "BMI Hesaplayıcı",
            "description": "Vücut kitle indeksinizi hesaplayın",
            "url": `${BASE_URL}/araclar/bmi`,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Kalori Hesaplayıcı",
            "description": "Günlük kalori ihtiyacınızı hesaplayın",
            "url": `${BASE_URL}/araclar/kalori`,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "SoftwareApplication",
            "name": "TDEE Hesaplayıcı",
            "description": "Toplam günlük enerji harcamanızı hesaplayın",
            "url": `${BASE_URL}/araclar/tdee`,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web"
          }
        },
        {
          "@type": "ListItem",
          "position": 4,
          "item": {
            "@type": "SoftwareApplication",
            "name": "Makro Hesaplayıcı",
            "description": "Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın",
            "url": `${BASE_URL}/araclar/makro`,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web"
          }
        }
      ]
    },
    "inLanguage": "tr-TR"
  });

  return {
    title: "Fitness Araçları | Gokalaf",
    description: "Ücretsiz fitness hesaplayıcıları: BMI, kalori, TDEE ve makro hesaplayıcı. Antrenman ve beslenme planlaması için kullanışlı araçlar.",
    keywords: "bmi hesaplama, kalori hesaplama, tdee hesaplama, makro hesaplama, fitness hesaplayıcı, vücut kitle indeksi, günlük kalori",
    ogTitle: "Fitness Araçları | Gokalaf",
    ogDescription: "Ücretsiz fitness hesaplayıcıları: BMI, kalori, TDEE ve makro hesaplayıcı.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Fitness Araçları | Gokalaf",
    twitterDescription: "Ücretsiz fitness hesaplayıcıları: BMI, kalori, TDEE ve makro hesaplayıcı.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar`,
    schema,
  };
}

export function generateBmiToolMeta(): MetaTags {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/araclar/bmi#app`,
    "name": "BMI Hesaplayıcı",
    "description": "Vücut kitle indeksinizi (BMI) hesaplayın. Boy ve kilonuza göre sağlıklı kilo aralığınızı öğrenin.",
    "url": `${BASE_URL}/araclar/bmi`,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "provider": { "@id": `${BASE_URL}/#organization` }
  });

  return {
    title: "BMI Hesaplayıcı - Vücut Kitle İndeksi Hesaplama | Gokalaf",
    description: "Ücretsiz BMI hesaplayıcı ile vücut kitle indeksinizi hesaplayın. Boy ve kilonuza göre ideal kilo aralığınızı öğrenin. Zayıf, normal, kilolu veya obez kategorinizi belirleyin.",
    keywords: "bmi hesaplama, vücut kitle indeksi, ideal kilo hesaplama, beden kitle endeksi, kilo boy oranı, sağlıklı kilo",
    ogTitle: "BMI Hesaplayıcı | Gokalaf",
    ogDescription: "Vücut kitle indeksinizi hesaplayın. İdeal kilo aralığınızı öğrenin.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/araclar/bmi`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "BMI Hesaplayıcı | Gokalaf",
    twitterDescription: "Vücut kitle indeksinizi hesaplayın.",
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/araclar/bmi`,
    schema,
  };
}

export function generateCalorieToolMeta(): MetaTags {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/araclar/kalori#app`,
    "name": "Kalori Hesaplayıcı",
    "description": "Günlük kalori ihtiyacınızı hesaplayın. Kilo vermek, korumak veya almak için gereken kalori miktarını öğrenin.",
    "url": `${BASE_URL}/araclar/kalori`,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "provider": { "@id": `${BASE_URL}/#organization` }
  });

  return {
    title: "Kalori Hesaplayıcı - Günlük Kalori İhtiyacı | Gokalaf",
    description: "Ücretsiz kalori hesaplayıcı ile günlük kalori ihtiyacınızı hesaplayın. Kilo vermek, korumak veya almak için kaç kalori almanız gerektiğini öğrenin.",
    keywords: "kalori hesaplama, günlük kalori ihtiyacı, kalori hesaplayıcı, diyet kalori, kilo verme kalori, bazal metabolizma",
    ogTitle: "Kalori Hesaplayıcı | Gokalaf",
    ogDescription: "Günlük kalori ihtiyacınızı hesaplayın.",
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
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/araclar/tdee#app`,
    "name": "TDEE Hesaplayıcı",
    "description": "Toplam Günlük Enerji Harcaması (TDEE) hesaplayıcı. Aktivite seviyenize göre yakmanız gereken kaloriyi öğrenin.",
    "url": `${BASE_URL}/araclar/tdee`,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "provider": { "@id": `${BASE_URL}/#organization` }
  });

  return {
    title: "TDEE Hesaplayıcı - Toplam Günlük Enerji Harcaması | Gokalaf",
    description: "Ücretsiz TDEE hesaplayıcı ile toplam günlük enerji harcamanızı hesaplayın. Aktivite seviyenize göre yakmanız gereken kalori miktarını öğrenin.",
    keywords: "tdee hesaplama, toplam günlük enerji harcaması, enerji harcama hesaplama, aktivite kalori, metabolizma hızı",
    ogTitle: "TDEE Hesaplayıcı | Gokalaf",
    ogDescription: "Toplam günlük enerji harcamanızı hesaplayın.",
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
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/araclar/makro#app`,
    "name": "Makro Hesaplayıcı",
    "description": "Günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize uygun makro besin dağılımını öğrenin.",
    "url": `${BASE_URL}/araclar/makro`,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "provider": { "@id": `${BASE_URL}/#organization` }
  });

  return {
    title: "Makro Hesaplayıcı - Protein, Karbonhidrat, Yağ | Gokalaf",
    description: "Ücretsiz makro hesaplayıcı ile günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Kas yapma, yağ yakma veya kilo koruma hedeflerinize uygun makro dağılımını öğrenin.",
    keywords: "makro hesaplama, protein hesaplama, karbonhidrat hesaplama, yağ hesaplama, makro besin, diyet makro",
    ogTitle: "Makro Hesaplayıcı | Gokalaf",
    ogDescription: "Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın.",
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
