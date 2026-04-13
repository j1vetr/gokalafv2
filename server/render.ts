import MarkdownIt from "markdown-it";
import type { Package, Exercise } from "@shared/schema";
type Article = any;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const articleStyles = `
  <style>
    .article-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: #0a0a0a; border-radius: 0.5rem; overflow: hidden; }
    .article-content table th { background: #1a1a1a; color: #ccff00; padding: 0.75rem 1rem; text-align: left; font-weight: 600; border-bottom: 2px solid #333; }
    .article-content table td { padding: 0.75rem 1rem; border-bottom: 1px solid #1a1a1a; color: #e5e5e5; }
    .article-content table tr:hover { background: rgba(204, 255, 0, 0.05); }
    .article-content table tr:last-child td { border-bottom: none; }
    .article-content blockquote { border-left: 4px solid #ccff00; padding: 1rem 1.5rem; margin: 1.5rem 0; background: rgba(204, 255, 0, 0.05); border-radius: 0 0.5rem 0.5rem 0; }
    .article-content blockquote p { margin: 0; color: #e5e5e5; }
    .article-content ul, .article-content ol { padding-left: 1.5rem; margin: 1rem 0; }
    .article-content li { margin: 0.5rem 0; color: #e5e5e5; }
    .article-content h1 { color: #fff; font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; }
    .article-content h2 { color: #fff; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; }
    .article-content h3 { color: #ccff00; font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; }
    .article-content h4 { color: #ccff00; font-size: 1.1rem; margin-top: 1.25rem; margin-bottom: 0.5rem; font-weight: 600; }
    .article-content p { margin: 1rem 0; }
    .article-content a { color: #ccff00; text-decoration: none; }
    .article-content a:hover { text-decoration: underline; }
    .article-content strong { color: #fff; font-weight: 600; }
    .article-content code { background: #1a1a1a; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; color: #ccff00; }
    .article-content .tip-box { background: rgba(204, 255, 0, 0.1); border: 1px solid rgba(204, 255, 0, 0.3); border-radius: 0.5rem; padding: 1rem 1.5rem; margin: 1.5rem 0; }
    .article-content .warning-box { background: rgba(255, 165, 0, 0.1); border: 1px solid rgba(255, 165, 0, 0.3); border-radius: 0.5rem; padding: 1rem 1.5rem; margin: 1.5rem 0; }
  </style>
`;

export function renderHome(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <header style="padding: 2rem; text-align: center;">
        <h1 style="font-size: 3rem; font-weight: 700; color: #ccff00;">GOKALAF</h1>
        <p style="font-size: 1.25rem; color: #a3a3a3;">Online Fitness & Vücut Geliştirme Koçluğu</p>
      </header>
      <main style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
        <section>
          <h2 style="font-size: 2rem; color: #fff; margin-bottom: 1rem;">Performans • Güç • Disiplin</h2>
          <p style="color: #a3a3a3;">
            Gokalaf ile profesyonel online fitness koçluğu. Kişiselleştirilmiş antrenman ve beslenme programları ile 
            hedeflerinize ulaşın. Haftalık takip, uzman rehberliği ve veri odaklı sistem ile dönüşümünüzü başlatın.
          </p>
        </section>
      </main>
    </div>
  `;
}

export function renderPackages(packages: Package[]): string {
  const activePackages = packages.filter(p => p.isActive);
  
  const packageCards = activePackages.map(pkg => `
    <article style="background: linear-gradient(135deg, #1a1a1a, #0a0a0a); border: 1px solid #333; border-radius: 1rem; padding: 2rem; margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.5rem; color: #ccff00; margin-bottom: 0.5rem;">${escapeHtml(pkg.name)}</h3>
      <p style="font-size: 1.25rem; color: #fff; margin-bottom: 1rem;">${pkg.weeks} Hafta</p>
      <p style="font-size: 2rem; font-weight: 700; color: #ccff00;">${Number(pkg.price).toLocaleString('tr-TR')} ₺</p>
      ${pkg.features ? `
        <ul style="list-style: none; padding: 0; margin-top: 1rem;">
          ${pkg.features.map(f => `<li style="color: #a3a3a3; padding: 0.25rem 0;">✓ ${escapeHtml(f)}</li>`).join('')}
        </ul>
      ` : ''}
    </article>
  `).join('');

  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <header style="padding: 2rem; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff;">Koçluk Paketleri</h1>
        <p style="color: #a3a3a3;">Hedeflerinize uygun paketi seçin</p>
      </header>
      <main style="padding: 2rem; max-width: 800px; margin: 0 auto;">
        ${packageCards || '<p style="color: #a3a3a3;">Şu anda aktif paket bulunmamaktadır.</p>'}
      </main>
    </div>
  `;
}

export function renderArticlesList(articles: Article[]): string {
  const publishedArticles = articles.filter(a => a.status === 'published');
  
  const articleCards = publishedArticles.map(article => `
    <article style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem;">
      <a href="/yazilar/${article.slug}" style="text-decoration: none;">
        ${article.heroImage ? `<img src="${article.heroImage}" alt="${escapeHtml(article.title)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;" />` : ''}
        <h2 style="font-size: 1.25rem; color: #fff; margin-bottom: 0.5rem;">${escapeHtml(article.title)}</h2>
        <p style="color: #a3a3a3; font-size: 0.875rem;">${escapeHtml(article.excerpt || '')}</p>
      </a>
    </article>
  `).join('');

  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <header style="padding: 2rem; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff;">Yazılar</h1>
        <p style="color: #a3a3a3;">Fitness, beslenme ve sağlık hakkında makaleler</p>
      </header>
      <main style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <div style="display: grid; gap: 1.5rem;">
          ${articleCards || '<p style="color: #a3a3a3;">Henüz makale bulunmamaktadır.</p>'}
        </div>
      </main>
    </div>
  `;
}

function ssrSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function addHeadingIds(html: string): { html: string; headings: { id: string; text: string; level: number }[] } {
  const headings: { id: string; text: string; level: number }[] = [];
  const usedIds = new Set<string>();
  const result = html.replace(/<h([2-3])>(.*?)<\/h[2-3]>/g, (_match, level, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    let id = ssrSlugify(cleanText);
    if (usedIds.has(id)) {
      let c = 2;
      while (usedIds.has(`${id}-${c}`)) c++;
      id = `${id}-${c}`;
    }
    usedIds.add(id);
    headings.push({ id, text: cleanText, level: parseInt(level) });
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
  return { html: result, headings };
}

function ssrParseFAQs(content: string): { mainContent: string; hasFaqs: boolean } {
  const faqMatch = content.match(/## Sıkça Sorulan Sorular([\s\S]*?)(?=## |$)/i);
  if (!faqMatch) return { mainContent: content, hasFaqs: false };
  const mainContent = content.replace(/## Sıkça Sorulan Sorular[\s\S]*?(?=## |$)/i, '');
  return { mainContent, hasFaqs: true };
}

export function renderArticleDetail(article: Article): string {
  const { mainContent: parsedContent, hasFaqs } = ssrParseFAQs(article.content || '');
  const rawHtml = md.render(parsedContent);
  const { html: contentHtml, headings } = addHeadingIds(rawHtml);
  if (hasFaqs) {
    headings.push({ id: 'sikca-sorulan-sorular', text: 'Sıkça Sorulan Sorular', level: 2 });
  }
  
  const categoryLabels: Record<string, string> = {
    'takviye': 'Takviye',
    'beslenme': 'Beslenme',
    'antrenman': 'Antrenman',
    'saglik': 'Sağlık',
  };
  const categoryLabel = categoryLabels[article.categoryId || ''] || article.categoryId || '';
  const categorySlug = article.categoryId || 'fitness';

  const publishedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  const imageAlt = `${article.title} - ${categoryLabel} rehberi ve bilgilendirici görsel. Gokalaf fitness blogu.`;

  return `
    ${articleStyles}
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <ol style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <li><a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a></li>
            <li style="color: #666;">›</li>
            <li><a href="/yazilar" style="color: #a3a3a3; text-decoration: none;">Yazılar</a></li>
            ${categoryLabel ? `
              <li style="color: #666;">›</li>
              <li><span style="color: #a3a3a3;">${categoryLabel}</span></li>
            ` : ''}
            <li style="color: #666;">›</li>
            <li><span style="color: #ccff00;">${escapeHtml(article.title.substring(0, 50))}${article.title.length > 50 ? '...' : ''}</span></li>
          </ol>
        </nav>

        <article itemscope itemtype="https://schema.org/Article">
          <header style="margin-bottom: 2rem;">
            ${categoryLabel ? `<span itemprop="articleSection" style="background: rgba(204, 255, 0, 0.1); color: #ccff00; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; text-transform: uppercase;">${categoryLabel}</span>` : ''}
            <h1 itemprop="headline" style="font-size: 2.5rem; font-weight: 700; color: #fff; margin: 1rem 0;">${escapeHtml(article.title)}</h1>
            <div style="display: flex; align-items: center; gap: 1rem; color: #666; font-size: 0.875rem; flex-wrap: wrap;">
              ${publishedDate ? `<time itemprop="datePublished" datetime="${article.publishedAt}">${publishedDate}</time>` : ''}
              <span>•</span>
              <span>${readingTime} dk okuma</span>
              <span>•</span>
              <span itemprop="author" itemscope itemtype="https://schema.org/Person">
                <span itemprop="name">Gokalaf</span>
              </span>
            </div>
            ${article.excerpt ? `<p itemprop="description" style="color: #a3a3a3; margin-top: 1rem; font-size: 1.1rem; line-height: 1.6;">${escapeHtml(article.excerpt)}</p>` : ''}
          </header>
          
          ${article.heroImage ? `
            <figure style="margin: 0 0 2rem 0;">
              <img 
                itemprop="image"
                src="${article.heroImage}" 
                alt="${escapeHtml(imageAlt)}"
                title="${escapeHtml(article.title)}"
                loading="eager"
                width="1200"
                height="675"
                style="width: 100%; height: auto; border-radius: 1rem; max-height: 500px; object-fit: cover;"
              />
              <figcaption style="text-align: center; color: #666; font-size: 0.8rem; margin-top: 0.5rem;">
                ${escapeHtml(article.title)} - Görsel
              </figcaption>
            </figure>
          ` : ''}

          ${headings.length > 2 ? `
            <nav aria-label="İçindekiler" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
              <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin: 0 0 1rem 0;">İçindekiler</h2>
              <ol style="list-style: none; padding: 0; margin: 0;">
                ${headings.map((h, i) => {
                  const num = h.level === 2 ? `${headings.filter((t, j) => t.level === 2 && j <= i).length}.` : '—';
                  return `<li style="margin: 0.25rem 0; ${h.level === 3 ? 'padding-left: 1.5rem;' : ''}">
                    <a href="#${h.id}" style="color: ${h.level === 2 ? '#ccff00' : '#a3a3a3'}; text-decoration: none; font-size: 0.9rem;">
                      <span style="color: #666; margin-right: 0.5rem;">${num}</span>${escapeHtml(h.text)}
                    </a>
                  </li>`;
                }).join('')}
              </ol>
            </nav>
          ` : ''}
          
          <div itemprop="articleBody" class="article-content" style="color: #e5e5e5; line-height: 1.8; font-size: 1.125rem;">
            ${contentHtml}
          </div>
          
          <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #1a1a1a;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
              <div style="width: 48px; height: 48px; background: #ccff00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000;">G</div>
              <div>
                <p style="color: #fff; font-weight: 600; margin: 0;">Gokalaf</p>
                <p style="color: #666; font-size: 0.875rem; margin: 0;">Online Fitness Koçu</p>
              </div>
            </div>
            <p style="color: #a3a3a3; font-size: 0.9rem; line-height: 1.6;">
              Bu makale Gokalaf ekibi tarafından hazırlanmıştır. Daha fazla ${categoryLabel.toLowerCase()} içeriği için 
              <a href="/yazilar" style="color: #ccff00; text-decoration: none;">yazılar sayfamızı</a> ziyaret edebilirsiniz.
            </p>
          </footer>
          
          ${article.ctaText && article.ctaLink ? `
            <div style="margin-top: 2rem; padding: 2rem; background: linear-gradient(135deg, rgba(204, 255, 0, 0.1), transparent); border: 1px solid rgba(204, 255, 0, 0.2); border-radius: 1rem; text-align: center;">
              <p style="color: #fff; margin-bottom: 1rem; font-size: 1.1rem;">Profesyonel koçluk ile hedeflerinize ulaşın</p>
              <a href="${article.ctaLink}" style="display: inline-block; background: #ccff00; color: #000; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                ${escapeHtml(article.ctaText)}
              </a>
            </div>
          ` : `
            <div style="margin-top: 2rem; padding: 2rem; background: linear-gradient(135deg, rgba(204, 255, 0, 0.1), transparent); border: 1px solid rgba(204, 255, 0, 0.2); border-radius: 1rem; text-align: center;">
              <p style="color: #fff; margin-bottom: 1rem; font-size: 1.1rem;">Profesyonel koçluk ile hedeflerinize ulaşın</p>
              <a href="/paketler" style="display: inline-block; background: #ccff00; color: #000; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                Koçluk Paketlerini İncele
              </a>
            </div>
          `}
        </article>
      </main>
    </div>
  `;
}

export function renderAbout(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Hakkımızda</h1>
        <p style="color: #a3a3a3; line-height: 1.8;">
          Gokalaf, profesyonel online fitness ve vücut geliştirme koçluğu hizmeti sunan bir platformdur. 
          Kişiselleştirilmiş antrenman programları, beslenme danışmanlığı ve haftalık takip ile 
          danışanlarımızın hedeflerine ulaşmalarına yardımcı oluyoruz.
        </p>
      </main>
    </div>
  `;
}

export function renderTools(): string {
  const tools = [
    { path: "/araclar/vki-hesaplama", title: "VKİ Hesaplayıcı", desc: "Vücut kitle indeksinizi hesaplayın" },
    { path: "/araclar/kalori-hesaplama", title: "Kalori Hesaplayıcı", desc: "Günlük kalori ihtiyacınızı öğrenin" },
    { path: "/araclar/tdee-hesaplama", title: "TDEE Hesaplayıcı", desc: "Toplam günlük enerji harcamanızı hesaplayın" },
    { path: "/araclar/makro-hesaplama", title: "Makro Hesaplayıcı", desc: "Protein, karbonhidrat ve yağ oranlarınızı belirleyin" },
    { path: "/araclar/ideal-kilo-hesaplama", title: "İdeal Kilo Hesaplayıcı", desc: "Boyunuza göre ideal kilonuzu hesaplayın" },
    { path: "/araclar/vucut-yagi-orani-hesaplama", title: "Vücut Yağ Oranı", desc: "Vücut yağ yüzdenizi hesaplayın" },
    { path: "/araclar/bir-tekrar-max-hesaplama", title: "1RM Hesaplayıcı", desc: "Maksimum kaldırma kapasiteni hesaplayın" },
    { path: "/araclar/su-tuketimi-hesaplama", title: "Su İhtiyacı", desc: "Günlük su ihtiyacınızı hesaplayın" },
    { path: "/araclar/kalp-atisi-hesaplama", title: "Kalp Hızı Bölgeleri", desc: "Antrenman kalp hızı bölgelerinizi öğrenin" },
    { path: "/araclar/protein-ihtiyaci-hesaplama", title: "Protein İhtiyacı", desc: "Günlük protein ihtiyacınızı hesaplayın" },
    { path: "/araclar/dinlenme-suresi-hesaplama", title: "Dinlenme Süresi", desc: "İdeal set arası dinlenme sürenizi öğrenin" },
  ];

  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Araçlar</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Fitness Araçları</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem;">
          Antrenman ve beslenme planlaması için 11 ücretsiz hesaplayıcı. Profesyonel koçluk sistemimizde kullandığım araçları ücretsiz olarak kullanın.
        </p>
        <div style="display: grid; gap: 1rem;">
          ${tools.map(tool => `
            <a href="${tool.path}" style="display: block; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; text-decoration: none;">
              <h2 style="color: #ccff00; margin-bottom: 0.5rem;">${escapeHtml(tool.title)}</h2>
              <p style="color: #a3a3a3;">${escapeHtml(tool.desc)}</p>
            </a>
          `).join('')}
        </div>
      </main>
    </div>
  `;
}

export function renderVkiTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">VKİ Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">VKİ (Vücut Kitle İndeksi) Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Vücut Kitle İndeksi (VKİ veya BMI), boy ve kilonuza göre sağlıklı kilo aralığınızı belirlemenize yardımcı olan bir ölçüttür.
          VKİ hesaplayarak zayıf, normal kilolu, fazla kilolu veya obez kategorisinde olup olmadığınızı öğrenebilirsiniz.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Vücut Kitle İndeksi <span style="color:#ccff00">Nedir?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut Kitle İndeksi (VKİ), ya da uluslararası adıyla Body Mass Index (BMI), bir kişinin kilogram cinsinden vücut ağırlığının metre cinsinden boyunun karesine bölünmesiyle elde edilen bir ölçümdür. Formül son derece basittir: <strong style="color:#fff">VKİ = Kilo (kg) / Boy² (m²)</strong>. Örneğin 80 kg ağırlığında, 1.80 m boyunda bir kişinin VKİ değeri 80 / (1.80 × 1.80) = <strong>24.7</strong> olarak hesaplanır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu ölçüm, ilk kez 1830'lu yıllarda Belçikalı istatistikçi Adolphe Quetelet tarafından geliştirilmiş ve başlangıçta bireysel sağlık değerlendirmesi için değil, toplumların genel vücut ağırlığı dağılımını incelemek amacıyla kullanılmıştır. Quetelet İndeksi olarak bilinen bu formül, 1970'lerde Ancel Keys'in kapsamlı araştırmaları sonucunda "Vücut Kitle İndeksi" adını almış ve modern tıp dünyasında standart bir ölçüm aracı haline gelmiştir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">VKİ'nin bu denli yaygınlaşmasının temel nedeni pratikliğidir. Özel bir ekipman gerektirmez, hesaplaması dakikalar içinde tamamlanır ve tüm dünyada ortak bir referans çerçevesi sunar. Dünya Sağlık Örgütü (WHO), VKİ'yi popülasyon düzeyinde obezite ve aşırı kilo takibinde birincil gösterge olarak kabul etmektedir. Türkiye'de de aile hekimliğinden beslenme danışmanlığına, spor biliminden sigorta değerlendirmelerine kadar pek çok alanda aktif biçimde kullanılmaktadır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">VKİ hesabında kullanılan iki değişken — boy ve kilo — vücudun gerçek kompozisyonu hakkında sınırlı bilgi verse de, büyük popülasyonlarda kardiyovasküler hastalık riski, tip 2 diyabet, hipertansiyon ve bazı kanser türleriyle istatistiksel olarak anlamlı bir korelasyon göstermektedir. Bu nedenle tek başına tanı koydurucu bir araç olmasa da, kapsamlı bir sağlık değerlendirmesinin olmazsa olmaz başlangıç adımlarından biri olarak kabul görmektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesaplama yaparken dikkat edilmesi gereken birkaç nokta vardır. Boy değerini sabah ölçmek daha doğrudur çünkü gün içinde omurga hafifçe sıkışır ve boyunuz 1-2 cm azalabilir. Kilo ölçümünü ise sabah aç karnına, tercihen tuvaletten sonra yapmanız en tutarlı sonucu verecektir. Bu şekilde elde ettiğiniz VKİ değeri, zaman içindeki değişimi takip etmek için güvenilir bir baz referans noktası oluşturur.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sonuç olarak VKİ, vücut ağırlığının sağlık üzerindeki potansiyel etkisini hızla değerlendirmenin en kolay yollarından biridir. Doğru yorumlandığında, beslenme planınızı optimize etmek, hedef kilonuzu belirlemek veya sağlık profesyonelleriyle daha verimli görüşmeler yapmak için sağlam bir başlangıç noktası sağlar.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            VKİ Değerleri <span style="color:#ccff00">Ne Anlama Gelir?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">WHO'nun belirlediği standart sınıflandırmaya göre VKİ değerleri dört ana kategoriye ayrılır. Bu kategorilerin her biri, farklı sağlık risklerini ve yaşam tarzı önerilerini beraberinde getirir.
            </p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Zayıf</div>
                <div>VKİ &lt; 18.5</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Yetersiz kalori alımı, kas kaybı riski, bağışıklık sistemi zayıflığı ve kemik yoğunluğu kaybı görülebilir. Hipotiroidi, yeme bozukluğu veya kronik hastalıkların belirtisi olabilir. Öncelikle altta yatan neden araştırılmalıdır.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Normal</div>
                <div>18.5 – 24.9</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kardiyovasküler hastalık, tip 2 diyabet ve hipertansiyon riski en düşük aralıktır. Ancak bu aralıkta olmak, yüksek yağ oranı ve düşük kas kütlesine sahip "normal kilolu obez" bireyler için yanıltıcı olabilir.</p>
              </div>
              <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#facc15;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Fazla Kilolu</div>
                <div>25 – 29.9</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kronik hastalık riski yükselmeye başlar. Özellikle bel çevresi 94 cm'yi (erkek) veya 80 cm'yi (kadın) aşıyorsa risk anlamlı düzeyde artar. Kalori kısıtlaması ve düzenli egzersizle bu kategoriden çıkmak mümkündür.</p>
              </div>
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Obez</div>
                <div>VKİ ≥ 30</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Tip 2 diyabet, kalp hastalığı, uyku apnesi, eklem problemleri ve bazı kanser türleri için risk belirgin biçimde artar. Profesyonel destek alınması ve kapsamlı bir yaşam tarzı değişikliği önerilir.</p>
              </div>
            </div>

            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Yaş faktörü de VKİ yorumunu etkiler. 65 yaş ve üzeri bireylerde 22-27 arasındaki bir VKİ değeri normal kabul edilir çünkü hafif fazla kilo, yaşlılıkta oluşabilecek kas ve kemik kaybına karşı koruyucu bir etki gösterebilir. Çocuk ve ergenler için ise yaşa ve cinsiyete özgü persentil tabloları kullanılır; yetişkin kategorileri direkt uygulanamaz.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Etnik köken de göz ardı edilmemelidir. Asya kökenli bireylerde aynı VKİ değerinde kardiyovasküler risk Avrupalı bireylere kıyasla daha yüksek olduğundan, bu popülasyon için sınır değerler daha düşük tutulmaktadır (fazla kilo eşiği 23, obezite eşiği 27.5). Türk toplumunu kapsayan araştırmalar da bu eşiklerin etnik farklılığa göre yeniden değerlendirilmesi gerektiğine işaret etmektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">VKİ değerinizin sınır bölgede olduğu durumlarda (örn. 24.5 veya 25.5 gibi eşiğe yakın değerler), tek başına bu ölçümü belirleyici kabul etmemek gerekir. Bel çevresi, bel-kalça oranı ve vücut yağ yüzdesi gibi tamamlayıcı ölçümlerle bir bütün olarak değerlendirme yapmak çok daha sağlıklı bir tablo ortaya koyar.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            VKİ'yi Fitness Sürecinde <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">VKİ, fitness hedefleri koyarken kullanışlı bir başlangıç noktasıdır; ancak tek başına yeterli bir rehber değildir. Özellikle düzenli egzersiz yapan kişiler için bu ölçümün ciddi sınırlılıkları bulunur. Kas dokusu, yağ dokusuna kıyasla daha yoğundur ve daha ağırdır. Bu nedenle düzenli direnç antrenmanı yapan bir sporcu, gerçekte çok düşük bir vücut yağ yüzdesine sahip olmasına karşın VKİ hesabına göre "fazla kilolu" hatta "obez" kategorisinde yer alabilir. Ünlü bir örnek üzerinden düşünürsek: pek çok dünya güreşi şampiyonu ya da olimpik halterci, BMI hesabına göre "obez" sınırındadır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu sınırlılığı aşmak için VKİ'yi diğer ölçümlerle birlikte kullanmak gerekir. <strong style="color:#fff">Vücut yağ yüzdesi</strong> ölçümü, vücudunuzdaki yağ dokusu ile yağsız kütleyi (kas, kemik, organlar) birbirinden ayırt eder; bu nedenle fitness ilerlemenizi takip etmede çok daha anlamlı bir göstergedir. <strong style="color:#fff">Bel çevresi</strong> ölçümü ise özellikle visseral yağ (iç organ yağı) birikimini yansıtır ve kardiyovasküler risk açısından VKİ'ye göre daha güçlü bir öngörücüdür.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Pratik bir yaklaşım olarak şu üç ölçümü birlikte kullanabilirsin: VKİ, bel-kalça oranı ve kilo. Bu üç metriğin zaman içindeki değişimini aylık olarak takip etmek, vücudunun nasıl dönüştüğünü çok daha net biçimde ortaya koyar. Fotoğraf çekmek de nesnel bir geri bildirim aracı olarak bu süreci destekler.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hedef belirleme sürecinde VKİ'yi şöyle kullanabilirsin: mevcut VKİ değerine göre kaba bir yol haritası çiz, ardından bu hedefi TDEE hesabıyla birleştirerek günlük kalori hedefini belirle. Kilo vermek istiyorsan ve VKİ değerin 27'nin üzerindeyse, haftada 0.5-1 kg kayıp sağlayacak bir kalori açığı (genellikle günlük 300-500 kcal) sürdürülebilir ve sağlıklı bir stratejidir. Kas kazanımı hedefliyorsan ve VKİ değerin 18.5-22 arasındaysa, kalori fazlası ve yüksek protein alımıyla kombine bir direnç antrenmanı programı en hızlı sonucu verecektir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bir başka önemli nokta: VKİ değerinde kısa sürede dramatik değişimler beklemek gerçekçi değildir. 80 kg'dan 75 kg'a inmek, 1.75 m'lik bir kişi için VKİ değerini yalnızca yaklaşık 1.6 puan düşürür. Bu yüzden VKİ'yi haftadan haftaya değil, aylık veya üç aylık dönemlerde değerlendirmek hem motivasyonunu korumanı hem de gerçekçi beklentiler içinde kalmayı kolaylaştırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sonuç olarak VKİ; nerede durduğunu anlaman, ilerlemeyi izlemen ve hedef aralığını belirlemen için değerli bir araçtır. Ama spor performansını, kas kütleni ve gerçek sağlık durumunu yansıtmaz. En sağlıklı yaklaşım, VKİ'yi bir ön değerlendirme olarak almak ve bunu diğer ölçümler, beslenme verileri ve antrenman ilerlemenle birlikte bir bütün olarak yorumlamaktır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            VKİ Hesabının <span style="color:#ccff00">Sınırları ve Doğru Yorumlama Rehberi</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut Kitle İndeksi, 1832 yılında Belçikalı matematikçi Adolphe Quetelet tarafından geliştirilen ve bugün dünyanın en yaygın kullanılan sağlık ölçümlerinden biri olmayı sürdüren bir formüldür. Ancak Quetelet bu formülü bireysel sağlık değerlendirmesi için değil, nüfus istatistikleri için tasarlamıştı. Bu önemli tarihsel bağlamı göz önünde bulundurduğumuzda, VKİ'nin hem güçlü hem de zayıf yönlerini çok daha net biçimde anlayabiliriz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">VKİ Neden Her Zaman Yeterli Değil?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">VKİ'nin en temel sorunu, vücut ağırlığını oluşturan bileşenleri ayırt edememesidir. Kas dokusu, yağ dokusundan çok daha yoğundur; bu nedenle yüksek kas kütlesine sahip bir atlet, aynı boydaki hareketsiz bir bireyle aynı VKİ değerini paylaşabilir. Dünya Sağlık Örgütü sınıflandırmasına göre "obez" kategorisine giren bir powerlifting sporcusu, gerçekte yüzde 12 vücut yağıyla son derece sağlıklı bir tabloya sahip olabilir. Bu nedenle VKİ, kas kütlesi yüksek bireyler için yanıltıcı sonuçlar üretir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Yaş da VKİ yorumlamada önemli bir faktördür. İleri yaşlarda kemik yoğunluğu azalırken kas kütlesi düşer; bu durum, gerçek vücut yağ yüzdesinin VKİ'nin öngördüğünden çok daha yüksek olmasına yol açabilir. 65 yaş üzeri bireylerde normal kabul edilen VKİ aralığının biraz daha geniş tutulması (22-27 arası) klinik pratikle daha uyumludur.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Etnik köken de VKİ eşiklerini etkiler. Asya kökenli bireyler için kronik hastalık riski, standart Batı normlarına göre daha düşük VKİ değerlerinde başlar. Dünya Sağlık Örgütü, Asya popülasyonu için "aşırı kilo" sınırını 25 yerine 23 olarak önermektedir. Bu farkı bilmek, özellikle farklı etnik geçmişlere sahip bireyler için doğru risk değerlendirmesi açısından hayati önem taşır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">VKİ ile Birlikte Kullanılması Gereken Ölçümler</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sağlık riskini daha doğru değerlendirmek için VKİ'yi tek başına kullanmak yerine şu ölçümlerle birleştirmek önerilir: Bel çevresi ölçümü (erkeklerde 94 cm, kadınlarda 80 cm üzeri risk sinyali verir), bel-kalça oranı (visseral yağ birikimini gösterir), vücut yağ yüzdesi (en doğru kompozisyon bilgisini sunar) ve kan biyomarkerları (trigliserid, HDL, insülin direnci). Bu dört ölçüm, VKİ ile birlikte değerlendirildiğinde çok daha kapsamlı ve güvenilir bir sağlık tablosu ortaya çıkar.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Sık Sorulan Sorular: VKİ Kaç Olmalı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Arama motorlarında en çok sorulan soruların başında "kaç kiloda hangi VKİ değeri normal sayılır?" sorusu gelir. Türkiye'de 170 cm boyunda bir erkek için sağlıklı kilo aralığı 53-72 kg (VKİ 18.5-24.9) olarak hesaplanır. 165 cm boyundaki bir kadın içinse bu aralık 50-68 kg'a karşılık gelir. Ancak bu rakamlar yalnızca istatistiksel ortalamaları yansıtır; bireysel sağlık durumu, yaş ve vücut yapısı bu aralıkları önemli ölçüde değiştirebilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Öte yandan "VKİ 25 fazla kilolu sayılır mı?" sorusu da sıkça karşılaşılan bir sorundur. Teknik olarak evet; ancak bu etiket, bağlamdan koparıldığında yanıltıcı olabilir. Düzenli egzersiz yapan, kan değerleri normal olan ve bel çevresi ideal sınırlar içinde olan bir bireyin VKİ'si 25-27 arasında olsa bile gerçek sağlık riski son derece düşük olabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sonuç olarak VKİ, sağlığın bir fotoğrafını değil yalnızca bir ipucunu sunar. En doğru değerlendirme; VKİ, vücut yağ yüzdesi, bel çevresi ve yaşam tarzı alışkanlıklarının bir bütün olarak ele alınmasıyla mümkündür. Bu hesap makinesini düzenli olarak kullanarak zaman içindeki değişimlerinizi takip etmek, anlık bir ölçümden çok daha değerli bilgiler sağlayacaktır.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderCalorieTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Kalori Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Günlük Kalori İhtiyacı Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Yaşınız, cinsiyetiniz, boyunuz, kilonuz ve aktivite seviyenize göre günlük kalori ihtiyacınızı hesaplayın.
          Kilo verme, koruma veya alma hedeflerinize uygun kalori hedefi belirleyin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kalori <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalori, besinlerin içerdiği enerji miktarını ifade eden bir birimdir. Teknik tanımıyla bir kilokalori (kcal), bir litre suyu 1°C ısıtmak için gereken enerji miktarına eşittir. Beslenme dünyasında "kalori" derken aslında hep kilokalori'den bahsedilir; etiketlerde "200 kalori" yazan bir ürün, fizik açısından 200 kilokalori enerji içermektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücudunuz her an enerji harcar — nefes alırken, uyurken, düşünürken ve hareket ederken. Bu enerji kaynağını besinlerden sağlarsınız. Karbonhidratlar ve proteinler gram başına yaklaşık 4 kcal, yağlar ise 9 kcal enerji sağlar. Alkol gram başına 7 kcal ile besin değeri neredeyse sıfır olan ama enerji yoğunluğu yüksek bir madde olarak öne çıkar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesinde kullandığımız formül <strong style="color:#fff">Mifflin-St Jeor denklemdir</strong>. 1990 yılında geliştirilen ve bilimsel literatürde en doğru sonuçları verdiği kanıtlanan bu formül, günümüzde diyetisyenler ve spor bilimciler tarafından altın standart olarak kabul görmektedir. Formül şu şekilde çalışır:
            </p>
            <div>
              <div>Mifflin-St Jeor Denklemi</div>
              <div><span style="color:#ccff00">Erkek:</span> BMR = (10 × kilo) + (6.25 × boy) − (5 × yaş) + 5</div>
              <div><span>Kadın:</span> BMR = (10 × kilo) + (6.25 × boy) − (5 × yaş) − 161</div>
            </div>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu denklem önce <strong style="color:#fff">Bazal Metabolizma Hızı'nı (BMR)</strong> verir. BMR; tamamen dinlenme halindeyken, hiçbir şey yemeden ve en temel yaşamsal fonksiyonları sürdürmek için vücudun tükettiği kalori miktarıdır. Kalp atışı, solunum, vücut ısısını koruma, sinir sistemi aktivitesi ve hücre yenilenmesi gibi süreçler bu enerjiyi tüketir. Çoğu yetişkin için BMR, toplam günlük enerji harcamasının yüzde 60 ila 75'ini oluşturur.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Mifflin-St Jeor'dan önce yaygın kullanılan Harris-Benedict denklemi (1919) de benzer mantıkla çalışır ancak modern araştırmalar Mifflin-St Jeor'un gerçek ölçümlerle daha yüksek korelasyon gösterdiğini ortaya koymuştur. Özellikle 10 kg'dan fazla fazla kilosu olan bireylerde doğruluk farkı belirginleşmektedir. Bu yüzden günümüzde Mifflin-St Jeor tercih edilmektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesaplama sırasında doğru veriler girmeniz sonucun güvenilirliğini doğrudan etkiler. Kilo ölçümünüzü sabah aç karnına, boy ölçümünüzü ise düz bir zeminde dik dururken yapmanız önerilir. Aktivite seviyesini belirlerken dürüst olmak da kritik öneme sahiptir; pek çok kişi aktivite seviyesini olduğundan yüksek seçerek kalori ihtiyacını abartır ve bu da kilo kontrolünü zorlaştırır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            BMR ve TDEE <span style="color:#ccff00">Ne Anlama Gelir?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesap makinesi size üç temel değer sunar: BMR, TDEE ve hedef kalori. Bu üç değeri doğru anlamak, beslenme planınızı gerçekten işe yarar hale getirir.
            </p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#facc15;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">BMR</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">Bazal Metabolizma Hızı</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Tamamen yatakta, hiç hareket etmeden, aç karnına yaşamak için gereken minimum kalori. Uyurken bile bu kadar kalori yakarsınız. Vücudunuzun "rölantide" tükettiği enerjidir.</p>
              </div>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">TDEE</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">Toplam Günlük Enerji Harcaması</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">BMR'nin aktivite çarpanıyla çarpılmasıyla elde edilir. Günlük tüm hareketlerinizi, egzersizinizi ve yaşam aktivitenizi kapsar. Kilonuzu korumak için alması gereken kaloridir.</p>
              </div>
              <div style="background:rgba(204,255,0,0.1);border:1px solid rgba(204,255,0,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#ccff00;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Hedef Kalori</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">Hedefinize Göre Ayarlı</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">TDEE'den hedefinize göre kalori eklenip çıkarılır. Kilo vermek için −500 kcal, kilonuzu korumak için ±0, kas kazanmak için +300 kcal uygulanır.</p>
              </div>
            </div>

            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Aktivite çarpanları şu şekilde belirlenir: <strong style="color:#fff">Hareketsiz (1.2)</strong> yalnızca masa başı çalışanlar için, <strong style="color:#fff">Hafif Aktif (1.375)</strong> haftada 1-2 gün hafif egzersiz yapanlar için, <strong style="color:#fff">Orta Aktif (1.55)</strong> haftada 3-5 gün antrenman yapanlar için, <strong style="color:#fff">Çok Aktif (1.725)</strong> haftada 6-7 gün yoğun çalışanlar için, <strong style="color:#fff">Ekstra Aktif (1.9)</strong> ise fiziksel iş yapan ya da günde iki kez antrenman yapanlar için geçerlidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kilo verme hedefinde uygulanan <strong style="color:#fff">−500 kcal</strong> açığı, teorik olarak haftada yaklaşık 0.45 kg yağ kaybına karşılık gelir (1 kg yağ ≈ 7.700 kcal). Bu tempo hem sürdürülebilir hem de kas kütlesini büyük ölçüde koruyan bir hızdır. Bunun iki katı olan −1000 kcal açığı daha hızlı kilo kaybına yol açsa da kas kaybı, metabolizma yavaşlaması ve besin eksikliği riski beraberinde gelir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kas kazanımı için uygulanan <strong style="color:#fff">+300 kcal</strong> fazlası ise kasın büyümesi için gereken anabolik ortamı yaratır. Daha büyük fazlalar (500+ kcal) kas gelişimini anlamlı biçimde hızlandırmaz, yalnızca yağ birikimini artırır. Bu yüzden "temiz bulk" stratejisinde 200-400 kcal fazlası altın aralık olarak kabul edilir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kalori Hedefini Fitness'ta <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalori hesabını bilmek ile onu günlük hayata uygulamak arasında önemli bir fark vardır. Hesap makinenizden aldığınız değer bir başlangıç noktasıdır — vücudunuzun gerçek tepkisine göre birkaç hafta içinde ince ayar yapmanız gerekebilir. Bunun nedeni formüllerin istatistiksel ortalamalardan türetilmiş olmasıdır; bireysel metabolizma hızları gerçekte hesaplanan değerden yüzde 10-20 oranında farklılık gösterebilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Pratik bir yaklaşım olarak şu adımları uygulayabilirsiniz: İlk iki hafta hesaplanan kalori hedefiyle beslenin ve kilonuzdaki değişimi takip edin. Beklenen hızda (haftada 0.3-0.5 kg) kilo vermiyorsanız kaloriyi 100-150 kcal daha düşürün. Öte yandan sürekli yorgunluk, uyku bozukluğu veya performans düşüşü yaşıyorsanız kaloriyi 100-200 kcal artırmayı deneyin. Bu "adaptif kalibrasyon" yaklaşımı, körü körüne bir sayıya bağlı kalmaktan çok daha etkili sonuçlar verir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalori saymak bir zorunluluk mu? Kesinlikle değil. Ancak en azından birkaç hafta boyunca yediğiniz besinlerin kalori değerini takip etmek, porsiyon boyutları ve besin yoğunluğu konusunda kalıcı bir sezgi geliştirir. Bu sezgiyi bir kez kazandığınızda, hassas takip yapmadan da hedefinize yakın beslenebilirsiniz. Beslenme uygulamaları (MyFitnessPal, Cronometer gibi) bu süreci önemli ölçüde kolaylaştırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalori hedefi belirledikten sonra bir sonraki adım <strong style="color:#fff">makro dağılımını planlamaktır</strong>. Aynı kalori miktarını çok farklı makro oranlarıyla karşılayabilirsiniz; bu oranlar vücut kompozisyonunuzu doğrudan etkiler. Kas kazanırken yüksek protein (vücut ağırlığının kilogramı başına 1.6-2.2 g), kilo verirken yeterli protein (1.8-2.5 g/kg) kas kütlesini korumak için kritiktir. Karbonhidrat ve yağ dağılımı ise kişisel tercih, antrenman tipi ve tıbbi duruma göre esnek şekilde ayarlanabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak şunu vurgulamak gerekir: Kalori dengesi kilo kontrolünün en temel prensibi olsa da tek belirleyici faktör değildir. Uyku kalitesi, stres hormonu kortizol, bağırsak mikrobiyomunu, besin kalitesi ve hormon dengesi de vücut kompozisyonunu etkileyen önemli değişkenlerdir. Bu yüzden kalori hedefine ulaşıyor olmanıza rağmen beklenen sonucu görmüyorsanız, bu diğer faktörleri de gözden geçirmeniz gerektiğinin işaretidir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kalori Sayarken <span style="color:#ccff00">Yapılan En Yaygın Hatalar ve Çözümleri</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalori takibi, vücut kompozisyonu hedeflerine ulaşmanın en güvenilir yollarından biridir. Ancak araştırmalar, çoğu insanın yediklerini yüzde 20-50 oranında olduğundan az, fiziksel aktivitelerini ise yüzde 30-50 oranında fazla tahmin ettiğini ortaya koymaktadır. Bu sistematik sapma, kalori hesabından beklenen sonuçların alınamamasının başlıca nedenidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kalori Takibinde En Sık Yapılan 5 Hata</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">1. Pişirme yağını ve sosları hesaba katmamak:</strong> Bir yemek kaşığı zeytinyağı 120 kalori içerir. Günde üç-dört kaşık kullanım, fark edilmeksizin 360-480 kalori ekler. Çoğu kalori takip uygulaması bu "gizli kalorileri" atlamayı kolaylaştırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">2. Porsiyon boyutlarını göz kararı tahmin etmek:</strong> Yapılan araştırmalar, insanların porsiyon boyutlarını ortalama yüzde 25-50 oranında küçümsediğini göstermektedir. Özellikle yüksek kalorili yoğun besinlerde (kuruyemişler, peynir, tahıllar) bu yanılsama çok belirginleşir. Mutfak terazisi kullanmak, bu hatayı en aza indiren en etkili yöntemdir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">3. Sıvı kalorileri görmezden gelmek:</strong> Meyve suları, süt, sporcu içecekleri, alkol ve şekerli çaylar önemli kalori yükleri taşır ama çoğu kişi bunları "yemek" olarak değerlendirmez. 250 ml portakal suyu yaklaşık 110 kalori içerirken bütün portakal 62 kalori ve çok daha fazla lif sağlar. Sıvı kalorileri, toplam günlük alımı sessizce yüzde 15-20 artırabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">4. Egzersiz kalorilerini çift saymak:</strong> Fitness cihazları ve uygulamaları egzersiz kalori hesaplamalarında yüzde 30-100 arasında değişen abartılı değerler üretebilir. Bu değerlere güvenip "egzersiz yaptım, daha fazla yiyebilirim" mantığıyla hareket etmek, kalori açığını tamamen ortadan kaldırabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">5. Hafta sonu kalorilerini hafta içiyle dengelememek:</strong> Araştırmalar, insanların hafta içi oluşturdukları kalori açığının büyük bölümünü hafta sonu yedikleriyle kapattığını göstermektedir. Haftalık ortalama kalori alımı, günlük takipten çok daha anlamlı bir göstergedir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kilo Vermek İçin Günde Kaç Kalori Yenilmeli?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu, Türkiye'de en çok aranan fitness sorularından biridir. Genel yanıt şudur: TDEE'nizden 300-500 kalori düşük yemek, sürdürülebilir ve kas koruyucu bir kilo kaybı sağlar. 70 kg, orta aktif yaşam süren 30 yaşında bir kadın için bu yaklaşık 1500-1700 kcal/gün anlamına gelir. 80 kg, orta aktif 30 yaşında bir erkek için ise 2000-2200 kcal/gün civarındadır. Bunlar yalnızca başlangıç noktalarıdır; gerçek değer bireyden bireye değişir ve 2-3 haftalık kilo takibiyle kalibre edilmelidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kalori Açığı Ne Kadar Olmalı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Çok az yersen metabolizma yavaşlar" — bu yaygın ifadenin arkasında gerçek bir fizyolojik mekanizma yatmaktadır. Günlük 500 kalorininin üzerindeki açıklar, vücudun adaptif termogenezisini tetikler ve enerji harcamasını düşürür. Bu nedenle büyük kalori kısıtlamaları kısa vadede hızlı kilo kaybı verse de orta ve uzun vadede sonuçlar çoğunlukla hayal kırıklığı yaratır. 250-500 kcal arası bir günlük açık, hem sürdürülebilir hem de metabolizmanın korunması açısından bilimsel olarak desteklenen optimal aralığı temsil eder.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesini düzenli olarak kullanarak her 4-6 haftada bir kalori hedeflerinizi güncellemenizi öneririz. Kilo değiştikçe TDEE de değişir; dolayısıyla başlangıçta belirlenen kalori hedefi zamanla optimal olmaktan çıkar ve yeniden hesaplanması gerekir.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderTdeeTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">TDEE Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">TDEE Hesaplayıcı — Toplam Günlük Enerji Harcaması</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Toplam Günlük Enerji Harcaması (TDEE), gün boyunca yaktığınız toplam kalori miktarıdır.
          Bu değer bazal metabolizma hızınız ve aktivite seviyenizin birleşiminden oluşur.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            TDEE <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE, İngilizce "Total Daily Energy Expenditure" ifadesinin kısaltmasıdır ve Türkçeye <strong style="color:#fff">Toplam Günlük Enerji Harcaması</strong> olarak çevrilir. Adından da anlaşılacağı gibi, bir günde vücudunuzun tüm aktiviteleri için harcadığı toplam kalori miktarını ifade eder. Bu değer yalnızca egzersizi değil; dinlenirken, iş yaparken, yemek yerken ve uyurken harcanan enerjiyi de kapsar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE'nin hesaplanması iki aşamadan oluşur. İlk aşamada <strong style="color:#fff">Bazal Metabolizma Hızı (BMR)</strong> hesaplanır. BMR, vücudun tamamen dinlenme halindeyken temel yaşamsal fonksiyonları — kalp atışı, solunum, vücut ısısı, sinir sistemi ve hücre yenilenmesi — için harcadığı enerjidir. Hesap makinemizde BMR için Mifflin-St Jeor denklemi kullanılmaktadır: erkekler için BMR = (10 × kilo) + (6.25 × boy) − (5 × yaş) + 5, kadınlar için ise bu formüle −161 eklenir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İkinci aşamada BMR değeri bir <strong style="color:#fff">aktivite çarpanıyla</strong> çarpılır. Bu çarpan, günlük hareketlilik düzeyinizi yansıtır. Aktivite çarpanları şu şekildedir: masa başı hareketsiz yaşam için 1.2, haftada 1-3 gün hafif egzersiz için 1.375, haftada 3-5 gün orta yoğunlukta egzersiz için 1.55, haftada 6-7 gün yoğun antrenman için 1.725 ve fiziksel iş ile günde iki kez antrenman kombinasyonu için 1.9 kullanılır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE kavramı beslenme biliminde 1919'larda Harris ve Benedict'in çalışmalarına dayanır; ancak modern dünklemler çok daha fazla değişkeni hesaba katar. Günümüzde Mifflin-St Jeor (1990) ile Katch-McArdle (vücut yağ yüzdesini kullanan) denklemleri en yaygın ve doğru hesaplama yöntemleri olarak kabul görmektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE ile kalori ihtiyacı arasındaki farka dikkat etmek gerekir. TDEE, kilonuzu <em>korumak</em> için tüketmeniz gereken kalori miktarını gösterir. Kilo vermek için bunun altında, kilo almak ya da kas kazanmak için ise üzerinde kalori tüketmeniz gerekir. Bu temel denge, beslenme planlamasının ve vücut kompozisyonu çalışmalarının temelidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesaplama yaparken aktivite seviyenizi olduğundan yüksek seçmek çok yaygın yapılan bir hatadır. Haftada 4 gün antrenman yapıyor olsanız bile, günün geri kalanını masa başında geçiriyorsanız "orta aktif" kategorisi gerçeği en iyi yansıtan seçenek olacaktır. Aktivite seviyesini abartmak, kalori dengesini bozar ve hedeflere ulaşmayı zorlaştırır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            TDEE Sonuçlarını <span style="color:#ccff00">Nasıl Yorumlamalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesap makinesi size dört farklı hedef için kalori değeri sunar. Bu değerlerin her biri farklı bir vücut kompozisyonu stratejisine karşılık gelir ve doğru seçim, hedefinize ve mevcut fiziksel durumunuza göre değişir.
            </p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Hızlı Kilo Verme</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">TDEE − 500 kcal</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Haftada yaklaşık 0.45 kg kilo kaybına yol açar. Motivasyonu yüksek tutar ancak uzun vadede kas kaybı ve metabolizma yavaşlaması riski taşır. Kısa süreli müdahaleler için uygundur.</p>
              </div>
              <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#facc15;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Yavaş Kilo Verme</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">TDEE − 250 kcal</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Haftada 0.2-0.3 kg kayıp. Kas kütlesini en iyi koruyan, sürdürülebilir ve uzun vadeli tercih. Yeni başlayanlar ve uzun süreli diyet geçmişi olanlar için ideal başlangıç noktasıdır.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Yavaş Kas Yapma</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">TDEE + 250 kcal</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Temiz bulk olarak bilinen bu strateji minimum yağ depolarken kas gelişimine olanak sağlar. Vücut yağ oranı %15-20 (erkek) veya %22-27 (kadın) üzerindeyse önerilen yaklaşımdır.</p>
              </div>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Hızlı Kas Yapma</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">TDEE + 500 kcal</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Daha agresif bir fazla kalori stratejisi. Kas gelişimini biraz hızlandırır ancak yağ birikimini de artırır. İnce yapılı, zor kilo alan bireylere daha uygundur.</p>
              </div>
            </div>

            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE değeriniz yaşa, vücut kompozisyonuna ve antrenman geçmişinize göre önemli ölçüde değişir. Kas dokusu, yağ dokusuna kıyasla dinlenirken daha fazla kalori yakar. Bu yüzden kas kütlesi yüksek birinin TDEE'si, aynı kiloda ancak daha fazla vücut yağı olan birine göre belirgin şekilde daha yüksektir. Bu fark özellikle 10+ yıl direnç antrenmanı yapan sporcular için günlük 300-500 kcal'a kadar ulaşabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kadınlarda TDEE döngüsel hormonal değişimler nedeniyle ay içinde farklılık gösterebilir. Luteal fazda (ovülasyondan âdete kadar) BMR yaklaşık 100-300 kcal artabilir; bu dönemde açlık hissinin artması tamamen fizyolojik bir tepkidir ve irade eksikliğiyle açıklanamaz.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            TDEE'yi Fitness Planında <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE, bir fitness planının merkezinde yer alması gereken değerdir. Antrenman programı ne kadar iyi yazılmış olursa olsun, kalori dengesi doğru kurulmadan vücut kompozisyonunda anlamlı değişimler elde etmek son derece güçtür. TDEE'yi bir "sıfır noktası" olarak düşünebilirsiniz: bu değerin altında kalırsanız kilo verirsiniz, üzerinde çıkarsanız kilo alırsınız.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Pratikte TDEE'nin gerçek bir araç olarak çalışabilmesi için onu <strong style="color:#fff">refeeding stratejisiyle</strong> birleştirmek önerilir. Kalori kısıtlaması sürecinde metabolizma zamanla uyum sağlar ve enerji harcaması düşebilir; bu olguya "metabolik adaptasyon" denir. Bunu önlemek için her 8-12 haftada bir 1-2 haftalık ara verme ya da TDEE seviyesine çıkma dönemleri planlanabilir. Bu strateji hem metabolizmayı canlı tutar hem de psikolojik yükü azaltır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE değerinizin ne kadar doğru olduğunu anlamak için en iyi yöntem <strong style="color:#fff">iki haftalık kilo takibi</strong> yapmaktır. Hesaplanan TDEE kadar yiyin ve kilonuzun nasıl değiştiğini gözlemleyin. Kilo sabit kalıyorsa hesap doğrudur. Her hafta artıyorsa gerçek TDEE'niz hesaplananın altındadır; düşüyorsa üstündedir. Bu kişisel kalibrasyon, formül tabanlı hesaplamanın öngöremediği bireysel metabolizma farklarını ortaya çıkarır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE'yi antrenman döngülerinize göre dinamik olarak ayarlamak da büyük fark yaratır. Yoğun antrenman dönemlerinde (hacim fazı, yarışma hazırlığı vb.) kalori ihtiyacı artarken, aktif dinlenme ya da deload haftalarında düşer. Sabit bir kalori hedefine takılı kalmak yerine, haftalık antrenman yüküyle paralel bir beslenme yaklaşımı benimsemek hem performansı hem de vücut kompozisyonu sonuçlarını iyileştirir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak TDEE hesabını <strong style="color:#fff">makro hesaplayıcısıyla birlikte kullanmayı</strong> öneririz. Toplam kalori hedefinizi belirledikten sonra bu kalorileri protein, karbonhidrat ve yağ olarak nasıl dağıtacağınızı belirlemek, özellikle kas koruma ve kas kazanımı süreçlerinde kritik önem taşır. TDEE size "ne kadar yiyeceğini", makro dağılımı ise "ne yiyeceğini" söyler; ikisi birlikte tam bir beslenme stratejisi oluşturur.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            TDEE Hakkında <span style="color:#ccff00">Doğru Bilinen Yanlışlar ve Sık Sorulan Sorular</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Günde kaç kalori yakmalıyım?" sorusu, internet üzerinde en çok aranan beslenme sorularından biridir. Cevap kişisel TDEE değerine bağlıdır ve bu değer sanıldığından çok daha kişiseldir. İki kişi aynı boy, kilo ve yaşa sahip olsa bile TDEE değerleri günlük 200-400 kcal farklı olabilir; bu farkı yaratan faktörler arasında genetik, kas kütlesi, hormonal durum ve geçmiş diyet geçmişi sayılabilir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">TDEE Hakkında En Çok Sorulan Sorular</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">TDEE ile BMR arasındaki fark nedir?</strong> BMR (Bazal Metabolizma Hızı), vücudun tamamen dinlenme halindeyken harcadığı kaloriyi ifade eder. TDEE ise BMR'ın tüm günlük fiziksel aktivitelerle çarpılmış halidir. TDEE her zaman BMR'dan büyüktür. Hareketsiz bir yaşam süren biri için TDEE ≈ BMR × 1.2 iken, çok aktif biri için TDEE ≈ BMR × 1.7-1.9'a çıkabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">TDEE her gün aynı mı kalır?</strong> Hayır. Günlük TDEE, aktivite düzeyine bağlı olarak önemli ölçüde dalgalanır. Aktif bir antrenman gününde TDEE, dinlenme gününe kıyasla 300-800 kcal daha yüksek olabilir. Bu nedenle sabit bir kalori hedefi belirlemek yerine, bazı programlarda antrenman ve dinlenme günleri için farklı kalori hedefleri kullanılır; bu yaklaşım "kalori döngüsü" (calorie cycling) olarak bilinir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">TDEE hesabı ne kadar doğrudur?</strong> En iyi formüller bile gerçek değerden yüzde 10-15 sapabilir. Bu sapma; bireysel metabolik hız farklılıklarından, bağırsak mikrobiyomundan, hormonal profilden ve ölçülemez günlük aktivitelerden kaynaklanır. Bu yüzden TDEE hesabını bir başlangıç noktası olarak kullanıp iki-üç haftalık kilo takibiyle kişiselleştirmek, formülü körü körüne uygulamaktan çok daha etkilidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Metabolik Adaptasyon: Neden Zaman İçinde Kilo Kaybı Yavaşlar?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Uzun süreli kalori kısıtlamasında vücut, enerji harcamasını düşürerek yeni koşullara adapte olur. Bu olgu "metabolik adaptasyon" ya da "adaptif termogenez" olarak adlandırılır. Bir çalışma, 6 aylık kilo verme programının ardından katılımcıların dinlenme metabolizma hızının öngörülenden günlük 100-300 kcal daha az olduğunu ortaya koymuştur. Bu, yalnızca kilo kaybından değil, fizyolojik bir uyum mekanizmasından kaynaklanmaktadır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Metabolik adaptasyonla başa çıkmanın en etkili yolu "diyet molası" vermektir. Belirli aralıklarla (her 8-12 haftada bir) TDEE seviyesine çıkmak, leptin hormonunu yenileyerek metabolizmayı canlandırır. Bu stratejinin uzun vadeli kilo yönetiminde çok daha sürdürülebilir sonuçlar verdiğini gösteren araştırmalar giderek çoğalmaktadır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">TDEE'yi Artırmanın Kanıtlanmış Yolları</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">TDEE doğuştan sabit değildir; yaşam tarzı seçimleriyle önemli ölçüde artırılabilir. Direnç antrenmanı kas kütlesini artırarak dinlenme metabolizmasını yükseltir; her ekstra kilogram kas dokusu günlük yaklaşık 13-15 kcal ek enerji tüketimine katkı sağlar. Günlük NEAT (antrenman dışı fiziksel aktivite) artırmak da TDEE üzerinde şaşırtıcı büyük etkiler yaratabilir; ofis çalışanlarında standı masa kullanımı, merdiven tercihi ve yürüyüş araları günlük ek 300-500 kcal anlamına gelebilir. Uyku kalitesini iyileştirmek ise büyüme hormonu üretimini artırarak metabolizma hızını destekler.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderMacroTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Makro Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Makro Besin Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize uygun makro besin
          dağılımını öğrenerek beslenme planınızı optimize edin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Makro Besinler <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro besinler ya da kısaca "makrolar", vücudun enerji ve yapı taşı olarak kullandığı üç temel besin grubunu ifade eder: <strong style="color:#fff">protein, karbonhidrat ve yağ</strong>. Her birinin farklı işlevleri, farklı enerji değerleri ve vücut kompozisyonu üzerinde farklı etkileri vardır. Kalori saymak "ne kadar yiyeceğini" söylerken, makro takibi "ne yiyeceğini" belirler.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Enerji değerleri açısından: <strong style="color:#fff">Protein ve karbonhidrat</strong> gram başına 4 kcal, <strong style="color:#fff">yağ</strong> ise gram başına 9 kcal sağlar. Bu fark, aynı kalori miktarını farklı gramaj kombinasyonlarıyla karşılayabileceğiniz anlamına gelir. Örneğin 2000 kcal'lik bir plan; 200g protein (800 kcal) + 175g karbonhidrat (700 kcal) + 55g yağ (500 kcal) şeklinde düzenlenebilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro hesaplaması üç adımda gerçekleşir. Önce TDEE belirlenir, ardından hedefe göre (kilo verme, koruma veya kas kazanımı) toplam kalori ayarlanır. Son adımda bu kalori miktarı üç makroya dağıtılır. Bu hesap makinesi bu dağılımı otomatik olarak yapar ve size gram cinsinden günlük protein, karbonhidrat ve yağ hedeflerinizi gösterir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro dağılımının temelinde <strong style="color:#fff">protein önceliği</strong> ilkesi yatar. Günümüz spor beslenme araştırmaları, optimum kas gelişimi ve korunması için vücut ağırlığının kilogramı başına 1.6 ila 2.2 gram protein tüketimini önermektedir. Kalori kısıtlaması dönemlerinde bu aralığın üst sınırına çıkmak (2.2-2.5 g/kg), kas kaybını minimize etmeye yardımcı olur. Protein hedefi belirlendikten sonra kalan kalori, karbonhidrat ve yağ arasında kişisel tercih ve metabolik yanıta göre paylaştırılır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesap makinesinde seçebileceğiniz hazır makro şablonları, kanıta dayalı farklı beslenme yaklaşımlarını temsil eder. Dengeli beslenme için standart oranlar uygulanırken, düşük karbonhidrat veya ketojenik seçenekler karbonhidratı dramatik biçimde düşürüp yağı artırır. Yüksek protein şablonu ise protein oranını maksimuma çıkararak özellikle kesim dönemlerinde kas korumayı ön plana alır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro hesabının formüller üzerinden yapılan teorik bir çalışma olduğunu ve gerçek uygulama sırasında ince ayara ihtiyaç duyulabileceğini hatırlatmak gerekir. İki-üç haftalık takip sonucunda performansınızı, enerjinizi ve vücut ağırlığı değişiminizi değerlendirip gerekirse karbonhidrat ve yağ dağılımını revize edebilirsiniz. Protein hedefi ise genel olarak sabit tutulur.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Her Makronun <span style="color:#ccff00">Vücuttaki Rolü</span>
          </h2>
          <div style="margin-top:1rem">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Protein</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">4 kcal / gram</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kas dokusu, enzimler, hormonlar ve bağışıklık proteinlerinin yapı taşıdır. Doygunluk hissini en uzun süre sağlayan makrodur. Termik etkisi en yüksek olan besin grubudur; sindirimi için harcanan enerji, alınan kalorinin yüzde 20-30'una ulaşabilir.</p>
              </div>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Karbonhidrat</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">4 kcal / gram</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Beynin ve kasların tercih ettiği yakıt kaynağıdır. Glikojen olarak kaslarda depolanan karbonhidrat, yoğun egzersiz performansının temelini oluşturur. Lifli karbonhidratlar bağırsak sağlığını destekler ve kan şekerini dengeler.</p>
              </div>
              <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#facc15;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Yağ</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">9 kcal / gram</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Hormon üretimi (özellikle testosteron ve östrojen) için vazgeçilmezdir. Yağda çözünen vitaminlerin (A, D, E, K) emilimini sağlar. Uzun süreli düşük yoğunluklu aktiviteler için önemli bir enerji kaynağıdır. Minimum yüzde 20 yağ alımının altına düşmek hormon dengesini bozabilir.</p>
              </div>
            </div>

            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro dağılımı hedefe göre önemli ölçüde değişir. <strong style="color:#fff">Kas kazanımında (bulk)</strong> karbonhidrat antrenman performansı için yüksek tutulurken, protein kas sentezi için yeterli düzeyde kalır. <strong style="color:#fff">Yağ yakarken (cut)</strong> karbonhidrat azaltılır, protein artırılır; böylece kalori açığında kas korunur. <strong style="color:#fff">Vücudu koruma döneminde</strong> ise dengeli ve sürdürülebilir bir dağılım tercih edilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro takibine yeni başlayanlar için pratik bir başlangıç noktası şöyledir: önce protein hedefini kilogram başına 2 gram olarak sabitleyin. Kalan kalorileri yaklaşık yüzde 50 karbonhidrat ve yüzde 25-30 yağ şeklinde dağıtın. Bu standart dengeli profil, çoğu kişi için güvenli ve etkin bir başlangıç noktasıdır; ilk birkaç hafta içinde kişisel yanıtınıza göre ince ayar yapabilirsiniz.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makrolar kadar önemli olan bir konu da <strong style="color:#fff">besin kalitesidir</strong>. Aynı protein gramına ulaşmak için işlenmiş et ürünleri veya yüksek kaliteli tam gıdalar (yumurta, tavuk, baklagiller) tercih etmek; sindirim, hormonal denge ve genel sağlık üzerinde çok farklı sonuçlar doğurur. Makro takibi yalnızca miktarla değil, kaynaklarla birlikte düşünüldüğünde gerçek anlamını kazanır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Makroları Fitness Sürecinde <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro takibini pratiğe dökmek, ilk başta karmaşık görünebilir. Ancak birkaç temel ilkeyi benimsemek bu süreci önemli ölçüde sadeleştirir. İlk ve en kritik adım, hesaplanan makro hedeflerinizi bir beslenme takip uygulamasına (MyFitnessPal, Cronometer veya benzeri) girerek günlük öğünlerinizi kaydetmektir. İlk 2-3 haftada bu alışkanlığı oturtmak, uzun vadede çok daha bilinçli beslenme kararları almanızı sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro takibinde esneklik büyük önem taşır. <strong style="color:#fff">Esnek Diyet (IIFYM — If It Fits Your Macros)</strong> yaklaşımı, herhangi bir besini makro hedeflerine uyduğu sürece tüketmeyi mümkün kılar. Bu yaklaşım, sosyal etkinliklerde ve yemek dışarıda yenildiğinde beslenmeyi yönetmeyi kolaylaştırır. Mükemmeliyetçi bir yaklaşım yerine "yüzde seksen kuralı" daha sürdürülebilirdir: hedeflerin yüzde seksenine ulaşmak, tam hedeften sapmayı kurtarmaktan çok daha iyidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Antrenman zamanlamasına göre karbonhidrat dağılımını optimize etmek de bir sonraki adımdır. <strong style="color:#fff">Antrenman öncesi</strong> (1-2 saat önce) kompleks karbonhidrat ağırlıklı bir öğün, egzersiz performansını destekler. <strong style="color:#fff">Antrenman sonrası</strong> (ilk 30-60 dakika içinde) hızlı karbonhidrat ve protein kombinasyonu kas glikojen depolarını yeniler ve iyileşme sürecini hızlandırır. Bu strateji, özellikle yüksek hacimli ya da iki günlük antrenmanlarda belirgin fark yaratır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro hesabınızı belirli aralıklarla güncellemek de önemlidir. Vücut ağırlığınız değiştikçe (her 5 kg'da bir veya her 4-6 haftada bir) makro hedeflerinizi yeniden hesaplamak, beslenme planınızın mevcut fiziksel durumunuza uygun kalmасını sağlar. Başlangıç kilonuza ve hedefinize göre hesaplanan makrolar, 20 kg kilo kaybından sonra artık optimum değildir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak makro takibinin uzun vadeli bir beceri olduğunu unutmamak gerekir. Aylarca haftalık hassas takip yapan kişiler, zamanla porsiyon boyutlarını ve besinlerin makro içeriklerini sezgisel olarak tahmin edebilir hale gelir. Bu sezgi, beslenme uygulamasına sürekli bağımlı kalmadan da dengeli ve hedefe uygun beslenebilme özgürlüğü sağlar. Makro takibi nihai bir araç değil; sağlıklı beslenme alışkanlıklarını içselleştirme sürecinde güçlü bir eğitim yöntemidir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Makro Hesaplama <span style="color:#ccff00">Sık Sorulan Sorular ve Pratik Rehber</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Makro takibi, son yıllarda Türkiye'de de hızla yaygınlaşan bir beslenme yönetim yaklaşımıdır. "Makrolarım neler olmalı?", "Kas yaparken karbonhidrat yenilmeli mi?", "Yağ tüketmek gerçekten yağlandırır mı?" gibi sorular, fitness topluluğunun en çok meşgul olduğu konuların başında gelmektedir. Bu rehberde bu soruları bilimsel kanıtlar ışığında yanıtlıyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Karbonhidrat Düşmanınız Değil</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Karbonhidrat yemek yağlandırır" efsanesi hâlâ yaygın olsa da bu saptama bilimsel olarak doğrulanmamıştır. Karbonhidrat alımı, tek başına yağ birikimine yol açmaz; toplam kalori dengesi belirleyicidir. Araştırmalar, eşit kalorili düşük yağlı ve düşük karbonhidratlı diyetlerin uzun vadede benzer kilo kaybı sağladığını göstermektedir. Karbonhidratların kısılması kısa vadede hızlı kilo kaybı gibi görünür; ancak bu büyük ölçüde glikojen ve su kaybıdır, yağ kaybı değil.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Egzersiz performansı söz konusu olduğunda karbonhidratın önemi daha da artar. Kasların birincil yakıtı olan glikojen, yalnızca karbonhidratlardan sentezlenir. Düşük karbonhidrat diyetlerinde antrenman yoğunluğu ve hacmi genellikle düşer; bu da uzun vadede kas kazanımını sekteye uğratabilir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Diyet Yağı Hakkında Bilinen Yanlışlar</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Yağ yemek yağlandırır" düşüncesi, diyetisyenlerin defalarca çürüttüğü ancak bir türlü ortadan kalkmayan bir efsanedir. Yağın gram başına 9 kcal içermesi, onu dikkatli tüketilmesi gereken bir makro yapar; ancak diyetten tamamen çıkarmak hormonsal dengeyi bozar. Testosteron, östrojen ve kortizon gibi steroid hormonlar kolesterolden sentezlenir ve kolesterol yalnızca hayvansal yağlarda bulunur. Çok düşük yağlı diyetler bu hormonların üretimini sekteye uğratabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Öte yandan omega-3 yağ asitleri (yağlı balık, ceviz, keten tohumu) iltihaplanmayı azaltır, kalp sağlığını korur ve kas iyileşmesini hızlandırır. Bu "sağlıklı yağlar", makro planlamasında minimum yüzde 20-25 yağ alımının korunması gerektiğini destekleyen en önemli gerekçelerden biridir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Makrolarınızı Gerçek Hayata Uyarlama</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Dışarıda yemek yediğinizde ne yapmalısınız?</strong> Restoran porsiyonları genellikle ev porsiyonlarından yüzde 60-200 daha büyüktür. Pratik bir kural: tabağı ikiye bölün, yarısını eve götürün veya yarısını bitirmeden kalkın. Protein kaynağını tanımlayın (et, tavuk, balık), karbonhidrat kaynağını tahmin edin, sosları mümkün olduğunca sınırlayın.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Makro takibini ne zaman bırakabilirsiniz?</strong> Beyin kısa sürede besin içeriklerini sezgisel olarak tahmin etmeyi öğrenir. Araştırmalar, yoğun makro takibi deneyiminin ardından çoğu kişinin bant kontrolü olmadan da makrolarına yakın beslendiğini göstermektedir. Hedefinize ulaştıktan sonra haftalık-aylık "spot kontrol" yöntemiyle makrolarınızı periyodik olarak gözden geçirmek, tam takipten vazgeçerken kazanımlarınızı korumanızı sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak makro takibinin psikolojik boyutunu göz ardı etmemek gerekir. Bazı bireyler için aşırı titiz makro takibi, yiyeceklerle sağlıksız bir ilişkiye ya da besin anksiyetesine yol açabilir. Bu işaretleri fark ederseniz, yüzde seksen kuralı veya daha esnek bir yaklaşım benimsemek, uzun vadeli sağlık ve mutluluk için çok daha uygun bir stratejidir.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderIdealKiloTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">İdeal Kilo Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">İdeal Kilo Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın. Devine, Robinson, Miller ve Hamwi
          formülleriyle bilimsel hesaplama yaparak sağlıklı kilo hedeflerinizi belirleyin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            İdeal Kilo <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kilo, belirli bir boy için sağlık riskleri ve yaşam kalitesi açısından en uygun vücut ağırlığı aralığını ifade eden kavramdır. Tek bir "doğru" değer olmaktan çok, kişinin fiziksel yapısına, kas kütlesine, kemik yoğunluğuna ve yaşına göre değişen bir aralık söz konusudur. Bu hesap makinesi, bilim dünyasında en yaygın kabul gören dört farklı formülü bir arada kullanarak size kapsamlı bir değerlendirme sunar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kilo hesaplamada kullanılan başlıca formüller şunlardır: <strong style="color:#fff">Devine formülü</strong> (1974), başlangıçta ilaç dozajı hesaplamak için geliştirilmiş ancak zamanla ideal kilo tahminine uyarlanmıştır. <strong style="color:#fff">Robinson formülü</strong> (1983), Devine'den daha hassas bir yaklaşım sunar. <strong style="color:#fff">Miller formülü</strong> (1983), özellikle düşük boylar için daha gerçekçi sonuçlar verir. <strong style="color:#fff">Hamwi formülü</strong> ise klinik pratikte diyetisyenler tarafından sıkça başvurulan klasik bir yöntemdir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Tüm bu formüller boy üzerinden bir temel kilo belirler ve her ek santimetre için küçük bir ağırlık artışı ekler. Erkek ve kadın için ayrı hesaplamalar yapılır çünkü kadınların kemik yapısı ve kas kütlesi dağılımı erkeklerden farklıdır. Bu farklılık, aynı boyda bir erkek ve kadın için önerilen ideal kilo aralığının birbirinden ayrışmasına yol açar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kemik yapısı (çerçeve boyutu) da ideal kiloyu etkileyen önemli bir faktördür. İnce kemik yapısına sahip biri ile geniş kemikli biri için aynı boy değerinde birbirinden farklı ideal ağırlık aralıkları söz konusu olabilir. Bileğin çevresi ölçülerek kabaca kemik yapısı tahmin edilebilir: 17 cm altı ince, 17-20 cm orta, 20 cm üzeri geniş kemik yapısına işaret eder. Bu hesap makinesi bu farkı dikkate alarak önerilen aralığı birkaç kilogram kaydırabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kilo kavramının sınırlılıklarını da göz önünde bulundurmak gerekir. Bu formüller genel popülasyon ortalamaları üzerinden türetilmiştir ve sporculara, vücut geliştiricilere ya da özel tıbbi durumlara sahip bireylere direkt uygulanamaz. Yüksek kas kütlesine sahip bir atlet, formüle göre "fazla kilolu" görünebilir; oysa gerçekte mükemmel bir sağlık tablosu sergileyebilir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            İdeal Kilo Sonuçlarını <span style="color:#ccff00">Nasıl Yorumlamalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesap makinesi size birden fazla formülden elde edilen sonuçları gösterir. Bu değerlerin birbirinden birkaç kilogram farklı olması normaldir; dört formülün ortalaması ya da ortanca değeri en güvenilir tahmini sunar. Önemli olan, tek bir sayıya değil, bu sonuçların işaret ettiği genel aralığa odaklanmaktır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Mevcut kilonuzun ideal aralığın üzerinde olması; hedef kilo vermek için kalori açığı oluşturmanız, düzenli egzersiz yapmanız ve beslenme düzeninizi gözden geçirmeniz gerektiğine işaret eder. Kilo verme sürecinde haftada 0.5-1 kg arası kayıp, hem sürdürülebilir hem de kas kütlesini koruma açısından en güvenli hızdır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Mevcut kilonuz ideal aralığın altındaysa, bu beslenme yetersizliği, düşük kas kütlesi veya bir sağlık sorununa işaret edebilir. Kilo almak amacıyla yalnızca kalori fazlası oluşturmak yerine, direnç antrenmanıyla desteklenen ve protein ağırlıklı bir kalori fazlası stratejisi benimsemek, kilo artışının büyük bölümünün kas olarak gelmesini sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kiloya ulaştıktan sonra hedef yalnızca kilo korumak olmamalıdır. Vücut kompozisyonunu iyileştirmek — aynı ağırlıkta daha fazla kas, daha az yağ — sağlık, performans ve görünüm açısından çok daha anlamlı bir hedef olabilir. Bu "rekomposizyon" süreci, yeterli protein alımı ve düzenli direnç antrenmanının kombinasyonuyla mümkündür; ancak kilo değişimi minimal olduğundan çok daha sabır gerektiren bir yoldur.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak ideal kilo hedefini kısa vadeli bir varış noktası olarak değil, uzun vadeli bir sağlık yolculuğunun kilometre taşı olarak değerlendirmek önemlidir. Herhangi bir özel sağlık durumunuz varsa veya ciddi kilo değişikliği hedefliyorsanız, bir diyetisyen ya da spor hekimi ile çalışmanızı öneririz.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            İdeal Kiloyu Fitness Hedefi Olarak <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kilo hesabını bir fitness yol haritasının başlangıç noktası olarak kullanmak, hedef belirleme sürecini önemli ölçüde netleştirir. Ancak bu değeri körü körüne takip etmek yerine, kendi vücut yapınızı, yaşam tarzınızı ve gerçekçi hedeflerinizi de göz önünde bulundurmanız gerekir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Formüle dayalı ideal kilodan farklı olarak <strong style="color:#fff">kişisel ideal kilonuzu</strong> belirlemek için şu soruları kendinize sorun: Hangi kiloda enerji dolu ve sağlıklı hissediyordunuz? Kan değerleriniz hangi kilo aralığında normal seyretti? Hangi kiloda spor performansınız en yüksekti? Bu kişisel referans noktaları, genellikle formül sonuçlarından daha anlamlı bir hedef ortaya koyar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kiloya giden yolda sürdürülebilirlik en kritik faktördür. Hızlı kilo kaybı yöntemleri (çok düşük kalorili diyetler, aşırı kardio) kısa vadede etkili görünse de uzun vadede kas kaybı, metabolizma yavaşlaması ve "yo-yo" etkisiyle sonuçlanır. Kademeli ilerleme, alışkanlık geliştirme ve yaşam tarzı değişiklikleri; hedefe çok daha kalıcı biçimde ulaşmayı sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kiloya yaklaştıkça ilerleme yavaşlar. Bu "set point" etkisi, vücudun belirli bir ağırlığı korumaya çalışan metabolik adaptasyonunun sonucudur. Bu dönemde kilo değişimine odaklanmak yerine vücut kompozisyonuna — yağ yüzdesi ve kas kütlesine — odaklanmak motivasyonu korur ve süreci daha anlamlı kılar. Bant ölçüleri ve vücut yağ yüzdesi takibi, bu dönemde kilogramdan çok daha fazlasını söyler.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kilo hesabını <strong style="color:#fff">TDEE ve kalori hesabıyla birlikte kullanmak</strong> en akıllıca yaklaşımdır. İdeal kilonuzu belirleyin, ardından TDEE hesabıyla o kilodaki enerji ihtiyacınızı öngörün. Mevcut kilonuz ile ideal kilonuz arasındaki fark, ne kadar kalori açığı oluşturmanız ya da ne kadar süre sürdürmeniz gerektiğine dair gerçekçi bir çerçeve sunar.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            İdeal Kiloya Ulaşmak: <span style="color:#ccff00">Gerçekçi Beklentiler ve Bilimsel Yaklaşım</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"İdeal kilom kaç olmalı?" sorusu, Türkiye'de her ay milyonlarca kez aranan sorular arasında yer almaktadır. Bu sorunun yanıtı; boy, cinsiyet, kemik yapısı ve kas kütlesi gibi faktörlere göre değişir. Ancak bir sayıyı hedef olarak belirlemek, süreci yönetmenin yalnızca başlangıcıdır. Asıl mesele o sayıya nasıl ulaşılacağı ve bu noktada uzun süre kalınabileceğidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kilo Vermek İçin Ne Kadar Süre Gerekir?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Matematiksel hesaplamaya göre yaklaşık 7700 kalorilik açık, 1 kg yağ kaybına eşdeğerdir. Günlük 500 kcal açıkla haftada yaklaşık 0.5 kg, günlük 1000 kcal açıkla haftada yaklaşık 1 kg kilo kaybı öngörülür. Ancak bu hesap lineer değildir; vücut adaptasyon mekanizmaları devreye girer ve ilk haftalardaki hızlı düşüş — çoğunlukla su ve glikojen kaybını yansıtır — yavaşlar. İdeal kiloya ne kadar sürede ulaşılacağını hesaplamak için mevcut kilo ile hedef kilo arasındaki farkı, haftalık 0.3-0.5 kg kayıpla bölmek gerçekçi bir zaman çerçevesi verir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Boy ve Kilo Tablosu: Turkiye için Sağlıklı Ağırlık Aralıkları</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Türkiye'de en sık aranan konulardan biri "boy kilo tablosu" ya da "boya göre ideal kilo" hesabıdır. Genel bir rehber olarak; 160 cm boy için sağlıklı kilo aralığı 47-65 kg, 170 cm için 53-72 kg, 175 cm için 56-77 kg, 180 cm için 60-82 kg olarak belirtilebilir. Ancak bu rakamlar, kas kütlesi ve kemik yapısı hesaba katılmadan yalnızca VKİ sınırlarına dayalıdır; bireysel değerlendirme için her zaman daha spesifik hesaplama araçları kullanılmalıdır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Yo-Yo Etkisi Neden Oluşur ve Nasıl Önlenir?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kilo verildikten sonra geri alınması — yo-yo etkisi — kilo yönetiminin en yaygın ve en hayal kırıklığı yaratan sonucudur. Araştırmalar, kilo veren insanların yüzde 80'inden fazlasının 5 yıl içinde verdikleri kiloların büyük bölümünü geri aldığını ortaya koymaktadır. Bu durumun temelinde birkaç mekanizma yatar: adipoz doku (yağ hücreleri) küçülür ama yok olmaz; leptin düzeyleri düşer ve iştah artar; metabolik hız kalıcı olarak baskılanabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Yo-yo etkisini önlemenin en güçlü stratejisi, kilo verme sürecinde kas kütlesini korumaktır. Bunu sağlamanın yolu ise yeterli protein alımı ve düzenli direnç antrenmanıdır. Kas dokusu, beden ağırlığının korunmasında hem metabolik hem de davranışsal mekanizmalar aracılığıyla kritik bir rol oynar. Kasları yüksek tutmak; TDEE'yi yüksek tutmak, açlık hormonlarını dengelemek ve hedef kiloyu sürdürmeyi kolaylaştırmak anlamına gelir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İdeal kilonuzu yalnızca hedef bir sayı olarak değil; sürdürülebilir beslenme alışkanlıkları, düzenli hareket ve kaliteli uyku etrafında kurulmuş bir yaşam tarzının doğal sonucu olarak görmek, bu noktaya ulaşmanızı ve orada kalmanızı çok daha olası kılacaktır.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderVucutYagiTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Vücut Yağ Oranı Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Vücut Yağ Oranı Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          US Navy formülüyle vücut yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın.
          Evde kolayca ölçüm yaparak vücut kompozisyonunuzu analiz edin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Vücut Yağ Oranı <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut yağ oranı, toplam vücut ağırlığının yüzde kaçının yağ dokusundan oluştuğunu gösteren bir ölçümdür. VKİ'nin aksine, bu değer vücudun gerçek kompozisyonunu yansıtır ve aynı kiloda iki farklı bireyin ne denli farklı bir fiziksel yapıya sahip olabileceğini ortaya koyar. Fitness ve sağlık değerlendirmesinde kullanılan en bilgilendirici metriklerden biridir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesinde kullanılan yöntem <strong style="color:#fff">ABD Deniz Kuvvetleri (US Navy) formülüdür</strong>. Bel, boyun ve kalça (kadınlar için) çevre ölçümlerini kullanan bu formül, laboratuvar ekipmanı gerektirmeksizin oldukça güvenilir sonuçlar verir. Bilimsel çalışmalar, doğru ölçümler yapıldığında bu yöntemin gerçek değerden ortalama yüzde 3-4 sapma gösterdiğini ortaya koymaktadır. Bu, pratik kullanım için kabul edilebilir bir hata payıdır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Daha hassas ölçüm yöntemleri de mevcuttur. <strong style="color:#fff">DEXA (Dual-Energy X-ray Absorptiometry)</strong> en doğru laboratuvar yöntemi olarak kabul görür ve yüzde 1-2 hata payıyla sonuç verir; ancak pahalı ve uzmanlık gerektiren bir testtir. <strong style="color:#fff">Hidrodansitometri (su altı tartımı)</strong> altın standart olarak bilinir. <strong style="color:#fff">Kaliper ölçümü</strong> eğitimli uygulayıcı tarafından yapıldığında güvenilir sonuçlar verir. <strong style="color:#fff">Biyoelektrik empedans (BIA)</strong> ise hidrasyon durumuna bağlı olarak tutarsız sonuçlar üretebilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Doğru ölçüm için bel çevrenizi göbek hizasında, boyun çevrenizi ise çene altında ölçün. Ölçümü sabah aç karnına, tuvaletten sonra yapmak en tutarlı sonucu verir. Kadınlar için kalça çevresi, en geniş nokta üzerinden ölçülmelidir. Her ölçüm noktasında en az iki ölçüm alıp ortalamasını kullanmak, hata payını azaltır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut yağ oranı zaman içinde takip edildiğinde son derece değerli bilgiler sunar. Kilo sabit kalsa bile yağ oranındaki düşüş ve kas kütlesindeki artış, vücut kompozisyonunun iyileştiğine işaret eder. Bu "rekomposizyon" süreci, kilogram odaklı takiple fark edilemeyebilir; bu yüzden aylık vücut yağ ölçümü, fitness ilerlemenizi değerlendirmenin en kapsamlı yollarından biridir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Vücut Yağ Oranı <span style="color:#ccff00">Kategorileri Ne Anlama Gelir?</span>
          </h2>
          <div style="margin-top:1rem">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Atletik (Erkek)</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%6 – %13</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Profesyonel sporculara özgü aralık. Kas tanımlanması belirgin, damarlar görünür. %6'nın altı tehlikeli düzeyde olup hormon üretimini bozabilir.</p>
              </div>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Atletik (Kadın)</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%14 – %20</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kadınlarda hormonal ve üreme sağlığı için minimum yağ miktarı erkeklerden yüksektir. %14'ün altı kadınlar için sağlık riskleri taşır.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Fitness (Erkek)</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%14 – %17</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Düzenli egzersiz yapan aktif bireylerin aralığı. Sağlık açısından optimal, sürdürülebilir ve günlük performansa uyumlu. Kas kondisyonu belirgin biçimde görünür.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Fitness (Kadın)</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%21 – %24</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kadınlar için sağlıklı aktif aralık. Enerji, hormonal denge ve günlük fonksiyon açısından optimal. Düzenli egzersiz ve dengeli beslenmeyle ulaşılabilir ve korunabilir.</p>
              </div>
            </div>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut yağ oranı yükseldikçe kronik hastalık riskleri artar. Özellikle <strong style="color:#fff">visseral yağ</strong> (karın boşluğundaki iç organ yağı), cilt altı yağdan çok daha tehlikelidir. Visseral yağ yüksekliği, insülin direnci, tip 2 diyabet, kardiyovasküler hastalıklar ve metabolik sendromla doğrudan ilişkilidir. Bel çevresi yüksekliği (erkekte 94 cm, kadında 80 cm üzeri), visseral yağ birikiminin basit bir göstergesi olarak klinisyenler tarafından sıkça kullanılmaktadır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Düşük vücut yağının da riskleri vardır. Erkeklerde %5'in, kadınlarda %12-13'ün altına düşen yağ oranı; hormon üretimini bozabilir, bağışıklık sistemini zayıflatabilir, kemik mineral yoğunluğunu düşürebilir ve kadınlarda menstrüel bozukluklara yol açabilir. Bu yüzden "ne kadar az yağ o kadar iyi" anlayışı yanlış ve potansiyel olarak tehlikeli bir yaklaşımdır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Vücut Yağ Oranını Fitness'ta <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut yağ oranı, fitness planlamasında kilo ölçümünden çok daha güçlü bir rehberdir. İki temel strateji olan bulk (kas kazanımı fazı) ve cut (yağ yakma fazı) arasındaki geçiş kararını bu değer üzerinden vermek, süreci çok daha akıllıca yönetmenizi sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Genel kabul gören bir kural olarak; erkekler için <strong style="color:#fff">%15'in üzerinde</strong>, kadınlar için <strong style="color:#fff">%25'in üzerinde</strong> yağ oranıyla bulk yapmak tavsiye edilmez. Bu seviyelerde kalori fazlası oluşturmak, ağırlıklı olarak yağ birikimiyle sonuçlanır. Önce yağ oranını sağlıklı aralığa düşürmek (cut), ardından kontrolü bir fazla kalori dönemine geçmek çok daha verimli bir yol haritasıdır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Ölçümlerinizi ayda bir veya iki ayda bir tekrarlamak, trendleri görmek için yeterlidir. Günlük değişimler; su tutma, besin içeriği, ölçüm tekniği ve hidrasyon gibi pek çok faktörden etkilendiği için anlamlı değildir. Uzun vadeli trendi takip etmek — örneğin altı ayda yüzde 3 düşüş — vücut kompozisyonunuzdaki gerçek değişimi yansıtır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut yağ oranını düşürmenin en etkili kombinasyonu: <strong style="color:#fff">kalori açığı + direnç antrenmanı + yeterli protein alımı</strong>. Bu üçlü strateji, kilo verirken kas kütlesini korur ve "yağ oranı düşürme" yerine "yağsız bir vücuda dönüşme" sürecini yönetir. Yalnızca kardio odaklı bir yaklaşım, kalori fazı döneminde kaybedilen kas kütlesini de götürebilir ve yağ oranının uzun vadede artmasına yol açar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak: bant ölçüleri, fotoğraf karşılaştırması ve vücut yağ oranı ölçümünü bir arada kullanmak, kilogram ölçümüne kıyasla çok daha kapsamlı bir ilerleme tablosu sunar. "Ayna testi" olarak da bilinen fotoğraf karşılaştırması, sayıların gösteremediği görsel değişimleri net biçimde ortaya koyar ve motivasyonu besler.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Vücut Yağ Oranını Düşürmenin <span style="color:#ccff00">Bilimsel ve Pratik Yolları</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Vücut yağ oranım yüzde kaç olmalı?" ve "Nasıl düşürürüm?" soruları, fitness dünyasının en sık aranan konuları arasındadır. Bu rehberde bilimsel araştırmaların ışığında hem hedef aralıkları hem de bu hedeflere ulaşmanın en kanıtlanmış yollarını paylaşıyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Vücut Yağı Yakmanın En Hızlı Yolu Nedir?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Doğrudan yanıt: kalori açığı + direnç antrenmanı + yeterli protein alımı. Bu üçlü kombinasyon, bilimsel literatürde defalarca onaylanmış en etkili yağ yakma stratejisidir. Yalnızca kardiyoya odaklanmak, kas kütlesi kaybıyla birlikte yağ yaktığı için uzun vadede metabolizmayı yavaşlatır. Yalnızca diete odaklanmak ise kas kaybına zemin hazırlar ve rebound (geri yağlanma) riskini artırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kardiyonun tipi de önemlidir. Yüksek yoğunluklu interval antrenmanı (HIIT), geleneksel sabit tempolu kardiyoya kıyasla daha kısa sürede daha fazla kalori yakar ve "EPOC" (egzersiz sonrası oksijen tüketimi) etkisiyle antrenman sonrasında da kalori harcamaya devam eder. Ancak HIIT'in yüksek toparlanma maliyeti göz önüne alındığında, haftada 2-3 seans yeterlidir; geri kalan kardiyovasküler çalışmalar düşük-orta yoğunlukta yapılabilir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Göbek Yağını Eritmenin Yolları</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Göbek eritme egzersizleri" her yıl milyonlarca arama yapılan bir konudur. Ancak bilim şunu net söylemektedir: bölgesel yağ yakımı mümkün değildir. Göbek kaslarını çalıştırmak kasları güçlendirir; ancak üzerlerindeki yağ dokusunu doğrudan eritmez. Göbek yağını azaltmanın yolu, genel vücut yağ yüzdesini düşürmektir. Iyi haber şudur: visseral yağ (karın içi yağ), cilt altı yağa kıyasla diyet ve egzersiz müdahalelerine çok daha hızlı yanıt verir. Kalori açığı oluşturulduğunda vücut önce visseral yağı yakmaya başlar; bu nedenle ilk haftalarda bel çevresinde belirgin bir incelme gözlemlenir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Uyku ve Stres, Vücut Yağ Oranını Nasıl Etkiler?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Yetersiz uyku ve kronik stres, vücut yağ oranı üzerinde doğrudan olumsuz etkiler yaratır. Uyku yoksunluğu; kortizol düzeyini artırır, insülin duyarlılığını azaltır ve iştahı tetikleyen ghrelin hormonunu yükseltirken tokluk hissini sağlayan leptin hormonunu düşürür. Bir araştırmaya göre, aynı kalori kısıtlı diyetle 5.5 saat uyuyanlar 8.5 saat uyuyanlara kıyasla yüzde 55 daha az yağ ve yüzde 60 daha fazla kas kütlesi kaybetti. Bu bulgu, uyku kalitesinin vücut kompozisyonu üzerindeki etkisinin ne kadar derin olduğunu açıkça göstermektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kortizol, özellikle visseral yağlanmayı tetikleyen bir hormondur. Kronik stres altında kortizol düzeyi yüksek kalır ve vücut enerji rezervi olarak karın bölgesine yağ depolamaya eğilim gösterir. Bu nedenle meditasyon, doğa yürüyüşleri, sosyal bağlar ve hobiler gibi stres azaltma stratejileri, diyet ve egzersiz kadar önemli bir vücut yağ yönetimi aracıdır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sonuç olarak vücut yağ oranını düşürmek yalnızca bir estetik hedef değil, uzun vadeli sağlık yatırımıdır. Doğru araçlar ve bilimsel destekli stratejilerle bu hedefe ulaşmak hem mümkün hem de sürdürülebilirdir.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderOneRepMaxTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">1RM Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">One Rep Max (1RM) Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Kaldırdığınız ağırlık ve tekrar sayısından maksimum kaldırma kapasitenizi hesaplayın.
          Epley ve Brzycki formülleriyle güç seviyenizi ölçün ve antrenman programınızı optimize edin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            1 Tekrar Maksimum <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1 Tekrar Maksimum (1RM), bir kişinin belirli bir harekette tek seferinde kaldırabileceği maksimum ağırlık miktarıdır. Güç antrenmanının temel referans noktası olan bu değer; antrenman yükünü belirlemek, ilerlemeyi ölçmek ve program tasarlamak için dünya genelinde spor bilimciler ve koçlar tarafından kullanılmaktadır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM'i doğrudan test etmek mümkündür; ancak maksimal yük denemeleri ciddi sakatlanma riski taşır ve özellikle yeni başlayanlar için tavsiye edilmez. Bu nedenle bu hesap makinesi, <strong style="color:#fff">submaksimal test yöntemine</strong> dayanır: maksimumdan daha az bir ağırlıkla yapılan tekrar sayısından 1RM tahminlenir. Bu, hem güvenli hem de pratik bir yaklaşımdır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesap makinesinde kullanılan başlıca formüller şunlardır: <strong style="color:#fff">Epley formülü</strong> (1RM = Ağırlık × (1 + Tekrar/30)) ve <strong style="color:#fff">Brzycki formülü</strong> (1RM = Ağırlık × (36 / (37 − Tekrar))). Her iki formül de 10 tekrar veya altında en güvenilir sonuçları verir. Tekrar sayısı yükseldikçe (10+) tahmin hatası da artar; bu yüzden 3-8 tekrar aralığında test yapmak daha sağlıklı veriler üretir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM tahmininin doğruluğunu etkileyen faktörler arasında teknik form, dinlenme durumu, günlük psikolojik durum, sıcaklık ve kasların ısınma düzeyi yer alır. Bu nedenle ölçümü standart koşullarda (iyi dinlenmiş, ısınmış, tutarlı formla) yapmak, zaman içindeki karşılaştırmaların anlamlı olmasını sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM değeri bireyden bireye ve hareketten harekete önemli ölçüde farklılık gösterir. Vücut ağırlığına göreli 1RM değerleri ise performansı karşılaştırmak için kullanılır. Örneğin vücut ağırlığınızın 1.5 katı squat yapmak orta-üst düzey güç olarak kabul edilirken, 2 kat ya da üzerindeki değerler elit sporcu sınıfına girer. Bu oranlar performans düzeyinizi nesnel olarak değerlendirmenize yardımcı olur.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            1RM Yüzdelerini <span style="color:#ccff00">Nasıl Kullanırsın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM'nin asıl değeri, yüzde bazlı antrenman yüklerini belirlemekte yatar. Antrenman hedefine göre hangi yüzde aralığında çalışmanız gerektiği bilimsel olarak belirlenmiştir:
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Güç Dayanıklılığı</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%50-65 / 15-20 tekrar</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kas dayanıklılığını geliştirmek için kullanılır. Yüksek tekrar sayısı metabolik uyumu ön plana çıkarır.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Hipertrofi (Kas Büyümesi)</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%65-85 / 6-12 tekrar</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kas kütlesi kazanımı için en optimal aralık. Mekanik gerilim ve metabolik stres kombinasyonu kas büyümesini tetikler.</p>
              </div>
              <div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#fb923c;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Güç Geliştirme</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%85-95 / 2-5 tekrar</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Nöromüsküler adaptasyonu ve kas gücünü geliştirmeye odaklanır. Sinir sistemi bu aralıkta maksimum motor ünite devşirmeyi öğrenir.</p>
              </div>
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Maksimal Güç</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">%95-100 / 1-2 tekrar</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">1RM test ve gelişim için kullanılır. Deneyimli sporcular için uygundur, merkezi sinir sistemini yoğun biçimde zorlar. Yeterli iyileşme zorunludur.</p>
              </div>
            </div>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Periyodizasyon (döngüsel antrenman) planlarında 1RM yüzdeleri sistematik biçimde değiştirilir. Örneğin bir 12 haftalık program; ilk 4 hafta hipertrofi ağırlıklı (%70-80), sonraki 4 hafta güç odaklı (%80-90) ve son 4 hafta pik performans için maksimal yükleme (%90-100) içerebilir. Bu döngüsel yaklaşım, hem sürekli ilerlemeyi hem de toparlanmayı optimize eder.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            1RM'yi Antrenman Programına <span style="color:#ccff00">Nasıl Entegre Etmelisin?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM bilgisine sahip olmak, antrenman yükünüzü tahmine dayalı değil, bilimsel olarak belirlemenizi sağlar. "Bu hafta kaç kilo koyayım?" sorusu, 1RM'nizin belirli bir yüzdesiyle otomatik olarak yanıtlanır. Bu yaklaşım, hem aşırı yüklenmeden hem de yetersiz uyarımdan kaçınmanızı sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM değerlerinizi belirli aralıklarla (her 4-8 haftada bir) güncellemek önemlidir. Antrenman ilerledikçe güç düzeyiniz artar ve eski 1RM değerlerine göre belirlenen yükler giderek yetersiz kalır. Bu güncelleme, programınızın sürekli zorlu ve gelişim sağlayıcı kalmasını güvence altına alır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Büyük bileşik hareketler (squat, deadlift, bench press, overhead press) için 1RM takibi en değerli olanıdır. Bu hareketler, en fazla kas grubunu bir arada çalıştıran ve güç gelişiminin temel göstergesi olan egzersizlerdir. İzole hareketler için 1RM'yi takip etmek daha az önceliklidir ve sakatlanma riski taşıyabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM testini nasıl yapmalısınız? Önce genel ısınma, ardından çalışacağınız hareket için spesifik ısınma setleri yapın. Ağırlığı kademeli olarak artırın: yüzde 50, 70, 85, 95 ve 100 şeklinde. Her set arasında en az 3-5 dakika dinlenin. Formu bozmadan tamamlayabileceğiniz en ağır yük 1RM'nizdir. Test sonrasında merkezi sinir sistemi yorulduğu için en az 48-72 saat tam dinlenme planlamak önemlidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Submaksimal tahmin yönteminde ise test günü yorgunken veya düşük motivasyonlu günlerde hesaplama yapılmamalıdır. Çünkü 6 tekrar yapabildiğiniz ağırlık, zinde bir günde 8 tekrar yapabileceğiniz ağırlıkla aynı olmayabilir ve bu fark 1RM tahminini birkaç kilogram kaydırır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Güç Standartları ve <span style="color:#ccff00">1RM Hakkında Sık Sorulan Sorular</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Squat'ta kaç kilo kaldırmalıyım?", "Bench press 1RM'im iyi mi?", "1RM ne kadar sürede artar?" — bu sorular, güç antrenmanı yapan herkesin merak ettiği konulardır. Bu rehberde güç standartları ve 1RM gelişimi hakkında gerçekçi bir perspektif sunuyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Güç Standartları: Nerede Duruyorsunuz?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Güç standartları, vücut ağırlığına göreli 1RM değerlerine dayanır ve deneyim düzeyine göre kategorize edilir. Squat için genel referans noktaları şöyledir: yeni başlayan erkek için vücut ağırlığının yüzde 75'i, orta düzey için yüzde 150, ileri düzey için yüzde 200 ve elit sporcu için yüzde 250 veya üzeri. Kadınlar için bu değerler genellikle yüzde 20-30 daha düşüktür. Bench press için erkekte başlangıç yüzde 50, orta yüzde 100 ve ileri düzey yüzde 150 vücut ağırlığı olarak sınıflandırılır. Bu rakamlar kesin sınırlar değil, yol gösterici referans noktaları olarak değerlendirilmelidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">1RM Ne Kadar Sürede Artar?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">1RM gelişim hızı, antrenman deneyimine göre dramatik biçimde farklılık gösterir. Yeni başlayanlar (0-1 yıl) "yeni başlayan kazanımları" sayesinde her 1-2 haftada belirgin güç artışı yaşarlar; bu dönemde aylık yüzde 5-15 gibi hızlı ilerlemeler mümkündür. Orta düzey sporcular (1-3 yıl) için aylık yüzde 2-5, ileri düzey sporcular (3+ yıl) için ise aylık yüzde 1-2 veya altı daha gerçekçidir. Güç antrenmanında ilerleme kaçınılmaz olarak yavaşlar; bu nedenle deneyimli sporcuların hedeflerini buna göre ayarlaması kritik önem taşır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">1RM Artırmak İçin En Etkili Antrenman Yöntemleri</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Lineer periodizasyon</strong>, yeni başlayanlar için en etkili yöntemdir. Her seansta ağırlığı küçük miktarlarda (alt vücut için 2.5 kg, üst vücut için 1.25 kg) artırmak, güçlü bir adaptasyon sinyali oluşturur. Lineer ilerleme platoya ulaştığında dalgalı veya blok periodizasyona geçmek süreci canlandırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Submaksimal yükleme</strong>, 1RM test yapmadan güç kazanmanın en sürdürülebilir yoludur. Yüzde 85-90 yüklerde 2-3 tekrar ile birden fazla set yapmak (5×2 veya 6×3 gibi), nöromüsküler adaptasyonu maksimuma çıkarırken sakatlanma riskini minimize eder. Bu yöntem, Sovyet ağırlıkçılık programlarından günümüze uzanan köklü bir geleneğe dayanır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">1RM Testinden Sonra Ne Yapmalısınız?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Maksimal bir 1RM testi, merkezi sinir sistemini (MSS) yoğun biçimde yorar. Kas ağrısı minimum olsa bile MSS 48-72 saat tam toparlanma gerektirir. Bu nedenle test sonrası aktif dinlenme ya da düşük yoğunluklu teknik çalışması en uygun yaklaşımdır. Bazı koçlar, 1RM testini önemli bir yarışma veya hedeften 1-2 hafta önce değil, en az 2-3 hafta önce yapılmasını önerir; böylece test yorgunluğu pik performansı olumsuz etkilemez.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesini kullanarak 1RM değerlerinizi düzenli olarak hesaplayın ve zaman içindeki ilerlemenizi kaydedin. Büyük bileşik hareketlerde elde edilen güç artışı, fitness yolculuğunuzun en güvenilir ve motive edici göstergelerinden biridir.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderSuTuketimiTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Su İhtiyacı Hesaplayıcı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Su İhtiyacı Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın.
          Sağlıklı hidrasyon için doğru su miktarını öğrenin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Günlük Su İhtiyacı <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Su, insan vücudunun yüzde 60'ını oluşturan ve neredeyse tüm metabolik süreçlerin temelini oluşturan vazgeçilmez bir bileşendir. Besin maddelerini taşımak, vücut ısısını düzenlemek, eklemleri yağlamak, atık maddeleri uzaklaştırmak ve biyokimyasal reaksiyonlara ortam hazırlamak suyun başlıca görevleri arasındadır. Yeterli su tüketimi, hem sağlık hem de fiziksel performans açısından kalori ya da protein kadar kritik öneme sahiptir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Günlük su ihtiyacı kişiden kişiye önemli ölçüde değişir. Bu hesap makinesi, vücut ağırlığınızı, aktivite düzeyinizi ve iklim koşullarınızı birlikte değerlendirerek kişiselleştirilmiş bir tavsiye sunar. Yaygın kullanılan temel formül; vücut ağırlığının kilogramı başına <strong style="color:#fff">30-35 ml su</strong> olarak hesaplanmasıdır. Buna göre 70 kg bir birey için günlük temel su ihtiyacı 2.1-2.45 litre olarak belirlenir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Egzersiz, su ihtiyacını önemli ölçüde artırır. Orta yoğunlukta bir antrenman sırasında vücut saatte 0.5 ila 1.5 litre arasında ter yoluyla su kaybeder. Bu kaybı yerine koymak için antrenman öncesinde 400-600 ml su içmek, egzersiz sırasında her 15-20 dakikada bir 150-250 ml tüketmek ve antrenman sonrasında kaybedilen her yarım kilogram için 600 ml ek su almak önerilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sıcak ve nemli iklimlerde ter üretimi artar, dolayısıyla su ihtiyacı yükselir. Yüksek irtifada da solunum yoluyla su kaybı arttığı için günlük alımın artırılması gerekir. Hamilelik ve emzirme dönemlerinde de su ihtiyacı belirgin biçimde yükselir. Bu hesap makinesi bu faktörleri dikkate alarak temel değeri ayarlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Suyun sadece içeceklerden değil, besinlerden de karşılandığını hatırlatmak gerekir. Meyveler, sebzeler, çorbalar ve süt gibi besinler, günlük su ihtiyacının yüzde 20-30'unu karşılayabilir. Ancak hesap makineleri genellikle içecek olarak alınması gereken miktarı verir; bu nedenle günlük ölçümünüzü yalnızca sıvı alımınız üzerinden değerlendirmeniz önerilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kafein içeren içecekler (kahve, çay) hafif diüretik etkiye sahiptir ancak ölçülü tüketimde su kaybına yol açmaz. Alkol ise gerçek anlamda dehidrasyon yapan bir maddedir; içilen her alkollü içecek için en az bir bardak su içmek iyi bir pratik kuraldır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Dehidrasyon <span style="color:#ccff00">Belirtileri ve Etkileri</span>
          </h2>
          <div style="margin-top:1rem">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#facc15;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Hafif (%1-2)</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Susuzluk hissi, hafif baş ağrısı, konsantrasyon güçlüğü, yorgunluk. Spor performansı yüzde 5-10 oranında düşer. İdrar rengi koyu sarıya döner.</p>
              </div>
              <div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#fb923c;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Orta (%2-5)</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Belirgin yorgunluk, koordinasyon bozukluğu, kas krampları, mide bulantısı. Aerobik kapasite yüzde 20'ye kadar düşebilir. Bilişsel işlevler ciddi ölçüde zayıflar.</p>
              </div>
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Ağır (%5+)</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Baş dönmesi, hızlı kalp atışı, bilinç bulanıklığı, acil tıbbi müdahale gerekebilir. Isı çarpması ve uzun vadeli organ hasarı riski ciddi düzeye ulaşır.</p>
              </div>
            </div>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Thirst (susuzluk) mekanizması, hafif dehidrasyon için bile geç devreye girer. Yani susuzluk hissettiren zaman, vücudun zaten yüzde 1-2 oranında su kaybettiği andır. Bu yüzden "susayınca iç" kuralı, optimal hidrasyon için yeterli değildir. Gün boyunca düzenli aralıklarla su içmek, susuzluk hissi beklemekten çok daha etkili bir stratejidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">İdrar rengi</strong>, hidrasyon durumunuzu değerlendirmenin en kolay ve güvenilir yöntemlerinden biridir. Açık sarı (limonata rengi) iyi hidrasyon, koyu sarı veya kahverengi ise yetersiz su alımına işaret eder. Sabah ilk idrarda koyu renk normaldir; gün içinde soluk renge dönmesi hedeflenir. Renksiz idrar ise aşırı su tüketiminin göstergesi olabilir; bu da elektrolit dengesini bozabilir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Fitness Sürecinde <span style="color:#ccff00">Su Tüketim Stratejisi</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Düzenli egzersiz yapan bireyler için su yönetimi, performans ve iyileşme sürecinin ayrılmaz bir parçasıdır. Antrenman öncesi, sırası ve sonrasında su alımını planlamak, yalnızca sağlık için değil atletik performans için de kritik öneme sahiptir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Antrenman öncesi:</strong> Egzersizden 2-3 saat önce 500-600 ml su içmek, antrenmanı tam hidrate başlamanızı sağlar. Antrenmanın hemen öncesinde (15-30 dakika önce) ek 200-300 ml almak da önerilir. Eğer sabah erken antrenman yapıyorsanız, uyku sırasında oluşan su kaybını karşılamak için sabah kalkışında en az bir büyük bardak (300-400 ml) su içmeyi alışkanlık haline getirin.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Antrenman sırasında:</strong> Her 15-20 dakikada bir 150-250 ml su tüketimi genel öneri olarak kabul görmektedir. 60 dakikadan uzun veya yoğun terlemenin yaşandığı antrenmanlarda sodyum içeren sporcu içecekleri ya da elektrolit takviyesi, yalnızca suya kıyasla daha etkin bir hidrasyon sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Antrenman sonrası:</strong> Kaybedilen her 0.5 kg vücut ağırlığı için yaklaşık 600-750 ml sıvı alınması önerilir. Bu nedenle antrenmandan önce ve sonra tartılmak, kayıp miktarını doğru belirlemenize yardımcı olur. Antrenman sonrası su alımını protein ve karbonhidratlı bir öğün ya da içecekle birleştirmek, kasların glikojen depolarını yenilemesini ve iyileşme sürecini hızlandırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Günlük su hedefini tutturmayı kolaylaştıran pratik alışkanlıklar: her sabah kalkışta bir bardak su içmek, her öğünde su ile başlamak, çalışma ortamında görünür bir su şişesi bulundurmak ve gün içinde hatırlatıcı alarmlar kurmak. Bu küçük alışkanlıklar, bilincinde olmadan günlük hedefinizin büyük bölümünü karşılamanızı sağlar.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Su İçme Alışkanlığı Hakkında <span style="color:#ccff00">Sık Sorulan Sorular ve Uzman Tavsiyeleri</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Günde kaç litre su içmeliyim?" sorusu, sağlık ve beslenme alanında en sık aranan sorular arasında yer alır. Yanıt kişiden kişiye önemli ölçüde değişse de bu rehberde hem genel ilkeleri hem de bireysel ince ayarı yapmanıza yardımcı olacak bilimsel verileri paylaşıyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Günde 8 Bardak Su Gerçekten Yeterli Mi?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Günde 8 bardak su için" tavsiyesi yaygın olmakla birlikte bilimsel bir temelden yoksundur. Bu ifade, muhtemelen 1945 tarihli bir ABD Gıda ve Beslenme Kurulu önerisinin yanlış yorumlanmasından kaynaklanmaktadır. Söz konusu öneri, günlük 2-2.5 litre suyun büyük bölümünün besinlerden karşılandığını da açıkça belirtmiştir. Güncel araştırmalar, "8 bardak" gibi sabit bir hedef yerine bireysel ihtiyaca göre belirlenen miktarın çok daha uygun olduğu sonucuna varıyor. Bu hesap makinesinin sunduğu kişiselleştirilmiş değer, bu nedenle sabit hedeflerden çok daha değerlidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Aşırı Su İçmek Zararlı Olabilir Mi?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Evet, nadir ancak ciddi bir durum olan hiponatremi (kan sodyumunun aşırı seyrelmesi), gereğinden fazla su tüketimiyle tetiklenebilir. Bu risk özellikle uzun mesafe koşularında veya aşırı terleme olmaksızın çok miktarda su tüketildiğinde ortaya çıkar. Günlük 4-5 litrenin üzerindeki su tüketimi sağlıklı yetişkinler için dikkat gerektirir. Normal koşullarda böbrekler sağlıklı bir insanın saatte yaklaşık 0.8-1 litre su atabilir; bu üst sınırın farkında olmak, aşırı su tüketiminden korunmanın ilk adımıdır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Suyun Kilo Vermeye Etkisi Var Mı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Araştırmalar, yemekten önce 500 ml su içmenin kalori alımını ortalama yüzde 13 azalttığını göstermektedir. Bunun nedeni mide hacminin geçici olarak dolması ve tokluk sinyallerinin tetiklenmesidir. 12 haftalık bir çalışmada, yemekten önce su içen grup yemekten önce su içmeyen gruba kıyasla iki kat daha fazla kilo kaybetti. Soğuk su içmek ise vücudun suyu vücut sıcaklığına getirme çabası sayesinde çok küçük bir kalori harcamasına neden olur (yaklaşık 8-12 kcal/bardak); bu etki pratik açıdan anlamlı değildir ancak var olan tüm stratejilerin bir toplamı olarak değer taşır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Sporculara Özel Su Tüketim Rehberi</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Profesyonel sporcularda ve yoğun antrenman yapanlarda su ihtiyacı dramatik biçimde artar. Maraton veya uzun mesafeli bisiklet gibi dayanıklılık sporlarında seans başına 2-4 litreye kadar çıkabilen sıvı kaybı söz konusudur. Bu düzeyde kayıplar yalnızca suyla değil, elektrolitlerle (sodyum, potasyum, magnezyum) birlikte yerine konulmalıdır. Hiponatreminin büyük bölümü, uzun etkinliklerde sadece su içen ve elektrolit almayan sporcuların başına gelir. Bir saatten uzun süren etkinliklerde sodyum içeren sporcu içecekleri veya elektrolit takviyeleri, yalnızca suya kıyasla çok daha üstün bir hidrasyon sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Günlük su tüketiminizi artırmanın en kolay yolu alışkanlık yığımlama tekniğidir: her kahve veya çay içişinizden sonra bir bardak su, her öğün öncesi bir bardak su ve her antrenman öncesi-sonrası su gibi mevcut alışkanlıklara su içmeyi bağlamak, bilinçli bir çaba harcamadan günlük hedefinizi tutturmanızı sağlar.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderKalpAtisiTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Kalp Hızı Bölgeleri</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Kalp Hızı Bölgeleri Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Yaşınıza göre antrenman kalp hızı bölgelerinizi hesaplayın.
          Yağ yakımı, aerobik ve maksimum efor bölgelerini öğrenin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kalp Atış Hızı Bölgeleri <span style="color:#ccff00">Nedir?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalp atış hızı bölgeleri (heart rate zones), egzersiz yoğunluğunu kalp hızı üzerinden kategorize eden bir sistemdir. Maksimum kalp hızınızın belirli yüzdelerine karşılık gelen bu bölgeler, her birinin farklı fizyolojik süreçleri ve antrenman etkilerini temsil etmesi nedeniyle egzersiz planlamasında kritik bir araçtır. Doğru bölgede egzersiz yapmak, hem hedeflerinize ulaşma hızını artırır hem de aşırı antrenman ve sakatlanma riskini azaltır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Maksimum kalp hızı (MKH), teorik olarak kişinin bir dakikada ulaşabileceği en yüksek kalp hızıdır. En yaygın kullanılan tahmin formülü <strong style="color:#fff">220 − yaş</strong>'tır. Bu basit formülün hata payı yaklaşık ±10-12 atım/dk olup bireysel farklılıkları tam olarak yansıtmaz. Daha doğru bir tahmin için <strong style="color:#fff">Tanaka formülü</strong> (208 − 0.7 × yaş) kullanılabilir; bu formül özellikle 40 yaş üzeri bireylerde daha güvenilir sonuçlar verir. En kesin yöntem ise kardiyopulmoner egzersiz testi veya sahada yapılan maksimal egzersiz protokolleridir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Dinlenme kalp hızı da antrenman planlaması için önemli bir değerdir. Sağlıklı yetişkinlerde dinlenme kalp hızı genellikle 60-100 atım/dk arasındadır. Düzenli aerobik antrenman yapan bireylerde bu değer 40-60'a kadar düşebilir; bu, kalbin daha verimli çalıştığının göstergesidir. Sabah yataktan kalkmadan önce ölçülen dinlenme kalp hızı, iyileşme durumunuzu ve aşırı antrenman belirtilerini takip etmek için de güvenilir bir gösterge işlevi görür.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesi, maksimum kalp hızınızı hesaplayıp beş temel bölgeye böler. Her bölge belirli bir yoğunluk aralığını temsil eder ve farklı antrenman hedefleri için kullanılır. Kalp hızı monitörü veya spor saati ile bu bölgeleri gerçek zamanlı takip etmek, antrenman kalitesini önemli ölçüde artırır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalp atış hızı bölgelerini kullanmak için ekstra alet şart değildir. Algısal efor skalası (RPE — Rate of Perceived Exertion), yaklaşık bir yoğunluk tahmini sunar: rahat konuşabiliyorsanız düşük bölgedesinizdir, kısa cümlelerle konuşabiliyorsanız orta bölgedesinizdir, konuşmak zorlaştıysa yüksek bölgeye giriyorsunuzdur.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            5 Kalp Hızı Bölgesi <span style="color:#ccff00">Ne Anlama Gelir?</span>
          </h2>
          <div style="margin-top:1rem">
            <div>
              
            </div>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kalp Hızı Bölgelerini Antrenmanında <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalp hızı bölgelerini antrenman planlamasına entegre etmek, rastgele egzersiz yapmakla kıyaslandığında çok daha sistematik ve ölçülebilir bir gelişim sağlar. Hangi bölgede ne kadar zaman geçirdiğinizi bilmek, antrenman yükünüzü kontrol etmenizi ve iyileşme süreçlerini optimize etmenizi mümkün kılar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Dayanıklılık sporcuları için yaygın kabul gören <strong style="color:#fff">80/20 kuralı</strong>, antrenman süresinin yüzde 80'ini Bölge 1-2'de (düşük yoğunluk), yüzde 20'sini ise Bölge 4-5'te (yüksek yoğunluk) geçirmeyi önerir. Bu dağılım, hem yorgunluğu yönetir hem de aerobik kapasiteyi ve hız dayanıklılığını aynı anda geliştirmenize olanak tanır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Yağ yakımını hedefliyorsanız, Bölge 2 antrenmanlarına odaklanmak en etkili stratejidir. Bölge 2, yağı birincil enerji kaynağı olarak kullanan bölgedir ve uzun süre sürdürülebilir olması sayesinde toplam kalori harcaması da yüksek olur. Yaygın yanılgı şudur: daha yoğun egzersiz yaptıkça yağ yakmak daha hızlanır; oysa çok yüksek yoğunluklarda enerji kaynağı ağırlıklı olarak karbonhidrata kayar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalp hızı bölgeleri güç antrenmanında da kullanılabilir. Yüksek tekrarlı setler arasında kalp hızının Bölge 2'ye düşmesini beklemek, iyileşme sürecini optimize eder ve bir sonraki seti daha kaliteli yapmanızı sağlar. Bu yöntem, kardiyovasküler kapasiteyi de geliştirir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Düzenli kalp hızı takibi, aşırı antrenmanı erkenden fark etmenin de en güvenilir yoludur. Sabah dinlenme kalp hızınız normalden 5-10 atım/dk daha yüksekse, bu vücudun yeterince toparlanamadığının işaretidir. Bu durumda planlanmış yoğun bir antrenman yerine düşük yoğunluklu aktif dinlenme ya da tam dinlenme gününü tercih etmek, uzun vadeli performansı koruyan akıllıca bir karardır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kardiyovasküler Sağlık İçin <span style="color:#ccff00">Kalp Hızı Egzersizi: Sık Sorulan Sorular</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Yağ yakma bölgesi gerçek mi?", "Cardio kalp hızı kaç olmalı?", "Sabah aç karnına kardio daha mı etkili?" — bu sorular fitness topluluğunun en merak ettiği konulardandır. Bu rehberde, kalp hızı temelli antrenmanın gerçek faydalarını ve yaygın yanılgıları ele alıyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Yağ Yakma Bölgesi Gerçek mi, Mit mi?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Yağ yakma bölgesi" (genellikle maksimum kalp hızının yüzde 55-65'i) gerçek bir fizyolojik kavramdır; ancak sıklıkla yanlış anlaşılmaktadır. Bu bölgede yağ, toplam enerji üretiminin daha büyük bir yüzdesini oluşturur; ancak toplam kalori harcaması düşüktür. Daha yüksek yoğunluklarda karbonhidrat oranı artar ama toplam enerji harcaması da artar. Sonuç: aynı süre içinde yüksek yoğunluklu egzersiz genellikle daha fazla kalori ve daha fazla toplam yağ yakar. Bu nedenle "yağ yakmak istiyorum, düşük yoğunlukta çalışmalıyım" düşüncesi eksik bir yaklaşımdır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Dinlenme Kalp Hızı Düşürmenin Yolları</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Düşük dinlenme kalp hızı, kardiyovasküler sağlığın önemli bir göstergesidir. Düzenli aerobik antrenman, kalbin her atışta daha fazla kan pompaladığı anlamına gelen "kalp hacmi artışı"na yol açar. Bu adaptasyon sayesinde kalp, aynı kanı pompalamak için daha az atış yapar; yani dinlenme kalp hızı düşer. Bu adaptasyon, haftalar-aylar içinde gelişir ve tutarlı aerobik egzersizle doğru orantılıdır. Elit dayanıklılık sporcularında dinlenme kalp hızı 30-40 atım/dk değerlerine kadar düşebilirken, hareketsiz bir yaşam süren biri için 70-90 atım/dk tipiktir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kalp Atış Hızı Yüksek Olunca Ne Yapmalı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Egzersiz sırasında kalp atış hızı planlanan bölgenin çok üzerine çıkıyorsa birkaç olası neden düşünülebilir: yetersiz uyku veya toparlanma, yüksek stres, dehidrasyon, hastalık ya da aşırı antrenman. Bu durumda "zorla" hedef kalp hızını tutturmaya çalışmak yerine tempo düşürmek ya da aktif dinlenme gününe geçmek çok daha akıllıca bir karardır. Kronik olarak yüksek dinlenme kalp hızı (sürekli 90'ın üzeri) bir sağlık profesyoneliyle değerlendirilmelidir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kalp Hızı Egzersizinde Saat vs. Hissedilen Efor</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kalp hızı monitörü kullanmak antrenman kalitesini artırır; ancak tek başına yeterli değildir. "Algısal efor skalası" (RPE, 0-10 arası), kalp hızıyla birlikte kullanıldığında çok daha bütünlüklü bir geri bildirim sağlar. Örneğin, bir kişi Bölge 3 kalp hızı gösterse de RPE 8-9 gibi çok yüksek hissediyorsa bu vücudun olağanüstü yorgunluğuna işaret edebilir. Cihaz verileri ile öznel his birlikte değerlendirildiğinde en doğru antrenman kararları alınır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sonuç olarak kalp hızı bölgeleri, antrenman planlamasını rastgele tahminden sistematik bir bilime dönüştüren güçlü bir araçtır. Hedeflerinize göre doğru bölgede çalışmak, hem daha hızlı sonuç almanızı hem de uzun vadede sağlıklı ve sürdürülebilir bir egzersiz hayatı kurmanızı sağlar.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderProteinTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Protein İhtiyacı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Protein İhtiyacı Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı hesaplayın.
          Kas yapımı, yağ yakımı veya genel sağlık için doğru protein miktarını öğrenin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Protein İhtiyacı <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Protein, vücudun en temel yapı taşıdır. Amino asitlerden oluşan bu makro besin; kaslar, organlar, enzimler, hormonlar, antikorlar ve hücre zarlarının yapımında kullanılır. Günlük protein ihtiyacı, vücut ağırlığına, aktivite düzeyine, yaşa ve spor hedefine göre önemli ölçüde değişir. Bu hesap makinesi, bilimsel araştırmalara dayalı kişiselleştirilmiş bir günlük protein hedefi sunar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Protein ihtiyacı hesaplamasının temeli, vücut ağırlığının kilogramı başına düşen gram miktarına (g/kg) dayanır. Hareketsiz bir yaşam süren yetişkin için minimum 0.8 g/kg yeterli görülse de bu değer, aktif bireyler ve sporcular için yetersiz kalır. Güncel spor bilimi araştırmaları, direnç antrenmanı yapan bireyler için <strong style="color:#fff">1.6-2.2 g/kg</strong> aralığını optimum kas gelişimi için önermektedir. Kalori kısıtlaması dönemlerinde ise bu aralığın üst sınırına çıkmak, kas kaybını önlemek açısından kritik önem taşır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesaplama yaparken <strong style="color:#fff">yağsız vücut kütlesi (YVK)</strong> üzerinden protein hedefi belirlemek daha doğru sonuçlar verir. Vücut yağ yüzdesi yüksek olan bireylerde toplam vücut ağırlığı üzerinden hesaplama yapılırsa protein hedefi abartılabilir. YVK = Toplam Kilo × (1 − Yağ Yüzdesi) formülüyle hesaplanan değer üzerinden belirlenen protein miktarı, gerçek fizyolojik ihtiyacı daha iyi yansıtır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Yaş faktörü de protein ihtiyacını doğrudan etkiler. 65 yaş üzeri bireylerde kas kaybı (sarkopeni) riski arttığından, günlük protein alımının 1.2-1.6 g/kg düzeyinde tutulması önerilir. Ergenlik dönemindeyse büyüme ve gelişim için ek protein gerekmektedir. Bu hesap makinesi yaşınızı hesaba katarak size uygun aralığı belirler.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Protein kaynaklarının kalitesi de miktarı kadar önemlidir. <strong style="color:#fff">Tam protein kaynakları</strong> — yumurta, et, tavuk, balık, süt ürünleri ve soya — tüm esansiyel amino asitleri içerir. Bitkisel protein kaynakları genellikle bir veya daha fazla esansiyel amino asit bakımından sınırlıdır; ancak çeşitli bitkisel kaynakların (baklagiller + tahıllar gibi) kombinasyonu eksiksiz bir amino asit profili sağlar. Whey protein, kazein ve bitkisel protein takviyeler de günlük hedefe ulaşmayı kolaylaştıran pratik seçeneklerdir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Protein sindirimine ilişkin önemli bir nokta: vücudun tek öğünde sindirebileceği protein miktarına dair eski "30-40 gram sınırı" artık bilimsel olarak desteklenmemektedir. Vücut, tüketilen tüm proteini zaman içinde işleyebilir; ancak öğün başına 30-50 gram protein tüketimi, kas protein sentezini optimize etmek açısından pratik bir hedef olarak değerini korumaktadır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Hedefe Göre <span style="color:#ccff00">Protein İhtiyacı</span>
          </h2>
          <div style="margin-top:1rem">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Kilo Verme</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">2.0 – 2.5 g/kg</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kalori açığında kas kaybını en aza indirmek için protein ihtiyacı artar. Yüksek protein, doygunluk hissini de destekler ve toplam kalori alımını doğal biçimde azaltmaya yardımcı olur.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Kas Kazanımı</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">1.6 – 2.2 g/kg</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kas protein sentezini maksimize etmek için yeterli amino asit temini gerekir. Bu aralığın üzerinde tüketmek ek kas kazanımı sağlamaz; fazla protein enerji olarak kullanılır.</p>
              </div>
              <div style="background:rgba(204,255,0,0.1);border:1px solid rgba(204,255,0,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#ccff00;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Genel Sağlık</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">0.8 – 1.2 g/kg</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Fiziksel aktivite yapmayan veya hafif aktif yaşayan bireyler için günlük minimum ihtiyaç. Bağışıklık sistemi, doku tamiri ve hormon üretimi için yeterli düzeyi karşılar.</p>
              </div>
            </div>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Protein zamalaması — öğünlerin gün içine nasıl dağıtıldığı — toplam protein miktarı kadar önemlidir. Araştırmalar, protein tüketimini güne eşit dağıtmanın (sabah, öğle, akşam ve antrenman sonrası) 24 saatlik kas protein sentezini artırdığını göstermektedir. Özellikle sabah kahvaltısında yeterli protein tüketmek, kahvaltıyı atlayan ya da düşük proteinli öğünle geçiştirenlere kıyasla belirgin bir avantaj sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Antrenman sonrası protein penceresi ise gerçektir ancak çok dar değildir. Egzersizin ardından 2-3 saat içinde protein tüketmek, kas sentezini desteklemek için yeterlidir. 30 dakikalık "anabolik pencere" fikri abartılmıştır. Günlük toplam protein hedefini karşılamak ve düzenli aralıklarla protein tüketmek, zamanlama kaygısından çok daha etkili bir stratejidir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Günlük Protein Hedefine <span style="color:#ccff00">Nasıl Ulaşırsın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesaplanan protein hedefine düzenli olarak ulaşmak, fitness sürecinin en zorlu pratik parçalarından biridir. Özellikle 150-200 gram gibi yüksek protein hedefleri, dikkatli planlama ve doğru gıda seçimleri gerektir. İşte bu hedefe sistematik biçimde ulaşmak için kanıtlanmış stratejiler:
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Gıda başına protein yoğunluğunu bilmek</strong> ilk adımdır. 100 gram pişmiş tavuk göğsü yaklaşık 31g, yumurta (1 adet) 6g, 100g lor peyniri 12g, 100g yağsız kırmızı et 28g, 100g somon 25g protein içerir. Bu değerleri yaklaşık olarak ezberlemek, çeşitli öğünleri makul bir eforla hedefle uyumlu hale getirmenizi sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Her öğüne bir protein kaynağı koymak</strong> en etkili pratik alışkanlıktır. Kahvaltıda yumurta veya süzme peynir, öğle yemeğinde tavuk veya ton balığı, akşamda kırmızı et veya balık planlamak; günlük hedefe otomatik biçimde yaklaşmanızı sağlar. Öğün atlamak protein hedefini tutturmayı ciddi ölçüde güçleştirir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Protein takviyeleri, diyetten yeterli protein almakta zorlananlara pratik bir çözüm sunar. 1 ölçek whey protein tozu genellikle 20-25g protein içerir ve düşük kalori yüküyle bu gramajı karşılamanın en hızlı yoludur. Ancak takviyelerin gerçek gıdaların yerini tutamayacağını hatırlatmak gerekir; gerçek gıdalar, protein dışında pek çok mikro besin ve faydalı bileşik sunar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak: hesaplanan protein hedefi her gün tam olarak tutturulmak zorunda değildir. Haftalık ortalamaya odaklanmak daha sürdürülebilir bir yaklaşımdır. Sosyal etkinlikler, yoğun iş günleri veya seyahat dönemlerinde hedefin biraz altında kalmak, genel ilerlemeyi anlamlı biçimde etkilemez. Önemli olan, tutarlı bir haftalık ortalamayı korumaktır.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Protein Alımı Hakkında <span style="color:#ccff00">Doğru Bilinen Yanlışlar ve Sık Sorulan Sorular</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Günde ne kadar protein almalıyım?" sorusu, spor ve beslenme alanında en çok aranan sorulardan biridir. Yanıt kişisel koşullara göre değişse de bilimsel literatürde bu konuda giderek güçlenen bir fikir birliği mevcuttur. Yanlış anlamalar ise genellikle iki uçta kümelenmektedir: ya protein alımı yetersiz kalır ya da "ne kadar çok o kadar iyi" mantığıyla gerektiğinden fazla tüketilir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Çok Fazla Protein Böbreklere Zarar Verir Mi?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu, spor dünyasının en köklü efsanelerinden biridir. Araştırmalar, böbrek fonksiyonu sağlıklı olan bireyler için yüksek protein alımının (3 g/kg'a kadar) böbrek sağlığını olumsuz etkilemediğini ortaya koymaktadır. Böbrek hastalığı veya böbrek yetmezliği olan bireyler için protein kısıtlaması gerekebilir; ancak bu durum, sağlıklı bireylere genelleştirilemez. Dünya genelinde milyonlarca sporcu yıllarca yüksek protein alımını sürdürmekte ve böbrek sorunu yaşamamaktadır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Bitkisel Protein Hayvansal Proteinle Aynı Etkiyi Sağlar Mı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bitkisel proteinlerin kas sentezi açısından hayvansal proteinlerden daha az etkili olduğu bilinmektedir; ancak bu fark yeterli miktarda ve doğru kombinasyonlarla büyük ölçüde kapatılabilir. Temel sorun, çoğu bitkisel proteinin düşük lösin içeriğidir. Lösin, kas protein sentezini tetikleyen en kritik amino asittir. Soya, lösin bakımından en zengin bitkisel protein kaynağıdır ve hayvansal proteinlere en yakın kas senteziuyarımını sağlar. Bezelye ve pirinç protein kombinasyonu da (50/50) eksiksiz bir amino asit profili oluşturur.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Yaşlılıkta Protein İhtiyacı Artar Mı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Evet, önemli ölçüde. 60 yaş üzerinde kas dokusunun yenilenmesi için gereken uyarım eşiği yükselir; bu fenomene "anabolik direnç" denir. Başka bir deyişle, aynı miktarda kas sentezi için daha fazla protein gerekmektedir. Güncel araştırmalar, 65 yaş üzeri bireyler için kilogram başına en az 1.2-1.6 gram protein önermekte; bazı uzmanlar bu aralığın 2.0 g/kg'a kadar çıkılabileceğini savunmaktadır. Bu konuda bilinç oluşturmak özellikle önemlidir çünkü yaşlılıkta kas kaybı (sarkopeni) bağımsız yaşamı ve genel sağlığı tehdit eden en önde gelen faktörlerden biridir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Sabahları Protein Tüketmek Neden Bu Kadar Önemli?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Uyku sırasında 7-9 saatlik oruç sonrası vücut, kas protein yıkımı üstün gelmeye başlar. Sabah yüksek protein içeren bir kahvaltı, bu yıkım sürecini anabolizm (yapım) lehine döndürür. Araştırmalar, sabah kahvaltısına 30-40 gram protein eklemenin günlük toplam protein sentezini öğleden ve akşamdan alınan eşdeğer miktarına kıyasla anlamlı biçimde artırdığını ortaya koymaktadır. Bu nedenle sabah kahvaltısını atlamak veya düşük proteinli geçiştirmek, özellikle kas koruma ve gelişimi hedefleyenler için maliyetli bir alışkanlıktır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesini üç ayda bir yeniden kullanmanızı öneririz. Kilo, aktivite düzeyi veya hedef değiştikçe optimum protein miktarı da değişir. Güncel verilerle hesaplanmış bir protein hedefi, hem sonuç almanızı hızlandırır hem de kaynaklarınızı en verimli şekilde kullanmanızı sağlar.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderDinlenmeTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Dinlenme Süresi</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Set Arası Dinlenme Süresi Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Antrenman hedefinize ve egzersiz türüne göre ideal set arası dinlenme süresini hesaplayın.
          Bilimsel verilere dayalı dinlenme programıyla antrenman kalitesini artırın.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Setler Arası Dinlenme <span style="color:#ccff00">Neden Önemlidir?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Setler arası dinlenme süresi, antrenman programlamasının en sık göz ardı edilen ancak en belirleyici değişkenlerinden biridir. Doğru dinlenme süresini seçmek; performansı, kas uyarımını, hormonsal yanıtı ve enerji sistemlerinin kullanımını doğrudan etkiler. "Ne kadar dinlenmeliyim?" sorusunun yanıtı ise hedef, egzersiz türü ve bireysel toparlanma kapasitesine göre değişir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Dinlenmenin fizyolojik temeli <strong style="color:#fff">ATP-PCr (fosfokreatin) sisteminin yenilenmesine</strong> dayanır. Yüksek yoğunluklu kısa süreli egzersizlerde (ağır kaldırma, sprintle vb.) birincil enerji kaynağı olan PCr, kas hücrelerinde sınırlı miktarda depolanır ve kasılmalar sırasında hızla tükenir. Tam yenilenmesi için yaklaşık <strong style="color:#fff">3-5 dakika</strong> gerekmektedir. Kısa dinlenme süreleriyle tekrar eden yüksek yoğunluklu setler, yorgunlukla birlikte performans düşüşüne yol açar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Laktik asit birikimi de dinlenme ihtiyacını etkileyen önemli bir faktördür. Orta-yüksek tekrarlı setlerde (8-15 tekrar) artan laktat konsantrasyonu, kas asitliğini yükselterek kasılma kapasitesini düşürür. Bu asidik ortamın temizlenmesi, hem oksijene hem de zaman gerektirir. Bu nedenle metabolik stres odaklı antrenmanlarda 60-90 saniyelik dinlenme süreleri, bu birikimi yönetmek için yeterlidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sinir sistemi yorgunluğu da göz ardı edilmemesi gereken bir boyuttur. Özellikle maksimal ya da maksimale yakın yüklerle yapılan egzersizler (güç antrenmanı, olimpik kaldırışlar) merkezi sinir sistemini yoğun biçimde zorlar. Bu tür egzersizlerde kas yorgunluğunun çok ötesinde bir toparlanma zamanı gereklidir; 3-5 dakika hatta bazı durumlarda daha uzun süreler uygundur.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu hesap makinesi, seçtiğiniz egzersiz türü ve hedefinizi dikkate alarak bilimsel literatüre dayalı bir dinlenme süresi önerisi sunar. Kronometreyle ölçülen disiplinli dinlenme, "hissettiğinizde başlamak"tan çok daha tutarlı antrenman kalitesi sağlar.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Hedefe Göre <span style="color:#ccff00">Dinlenme Süreleri</span>
          </h2>
          <div style="margin-top:1rem">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Maksimal Güç</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">3 – 5 dakika</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">%85-100 1RM yüklerinde çalışılırken PCr sisteminin tam yenilenmesi ve sinir sistemi toparlanması için uzun dinlenme şarttır. Kısa dinlenme güç çıktısını ciddi ölçüde düşürür.</p>
              </div>
              <div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#fb923c;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Hipertrofi (Kas Büyümesi)</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">60 – 90 saniye</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Metabolik stres ve hormonsal tepkiyi (büyüme hormonu, testosteron) artırmak için kas henüz tam toparlanmadan bir sonraki sete geçilir. Sürdürülebilir yorgunluk birikimi hedeflenir.</p>
              </div>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Güç Dayanıklılığı</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">30 – 60 saniye</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kısa dinlenme süreleriyle birikimli yorgunlukla çalışmak kardiyovasküler kapasiteyi ve kas dayanıklılığını artırır. Devre antrenmanları ve yüksek yoğunluklu interval programları bu aralığı kullanır.</p>
              </div>
              <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Genel Kondisyon</div>
                <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">45 – 90 saniye</div>
                <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Genel fitness hedefli antrenmanlarda esneklik önemlidir. Ağırlık, tekrar sayısı ve kişisel toparlanma kapasitesine göre bu aralıkta ince ayar yapılabilir.</p>
              </div>
            </div>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Önemli bir not: bu süreler genel kılavuz niteliğindedir. Bireysel toparlanma kapasitesi, yaş, kondisyon düzeyi, uyku kalitesi ve beslenme durumu bu süreleri etkileyebilir. Deneyimli sporcular, yeni başlayanlardan daha hızlı toparlanabilirken 40 yaş üzeri bireyler için dinlenme sürelerinin biraz uzatılması performansı koruyabilir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Dinlenme Sürecini <span style="color:#ccff00">Nasıl Optimize Etmelisin?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Dinlenme süreci sadece pasif bekleme değildir; bu zamanı bilinçli kullanmak antrenman kalitesini artırır. Setler arasında yapabileceğiniz şeyler arasında hafif germeler (statik değil, dinâmik), nefes kontrolü egzersizleri, antagonist kas grupları için hafif aktivasyonlar veya zihinsel hazırlık yer alabilir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Süperset ve drop set</strong> tekniklerinde dinlenme zamanlaması farklılaşır. Zıt kas gruplarının süperseti (örn. biceps + triceps) her iki egzersiz için de ayrı ayrı 30-45 saniyelik pasif dinlenme sağlarken toplam antrenman süresini kısaltır. Drop setlerde ise ağırlığı azaltarak hemen devam edilir; bu nedenle setler arası dinlenmeye gerek kalmaz.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Uzun antrenman seanslarında dinlenme sürelerinin kümülatif etkisi ciddi biçimde uzar. 4 set × 8 egzersiz × 2 dakika dinlenme = 64 dakika yalnızca beklemeyle geçer. Dinlenme sürelerini hedefe göre optimize etmek, antrenman süresini kısaltırken yoğunluğu artırır. Bu sayede daha kısa ama daha kaliteli seanslar mümkün olur.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Setler arası dinlenmeyi izlemek için bu uygulamayı ya da spor saatinizdeki kronometre özelliğini kullanın. "Hazır hissedince başlarım" yaklaşımı, araştırmalarda tutarsız dinlenme sürelerine ve dolayısıyla tutarsız performansa yol açtığı gösterilmiştir. Dinlenme sürelerini standartlaştırmak, antrenman yüküne ilişkin nesnel veri toplamanıza ve ilerlemeyi doğru izlemenize imkân tanır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak set arası dinlenmeyi nefes alışverişinizle ilişkilendirmek pratik bir kural sunar: nefes hızınız normale döndüğünde veya bir sonraki seti tam güçle yapabilecek kadar toparlandığınızı hissettiğinizde başlayın. Bu özellikle ileri düzey sporcular için, egzersiz türüne ve yoğunluğa göre dinamik dinlenme sürelerini kullananlar için değerli bir tamamlayıcı stratejidir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Kas Toparlanması ve Uyku: <span style="color:#ccff00">Göz Ardı Edilen Bağlantı</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Antrenman aralarında ne kadar dinlenmeliyim?", "Kaslar ne kadar sürede toparlanır?", "Uyku gerçekten bu kadar önemli mi?" — bu sorular sporseverler tarafından sıkça araştırılmaktadır. Bu rehberde, dinlenme ve toparlanma sürecinin fizyolojisini ve pratik optimizasyon yollarını açıklıyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Kaslar Ne Zaman Büyür: Antrenman Sırasında mı, Sonrasında mı?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Çok yaygın bir yanılgıyı düzeltmek gerekir: kaslar antrenman sırasında değil, sonrasında büyür. Egzersiz, kas dokusunda mikroskobik hasarlar oluşturur; bu hasar, vücudun onarım ve yeniden yapılanma sürecini tetikler. Bu süreç 24-72 saat arasında sürebilir ve sürenin uzunluğu kas grubuna, antrenman yoğunluğuna ve bireyin toparlanma kapasitesine bağlıdır. Kaslar hasardan daha güçlü onarılarak büyür; bu "süperameli" (supercompensation) olarak bilinir. Yeterli dinlenme vermeksizin aynı kas grubunu tekrar tekrar çalıştırmak bu süreci engeller.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Uyku Esnasında Vücutta Ne Olur?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Uyku, antrenman adaptasyonunun gerçekleştiği birincil zaman dilimidir. Derin uyku (slow-wave sleep) evrelerinde büyüme hormonu (GH) günlük salgısının yüzde 70-80'i gerçekleşir. Büyüme hormonu, protein sentezini teşvik eder, yağ asitlerini enerji olarak mobilize eder ve kas dokusunu onarır. Bu nedenle yetersiz uyku, antrenmanın büyük bölümünün boşa gitmesi anlamına gelir: egzersiz yaptınız, uyarım oluşturdunuz, ancak adaptasyonun gerçekleşeceği ortamı sağlamadınız.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Araştırmalar, uyku kalitesini ve süresini iyileştirmenin kas gücü, reaksiyon süresi, kardiyovasküler dayanıklılık ve yaralanma riskini anlamlı biçimde etkilediğini göstermektedir. Stanford Üniversitesi'nin basketbolcularla yürüttüğü bir çalışmada, uyku süresi 10 saate çıkarılan oyuncuların sprint süreleri hızlandı, serbest atış isabetliliği arttı ve genel performans anlamlı biçimde iyileşti.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Toparlanmayı Hızlandıran Kanıtlanmış Stratejiler</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Aktif dinlenme:</strong> Yoğun antrenmandan sonraki gün hafif yürüyüş, yüzme veya yoga gibi düşük yoğunluklu aktiviteler, kan akışını artırarak metabolik atıkların uzaklaştırılmasını hızlandırır. Pasif dinlenmeye (tamamen hareketsiz kalmak) kıyasla aktif dinlenme, kas yorgunluğunu genellikle daha hızlı giderir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Soğuk-sıcak kontrast terapi:</strong> Soğuk su banyosu veya kontrast duş (soğuk-sıcak dönüşümlü), özellikle yoğun antrenmandan sonra inflamasyonu azaltır ve toparlanmayı destekler. Araştırmalar bu yöntemin kas ağrısını yüzde 20-30 azaltabileceğini göstermektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Beslenme zamanlaması:</strong> Antrenman sonrası 30-60 dakika içinde protein ve karbonhidrat kombinasyonu tüketmek, kas glikojen depolarını hızla yenileyerek iyileşmeyi optimize eder. Bu "anabolik pencere" artık eskisi kadar dar görülmese de antrenmandan hemen sonra beslenmek hâlâ en akıllıca stratejidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Setler arasındaki dinlenme süreleri kadar günler arasındaki dinlenme de büyük önem taşır. Bu hesap makinesini antrenman sırasında kullanarak setler arası dinlenmeyi optimize edin; günlük ve haftalık toparlanma düzeninizi ise uyku kalitesi ve aktif dinlenme günleriyle destekleyin.
            </p>
          </div>
        </div>

      </main>
    </div>
  `;
}

export function renderBoyKiloEndeksiTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Boy Kilo Endeksi</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Boy Kilo Endeksi Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Boy ve kilonuzu kullanarak vücut ağırlığı endeksinizi hesaplayın.
          Sağlıklı kilo aralığınızı öğrenin ve vücut kompozisyonunuzu değerlendirin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


        <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Boy Kilo Endeksi <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Boy Kilo Endeksi (BKE), vücut ağırlığını boy ile karşılaştıran ve sağlık riskini değerlendirmeye yardımcı olan bir ölçümdür. Bu hesap makinesinde kullanılan endeks, geleneksel VKİ formülünden farklı bir yaklaşım benimseyerek boya göreli ağırlık dağılımını değerlendirir. Özellikle Çin ve Uzak Doğu kaynaklı tıp araştırmalarında yaygın kullanım alanı bulan bu yöntem, Asya popülasyonuna özgü sağlık riski eşiklerini daha doğru yansıtır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Standart VKİ hesabında boy'un karesi paydada yer alırken, bazı boy kilo endeksi uygulamaları farklı ağırlıklandırma faktörleri kullanır. Bu yaklaşım, boy ile kilo arasındaki orantısallık ilişkisini farklı bir perspektiften ele alarak aynı VKİ değerine sahip ancak farklı boylu bireyler arasındaki sağlık farklılıklarını daha iyi açıklamaya çalışır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Hesap makinesinin pratik kullanımında boy ve kilo bilgilerini doğru girmek kritik önem taşır. Boy için sabah ölçümü tercih edilmeli, kilo için ise sabah aç karnına tartılmalıdır. Bu tutarlılık, zaman içinde yapılan karşılaştırmaların güvenilirliğini artırır. Ölçüm sıklığı olarak ayda bir değerlendirme, hem günlük su/besin dalgalanmalarını elimine eder hem de gerçek eğilimi görmek için yeterli süreyi sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Boy kilo endeksi değerini tek başına kullanmak yerine bel çevresi, vücut yağ yüzdesi ve bel-kalça oranı gibi tamamlayıcı metriklerle birlikte değerlendirmek, çok daha kapsamlı bir sağlık tablosu ortaya koyar. Hiçbir tek ölçüm aracı vücudun tüm karmaşıklığını tam olarak yansıtamaz; bu yüzden farklı araçların kombinasyonu her zaman daha değerli bilgiler sunar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Genel nüfus düzeyinde epidemiyolojik çalışmalarda ve klinik pratik takipte kullanışlı olan bu endeks, birey bazında kesin tanı için değil yönlendirici bir değerlendirme aracı olarak ele alınmalıdır. Herhangi bir sağlık endişeniz varsa, bu değerleri bir sağlık profesyoneliyle birlikte yorumlamanızı öneririz.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Sonuçları <span style="color:#ccff00">Nasıl Yorumlamalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Boy kilo endeksi değerlendirmesinde yalnızca anlık sonuca değil, zamanla nasıl değiştiğine odaklanmak daha değerlidir. Tek bir ölçüm, vücudun mevcut durumunun anlık bir fotoğrafı iken; aylık ölçümlerin takibi, beslenme ve egzersiz alışkanlıklarınızın gerçek etkisini ortaya koyar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Endeks değerinizin önerilen aralığın üzerinde olması; kalori dengesi, besin kalitesi ve fiziksel aktivite düzeyi konularında iyileştirme yapılabileceğine işaret eder. Bu durumda öncelikli strateji genellikle şunlardır: günlük kalori alımını TDEE'nin altında tutmak, işlenmiş besinleri azaltmak, düzenli aerobik ve direnç antrenmanına başlamak.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Değeriniz önerilen aralığın altındaysa, bu yetersiz kalori alımı veya düşük kas kütlesinin göstergesi olabilir. Özellikle ağırlık kazanmakta zorlanan "hard gainer" bireyler için yüksek kalorili, besin değeri zengin bir beslenme planı ve sistematik direnç antrenmanı kombinasyonu en etkili yaklaşımdır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Endeks değeriniz sağlıklı aralıkta olsa bile, bel çevresi veya vücut yağ yüzdesi yüksekse bu "normal kilolu obezite" (TOFI — Thin Outside, Fat Inside) durumuna işaret edebilir. Bu nedenle boy kilo endeksini her zaman diğer ölçümlerle birlikte değerlendirmek önemlidir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Sağlıklı Boy Kilo Dengesi İçin <span style="color:#ccff00">Ne Yapmalısın?</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sağlıklı bir boy kilo dengesini korumak, anlık diyet ya da kısa süreli yoğun egzersiz programlarıyla değil; sürdürülebilir yaşam tarzı alışkanlıklarıyla mümkündür. Araştırmalar, kısa vadeli agresif yaklaşımların büyük çoğunlukla "yo-yo" etkisiyle sonuçlandığını ve başlangıç noktasına veya daha kötüsüne dönüşle bittiğini göstermektedir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Beslenme açısından en etkili strateji; belirleyici kurallarla değil, <strong style="color:#fff">besin yoğunluğuyla</strong> düşünmektir. Yani aynı kaloriyle ne kadar fazla besin değeri (vitamin, mineral, protein, lif) alabileceğinize odaklanmak. Sebzeler, meyveler, baklagiller, tam tahıllar ve kaliteli protein kaynakları bu prensip için ideal gıdalardır.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Egzersiz açısından ise çeşitlilik ve tutarlılık bütünlüğün anahtarıdır. Haftada en az 150 dakika orta yoğunlukta aerobik aktivite (Dünya Sağlık Örgütü önerisi) ve haftada en az iki gün tüm vücudu kapsayan direnç antrenmanı, sağlıklı vücut ağırlığını korumak ve kardiyovasküler sağlığı desteklemek için bilimsel olarak kanıtlanmış minimumları temsil eder.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Günlük adım sayısı ve genel hareket düzeyi de göz ardı edilmemelidir. Günde 8.000-10.000 adım atılması, antrenman dışı enerji harcamasını (NEAT) artırarak toplam kalori yakımını önemli ölçüde yükseltir. Bu nedenle "antrenman yaptım, geri kalanında hareketsizim" yaklaşımı yerine, gün boyunca aktif kalmak hedeflenmeli; merdiven, yürüyüş ve ayakta çalışma gibi küçük aktiviteler desteklenmelidir.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak uyku ve stres yönetimi, vücut ağırlığı kontrolünde düşünüldüğünden çok daha büyük bir rol oynar. Kronik uyku yoksunluğu ve yüksek stres; iştah düzenleyici hormonları (ghrelin ve leptin) bozarak aşırı yemeye ve yağ birikimine zemin hazırlar. Sağlıklı bir boy kilo dengesi, yalnızca ne yediğiniz ve ne kadar hareket ettiğinizle değil; ne kadar uyuduğunuz ve stresi nasıl yönettiğinizle de şekillenir.
            </p>
          </div>
        </div>

        
        <div style="margin-top:3rem">
          <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
            Sağlıklı Vücut Ağırlığı İçin <span style="color:#ccff00">Bütünsel Yaşam Tarzı Rehberi</span>
          </h2>
          <div style="margin-top:1rem">
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sağlıklı bir vücut ağırlığını sürdürmek, yalnızca ne yediğiniz ve ne kadar hareket ettiğinizle sınırlı değildir. Modern araştırmalar, uyku, stres, sosyal bağlar ve çevre faktörlerinin de vücut ağırlığını belirlemede önemli roller üstlendiğini ortaya koymaktadır. Bu rehberde, boy kilo endeksinizi ve genel sağlık durumunuzu iyileştirmek için kanıtlanmış bütünsel stratejileri ele alıyoruz.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Türkiye'de Boy Kilo İlişkisi: Ne Bilmek Gerekir?</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Türkiye İstatistik Kurumu verilerine göre Türkiye'deki yetişkin nüfusun yaklaşık yüzde 32'si obez, yüzde 35'i ise fazla kilolu kategorisinde yer almaktadır. Bu oran, son otuz yılda yaklaşık üç katına çıkmıştır. Hızlı kentleşme, sedanter yaşam tarzı, işlenmiş gıdalara artan erişim ve stres bu artışın başlıca nedenleri arasında sayılmaktadır. Bu bağlamda kendi ağırlık durumunuzu düzenli olarak takip etmek, kişisel sağlık yönetiminin kritik bir parçasıdır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Çevre Düzenlemesi: Sağlıklı Yemeyi Kolaylaştırın</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Araştırmalar, kararlarımızın büyük bölümünün bilinçli tercihten değil çevre koşullarından şekillendiğini göstermektedir. "Çevre düzenlemesi" bu gerçeği avantaja dönüştürür: mutfakta sağlıklı gıdaları göz hizasına koyun, işlenmiş atıştırmalıkları görünmez alanlara kaldırın. Akşam yemeklerini küçük tabaklarda servis etmek — araştırmalara göre yüzde 20-30 daha az yenilmesini sağlar — gibi basit fiziksel değişiklikler, irade gücü gerektirmeksizin kalori alımını azaltabilir.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Sosyal Çevrenin Kilo Üzerindeki Etkisi</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Nicholas Christakis ve James Fowler'ın çığır açan araştırması, obezitenin sosyal ağlar üzerinden yayılabildiğini ortaya koydu. Yakın çevrenizde obezite olan kişilerin sayısı arttıkça, sizin de obez olma olasılığınız belirgin biçimde artmaktadır. Bunun tersi de geçerlidir: aktif ve sağlıklı beslenen bir sosyal çevre, sağlıklı davranışları pekiştirir. Bu bulgu, partnerlerin veya arkadaş gruplarının birlikte egzersiz yapmasının ve sağlıklı beslenmesinin neden bu kadar etkili olduğunu açıklamaktadır.
            </p>
            <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Vücut Ağırlığını Yönetmede Mikrobiyomun Rolü</h3>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bağırsak mikrobiyomu, son on yılın en heyecan verici araştırma alanlarından biridir. Araştırmalar, bağırsak bakteri çeşitliliğinin enerji metabolizması, yağ depolama eğilimi ve iştah hormonları üzerinde doğrudan etkisi olduğunu ortaya koymaktadır. Fermente gıdalar (yoğurt, kefir, turşu), yüksek lifli besinler ve polifenol açısından zengin besinler (meyveler, sebzeler, zeytinyağı) bağırsak mikrobiyomunu olumlu yönde şekillendirir ve böylece vücut ağırlığı yönetimine dolaylı ama gerçek bir katkı sağlar.
            </p>
            <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Boy kilo endeksinizi düzenli aralıklarla bu hesap makinesiyle takip etmek, sağlık yolculuğunuzdaki değişimleri nesnel biçimde görmenizi sağlar. Sayılara odaklanmak değil, ama sayıların anlattığı hikâyeyi dinlemek — işte sağlıklı yaşamın özü budur.
            </p>
          </div>
        </div>

        

      </main>
    </div>
  `;
}

export function renderBelKalcaOraniTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Bel Kalça Oranı</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Bel Kalça Oranı Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Bel ve kalça ölçümlerinizle kardiyovasküler sağlık riskinizi değerlendirin.
          WHO standartlarına göre yağ dağılımınızı analiz edin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


          <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              Bel Kalça Oranı <span style="color:#ccff00">Nedir?</span> Nasıl Hesaplanır?
            </h2>
            <div style="margin-top:1rem">
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bel-kalça oranı (BKO), bel çevresinin kalça çevresine bölünmesiyle elde edilen basit ancak bilgilendirici bir sağlık göstergesidir. Bu oran, vücuttaki yağ dağılımını değerlendirmek ve özellikle karın bölgesindeki visseral yağ birikimini tespit etmek amacıyla dünya genelinde yaygın biçimde kullanılmaktadır. Dünya Sağlık Örgütü, bu ölçümü kronik hastalık riskini değerlendirmede standart bir araç olarak benimsemiştir.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Formül son derece basittir: <strong style="color:#fff">BKO = Bel Çevresi (cm) ÷ Kalça Çevresi (cm)</strong>. Örneğin bel çevresi 80 cm, kalça çevresi 100 cm olan biri için BKO = 80 ÷ 100 = 0.80'dir. Bu değer cinsiyete göre farklı risk eşiklerine karşılık gelir.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Doğru ölçüm için bel çevresini göbek hizasında (genellikle kaburgalar ile kalça kemikleri arasındaki en dar noktada), kalça çevresini ise en geniş noktasından ölçmek gerekir. Ölçümü sabah aç karnına ve derin bir nefes verildikten sonra yapmak, tutarlı sonuçlar için önerilir. Bant, cilde yapışmadan ancak sarkmadan saracak şekilde tutulmalıdır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">BKO'nun önemi, yalnızca genel obeziteyi değil <strong style="color:#fff">yağ dağılımını</strong> ölçmesinden kaynaklanır. "Armut tipi" vücut (kalça-uyluk bölgesinde yağ birikimi) ve "elma tipi" vücut (karın bölgesinde yağ birikimi) aynı VKİ değerine sahip olabilir; ancak sağlık riskleri açısından önemli farklılıklar taşır. Elma tipi yağ dağılımı, tip 2 diyabet, hipertansiyon, kardiyovasküler hastalıklar ve metabolik sendromla çok daha güçlü bir ilişki içindedir.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">VKİ ile kıyaslandığında BKO, visseral (iç organ) yağı saptamada daha başarılı bir göstergedir. Araştırmalar, BKO'nun kardiyovasküler hastalık riskini VKİ'den daha iyi öngördüğünü ortaya koymaktadır. Bu yüzden her ikisini birlikte kullanmak, sağlık risklerinizi en kapsamlı biçimde değerlendirmenizi sağlar.
              </p>
            </div>
          </div>

          
          <div style="margin-top:3rem">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              BKO Değerleri <span style="color:#ccff00">Ne Anlama Gelir?</span>
            </h2>
            <div style="margin-top:1rem">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;margin:1rem 0">
                <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Düşük Risk (Erkek)</div>
                  <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">BKO ≤ 0.90</div>
                  <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Karın bölgesinde aşırı yağ birikimi yok. Kardiyovasküler ve metabolik hastalık riski normal popülasyon düzeyinde. Mevcut sağlıklı yaşam tarzını korumak yeterlidir.</p>
                </div>
                <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#4ade80;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Düşük Risk (Kadın)</div>
                  <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">BKO ≤ 0.80</div>
                  <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Kadınlarda fizyolojik olarak daha geniş kalça yapısı nedeniyle risk eşiği erkeklerden düşük tutulur. Bu aralıkta sağlıklı yağ dağılımı görülmektedir.</p>
                </div>
                <div style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#facc15;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Orta Risk</div>
                  <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">Erkek: 0.91-0.99 / Kadın: 0.81-0.85</div>
                  <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Metabolik sendrom ve kardiyovasküler risk belirgin biçimde yükselir. Beslenme ve egzersiz alışkanlıklarının gözden geçirilmesi önerilir.</p>
                </div>
                <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#f87171;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Yüksek Risk</div>
                  <div style="color:#fff;font-weight:700;font-size:0.875rem;margin-bottom:0.5rem">Erkek: ≥ 1.0 / Kadın: ≥ 0.86</div>
                  <p style="color:#6b7280;font-size:0.8rem;line-height:1.6;margin:0.5rem 0">Visseral yağ birikimi tehlikeli düzeye ulaşmıştır. Profesyonel tıbbi değerlendirme ve kapsamlı yaşam tarzı müdahalesi önerilir. Metabolik hastalık riski çok yüksektir.</p>
                </div>
              </div>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Menopoz sonrası kadınlarda yağ dağılımı armut tipinden elma tipine kayabilir ve BKO yükselebilir. Bu fizyolojik bir değişimdir ve hormon dengesindeki dönüşümün bir yansımasıdır. Bu dönemde bel çevresini düzenli takip etmek ve aktivite düzeyini yüksek tutmak, bu değişimi en aza indirmenin en etkili yoludur.
              </p>
            </div>
          </div>

          
          <div style="margin-top:3rem">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              BKO'yu Fitness Sürecinde <span style="color:#ccff00">Nasıl Kullanmalısın?</span>
            </h2>
            <div style="margin-top:1rem">
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">BKO, kilo verme sürecinde ölçek üzerindeki kilogram değişiminden çok daha anlamlı bir gelişme göstergesidir. Kilonuz aynı kalsa bile bel çevreniz azalıyorsa, bu yağ kütlesini kaybedip kas kütlesi kazandığınıza — vücut kompozisyonunun iyileştiğine — işaret eder. Bu nedenle egzersiz ve beslenme programınıza başlarken BKO değerinizi not alın ve aylık takip edin.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bel çevresini azaltmanın en etkili stratejisi; kalori açığı, yeterli protein alımı ve özellikle karın bölgesi visseral yağını hedef alan egzersizlerin kombinasyonudur. Önemli bir not: bölgesel yağ yakımı (spot reduction) bilimsel olarak kanıtlanmamış bir kavramdır. Mekik yapmak karın yağını doğrudan eritmez; ancak genel vücut yağını azaltan bir program, bel çevresini de küçültür.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Aerobik egzersizler — özellikle orta ve yüksek yoğunluklu kardiyovasküler aktiviteler — visseral yağı azaltmada en etkili egzersiz türü olarak öne çıkmaktadır. Direnç antrenmanı ile kombine edildiğinde ise hem yağ azalır hem de kasa dönüşüm sağlanır; bu da BKO'yu en hızlı iyileştiren kombinasyondur.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Uyku kalitesi ve stres yönetimi de BKO üzerinde doğrudan etkilidir. Yetersiz uyku ve kronik stres, kortizol hormonunu yükselterek özellikle karın bölgesinde yağ birikimine zemin hazırlar. Bu nedenle beslenme ve egzersiz kadar uyku hijyenine ve stres azaltma tekniklerine dikkat etmek, bel çevresini kontrol altında tutmanın önemli bir parçasıdır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">BKO ölçümünü her iki ayda bir tekrarlamak ilerlemenizi nesnel biçimde değerlendirmenizi sağlar. Ölçümü her seferinde aynı koşullarda (aynı saat, aynı açlık durumu, aynı teknik) yapmak, değişimlerin gerçek anlamda yorumlanabilmesi için şarttır.
              </p>
            </div>
          </div>

          
          <div style="margin-top:3rem">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              Bel Çevresini Küçültmenin <span style="color:#ccff00">Bilimsel Yolları ve Sık Sorulan Sorular</span>
            </h2>
            <div style="margin-top:1rem">
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Bel incelme egzersizleri neler?", "Göbek yağını yakmanın en hızlı yolu nedir?", "Bel kalça oranı nasıl düzeltilir?" — bu sorular fitness dünyasının en çok aranan konuları arasındadır. Bu rehberde bilimsel kanıtlara dayalı, gerçekçi ve uygulanabilir yanıtlar sunuyoruz.
              </p>
              <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Mekik Yapmak Göbeği Eritir Mi?</h3>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu en yaygın yanılgılardan biridir. Mekik (crunch) ve benzeri karın egzersizleri, karın kaslarını güçlendirir ve geliştirir; ancak üzerlerindeki yağ dokusunu doğrudan eritmez. "Bölgesel yağ yakımı" (spot reduction) bilimsel olarak defalarca çürütülmüş bir kavramdır. Bel çevresini gerçekten küçülten şey, genel vücut yağ yüzdesini düşüren sistematik bir yaklaşımdır. Karın antrenmanları bu hedef için destekleyici ama başlı başına yeterli değildir.
              </p>
              <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Visseral Yağı Azaltmanın En Hızlı Yolu</h3>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İyi haber şudur: visseral yağ, cilt altı yağa kıyasla diyet ve egzersiz müdahalelerine çok daha hızlı yanıt verir. Yüksek yoğunluklu interval antrenmanı (HIIT), visseral yağ azaltmada geleneksel düşük yoğunluklu kardiyoya kıyasla daha etkili olduğunu gösteren araştırmalar mevcuttur. Haftada 3 kez 20-30 dakikalık HIIT seansı, aylık bel çevresi ölçümlerinde gözle görülür fark yaratabilir. Direnç antrenmanı da visseral yağ azaltmada aerobik egzersizle karşılaştırılabilir sonuçlar vermektedir; özellikle bu ikisinin kombinasyonu en yüksek etkinliği sağlar.
              </p>
              <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Beslenmenin Bel Çevresi Üzerindeki Etkisi</h3>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İşlenmiş gıdalar, rafine karbonhidratlar ve trans yağlar visseral yağ birikimini tetikleyen başlıca besin faktörleridir. Öte yandan yüksek lif içeren diyet (günlük 25-30 gram hedef), visseral yağ azaltmayla güçlü biçimde ilişkilidir. Meğerse lifin en önemli faydalarından biri, bağırsak mikrobiyomunu olumlu yönde şekillendirerek iltihaplanmayı azaltması ve insülin duyarlılığını artırmasıdır; her ikisi de visseral yağ birikimini önleyen mekanizmalardır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Alkol tüketimi de bel çevresini etkileyen önemli bir faktördür. Alkol, vücut tarafından yakıt olarak öncelikli kullanılır; bu süreçte yağ yakımı duraklar ve gıdalardan gelen kaloriler büyük ölçüde yağ olarak depolanır. Alkol ayrıca kortizol düzeyini yükselterek abdominal yağlanmaya doğrudan zemin hazırlar.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bel-kalça oranınızı iki ayda bir ölçmek, tüm bu stratejilerin gerçek etkisini nesnel biçimde izlemenizi sağlar. Küçük ama tutarlı düşüşler — ayda 0.5-1 cm bel incelemesi — doğru yönde ilerlediğinizi gösterir. Bu hesap makinesini düzenli olarak kullanarak ilerlemenizi kayıt altına alın.
              </p>
            </div>
          </div>

      </main>
    </div>
  `;
}

export function renderVucutTipiTool(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/araclar" style="color: #a3a3a3; text-decoration: none;">Araçlar</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">Vücut Tipi Belirleme</span>
        </nav>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Vücut Tipi Belirleme</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Ektomorf, mezomorf veya endomorf olduğunuzu öğrenin.
          Genetik vücut tipinize göre kişiselleştirilmiş antrenman ve beslenme önerileri alın.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>


          <div style="margin-top:4rem;padding-top:3rem;border-top:1px solid #1a1a1a">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              Vücut Tipleri <span style="color:#ccff00">Nedir?</span> Nasıl Belirlenir?
            </h2>
            <div style="margin-top:1rem">
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut tipleri (somatotipler), 1940'larda Amerikalı psikolog William Sheldon tarafından geliştirilen bir sınıflandırma sistemidir. Bu sisteme göre insan vücudu üç temel tipe ayrılır: <strong style="color:#fff">ektomorf</strong> (ince, uzun kemikli, az yağlı), <strong style="color:#fff">mezomorf</strong> (atletik, kas gelişimine yatkın) ve <strong style="color:#fff">endomorf</strong> (yuvarlak, yağ depolamaya eğilimli). Günümüzde bu sınıflandırma, beslenme ve antrenman planlamasında bireysel farklılıkları anlamak için bir çerçeve olarak kullanılmaktadır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Önemli bir nokta: çoğu insan saf bir somatotipe sahip değildir. Gerçekte büyük çoğunluk, iki ya da üç tipin karışımından oluşan bir spektrumda yer alır. "Ekto-mezomorf", "meso-endomorf" gibi melez tipler çok daha yaygındır ve bu hesap makinesi baskın tipi belirlemek için oran ve ölçüm değerlerini kullanır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut tipini belirlemede kullanılan pratik yöntemler arasında bilek çevresi ve boy oranı, omuz-kalça oranı ve görsel değerlendirme yer alır. Bu hesap makinesi, bileğinizin çevresini referans alarak boy ile ağırlığınızı bu formüle dahil eder. Bilek çevresi, kemik yapısının (iskelet boyutunun) dolaylı bir göstergesi olduğundan doğal vücut tipini tahminlemede güvenilir bir ölçüttür.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Sheldon'ın orijinal sistemi hem genetik hem de psikolojik özelliklerle ilişkilendirmeye çalışmıştı; ancak bu kısım bilimsel dayanaktan yoksun bulunarak büyük ölçüde terk edilmiştir. Modern spor biliminde somatotip kavramı, metabolik yanıt, kas gelişim potansiyeli ve yağ depolama eğilimi gibi fizyolojik farklılıkları anlamanın başlangıç noktası olarak değer taşımaktadır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Vücut tipinizi bilmek, antrenman ve beslenme stratejinizi kişiselleştirmenin ilk adımıdır. "Herkese uyan tek bir program" yoktur; ektomorfun yediği besin miktarını endomorfun tüketmesi veya aynı antrenman programını her iki tipin uygulaması, birbirine tamamen zıt sonuçlar doğurabilir.
              </p>
            </div>
          </div>

          
          <div style="margin-top:3rem">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              3 Vücut Tipinin <span style="color:#ccff00">Özellikleri ve Farkları</span>
            </h2>
            <div style="margin-top:1rem">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:1rem 0">
                <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#60a5fa;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Ektomorf</div>
                  <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">İnce kemik yapısı, hızlı metabolizma, düşük doğal kas kütlesi. Kilo almakta ve kas yapmakta güçlük çeker. Yüksek kalori ve karbonhidrat alımı kritiktir. Aşırı kardio kas gelişimini engeller.</p>
                </div>
                <div style="background:rgba(204,255,0,0.1);border:1px solid rgba(204,255,0,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#ccff00;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Mezomorf</div>
                  <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Atletik yapı, orta-geniş kemik çerçevesi, hızlı kas yanıtı. Kas kazanımına ve yağ yakmaya en yatkın tip. Çoğu antrenman programı mezomorflar için tasarlanmış gibi görünür; ancak dikkat edilmezse yağ birikimi de hızlı olabilir.</p>
                </div>
                <div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:0.75rem;padding:1rem">
                  <div style="color:#fb923c;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Endomorf</div>
                  <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Geniş kemik yapısı, yavaş metabolizma, yağ depolamaya yüksek eğilim. Kas kazanımı görece kolaydır; ancak yağ altında kalır. Kalori kontrolü ve kardiyovasküler aktivite önceliklidir.</p>
                </div>
              </div>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Bu üç tip arasındaki en kritik fark, <strong style="color:#fff">insülin duyarlılığı ve metabolik hızdır</strong>. Ektomorflar genellikle yüksek insülin duyarlılığına ve hızlı metabolizmaya sahiptir; bu yüzden yüksek karbonhidrat alımı onlar için daha az risk taşır. Endomorflar ise insülin direncine daha yatkın oldukları için karbonhidrat toleransları daha düşük olabilir ve besin seçimlerinde daha dikkatli olmak avantaj sağlar.
              </p>
            </div>
          </div>

          
          <div style="margin-top:3rem">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              Vücut Tipine Göre <span style="color:#ccff00">Antrenman ve Beslenme Stratejisi</span>
            </h2>
            <div style="margin-top:1rem">
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Ektomorflar için:</strong> Kalori fazlası ve yüksek karbonhidrat tüketimi önceliklidir. Haftada 3-4 gün yoğun direnç antrenmanı, minimum kardio. Kompound hareketler (squat, deadlift, bench press, row) kas büyümesini en hızlı tetikleyen egzersizlerdir. Protein alımı kilogram başına 2-2.5 gram olmalıdır. Uyku ve stres yönetimi, bu tip için özellikle kritiktir çünkü kortizol kas katabolizmasını hızlandırır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Mezomorflar için:</strong> En fazla esnekliğe sahip olan bu tip, hem kas kazanımı hem de yağ kaybı için oldukça hızlı sonuç alabilir. Tehlike ise bu kolaylığa güvenerek beslenmeyi ihmal etmektir. Periyodik diyet dönemleri ve çeşitlendirilmiş antrenman programları mezomorfların uzun vadede en iyi formlarını korumalarını sağlar.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0"><strong style="color:#fff">Endomorflar için:</strong> Kalori kontrolü ve kardiyovasküler antrenman öne çıkar. Düşük-orta karbonhidrat, yüksek protein ve sağlıklı yağ ağırlıklı beslenme tercih edilir. Yüksek hacimli direnç antrenmanı ile interval kardio kombinasyonu en etkili yaklaşımdır. Yavaş metabolizmayla mücadelede tutarlılık ve sabır, hızlı sonuç arayışından çok daha belirleyicidir.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Son olarak şunu hatırlatmak gerekir: vücut tipi bir kader değildir. Epigenetik araştırmalar, genetik eğilimlerin yaşam tarzı seçimleriyle önemli ölçüde değiştirilebileceğini göstermektedir. Vücut tipinizi başlangıç noktanızı anlamak için kullanın; ama limitlerinizi çizmek için değil. Disiplinli bir beslenme ve antrenman programıyla her vücut tipi, dramatik fiziksel dönüşümler yaşayabilir.
              </p>
            </div>
          </div>

          
          <div style="margin-top:3rem">
            <h2 style="font-size:1.75rem;font-weight:700;color:#fff;text-transform:uppercase;margin:0 0 1.5rem;letter-spacing:-0.01em">
              Vücut Tipine Göre <span style="color:#ccff00">Özel Beslenme ve Antrenman Planı Rehberi</span>
            </h2>
            <div style="margin-top:1rem">
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">"Ektomorf nasıl kilo alır?", "Endomorf nasıl zayıflar?", "Mezomorf için en iyi antrenman programı hangisi?" — bu sorular vücut tipi hesabı yapan herkesi meşgul eden sorulardır. Bu rehberde her vücut tipi için özelleştirilmiş, bilimsel temelli yaklaşımları somut biçimde açıklıyoruz.
              </p>
              <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Ektomorf Kilo Nasıl Alır?</h3>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Ektomorflar için kilo almanın en büyük engeli genellikle iştah eksikliği ve yüksek metabolizmadır. Günde 3 büyük öğün yerine 5-6 daha küçük öğün, kalori alımını zorlanmadan artırmanın pratik yoludur. Kalori yoğun besinler (fındık ezmesi, avokado, zeytinyağı, tam tahıllar, kuru meyveler) hacim artışı olmaksızın önemli kalori katkısı sağlar. Protein alımı kilogram başına 2-2.5 gram olmalı ve her öğüne bir protein kaynağı eklenmelidir. Sıvı kaloriler (smoothie, süt bazlı içecekler) özellikle katı gıdaları yeterince tüketemeyenler için etkili bir tamamlayıcıdır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Antrenman açısından ektomorflar için şiddetli kardio kas kazanımını sekteye uğratır. Haftada 2-3 yoğun direnç antrenmanı, minimum kardio ile birleştirildiğinde en verimli sonuçları üretir. Kompound hareketler (squat, deadlift, bench, row) yüksek tekrarlı izole hareketlere kıyasla anabolik yanıtı çok daha güçlü tetikler. Dinlenme ve uyku, ektomorflar için özellikle kritiktir.
              </p>
              <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Endomorf Nasıl Zayıflar?</h3>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Endomorflar için kilo yönetiminin anahtarı, insülin duyarlılığını artırmak ve metabolizmayı canlı tutmaktır. Karbonhidrat alımının egzersiz etrafında yoğunlaştırılması (antrenman öncesi ve sonrası), karbonhidratın yağ olarak depolanma eğilimini azaltır. Genel beslenme stili açısından orta karbonhidrat-yüksek protein-yeterli sağlıklı yağ içeren bir yaklaşım (örneğin kalorilerin yüzde 35'i karbonhidrat, yüzde 35'i protein, yüzde 30'u yağ) endomorflar için iyi bir başlangıç noktasıdır.
              </p>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Antrenman açısından endomorflar hem kardiyovasküler egzersizden hem de direnç antrenmanından yararlanır. Direnç antrenmanı kas kütlesini koruyarak metabolizmayı yüksek tutar, kardio ise kalori açığını destekler. Haftada 4-5 gün antrenman (3 gün direnç + 2 gün orta yoğunluklu kardio) endomorflar için iyi belgelenmiş bir yaklaşımdır.
              </p>
              <h3 style="color:#fff;font-size:1rem;font-weight:600;margin:1.5rem 0 0.75rem">Vücut Tipi Zamanla Değişir Mi?</h3>
              <p style="color:#a3a3a3;line-height:1.8;margin:0.75rem 0">Kısmen evet. Somatotip ağırlıklı olarak genetik tarafından belirlense de yaşam tarzı değişiklikleriyle fenotipik ifadesi önemli ölçüde değişebilir. Yıllarca yoğun direnç antrenmanı yapan bir ektomorf, dışarıdan mezomorf gibi görünebilir. Endomorf olan biri doğru beslenme ve egzersizle atletik ve yalın bir görünüme ulaşabilir. Vücut tipini bir sınır olarak değil, başlangıç noktası olarak görmek; motivasyonu koruyarak gerçekçi bir ilerleme planı yapmanızı sağlar.
              </p>
            </div>
          </div>

      </main>
    </div>
  `;
}


export function render404(): string {
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 6rem; font-weight: 700; color: #ccff00; margin: 0;">404</h1>
        <p style="font-size: 1.5rem; color: #a3a3a3; margin: 1rem 0;">Sayfa bulunamadı</p>
        <a href="/" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #ccff00; color: #000; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  `;
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

export function renderExercisesList(exercises: Exercise[], total: number): string {
  const exerciseCards = exercises.slice(0, 24).map(exercise => `
    <article style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; overflow: hidden;">
      <a href="/egzersiz-akademisi/${exercise.slug}" style="text-decoration: none;">
        ${exercise.images[0] ? `<img src="${exercise.images[0]}" alt="${escapeHtml(exercise.name)}" style="width: 100%; height: 180px; object-fit: cover;" loading="lazy" />` : ''}
        <div style="padding: 1rem;">
          <span style="display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin-bottom: 0.5rem; ${
            exercise.level === 'beginner' ? 'background: rgba(34, 197, 94, 0.2); color: #22c55e;' :
            exercise.level === 'intermediate' ? 'background: rgba(234, 179, 8, 0.2); color: #eab308;' :
            'background: rgba(239, 68, 68, 0.2); color: #ef4444;'
          }">${levelLabels[exercise.level] || exercise.level}</span>
          <h2 style="font-size: 1rem; color: #fff; margin-bottom: 0.5rem;">${escapeHtml(exercise.name)}</h2>
          <p style="font-size: 0.875rem; color: #a3a3a3;">${exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ')}</p>
        </div>
      </a>
    </article>
  `).join('');

  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <header style="padding: 2rem; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff;">Egzersiz Akademisi</h1>
        <p style="color: #a3a3a3;">${total}+ fitness egzersizi ve hareket rehberi</p>
      </header>
      <main style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
          ${exerciseCards || '<p style="color: #a3a3a3;">Egzersiz bulunamadı.</p>'}
        </div>
      </main>
    </div>
  `;
}

export function renderExerciseDetail(exercise: Exercise): string {
  const muscles = exercise.primaryMuscles.map(m => muscleLabels[m] || m).join(', ');
  const level = levelLabels[exercise.level] || exercise.level;
  const instructions = exercise.instructionsTr || exercise.instructionsEn;

  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <nav style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <a href="/" style="color: #a3a3a3; text-decoration: none;">Ana Sayfa</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <a href="/egzersiz-akademisi" style="color: #a3a3a3; text-decoration: none;">Egzersiz Akademisi</a>
          <span style="color: #666; margin: 0 0.5rem;">›</span>
          <span style="color: #ccff00;">${escapeHtml(exercise.name)}</span>
        </nav>

        <article>
          <header style="margin-bottom: 2rem;">
            <span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; margin-bottom: 1rem; ${
              exercise.level === 'beginner' ? 'background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3);' :
              exercise.level === 'intermediate' ? 'background: rgba(234, 179, 8, 0.2); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.3);' :
              'background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
            }">${level}</span>
            <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">${escapeHtml(exercise.name)}</h1>
            <p style="color: #a3a3a3;">Hedef Kaslar: ${muscles}</p>
          </header>

          ${exercise.images.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
              ${exercise.images.map((img, i) => `
                <img src="${img}" alt="${escapeHtml(exercise.name)} - ${i === 0 ? 'Başlangıç' : 'Bitiş'} Pozisyonu" style="width: 100%; border-radius: 0.75rem; border: 1px solid #1a1a1a;" />
              `).join('')}
            </div>
          ` : ''}

          <section>
            <h2 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">Nasıl Yapılır?</h2>
            <ol style="padding-left: 1.5rem;">
              ${instructions.map(step => `<li style="color: #e5e5e5; margin-bottom: 1rem; line-height: 1.6;">${escapeHtml(step)}</li>`).join('')}
            </ol>
          </section>
        </article>
      </main>
    </div>
  `;
}
