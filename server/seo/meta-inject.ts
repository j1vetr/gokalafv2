import type { Article, Package } from "@shared/schema";

export interface MetaTags {
  title: string;
  description: string;
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
}

const BASE_URL = "https://gokalaf.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function generateHomeMeta(): MetaTags {
  return {
    title: "Gokalaf | Online Fitness & Vücut Geliştirme Koçluğu",
    description: "Gokalaf ile profesyonel online fitness ve vücut geliştirme koçluğu. Kişiselleştirilmiş antrenman ve beslenme programları, haftalık takip ve uzman rehberliği ile hedeflerinize ulaşın.",
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
  };
}

export function generatePackagesMeta(packages: Package[]): MetaTags {
  const activePackages = packages.filter(p => p.isActive);
  const weekOptions = activePackages.map(p => `${p.weeks} hafta`).join(", ");
  const description = activePackages.length > 0
    ? `Gokalaf koçluk paketleri: ${weekOptions}. Profesyonel antrenman ve beslenme programları ile fitness hedeflerinize ulaşın.`
    : "Gokalaf koçluk paketleri ile profesyonel antrenman ve beslenme programları.";

  return {
    title: "Koçluk Paketleri | Gokalaf",
    description,
    ogTitle: "Koçluk Paketleri | Gokalaf",
    ogDescription: description,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: `${BASE_URL}/paketler`,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Koçluk Paketleri | Gokalaf",
    twitterDescription: description,
    twitterImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/paketler`,
  };
}

export function generateArticlesListMeta(articles: Article[]): MetaTags {
  const latestTitles = articles.slice(0, 3).map(a => a.title).join(", ");
  const description = articles.length > 0
    ? `Fitness, beslenme ve sağlık hakkında uzman makaleler. ${latestTitles} ve daha fazlası.`
    : "Fitness, beslenme ve sağlık hakkında uzman makaleler. Gokalaf blog yazıları.";

  return {
    title: "Yazılar | Gokalaf Blog",
    description,
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
  };
}

export function generateArticleDetailMeta(article: Article): MetaTags {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || article.title;
  const ogImage = article.heroImage
    ? (article.heroImage.startsWith("http") ? article.heroImage : `${BASE_URL}${article.heroImage}`)
    : DEFAULT_OG_IMAGE;

  return {
    title: `${title} | Gokalaf`,
    description,
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
    articlePublishedTime: article.publishedAt?.toISOString(),
    articleModifiedTime: article.updatedAt?.toISOString(),
    articleAuthor: "Gokalaf",
    articleSection: article.categoryId || "Fitness",
  };
}

export function generateAboutMeta(): MetaTags {
  return {
    title: "Hakkımızda | Gokalaf",
    description: "Gokalaf'ın hikayesi, vizyonu ve fitness felsefesi. Profesyonel online koçluk hizmeti sunan ekibimizi tanıyın.",
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
  };
}

export function generateToolsMeta(): MetaTags {
  return {
    title: "Fitness Araçları | Gokalaf",
    description: "Ücretsiz fitness hesaplayıcıları: BMI, kalori, TDEE ve makro hesaplayıcı. Antrenman ve beslenme planlaması için kullanışlı araçlar.",
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
