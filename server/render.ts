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
    { path: "/araclar/vki", title: "VKİ Hesaplayıcı", desc: "Vücut kitle indeksinizi hesaplayın" },
    { path: "/araclar/kalori", title: "Kalori Hesaplayıcı", desc: "Günlük kalori ihtiyacınızı öğrenin" },
    { path: "/araclar/tdee", title: "TDEE Hesaplayıcı", desc: "Toplam günlük enerji harcamanızı hesaplayın" },
    { path: "/araclar/makro", title: "Makro Hesaplayıcı", desc: "Protein, karbonhidrat ve yağ oranlarınızı belirleyin" },
    { path: "/araclar/ideal-kilo", title: "İdeal Kilo Hesaplayıcı", desc: "Boyunuza göre ideal kilonuzu hesaplayın" },
    { path: "/araclar/vucut-yagi", title: "Vücut Yağ Oranı", desc: "Vücut yağ yüzdenizi hesaplayın" },
    { path: "/araclar/bir-tekrar-max", title: "1RM Hesaplayıcı", desc: "Maksimum kaldırma kapasiteni hesaplayın" },
    { path: "/araclar/su-tuketimi", title: "Su İhtiyacı", desc: "Günlük su ihtiyacınızı hesaplayın" },
    { path: "/araclar/kalp-atisi", title: "Kalp Hızı Bölgeleri", desc: "Antrenman kalp hızı bölgelerinizi öğrenin" },
    { path: "/araclar/protein", title: "Protein İhtiyacı", desc: "Günlük protein ihtiyacınızı hesaplayın" },
    { path: "/araclar/dinlenme", title: "Dinlenme Süresi", desc: "İdeal set arası dinlenme sürenizi öğrenin" },
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

        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Kitle İndeksi Nedir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Vücut Kitle İndeksi (VKİ), ya da uluslararası adıyla Body Mass Index (BMI), bir kişinin kilogram cinsinden vücut ağırlığının metre cinsinden boyunun karesine bölünmesiyle elde edilen bir ölçümdür. Formül son derece basittir: <strong style="color:#fff;">VKİ = Kilo (kg) / Boy² (m²)</strong>. Örneğin 80 kg ağırlığında, 1.80 m boyunda bir kişinin VKİ değeri 80 / (1.80 × 1.80) = <strong style="color:#ccff00;">24.7</strong> olarak hesaplanır.</p>
            <p style="margin-bottom: 1rem;">Bu ölçüm, ilk kez 1830'lu yıllarda Belçikalı istatistikçi Adolphe Quetelet tarafından geliştirilmiş ve başlangıçta bireysel sağlık değerlendirmesi için değil, toplumların genel vücut ağırlığı dağılımını incelemek amacıyla kullanılmıştır. 1970'lerde "Vücut Kitle İndeksi" adını alan bu formül, modern tıp dünyasında standart bir ölçüm aracı haline gelmiştir.</p>
            <p style="margin-bottom: 1rem;">VKİ'nin bu denli yaygınlaşmasının temel nedeni pratikliğidir. Özel bir ekipman gerektirmez, hesaplaması dakikalar içinde tamamlanır ve tüm dünyada ortak bir referans çerçevesi sunar. Dünya Sağlık Örgütü (WHO), VKİ'yi popülasyon düzeyinde obezite ve aşırı kilo takibinde birincil gösterge olarak kabul etmektedir.</p>
            <p style="margin-bottom: 1rem;">VKİ hesabında kullanılan iki değişken büyük popülasyonlarda kardiyovasküler hastalık riski, tip 2 diyabet, hipertansiyon ve bazı kanser türleriyle istatistiksel olarak anlamlı bir korelasyon göstermektedir.</p>
            <p style="margin-bottom: 1rem;">Boy değerini sabah ölçmek daha doğrudur çünkü gün içinde omurga hafifçe sıkışır. Kilo ölçümünü ise sabah aç karnına, tercihen tuvaletten sonra yapmanız en tutarlı sonucu verecektir.</p>
          </div>
        </section>

        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">VKİ Değerleri Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">WHO'nun belirlediği standart sınıflandırmaya göre VKİ değerleri dört ana kategoriye ayrılır:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
              <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #60a5fa; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Zayıf</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">VKİ &lt; 18.5</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Yetersiz kalori alımı, kas kaybı riski, bağışıklık sistemi zayıflığı görülebilir. Altta yatan neden araştırılmalıdır.</p>
              </div>
              <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #4ade80; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Normal</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">18.5 – 24.9</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Kardiyovasküler hastalık, tip 2 diyabet ve hipertansiyon riski en düşük aralıktır.</p>
              </div>
              <div style="background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #facc15; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Fazla Kilolu</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">25 – 29.9</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Kronik hastalık riski yükselmeye başlar. Kalori kısıtlaması ve düzenli egzersizle bu kategoriden çıkmak mümkündür.</p>
              </div>
              <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #f87171; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Obez</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">VKİ ≥ 30</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Tip 2 diyabet, kalp hastalığı, uyku apnesi için risk belirgin artar. Profesyonel destek önerilir.</p>
              </div>
            </div>
            <p style="margin-bottom: 1rem;">Yaş faktörü de VKİ yorumunu etkiler. 65 yaş ve üzeri bireylerde 22-27 arasındaki bir VKİ değeri normal kabul edilir. Etnik köken de VKİ eşiklerini etkiler; Asya kökenli bireyler için sınır değerler daha düşük tutulmaktadır.</p>
          </div>
        </section>

        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">VKİ'yi Fitness Sürecinde Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">VKİ, fitness hedefleri koyarken kullanışlı bir başlangıç noktasıdır; ancak tek başına yeterli bir rehber değildir. Özellikle düzenli egzersiz yapan kişiler için bu ölçümün ciddi sınırlılıkları bulunur. Kas dokusu, yağ dokusuna kıyasla daha yoğundur ve daha ağırdır. Bu nedenle düzenli direnç antrenmanı yapan bir sporcu, gerçekte çok düşük bir vücut yağ yüzdesine sahip olmasına karşın VKİ hesabına göre "fazla kilolu" kategorisinde yer alabilir.</p>
            <p style="margin-bottom: 1rem;">Bu sınırlılığı aşmak için VKİ'yi diğer ölçümlerle birlikte kullanmak gerekir. <strong style="color:#fff;">Vücut yağ yüzdesi</strong> ölçümü fitness ilerlemenizi takip etmede çok daha anlamlı bir göstergedir. <strong style="color:#fff;">Bel çevresi</strong> ölçümü ise özellikle visseral yağ birikimini yansıtır ve kardiyovasküler risk açısından VKİ'ye göre daha güçlü bir öngörücüdür.</p>
            <p style="margin-bottom: 1rem;">Pratik bir yaklaşım olarak şu üç ölçümü birlikte kullanabilirsin: VKİ, bel-kalça oranı ve kilo. Bu üç metriğin zaman içindeki değişimini aylık olarak takip etmek, vücudunun nasıl dönüştüğünü çok daha net biçimde ortaya koyar.</p>
            <p style="margin-bottom: 1rem;">Hedef belirleme sürecinde VKİ'yi şöyle kullanabilirsin: mevcut VKİ değerine göre kaba bir yol haritası çiz, ardından bu hedefi TDEE hesabıyla birleştirerek günlük kalori hedefini belirle. Kilo vermek istiyorsan ve VKİ değerin 27'nin üzerindeyse, haftada 0.5-1 kg kayıp sağlayacak bir kalori açığı (genellikle günlük 300-500 kcal) sürdürülebilir ve sağlıklı bir stratejidir.</p>
          </div>
        </section>

        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">VKİ Hesabının Sınırları ve Doğru Yorumlama Rehberi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Vücut Kitle İndeksi, 1832 yılında Belçikalı matematikçi Adolphe Quetelet tarafından geliştirilen ve bugün dünyanın en yaygın kullanılan sağlık ölçümlerinden biri olmayı sürdüren bir formüldür. Ancak Quetelet bu formülü bireysel sağlık değerlendirmesi için değil, nüfus istatistikleri için tasarlamıştı.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">VKİ Neden Her Zaman Yeterli Değil?</h3>
            <p style="margin-bottom: 1rem;">VKİ'nin en temel sorunu, vücut ağırlığını oluşturan bileşenleri ayırt edememesidir. Kas dokusu, yağ dokusundan çok daha yoğundur. Dünya Sağlık Örgütü sınıflandırmasına göre "obez" kategorisine giren bir powerlifting sporcusu, gerçekte yüzde 12 vücut yağıyla son derece sağlıklı bir tabloya sahip olabilir.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">VKİ ile Birlikte Kullanılması Gereken Ölçümler</h3>
            <p style="margin-bottom: 1rem;">Sağlık riskini daha doğru değerlendirmek için VKİ'yi tek başına kullanmak yerine şu ölçümlerle birleştirmek önerilir: Bel çevresi ölçümü (erkeklerde 94 cm, kadınlarda 80 cm üzeri risk sinyali verir), bel-kalça oranı (visseral yağ birikimini gösterir), vücut yağ yüzdesi (en doğru kompozisyon bilgisini sunar) ve kan biyomarkerları.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Sık Sorulan Sorular: VKİ Kaç Olmalı?</h3>
            <p style="margin-bottom: 1rem;">Türkiye'de 170 cm boyunda bir erkek için sağlıklı kilo aralığı 53-72 kg (VKİ 18.5-24.9) olarak hesaplanır. 165 cm boyundaki bir kadın içinse bu aralık 50-68 kg'a karşılık gelir. Ancak bu rakamlar yalnızca istatistiksel ortalamaları yansıtır; bireysel sağlık durumu, yaş ve vücut yapısı bu aralıkları önemli ölçüde değiştirebilir.</p>
            <p style="margin-bottom: 1rem;">Sonuç olarak VKİ; nerede durduğunu anlaman, ilerlemeyi izlemen ve hedef aralığını belirlemen için değerli bir araçtır. En sağlıklı yaklaşım, VKİ'yi bir ön değerlendirme olarak almak ve bunu diğer ölçümler, beslenme verileri ve antrenman ilerlemenle birlikte bir bütün olarak yorumlamaktır.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Günlük Kalori İhtiyacı Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Günlük kalori ihtiyacı, vücudunuzun hem temel yaşamsal fonksiyonlarını sürdürmek hem de günlük fiziksel aktivitelerinizi gerçekleştirmek için ihtiyaç duyduğu toplam enerji miktarıdır. Bu değer doğrudan yaşınıza, cinsiyetinize, boyunuza, kilonuza ve aktivite düzeyinize bağlı olarak kişiden kişiye önemli ölçüde değişir.</p>
            <p style="margin-bottom: 1rem;">Hesaplamada iki aşamalı bir yöntem kullanılır. İlk adımda <strong style="color:#fff;">Bazal Metabolizma Hızı (BMH)</strong> hesaplanır. BMH, vücudunuzun tamamen hareketsiz halde — uyku, solunum, kalp atışı, sinir sistemi aktivitesi gibi temel fonksiyonlar için — harcadığı enerji miktarıdır. Bu değer toplam enerji harcamasının %60-75'ini oluşturur. BMH hesabında bilimsel olarak en doğrulanmış formül <strong style="color:#ccff00;">Mifflin-St Jeor</strong> denklemdir.</p>
            <p style="margin-bottom: 1rem;">İkinci aşamada BMH değeri, fiziksel aktivite düzeyini yansıtan bir <strong style="color:#fff;">aktivite çarpanı</strong> ile çarpılır. Bu çarpan hareketsiz yaşam için 1.2'den, çok yoğun fiziksel aktiviteyle birlikte fiziksel iş yapanlar için 1.9'a kadar uzanan bir spektrumda yer alır. Sonuç, bilimsel terminolojide <strong style="color:#fff;">TDEE (Total Daily Energy Expenditure)</strong> olarak bilinen, günlük toplam enerji harcamanızdır.</p>
            <p style="margin-bottom: 1rem;">Hesaplama bu denli kapsamlı bilgi gerektirdiğinden dolayı, kişisel farklılıklar dikkate alındığında kalori ihtiyacı aynı kilodaki iki birey arasında bile günde 300-500 kalori fark edebilir. Bu yüzden "herkese uyan tek bir kalori sayısı" yoktur; hesaplama bireyseldir ve gerçekten kişiye özgü bir çıktı sunar.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalori Sonuçları Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Hesaplama sonucunda dört farklı senaryo için kalori hedefi sunulur: kilo verme, hızlı kilo verme, kilo koruma ve kilo alma. Bu senaryoların her biri TDEE değerinizden türetilir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Kilo verme senaryosunda</strong> TDEE'nin günde 300-500 kalori altında kalori tüketimi hedeflenir. Bu haftalık yaklaşık 0.3-0.5 kg kilo kaybına karşılık gelir. Haftada 1 kg'dan hızlı kilo vermeye çalışmak genellikle kas kaybına, hormon bozukluklarına ve "yo-yo" etkisine zemin hazırlar.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Kilo koruma senaryosunda</strong> tam olarak TDEE değerinizde kalori tüketimi önerilir. Bu noktada ağırlığınız teorik olarak sabit kalır. Ancak metabolizmanız dinamik bir sistem olduğundan küçük ölçüm hataları tolere edilebilir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Kilo alma senaryosunda</strong> TDEE'nin 300-500 kalori üzerinde tüketim önerilir. Bu yüksek protein tüketimiyle (kg başına 2-2.5 gram) ve düzenli direnç antrenmanıyla birleştirildiğinde aylık 1-2 kg kaliteli kas kazanımı mümkün hale gelir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalori Hesabını Fitness Sürecinde Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Kalori hesabı, beslenme planlamasının matematiksel iskeletidir. Ancak tek başına yeterli değildir; makro besin dağılımıyla tamamlanmalıdır. Aynı kaloriyi tüketen iki kişiden biri çoğunlukla protein ve sebzelerden beslenirken diğeri rafine karbonhidratlardan besleniyor olabilir. Vücut kompozisyonu açısından bu ikisi arasında dağlar kadar fark olacaktır.</p>
            <p style="margin-bottom: 1rem;">Pratik bir başlangıç stratejisi şu şekilde kurulabilir: Hesaplanan TDEE değerinizi temel alın. Protein için kilogram başına 1.8-2.2 gram hedefleyin (1 gram protein = 4 kalori). Yağ için toplam kalorinin %25-35'ini ayırın (1 gram yağ = 9 kalori). Kalan kalori miktarının tamamını karbonhidratlara bırakın.</p>
            <p style="margin-bottom: 1rem;">Başlangıçta 2-4 hafta yediklerinizi kaydetmek kalori konusundaki farkındalığınızı dramatik biçimde artırır. Araştırmalar, yiyecek kaydı tutmanın kilo yönetimindeki etkinliği neredeyse iki katına çıkardığını göstermektedir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalori ve Metabolizma: Sık Sorulan Sorulara Bilimsel Yanıtlar</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Günde kaç kalori almalıyım?", "1200 kalori diyeti işe yarıyor mu?", "Metabolizmam neden bu kadar yavaş?" — bunlar Türkiye'de ve dünyada en çok aranan beslenme sorularıdır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">1200 Kalori Diyeti Gerçekten İşe Yarıyor mu?</h3>
            <p style="margin-bottom: 1rem;">1200 kalori, çoğu yetişkin için BMH'nin altındadır. Bu durum kısa vadede hızlı kilo kaybı sağlarken metabolik adaptasyona, kas kaybına ve uzun vadede "yo-yo" etkisine zemin hazırlar. Araştırmalar, çok düşük kalorili diyetlerin başarısız olma oranının yüzde 80'i aştığını göstermektedir. Sürdürülebilir kalori açığı, TDEE'nin yüzde 10-20 altında olmaktır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Metabolik Adaptasyon Nedir?</h3>
            <p style="margin-bottom: 1rem;">Uzun süreli kalori kısıtlamasında vücut metabolizmasını düşürür; bu "metabolik adaptasyon" olarak bilinir. Bu yüzden diyet dönemlerinde "diyet molası" (1-2 hafta kalori kısıtlamasını kaldırmak) veya karbonhidrat yükleme stratejileri uygulamak metabolik hızı korumaya yardımcı olur.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">TDEE Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">TDEE (Total Daily Energy Expenditure — Toplam Günlük Enerji Harcaması), bir gün boyunca vücudunuzun harcadığı toplam kalori miktarıdır. Hem dinlenme halindeki metabolik aktivitenizi hem de günlük fiziksel hareketliliğinizi kapsar. Kalori yönetiminin merkezinde yer alan bu değer, kilo verme, koruma ve alma hedeflerinin temel hareket noktasını oluşturur.</p>
            <p style="margin-bottom: 1rem;">TDEE hesabı iki bileşenden oluşur: <strong style="color:#fff;">Bazal Metabolizma Hızı (BMH)</strong> ve <strong style="color:#fff;">Aktivite Faktörü</strong>. BMH, vücudunuzun tamamen hareketsiz haldeyken sadece yaşamsal fonksiyonlar için harcadığı enerji miktarıdır — solunum, kalp atışı, beyin aktivitesi, organ fonksiyonları. Günlük toplam enerji harcamasının %60-75'ini oluşturan BMH, yaşa, cinsiyete, boya ve kiloya göre değişir.</p>
            <p style="margin-bottom: 1rem;">BMH değeri aktivite faktörüyle çarpılarak TDEE elde edilir. <strong style="color:#ccff00;">Hareketsiz (sedanter)</strong> bir yaşam tarzı için 1.2, haftada 1-3 gün hafif egzersiz için 1.375, haftada 3-5 gün orta yoğunlukta egzersiz için 1.55, haftada 6-7 gün yoğun antrenman için 1.725, günde iki antrenman veya fiziksel iş için 1.9 çarpanı uygulanır.</p>
            <p style="margin-bottom: 1rem;">Doğru aktivite faktörü seçimi TDEE'nin doğruluğunu büyük ölçüde belirler. Pek çok kişi aktivite düzeyini olduğundan yüksek tahmin eder; bu da kalori hedefinin gerçeğin üzerinde belirlenmesine yol açar. Başlangıçta bir alt kategoriden başlamak ve vücudunuzun tepkisine göre ayarlama yapmak, daha güvenilir bir yaklaşımdır.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">TDEE ve BMR Farkı Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">BMR (Bazal Metabolizma Hızı) ile TDEE arasındaki fark, aktivite düzeyinizin yansımasıdır. Sedanter bir bireyden ultra-aktif bir sporcuya kadar bu iki değer arasındaki fark günde 1.000 kaloriyi aşabilir. TDEE değerinizi bilmek, gerçekten ne kadar kalori harcadığınızı anlamanızı sağlar.</p>
            <p style="margin-bottom: 1rem;">TDEE'nin pratikte önemine gelince: Kilo vermek için TDEE'nin 300-500 kalori altında; kilo almak için 200-400 kalori üzerinde beslenilmesi önerilir. Bu "kalori dengesi" prensibi, tüm kilo yönetimi stratejilerinin matematiğini oluşturur. TDEE bilmeden yapılan diyet, pusula olmadan yapılan navigasyon gibidir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">TDEE'yi Fitness Programında Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">TDEE, antrenman ve beslenme planlamasında kritik bir referans noktasıdır. Antrenman programı değiştiğinde (örneğin haftada 3 günden 5 güne geçiş) TDEE değeriniz de değişir. Bu değişimi dikkate almak, kalori hedeflerinizin güncel kalmasını sağlar.</p>
            <p style="margin-bottom: 1rem;">Bulk (kas kazanım) döneminde TDEE'nin 200-300 kalori üzerinde beslenilmesi önerilir. "Dirty bulk" olarak adlandırılan aşırı kalori fazlası, kas kazanımını hızlandırmaz ancak yağ birikimini artırır. "Clean bulk" stratejisinde ise küçük ama sürekli bir kalori fazlası ile kaliteli kas kazanımı hedeflenir.</p>
            <p style="margin-bottom: 1rem;">Cut (yağ yakım) döneminde TDEE'nin 300-500 kalori altında kalınması, kas kütlesini korurken yağ kaybını optimize eder. Bu süreçte protein alımını yüksek tutmak (kg başına 2-2.5 gram) ve direnç antrenmanına devam etmek kas koruma açısından kritiktir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">TDEE Hesabı ve Metabolizma: Sık Sorulan Sorular</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"TDEE'me göre kalori alıyorum ama kilo veremiyorum", "Metabolizmam yavaş mı?" gibi sorular sıkça karşılaşılan sorunlardır. Bunların büyük bölümünün yanıtı ölçüm hatasıdır: aktivite faktörü abartılıyor veya yenilen miktarlar hafife alınıyor.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">TDEE Neden Her Zaman Tutarsız Görünür?</h3>
            <p style="margin-bottom: 1rem;">TDEE sabit bir değer değildir. Antrenmandan önce ve sonra, uyku miktarına göre, hatta sıcak ve soğuk havalarda bile değişir. Günlük dalgalanmalar 100-300 kalori arasında olabilir. Bu yüzden TDEE'yi bir referans aralığı olarak kullanmak, sabit bir sayı olarak dayatmaktan çok daha sağlıklı bir yaklaşımdır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Aktivite Faktörünü Doğru Belirlemek</h3>
            <p style="margin-bottom: 1rem;">Çoğu kişi için en yaygın hata, aktivite faktörünü olduğundan yüksek seçmektir. Özellikle ofis çalışanları "hareketsiz" kategorisinden başlamalıdır. Gerçek TDEE'yi bulmak için 2 hafta boyunca kilonuzu ve kalori alımınızı takip edin; ağırlığınız değişmiyorsa alınan kalori miktarı, büyük olasılıkla gerçek TDEE'nize yakındır.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Makro Besinler Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Makro besinler, vücudumuzun büyük miktarlarda ihtiyaç duyduğu ve birincil enerji kaynağı olarak kullandığı üç temel besin grubudur: <strong style="color:#fff;">protein, karbonhidrat ve yağ</strong>. Bu üç besin grubu; kalori sağlama, doku yapımı, hormon üretimi ve enerji depolama gibi birbirinden farklı ancak birbirini tamamlayan görevler üstlenir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Protein</strong> (gram başına 4 kalori): Kasların, organların, enzimlerin ve antikorların yapı taşıdır. Vücudun kendi üretemediği esansiyel amino asitleri dışarıdan almak zorundayız. Fiziksel aktivite düzeyi arttıkça protein ihtiyacı da artar. Aktif bireyler için kilogram başına 1.6-2.2 gram protein, bilimsel literatürdeki konsensüs aralığıdır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Karbonhidrat</strong> (gram başına 4 kalori): Beynin ve kasların tercih ettiği yakıt kaynağıdır. Glukoza dönüştürülen karbonhidratlar, özellikle yüksek yoğunluklu egzersizlerde birincil enerji substratıdır. Kas glikojeni olarak depolanan karbonhidrat, antrenman performansını doğrudan belirler.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Yağ</strong> (gram başına 9 kalori): Hormon üretimi (özellikle testosteron ve östrojen), yağda çözünen vitaminlerin emilimi (A, D, E, K), sinir sistemi fonksiyonu ve uzun süreli enerji için vazgeçilmezdir. Sağlıklı yağlar (doymamış yağlar, omega-3) kardiyovasküler sağlığı desteklerken trans yağlar zararlıdır.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Makro Oranları Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Makro oranları, günlük toplam kalorinin her bir besin grubuna ne oranda ayrıldığını gösterir. Bu oranlar hedefe, vücut tipine ve aktivite düzeyine göre önemli ölçüde değişir. Bununla birlikte, bilimsel araştırmaların genel önerileri mevcuttur.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Kas kazanımı için:</strong> Protein %30-35, Karbonhidrat %40-50, Yağ %20-25. Yüksek protein alımı kas protein sentezini desteklerken, yeterli karbonhidrat antrenman performansını ve glikojen depolarını korur.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Yağ yakımı için:</strong> Protein %35-40, Karbonhidrat %30-40, Yağ %25-30. Daha yüksek protein oranı kas kütlesini korurken, biraz daha düşük karbonhidrat kalori açığını sürdürmeyi kolaylaştırır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Genel sağlık için:</strong> Protein %20-30, Karbonhidrat %45-55, Yağ %25-35. Dengeli bir makro dağılımı, sürdürülebilir enerji ve uzun vadeli sağlık için en uygun yaklaşımdır.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Makro Takibini Fitness Sürecinde Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Makro takibi, beslenme stratejisinin en güçlü araçlarından biridir. Sadece kalori saymak yerine makroları takip etmek, vücudunuza ne tür yakıt verdiğinizi anlamanızı ve hedefe yönelik beslenmenizi sağlar.</p>
            <p style="margin-bottom: 1rem;">Başlangıçta protein hedefini sabitleyin: kg başına 1.8-2 gram protein. Protein, hem kas koruma hem de tokluk hissi açısından en kritik makrodur. Ardından toplam kalori hedefinden protein kalorilerini çıkarın ve kalan kısımda karbonhidrat-yağ dengesini kurun.</p>
            <p style="margin-bottom: 1rem;">Makro takibini sürdürülebilir kılmak için katı kurallara değil esnek bir çerçeveye odaklanmak önerilir. "Tam gram" hedefleri yerine günlük ±10-15 gram tolerans tanımak, hem pratik hem de psikolojik açıdan daha sürdürülebilirdir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Makro Besinler Hakkında Sık Sorulan Sorular</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Karbonhidrat yemek kilo aldırır mı?", "Protein ne zaman alınmalı?", "Yağ yemek zararlı mı?" gibi sorular beslenme dünyasının en yaygın yanılgılarına işaret etmektedir.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Karbonhidrat Kilo Aldırır mı?</h3>
            <p style="margin-bottom: 1rem;">Karbonhidrat tek başına kilo aldırmaz; kalori fazlası kilo aldırır. Karbonhidrat tüketimi artınca kas glikojen depoları dolarak vücut ağırlığı geçici olarak artabilir (su tutulması). Ancak bu gerçek yağ kazanımı değildir. Kalori dengesi korunduğu sürece karbonhidrat içeren bir diyette kilo verilmesi mümkündür.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Protein Ne Zaman Alınmalı?</h3>
            <p style="margin-bottom: 1rem;">Protein zamanlaması konusundaki araştırmalar, günün herhangi bir zamanında alınan proteinin toplam günlük miktarı kadar belirleyici olmadığını göstermektedir. Önemli olan: günlük toplam protein hedefine ulaşmak ve bunu mümkün olduğunca eşit aralıklı öğünlere dağıtmaktır. Her öğünde 20-40 gram protein hedeflenmesi pratik bir yaklaşımdır.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">İdeal Kilo Nedir? Formüller Nasıl Çalışır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">İdeal kilo, belirli bir boy için "sağlıklı" kabul edilen ağırlık aralığını ifade etmek amacıyla kullanılan bir kavramdır. Ancak tek bir evrensel "ideal kilo" tanımı yoktur; bu değer kullanılan formüle ve bireyin vücut yapısına göre farklılık gösterir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Devine Formülü (1974)</strong>: Erkekler: 50 + 2.3 × (boy inç - 60); Kadınlar: 45.5 + 2.3 × (boy inç - 60). Orijinal olarak ilaç dozlaması hesabı için geliştirilmiş olan bu formül, günümüzde en yaygın referans noktasına dönüşmüştür.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Robinson Formülü (1983)</strong>: Devine formülünün revize edilmiş versiyonudur. Erkekler: 52 + 1.9 × (boy inç - 60); Kadınlar: 49 + 1.7 × (boy inç - 60). Daha dar bir ideal kilo aralığı sunar.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Miller Formülü (1983)</strong>: Erkekler: 56.2 + 1.41 × (boy inç - 60); Kadınlar: 53.1 + 1.36 × (boy inç - 60). Diğer formüllere kıyasla genellikle biraz daha yüksek ideal kilo değerleri üretir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Hamwi Formülü (1964)</strong>: Klinisyenler tarafından sıkça kullanılan bir diğer formüldür. Erkekler için 48 kg + 2.7 kg/inç (5 feet üzeri); kadınlar için 45.5 kg + 2.2 kg/inç (5 feet üzeri) baz formüldür.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">İdeal Kilo Sonuçları Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Dört formülden elde edilen değerler arasında genellikle 3-7 kg aralığında bir fark bulunur. Bu fark, her formülün farklı bir popülasyon özelliğini referans almasından kaynaklanır. Hesap makinesi dört formülün ortalamasını sunarak daha temsili bir hedef aralığı oluşturur.</p>
            <p style="margin-bottom: 1rem;">Bu formüllerin önemli bir sınırlaması bulunur: kas kütlesini hesaba katmazlar. Bu nedenle düzenli direnç antrenmanı yapan bireyler için "ideal kilo" aralığının üst sınırı veya biraz daha yukarısı gerçekçi ve sağlıklı olabilir. Örneğin kas kütlesi yüksek bir sporcu, formülün önerdiği kilodan 5-10 kg daha ağır olup mükemmel vücut kompozisyonuna sahip olabilir.</p>
            <p style="margin-bottom: 1rem;">Öte yandan ideal kilo hesabı yaş faktörünü de ihmal eder. 30 yaşında ve 60 yaşında aynı boyda olan iki birey için farklı sağlık riskleri ve farklı "ideal" ağırlıklar söz konusu olabilir. 65 yaş üzerinde hafif daha yüksek bir VKİ (22-27), kemik yoğunluğu ve kas kütlesi koruması açısından daha uygun olabilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">İdeal Kiloya Ulaşmak İçin Fitness Stratejisi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">İdeal kilo, bir nihai hedef değil bir yolculuk kılavuzudur. Bu rakama yaklaşırken sürecin kalitesine odaklanmak sonuçtan çok daha belirleyicidir. Hızlı kilo verme yerine yavaş ve sürdürülebilir ilerlemeyi hedeflemek; kilo hedefine ulaştığınızda hem daha sağlıklı hem de daha mutlu olmanızı sağlar.</p>
            <p style="margin-bottom: 1rem;">Kilo fazlası varsa: TDEE'nin 300-500 kalori altında beslenin, haftada en az 150 dakika orta yoğunlukta kardiyovasküler egzersiz ve haftada 2-3 gün direnç antrenmanı uygulayın. Bu kombinasyon hem yağ kaybını maximize eder hem de kas kütlesini korur.</p>
            <p style="margin-bottom: 1rem;">Kilo eksikliği varsa: TDEE'nin 200-300 kalori üzerinde yüksek besin değerli gıdalarla beslenin. "Hard gainer" olarak tanımlanan, kilo almakta güçlük çeken bireyler için öğün sıklığı artırılabilir ve sıvı kaloriler (protein shake, süt, smoothie) stratejiye eklenebilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">İdeal Kilo Hakkında Sık Sorulan Sorular</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"170 cm için ideal kilo nedir?", "Boyuma göre kaç kilo olmalıyım?", "İdeal kilom ne olmalı?" — Türkiye'de bu sorular her gün binlerce kişi tarafından aranmaktadır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Boyuma Göre Kilo Tablosu</h3>
            <p style="margin-bottom: 1rem;">Genel bir referans olarak: 160 cm için 50-65 kg, 165 cm için 53-68 kg, 170 cm için 57-72 kg, 175 cm için 61-77 kg, 180 cm için 65-82 kg aralıkları (erkek referans değerleri) yaygın kabul görmektedir. Kadınlar için bu değerler genellikle 4-6 kg daha düşük tutulur.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Vücut Yapısının Etkisi</h3>
            <p style="margin-bottom: 1rem;">İnce kemik yapısı (ince bilek çevresi), orta kemik yapısı ve geniş kemik yapısı arasında ideal kiloda 4-8 kg fark olabilir. Bilek çevresi bu yapıyı tahminlemenin basit bir yöntemidir: erkeklerde 18 cm altı ince yapı, 18-20 cm arası orta yapı, 20 cm üzeri geniş yapı olarak değerlendirilir.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Yağ Oranı Nedir? US Navy Formülü Nasıl Çalışır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Vücut yağ oranı, toplam vücut ağırlığının yüzde kaçının yağ dokusundan oluştuğunu gösteren bir ölçümdür. Bu değer yalnızca kilonuzu değil, vücudunuzun kompozisyonunu — kaç kilogram kas, kemik, su ve yağ taşıdığını — anlamanızı sağlar.</p>
            <p style="margin-bottom: 1rem;">US Navy Formülü, özel ekipman gerektirmeden yüksek doğrulukla vücut yağ oranını tahmin eden en yaygın kullanılan yöntemlerden biridir. ABD Deniz Kuvvetleri tarafından geliştirilen bu formül, boy, bel ve boyun çevresi ölçümlerini (erkekler için) veya boy, bel, kalça ve boyun ölçümlerini (kadınlar için) kullanır.</p>
            <p style="margin-bottom: 1rem;">Erkekler için formül: <strong style="color:#ccff00;">% Yağ = 86.010 × log10(bel - boyun) − 70.041 × log10(boy) + 36.76</strong></p>
            <p style="margin-bottom: 1rem;">Kadınlar için formül: <strong style="color:#ccff00;">% Yağ = 163.205 × log10(bel + kalça - boyun) − 97.684 × log10(boy) − 78.387</strong></p>
            <p style="margin-bottom: 1rem;">Doğru ölçüm için: Bel çevresini göbek hizasında ölçün. Boyun çevresini boyun kaslarının en dar noktasından ölçün. Kalça çevresini (kadınlar için) en geniş noktasından ölçün. Ölçümleri sabah aç karnına, aynı koşullarda tekrarlayın.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Yağ Oranı Kategorileri Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Erkekler için genel kategoriler: %2-5 Esansiyel Yağ (minimum sağlık için gereken), %6-13 Atlet, %14-17 Fitness, %18-24 Kabul Edilebilir, %25+ Obez. Kadınlar için bu değerler yaklaşık 8-10 puan daha yüksektir çünkü hormonal sistem ve üreme fonksiyonları için daha fazla esansiyel yağ gereklidir.</p>
            <p style="margin-bottom: 1rem;">Spor performansı açısından: Güç sporlarında (powerlifting, strongman) %10-20, estetik sporlarda (bodybuilding, fitness) %8-15, dayanıklılık sporlarında (maraton, triatlon) %8-12 vücut yağ oranı tipik olarak görülür. Bu aralıkların dışına çıkmak performansı olumsuz etkileyebilir.</p>
            <p style="margin-bottom: 1rem;">Sağlık açısından ise vücut yağ oranının çok düşük olması da risklidir. Erkeklerde %5'in altında, kadınlarda %12'nin altında yağ oranı hormonal bozukluklara, bağışıklık sistemi zayıflamasına ve kemik yoğunluğu kaybına yol açabilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Yağını Fitness Sürecinde Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Vücut yağ oranı, kilo ölçeğine kıyasla çok daha anlamlı bir ilerleme göstergesidir. Terazi kilonuz sabit kalsa bile yağ oranınız düşüyorsa, vücut kompozisyonunuz iyileşiyor — kas kazanıyorsunuz. Bu "recomposition" (yeniden kompozisyon) süreci, özellikle yeni başlayanlarda yaygındır.</p>
            <p style="margin-bottom: 1rem;">Aylık ölçüm rutini oluşturun: Her ayın aynı günü, sabah aç karnına, aynı ölçüm tekniğiyle ölçün. Bu tutarlılık, gerçek değişimleri günlük dalgalanmalardan ayırt etmenizi sağlar. Aylık 0.5-1 puan yağ oranı düşüşü, sürdürülebilir bir ilerleme olarak değerlendirilir.</p>
            <p style="margin-bottom: 1rem;">Yağsız vücut kitlesi (Lean Body Mass) takibi de son derece değerlidir. Yağsız kütle; kaslarınızı, kemiklerinizi, organlarınızı ve suyunuzu kapsar. Diyet sürecinde yağsız kütle sabitlenirken toplam ağırlık düşüyorsa bu ideal bir yağ yakım sürecine işaret eder.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Yağını Azaltmanın Bilimsel Yolları</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Vücut yağ oranını düşürmenin en hızlı yolu nedir?", "Karın yağı nasıl erir?", "Yağ yakarken kas korunur mu?" — bu sorular fitness dünyasının en çok aranan konularıdır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Kalori Açığı ve Protein Kombinasyonu</h3>
            <p style="margin-bottom: 1rem;">Yağ yakımının temelinde kalori açığı yatar. Ancak yalnızca kalori kısmaya odaklanmak kas kaybına zemin hazırlar. Kas kaybını önlemenin en etkili yolu yüksek protein alımı (kg başına 2-2.5 gram) ve direnç antrenmanıdır. Bu kombinasyon, vücudun enerji açığını karşılamak için yağ dokusunu tercihli olarak kullanmasını destekler.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">HIIT vs. Düşük Yoğunluklu Kardio</h3>
            <p style="margin-bottom: 1rem;">Yüksek yoğunluklu interval antrenmanı (HIIT), geleneksel düşük yoğunluklu kardioya kıyasla daha kısa sürede daha fazla kalori yakar ve "afterburn" (EPOC) etkisiyle antrenman sonrası da kalori harcamasını artırır. Öte yandan düşük yoğunluklu kardio kas üzerinde daha az yük oluşturarak iyileşme sürecini destekler. İkisinin kombinasyonu en kapsamlı sonuçları verir.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">1RM Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">1RM (One Repetition Maximum — Tek Tekrar Maksimumu), bir egzersizde doğru teknikle, tam hareket açıklığında gerçekleştirebileceğiniz maksimum ağırlığı ifade eder. Bu değer, güç antrenmanının en temel referans noktasıdır; antrenman yoğunluğu, program tasarımı ve güç gelişiminin ölçülmesi için kullanılır.</p>
            <p style="margin-bottom: 1rem;">1RM'yi hesaplamak için iki yaygın formül kullanılır. <strong style="color:#ccff00;">Epley Formülü (1985)</strong>: 1RM = Ağırlık × (1 + Tekrar/30). Örneğin 80 kg ile 5 tekrar yapıldığında: 80 × (1 + 5/30) = 80 × 1.167 = <strong style="color:#fff;">93.3 kg</strong> 1RM tahmin edilir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Brzycki Formülü (1993)</strong>: 1RM = Ağırlık × (36 / (37 - Tekrar)). Aynı örnek: 80 × (36 / (37-5)) = 80 × (36/32) = 80 × 1.125 = <strong style="color:#fff;">90 kg</strong> tahmin edilir. Brzycki formülü, düşük tekrar aralıklarında (1-5 tekrar) daha doğru sonuçlar üretirken Epley formülü daha geniş bir tekrar aralığında kullanılabilir.</p>
            <p style="margin-bottom: 1rem;">Her iki formülün de ortak önerisi: <strong style="color:#fff;">10 tekrarın altında</strong> yapılan setler, 1RM tahminlerinde çok daha güvenilir sonuçlar verir. 12-15 tekrarlık setlerden yapılan hesaplamalar daha geniş bir hata payı içerir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">1RM Değerleri Antrenman Planlamasında Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">1RM'nin gerçek değeri, antrenman programlamasında yüzde tabanlı yük belirlemeyi mümkün kılmasıdır. Güç bilimi, farklı antrenman hedeflerini belirli 1RM yüzdelerine bağlamaktadır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">%85-100 1RM (1-5 tekrar):</strong> Maksimal güç gelişimi. CNS (merkezi sinir sistemi) adaptasyonu, motor ünite aktivasyonu ve inter-musküler koordinasyon gelişir. Powerlifting ve güç antrenmanı programlarının temelini oluşturur.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">%65-85 1RM (6-12 tekrar):</strong> Hipertrofi (kas büyümesi). Mekanik stres, metabolik stres ve kas hasarı üçlüsü bu aralıkta optimum düzeyde oluşur. Bodybuilding ve estetik odaklı programların öncelikli çalışma bölgesidir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">%50-65 1RM (12-20+ tekrar):</strong> Kas dayanıklılığı. Oksitatif metabolizma adaptasyonu, kas enduransı ve kardiyovasküler kapasite gelişir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">1RM'yi Güç Antrenmanında Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">1RM bilgisi, "ne kadar ağırlık kullanmalıyım?" sorusunu nesnelleştirir. "Ağır hissettiren ama kaldırabildiğim" yerine "%70 1RM ile 10 tekrar" gibi bilimsel bir referans oluşturursunuz. Bu nesnellik, antrenman tutarlılığını ve ölçülebilir ilerlemeyi garantiler.</p>
            <p style="margin-bottom: 1rem;">Dönemselleştirme (periodizasyon) programlarında 1RM merkezi bir rol oynar. Lineer periodizasyonda her haftada ağırlık artırılırken set/tekrar düzenlenir. Undulating periodizasyonda ise hafta içinde farklı günlerde farklı 1RM yüzdeleriyle çalışılır. Her iki modelde de 1RM referans noktası olmadan program yönetimi mümkün değildir.</p>
            <p style="margin-bottom: 1rem;">1RM'yi her 4-8 haftada bir yeniden hesaplamak önerilir. Adaptasyon sürecinde 1RM artar ve eski hesaplamaya dayanan antrenman yükleri suboptimal kalabilir. Düzenli 1RM güncellemesi, programın her zaman gerçek kapasiteyle uyumlu kalmasını sağlar.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">1RM ve Güç Gelişimi Hakkında Uzman Rehberi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Squat 1RM'im nedir?", "Bench press'te kaç kilo kaldırabilirim?", "1RM'i nasıl artırırım?" — bu sorular güç antrenmanının merkezinde yer almaktadır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Güç Artışının Fizyolojik Temeli</h3>
            <p style="margin-bottom: 1rem;">1RM gelişimi, iki temel mekanizmaya dayanır: kas hipertrofisi (kas boyutunun artması) ve nöromusküler adaptasyon (sinir sisteminin kasları daha verimli kullanması). Yeni başlayanlar ilk 3-6 ayda nöromusküler adaptasyon sayesinde hızlı güç artışı yaşar; bu dönemde kaslar belirgin biçimde büyümeden güç önemli ölçüde artar.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Hangi Egzersizler için 1RM Takibi Önerilir?</h3>
            <p style="margin-bottom: 1rem;">1RM takibi en çok büyük kompound hareketlerde anlam taşır: squat, bench press, deadlift, overhead press ve barbell row. Bu beş temel hareket, çoklu eklem ve kas grubunu birlikte çalıştırdığı için güç gelişiminin en iyi göstergeleridir. İzole hareketlerde (curl, lateral raise vb.) 1RM takibi daha az anlamlıdır çünkü bu hareketler maksimal güç değil kas hipertrofisi için kullanılır.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Günlük Su İhtiyacı Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Su, insan vücudunun kütlesinin %60-70'ini oluşturur ve yaşamın sürdürülmesi için oksijenden sonra en kritik unsurdur. Kan dolaşımı, sinir iletimi, sıcaklık düzenlemesi, besin taşınması ve metabolik atıkların uzaklaştırılması — bunların tümü suya bağlıdır. Hafif bir dehidrasyon bile (vücut ağırlığının %1-2'si kadar) fiziksel performansı, bilişsel işlevi ve genel refahı anlamlı biçimde düşürür.</p>
            <p style="margin-bottom: 1rem;">Günlük su ihtiyacı kişiden kişiye önemli ölçüde değişir. En yaygın kural kg başına 30-35 ml'dir. 70 kg bir kişi için bu 2.1-2.5 litre anlamına gelir. Ancak aktivite düzeyi, iklim koşulları, diyet içeriği ve bireysel farklılıklar bu miktarı artırabilir.</p>
            <p style="margin-bottom: 1rem;">Amerikan Tıp Enstitüsü (IOM) yetişkin erkekler için günde 3.7 litre, kadınlar için 2.7 litre toplam sıvı alımı (içecekler + gıdalardan gelen su dahil) önermektedir. Gıdalardan gelen suyun günlük alımın yaklaşık %20'sini oluşturduğu göz önünde bulundurulduğunda, içme suyu hedefi erkekler için ~3 litre, kadınlar için ~2.2 litre olarak belirlenir.</p>
            <p style="margin-bottom: 1rem;">İdrar rengi, hidrasyon durumunun en pratik göstergesidir. Soluk sarı (limon suyu rengi) ideal hidrasyon göstergesidir. Koyu sarı veya kehribar rengi dehidrasyon işaretidir. Renksiz veya çok açık ise aşırı hidrasyon (nadir fakat mümkün) işareti olabilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Su İhtiyacını Etkileyen Faktörler</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Egzersiz yoğunluğu:</strong> Yoğun antrenmanlar saatte 0.5-1.5 litre terleme kaybına neden olabilir. Egzersiz öncesi 400-600 ml, egzersiz sırasında her 15-20 dakikada 150-250 ml, egzersiz sonrası kaybedilen her 0.5 kg için 500-750 ml su alımı önerilir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">İklim ve sıcaklık:</strong> Sıcak ve nemli havalarda terleme artışı su ihtiyacını önemli ölçüde yükseltir. Yaz aylarında veya tropik iklimlerde bazal su ihtiyacına günlük ek 0.5-1 litre eklemek gerekebilir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Beslenme içeriği:</strong> Yüksek sodyum, protein veya lif içeren diyetler su ihtiyacını artırır. Öte yandan meyve ve sebzeler yüksek su içeriğiyle günlük sıvı alımına anlamlı katkı sağlar.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Sağlık durumu:</strong> Ateş, ishal veya kusma kayıplarını artırır. Böbrek taşı geçmişi olan bireylerin daha yüksek su tüketmesi önerilir. Kalp yetmezliği veya böbrek hastalığı durumunda ise sıvı kısıtlaması gerekebilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Hidrasyon ve Spor Performansı</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Dehidrasyonun spor performansı üzerindeki etkileri bilimsel olarak iyi belgelenmiştir. Vücut ağırlığının %2'si kadar sıvı kaybı aerobik kapasiteyi %10-20 oranında düşürür. %3-5 kayıp güç çıktısını ve bilişsel performansı önemli ölçüde azaltır. %5+ kayıp ciddi sağlık riskine zemin hazırlar.</p>
            <p style="margin-bottom: 1rem;">Antrenman öncesi hidrasyon stratejisi: Antrenmanın 2-4 saat öncesinde 400-600 ml su için. İdrar renginiz soluk sarı ise hidrasyon yeterlidir. Eğer koyu sarıysa ek 200-300 ml alın. Antrenman sırasında susama hissine göre değil, program dahilinde düzenli aralıklarla su için — susama hissi zaten hafif dehidrasyonun göstergesidir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Su Tüketimi Hakkında Sık Sorulan Sorular</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Günde 2 litre su içmek yeterli mi?", "Kahve su kaybettirir mi?", "Çok su içmek zararlı mı?" gibi sorular hidrasyon konusundaki en yaygın meraklardır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Günde 8 Bardak Su İçmeli Miyim?</h3>
            <p style="margin-bottom: 1rem;">"8 bardak su" (yaklaşık 2 litre) geniş kitlelere yönelik pratik bir öneri olup bilimsel bir kesinlik taşımaz. Araştırmalar, optimal hidrasyon miktarının kişiden kişiye ve koşuldan koşula önemli ölçüde değiştiğini göstermektedir. Kilonuzu ve aktivite düzeyinizi temel alan kişiselleştirilmiş hesaplama, bu genel kuraldan çok daha doğru bir rehber sunar.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Kahve ve Çay Su Yerine Geçer mi?</h3>
            <p style="margin-bottom: 1rem;">Kafeinli içeceklerin hafif diüretik etkisi vardır; ancak bu etki sınırlıdır ve düzenli tüketicilerde azalır. Araştırmalar, ılımlı miktarda (günde 3-4 fincan) kahve ve çay tüketiminin sıvı dengesine net olarak olumsuz etki etmediğini göstermektedir. Bununla birlikte, saf su içmek hidrasyon için en sağlıklı kaynaktır.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalp Hızı Bölgeleri Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Kalp hızı bölgeleri, egzersiz yoğunluğunu maksimum kalp atış hızının (MKH) yüzdesiyle ifade eden bir sistemdir. Bu sistem, antrenmanı belirli fizyolojik adaptasyonları tetikleyecek şekilde planlamanızı mümkün kılar. Her bölge farklı bir enerji sistemi ve kardiyovasküler adaptasyon profiliyle ilişkilidir.</p>
            <p style="margin-bottom: 1rem;">Maksimum kalp atış hızını hesaplamak için en yaygın kullanılan formül: <strong style="color:#ccff00;">MKH = 220 - Yaş</strong>. Örneğin 30 yaşında biri için MKH = 220 - 30 = 190 atım/dakika. Ancak bu formül popülasyon ortalamasını yansıtır; bireysel MKH bu değerden ±10-20 atım/dakika sapabilir.</p>
            <p style="margin-bottom: 1rem;">Daha doğru bir formül olan <strong style="color:#ccff00;">Tanaka Formülü</strong>: MKH = 208 - (0.7 × Yaş). 30 yaşındaki kişi için: 208 - 21 = 187 atım/dakika. Bu formül özellikle orta yaş ve üzeri bireylerde daha doğru sonuçlar vermektedir.</p>
            <p style="margin-bottom: 1rem;">En doğru MKH değeri için gerçek maksimal efor gerektiren bir test yapılabilir (bisiklet testi, HIIT protokolü). Ancak bu testler deneyimli sporcular için uygundur; yeni başlayanlar ve sağlık sorunları olanlar formül yöntemini tercih etmelidir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalp Hızı Bölgeleri Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Bölge 1 (%50-60 MKH):</strong> Aktif toparlanma bölgesi. Çok düşük yoğunluk. Kan dolaşımını iyileştirir, metabolik atıkların temizlenmesine yardımcı olur. Yoğun antrenman sonrası aktif toparlanma günlerinde idealdir. Enerji kaynağı büyük oranda yağdır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Bölge 2 (%60-70 MKH):</strong> Aerobik temel bölgesi. "Yağ yakım bölgesi" olarak bilinen bu alan, uzun süreli kardiyovasküler antrenmanın temelini oluşturur. Mitokondri yoğunluğunu artırır, aerobik kapasite geliştirir. Kalp sağlığı için uzun vadeli en değerli bölgedir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Bölge 3 (%70-80 MKH):</strong> Aerobik dayanıklılık bölgesi. Rahat konuşma güçleşir. Laktat üretimi başlar ama hâlâ temizlenebilir düzeydedir. Kardiyovasküler verimlilik gelişir. Çoğu fitness antrenmanı bu bölgede yapılır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Bölge 4 (%80-90 MKH):</strong> Anaerobik eşik bölgesi. Yüksek yoğunluk, kısa cümlelerle konuşulabilir. Laktik asit birikir ancak toleranla yönetilir. Bu bölgede yapılan antrenmanlar laktat eşiğini yükseltir ve yarış temposu geliştirir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Bölge 5 (%90-100 MKH):</strong> Maksimum efor bölgesi. Konuşmak mümkün değildir. Birkaç dakika üzerinde sürdürülemez. VO2max gelişimi için bu bölgede çalışılır; sprint, HIIT ve yüksek yoğunluklu interval antrenmanları bu bölgeyi hedefler.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalp Hızı Bölgelerini Fitness'ta Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Kalp hızı bölgelerine dayalı antrenman, hem amatör sporcular hem de elit atletler için bilimsel olarak en etkili programlama yaklaşımlarından biridir. "Ne kadar zorlanıyorum?" sorusunun nesnel bir ölçütüdür.</p>
            <p style="margin-bottom: 1rem;">Yeni başlayanlar için: Haftada 3-4 gün, toplam antrenman süresinin %80'ini Bölge 2'de (60-70% MKH) geçirin. Bu "polarized training" modelinin temel prensibidir. Kalan %20'yi Bölge 4-5'te geçirmek kardiyovasküler kapasiteyi hızla geliştirir.</p>
            <p style="margin-bottom: 1rem;">Deneyimli sporcular için: Bölge 2 antrenmanı aerobik tabanı güçlendirmeye devam eder. Bölge 4 antrenmanları (tempo runs, threshold intervals) yarış performansını artırır. Bölge 5 çalışmaları (HIIT, sprint) VO2max'ı yükseltir.</p>
            <p style="margin-bottom: 1rem;">Yağ yakımı hedefinde: Yaygın inanışın aksine, en fazla yağ kalori başına Bölge 2'de yakılır — ancak bu düşük yoğunlukta toplam kalori harcaması da düşüktür. Daha yüksek bölgelerde daha fazla toplam kalori harcanır. Optimal strateji, her ikisini kombine etmektir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kalp Sağlığı ve Egzersiz: Sık Sorulan Sorular</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Dinlenme kalp hızı kaç olmalı?", "Egzersizde kalp hızı ne kadar yükselebilir?", "Yüksek kalp hızı tehlikeli mi?" gibi sorular kalp sağlığı konusundaki en yaygın meraklardır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Dinlenme Kalp Hızı Ne Olmalı?</h3>
            <p style="margin-bottom: 1rem;">Yetişkinlerde normal dinlenme kalp hızı 60-100 atım/dakika arasındadır. Düzenli aerobik egzersiz yapanlar ve sporcular 40-60 atım/dakika gibi daha düşük değerlere sahip olabilir; bu, kalbin daha verimli çalıştığının bir göstergesidir. Sabah yataktan kalkmadan önce ölçülen dinlenme kalp hızı, en doğru değeri verir.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Egzersizde Kalp Hızının Yükselmesi Zararlı mı?</h3>
            <p style="margin-bottom: 1rem;">Sağlıklı bireylerde, egzersizde MKH'ye kadar çıkan kalp hızı normal ve güvenlidir. Egzersizin kardiyovasküler sistemi güçlendirdiği ve uzun vadede kalp hastalığı riskini azalttığı bilimsel olarak kanıtlanmıştır. Bununla birlikte, kalp hastası veya hipertansiyon tanısı alanların egzersiz yoğunluğunu bir doktor gözetiminde planlaması önerilir.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Günlük Protein İhtiyacı Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Protein, vücuttaki neredeyse her yapının ve işlevin temelinde yer alır: kaslar, organlar, enzimler, antikorlar, hormonlar ve hücre reseptörleri amino asitlerden oluşur. Dışarıdan almak zorunda olduğumuz 9 esansiyel amino asit, yeterli ve kaliteli protein tüketimini zorunlu kılar.</p>
            <p style="margin-bottom: 1rem;">Günlük protein ihtiyacı, aktivite düzeyi ve hedefe göre önemli ölçüde değişir. Bilimsel literatürdeki genel kategoriler şöyledir: <strong style="color:#ccff00;">Sedanter bireyler</strong> için WHO önerisi kg başına 0.8 gram'dır; bu minimum sağlık gereksinimi için yeterlidir. <strong style="color:#ccff00;">Aktif bireyler ve sporcular</strong> için kg başına 1.2-2.2 gram aralığı, güncel araştırmaların konsensüs önerisidir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Kas yapımı (bulk)</strong> sürecinde: Kg başına 2.0-2.4 gram protein, maksimum kas protein sentezini destekler. Yüksek protein alımı aynı zamanda tokluk hissini artırarak kalori yönetimini kolaylaştırır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#ccff00;">Yağ yakımı (cut)</strong> sürecinde: Kg başına 2.2-2.6 gram protein, kas kütlesini korurken kalori açığında çalışılmasını sağlar. Kas dokusunun "katabolize" edilmesini (enerji için yıkılmasını) önlemek, yağ yakım sürecinin en kritik prensibidir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Protein Kaynakları ve Kalitesi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Tüm protein kaynakları eşit değildir. "Protein kalitesi", bir kaynakta tüm esansiyel amino asitlerin bulunup bulunmadığı ve vücut tarafından ne kadarının kullanılabildiğiyle ölçülür.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Hayvansal protein kaynakları</strong> (yumurta, tavuk, balık, kırmızı et, süt ürünleri): Tüm esansiyel amino asitleri içerirler ve biyoyararlanım oranları yüksektir. Özellikle lösin içerikleri kas protein sentezini güçlü biçimde tetikler.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Bitkisel protein kaynakları</strong> (baklagiller, kinoa, soya, tofu): Tek başlarına eksik amino asit profili içerebilirler; ancak farklı kaynaklardan çeşitlendirilmiş alım tam amino asit kapsamı sağlar. Kinoa ve soya, eksiksiz amino asit profiline sahip nadir bitkisel protein kaynaklarıdır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Protein takviyeleri</strong> (whey, kazein, bitki bazlı protein tozu): Yeterli protein alımını kolaylaştırmak için kullanılır. Whey, sindirim hızı ve amino asit profili açısından en kaliteli protein takviyesidir. Kazein yavaş sindirildiği için gece alımına uygundur.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Proteini Fitness Sürecinde Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Protein zamanlaması konusunda araştırmalar, günlük toplam miktarın zamanlamadan çok daha belirleyici olduğunu göstermektedir. Bununla birlikte, bazı stratejiler pratikte avantaj sağlar.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Antrenman sonrası protein:</strong> Egzersizden sonra 30-60 dakika içinde 20-40 gram hızlı sindirilen protein (whey veya yağsız et/yumurta) almak, kas protein sentezini optimize eder. Bu "anabolik pencere" artık eskisi kadar dar görülmese de antrenmandan hemen sonra beslenmek hâlâ en pratik stratejidir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Eşit dağılım:</strong> Günlük protein hedefini 3-5 öğüne eşit dağıtmak, proteinden elde edilen kas protein sentezini maximize eder. Her öğünde 20-40 gram protein hedeflemek pratik bir rehber sunar.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Protein İhtiyacı Hakkında Sık Sorulan Sorular</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Günde kaç gram protein almalıyım?", "Protein böbreklere zarar verir mi?", "Bitkisel protein yeterli mi?" — bunlar protein konusunun en yaygın soruları ve yanılgılarıdır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Yüksek Protein Böbreklere Zararlı mı?</h3>
            <p style="margin-bottom: 1rem;">Bu yaygın bir yanılgıdır. Araştırmalar, yüksek protein alımının (kg başına 2.2 grama kadar) sağlıklı böbreklere sahip bireylerde herhangi bir zarar vermediğini tutarlı biçimde göstermektedir. Bu bulgu 2016 yılında ISSN (Uluslararası Spor Beslenmesi Derneği) tarafından da onaylanmıştır. Böbrek hastalığı tanısı alanlar ise protein alımını doktor önerisiyle sınırlandırmalıdır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Whey Protein Gerçekten Gerekli mi?</h3>
            <p style="margin-bottom: 1rem;">Whey protein, gıdadan yeterli protein almayı zorlaştıran koşullarda (düşük iştah, yoğun program, yüksek gereksinim) son derece pratik bir çözümdür. Ancak gıda kaynaklarından yeterli protein alınıyorsa takviye zorunlu değildir. "Whey olmadan kas yapılmaz" gibi bir önermeden uzak durmak gerekir; kas yapımı proteinin toplam miktarına bağlıdır, kaynağına değil.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Setler Arası Dinlenme Neden Önemlidir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Setler arası dinlenme süresi, antrenman programlamasının en sık göz ardı edilen ancak en belirleyici değişkenlerinden biridir. Doğru dinlenme süresini seçmek; performansı, kas uyarımını, hormonsal yanıtı ve enerji sistemlerinin kullanımını doğrudan etkiler.</p>
            <p style="margin-bottom: 1rem;">Dinlenmenin fizyolojik temeli <strong style="color:#fff;">ATP-PCr (fosfokreatin) sisteminin yenilenmesine</strong> dayanır. Yüksek yoğunluklu kısa süreli egzersizlerde birincil enerji kaynağı olan PCr, kas hücrelerinde sınırlı miktarda depolanır ve kasılmalar sırasında hızla tükenir. Tam yenilenmesi için yaklaşık <strong style="color:#ccff00;">3-5 dakika</strong> gerekmektedir.</p>
            <p style="margin-bottom: 1rem;">Laktik asit birikimi de dinlenme ihtiyacını etkileyen önemli bir faktördür. Orta-yüksek tekrarlı setlerde (8-15 tekrar) artan laktat konsantrasyonu, kas asitliğini yükselterek kasılma kapasitesini düşürür. Bu asidik ortamın temizlenmesi, hem oksijene hem de zaman gerektirir.</p>
            <p style="margin-bottom: 1rem;">Sinir sistemi yorgunluğu da göz ardı edilmemesi gereken bir boyuttur. Özellikle maksimal ya da maksimale yakın yüklerle yapılan egzersizler (güç antrenmanı, olimpik kaldırışlar) merkezi sinir sistemini yoğun biçimde zorlar; 3-5 dakika hatta bazı durumlarda daha uzun dinlenme gerektirir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Hedefe Göre Dinlenme Süreleri</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
              <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #f87171; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Maksimal Güç</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">3 – 5 dakika</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">%85-100 1RM yüklerinde PCr sisteminin tam yenilenmesi ve sinir sistemi toparlanması için uzun dinlenme şarttır.</p>
              </div>
              <div style="background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #fb923c; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Hipertrofi</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">60 – 90 saniye</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Metabolik stres ve hormonsal tepkiyi artırmak için kas henüz tam toparlanmadan bir sonraki sete geçilir.</p>
              </div>
              <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #60a5fa; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Güç Dayanıklılığı</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">30 – 60 saniye</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Kısa dinlenme süreleriyle kardiyovasküler kapasiteyi ve kas dayanıklılığını artırır.</p>
              </div>
              <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #4ade80; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Genel Kondisyon</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">45 – 90 saniye</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Ağırlık, tekrar sayısı ve kişisel toparlanma kapasitesine göre bu aralıkta ince ayar yapılabilir.</p>
              </div>
            </div>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Dinlenme Sürecini Nasıl Optimize Etmelisin?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Dinlenme süreci sadece pasif bekleme değildir; bu zamanı bilinçli kullanmak antrenman kalitesini artırır. Setler arasında hafif germeler (statik değil, dinamik), nefes kontrolü egzersizleri veya antagonist kas grupları için hafif aktivasyonlar yapılabilir.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Süperset ve drop set</strong> tekniklerinde dinlenme zamanlaması farklılaşır. Zıt kas gruplarının süperseti her iki egzersiz için de ayrı ayrı 30-45 saniyelik pasif dinlenme sağlarken toplam antrenman süresini kısaltır.</p>
            <p style="margin-bottom: 1rem;">Uzun antrenman seanslarında dinlenme sürelerinin kümülatif etkisi ciddi biçimde uzar. 4 set × 8 egzersiz × 2 dakika dinlenme = 64 dakika yalnızca beklemeyle geçer. Dinlenme sürelerini hedefe göre optimize etmek, antrenman süresini kısaltırken yoğunluğu artırır.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Kas Toparlanması ve Uyku: Göz Ardı Edilen Bağlantı</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem;">Kaslar Ne Zaman Büyür?</h3>
            <p style="margin-bottom: 1rem;">Kaslar antrenman sırasında değil, sonrasında büyür. Egzersiz kas dokusunda mikroskobik hasarlar oluşturur; bu hasar onarım ve yeniden yapılanma sürecini tetikler. Bu süreç 24-72 saat arasında sürebilir. Kaslar hasardan daha güçlü onarılarak büyür; bu "süperameli" (supercompensation) olarak bilinir.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Toparlanmayı Hızlandıran Stratejiler</h3>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Aktif dinlenme:</strong> Yoğun antrenmandan sonraki gün hafif yürüyüş, yüzme veya yoga gibi düşük yoğunluklu aktiviteler kan akışını artırarak metabolik atıkların uzaklaştırılmasını hızlandırır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Beslenme zamanlaması:</strong> Antrenman sonrası 30-60 dakika içinde protein ve karbonhidrat kombinasyonu tüketmek kas glikojen depolarını hızla yenileyerek iyileşmeyi optimize eder.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Boy Kilo Endeksi Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Boy Kilo Endeksi (BKE), vücut ağırlığını boy ile karşılaştıran ve sağlık riskini değerlendirmeye yardımcı olan bir ölçümdür. Bu hesap makinesinde kullanılan endeks, geleneksel VKİ formülünden farklı bir yaklaşım benimseyerek boya göreli ağırlık dağılımını değerlendirir. Özellikle Çin ve Uzak Doğu kaynaklı tıp araştırmalarında yaygın kullanım alanı bulan bu yöntem, Asya popülasyonuna özgü sağlık riski eşiklerini daha doğru yansıtır.</p>
            <p style="margin-bottom: 1rem;">Hesap makinesinin pratik kullanımında boy ve kilo bilgilerini doğru girmek kritik önem taşır. Boy için sabah ölçümü tercih edilmeli, kilo için ise sabah aç karnına tartılmalıdır. Bu tutarlılık, zaman içinde yapılan karşılaştırmaların güvenilirliğini artırır. Ölçüm sıklığı olarak ayda bir değerlendirme, hem günlük su/besin dalgalanmalarını elimine eder hem de gerçek eğilimi görmek için yeterli süreyi sağlar.</p>
            <p style="margin-bottom: 1rem;">Boy kilo endeksi değerini tek başına kullanmak yerine bel çevresi, vücut yağ yüzdesi ve bel-kalça oranı gibi tamamlayıcı metriklerle birlikte değerlendirmek, çok daha kapsamlı bir sağlık tablosu ortaya koyar.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Sonuçları Nasıl Yorumlamalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Boy kilo endeksi değerlendirmesinde yalnızca anlık sonuca değil, zamanla nasıl değiştiğine odaklanmak daha değerlidir. Tek bir ölçüm vücudun mevcut durumunun anlık bir fotoğrafı iken aylık ölçümlerin takibi beslenme ve egzersiz alışkanlıklarınızın gerçek etkisini ortaya koyar.</p>
            <p style="margin-bottom: 1rem;">Endeks değerinizin önerilen aralığın üzerinde olması; kalori dengesi, besin kalitesi ve fiziksel aktivite düzeyi konularında iyileştirme yapılabileceğine işaret eder. Öncelikli strateji: günlük kalori alımını TDEE'nin altında tutmak, işlenmiş besinleri azaltmak, düzenli aerobik ve direnç antrenmanına başlamak.</p>
            <p style="margin-bottom: 1rem;">Değeriniz sağlıklı aralıkta olsa bile bel çevresi veya vücut yağ yüzdesi yüksekse bu "normal kilolu obezite" (TOFI — Thin Outside, Fat Inside) durumuna işaret edebilir. Bu nedenle boy kilo endeksini her zaman diğer ölçümlerle birlikte değerlendirmek önemlidir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Sağlıklı Boy Kilo Dengesi İçin Ne Yapmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Sağlıklı bir boy kilo dengesini korumak, anlık diyet ya da kısa süreli yoğun egzersiz programlarıyla değil; sürdürülebilir yaşam tarzı alışkanlıklarıyla mümkündür.</p>
            <p style="margin-bottom: 1rem;">Beslenme açısından en etkili strateji <strong style="color:#fff;">besin yoğunluğuyla</strong> düşünmektir: aynı kaloriyle ne kadar fazla besin değeri (vitamin, mineral, protein, lif) alabileceğinize odaklanmak. Sebzeler, meyveler, baklagiller, tam tahıllar ve kaliteli protein kaynakları bu prensip için ideal gıdalardır.</p>
            <p style="margin-bottom: 1rem;">Egzersiz açısından ise çeşitlilik ve tutarlılık anahtardır. Haftada en az 150 dakika orta yoğunlukta aerobik aktivite ve haftada en az iki gün tüm vücudu kapsayan direnç antrenmanı, sağlıklı vücut ağırlığını korumak için bilimsel olarak kanıtlanmış minimumları temsil eder.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Sağlıklı Vücut Ağırlığı İçin Bütünsel Yaşam Tarzı Rehberi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Sağlıklı bir vücut ağırlığını sürdürmek yalnızca ne yediğiniz ve ne kadar hareket ettiğinizle sınırlı değildir. Uyku, stres, sosyal bağlar ve çevre faktörleri de önemli rol oynar.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Türkiye'de Boy Kilo İlişkisi</h3>
            <p style="margin-bottom: 1rem;">Türkiye İstatistik Kurumu verilerine göre Türkiye'deki yetişkin nüfusun yaklaşık yüzde 32'si obez, yüzde 35'i ise fazla kilolu kategorisindedir. Bu oran son otuz yılda yaklaşık üç katına çıkmıştır. Kendi ağırlık durumunuzu düzenli olarak takip etmek, kişisel sağlık yönetiminin kritik bir parçasıdır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Çevre Düzenlemesi</h3>
            <p style="margin-bottom: 1rem;">Araştırmalar, kararlarımızın büyük bölümünün bilinçli tercihten değil çevre koşullarından şekillendiğini göstermektedir. Mutfakta sağlıklı gıdaları göz hizasına koyun, işlenmiş atıştırmalıkları görünmez alanlara kaldırın. Akşam yemeklerini küçük tabaklarda servis etmek gibi basit fiziksel değişiklikler, irade gücü gerektirmeksizin kalori alımını azaltabilir.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Bel Kalça Oranı Nedir? Nasıl Hesaplanır?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Bel-kalça oranı (BKO), bel çevresinin kalça çevresine bölünmesiyle elde edilen basit ancak bilgilendirici bir sağlık göstergesidir. Bu oran, vücuttaki yağ dağılımını değerlendirmek ve özellikle karın bölgesindeki visseral yağ birikimini tespit etmek amacıyla kullanılmaktadır. Dünya Sağlık Örgütü, bu ölçümü kronik hastalık riskini değerlendirmede standart bir araç olarak benimsemiştir.</p>
            <p style="margin-bottom: 1rem;">Formül son derece basittir: <strong style="color:#ccff00;">BKO = Bel Çevresi (cm) ÷ Kalça Çevresi (cm)</strong>. Örneğin bel çevresi 80 cm, kalça çevresi 100 cm olan biri için BKO = 80 ÷ 100 = 0.80'dir.</p>
            <p style="margin-bottom: 1rem;">Doğru ölçüm için bel çevresini göbek hizasında (kaburgalar ile kalça kemikleri arasındaki en dar noktada), kalça çevresini ise en geniş noktasından ölçmek gerekir. Ölçümü sabah aç karnına ve derin bir nefes verildikten sonra yapmak, tutarlı sonuçlar için önerilir.</p>
            <p style="margin-bottom: 1rem;">BKO'nun önemi, yalnızca genel obeziteyi değil <strong style="color:#fff;">yağ dağılımını</strong> ölçmesinden kaynaklanır. "Elma tipi" vücut (karın bölgesinde yağ birikimi), tip 2 diyabet, hipertansiyon, kardiyovasküler hastalıklar ve metabolik sendromla çok daha güçlü bir ilişki içindedir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">BKO Değerleri Ne Anlama Gelir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
              <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #4ade80; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Düşük Risk (Erkek)</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">BKO ≤ 0.90</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Kardiyovasküler ve metabolik hastalık riski normal popülasyon düzeyinde.</p>
              </div>
              <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #4ade80; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Düşük Risk (Kadın)</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">BKO ≤ 0.80</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Kadınlarda fizyolojik olarak daha geniş kalça yapısı nedeniyle risk eşiği erkeklerden düşük tutulur.</p>
              </div>
              <div style="background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #facc15; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Orta Risk</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">Erkek: 0.91-0.99 / Kadın: 0.81-0.85</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Metabolik sendrom ve kardiyovasküler risk belirgin biçimde yükselir.</p>
              </div>
              <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #f87171; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Yüksek Risk</div>
                <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">Erkek: ≥ 1.0 / Kadın: ≥ 0.86</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Visseral yağ birikimi tehlikeli düzeye ulaşmıştır. Profesyonel tıbbi değerlendirme önerilir.</p>
              </div>
            </div>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">BKO'yu Fitness Sürecinde Nasıl Kullanmalısın?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">BKO, kilo verme sürecinde ölçek üzerindeki kilogram değişiminden çok daha anlamlı bir gelişme göstergesidir. Kilonuz aynı kalsa bile bel çevreniz azalıyorsa, bu yağ kütlesini kaybedip kas kütlesi kazandığınıza işaret eder.</p>
            <p style="margin-bottom: 1rem;">Bel çevresini azaltmanın en etkili stratejisi; kalori açığı, yeterli protein alımı ve özellikle visseral yağı hedef alan egzersizlerin kombinasyonudur. Bölgesel yağ yakımı (spot reduction) bilimsel olarak kanıtlanmamış bir kavramdır — mekik yapmak karın yağını doğrudan eritmez. Ancak genel vücut yağını azaltan bir program, bel çevresini de küçültür.</p>
            <p style="margin-bottom: 1rem;">Aerobik egzersizler — özellikle orta ve yüksek yoğunluklu kardiyovasküler aktiviteler — visseral yağı azaltmada en etkili egzersiz türü olarak öne çıkmaktadır. Direnç antrenmanı ile kombine edildiğinde ise hem yağ azalır hem de kasa dönüşüm sağlanır.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Bel Çevresini Küçültmenin Bilimsel Yolları</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem;">Visseral Yağı Azaltmanın En Hızlı Yolu</h3>
            <p style="margin-bottom: 1rem;">İyi haber şudur: visseral yağ, cilt altı yağa kıyasla diyet ve egzersiz müdahalelerine çok daha hızlı yanıt verir. Yüksek yoğunluklu interval antrenmanı (HIIT), visseral yağ azaltmada geleneksel düşük yoğunluklu kardioya kıyasla daha etkili olduğunu gösteren araştırmalar mevcuttur.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Beslenmenin Bel Çevresi Üzerindeki Etkisi</h3>
            <p style="margin-bottom: 1rem;">İşlenmiş gıdalar, rafine karbonhidratlar ve trans yağlar visseral yağ birikimini tetikleyen başlıca besin faktörleridir. Yüksek lif içeren diyet (günlük 25-30 gram hedef) visseral yağ azaltmayla güçlü biçimde ilişkilidir. Alkol tüketimi de bel çevresini doğrudan etkiler; vücudun yakıt olarak öncelikle alkolü kullanmasıyla yağ yakımı duraklar.</p>
            <p style="margin-bottom: 1rem;">BKO'yu iki ayda bir ölçmek, tüm bu stratejilerin gerçek etkisini nesnel biçimde izlemenizi sağlar. Küçük ama tutarlı düşüşler — ayda 0.5-1 cm bel incelemesi — doğru yönde ilerlediğinizi gösterir.</p>
          </div>
        </section>
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
        <section style="margin-top: 3rem; padding-top: 3rem; border-top: 1px solid #1a1a1a;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Tipleri Nedir? Nasıl Belirlenir?</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">Vücut tipleri (somatotipler), 1940'larda Amerikalı psikolog William Sheldon tarafından geliştirilen bir sınıflandırma sistemidir. Bu sisteme göre insan vücudu üç temel tipe ayrılır: <strong style="color:#fff;">ektomorf</strong> (ince, uzun kemikli, az yağlı), <strong style="color:#fff;">mezomorf</strong> (atletik, kas gelişimine yatkın) ve <strong style="color:#fff;">endomorf</strong> (yuvarlak, yağ depolamaya eğilimli).</p>
            <p style="margin-bottom: 1rem;">Önemli bir nokta: çoğu insan saf bir somatotipe sahip değildir. Gerçekte büyük çoğunluk, iki ya da üç tipin karışımından oluşan bir spektrumda yer alır. "Ekto-mezomorf", "meso-endomorf" gibi melez tipler çok daha yaygındır.</p>
            <p style="margin-bottom: 1rem;">Vücut tipini belirlemede kullanılan pratik yöntemler arasında bilek çevresi ve boy oranı, omuz-kalça oranı ve görsel değerlendirme yer alır. Bu hesap makinesi, bileğinizin çevresini referans alarak boy ile ağırlığınızı bu formüle dahil eder.</p>
            <p style="margin-bottom: 1rem;">Vücut tipinizi bilmek, antrenman ve beslenme stratejinizi kişiselleştirmenin ilk adımıdır. "Herkese uyan tek bir program" yoktur; ektomorfun yediği besin miktarını endomorfun tüketmesi tamamen zıt sonuçlar doğurabilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">3 Vücut Tipinin Özellikleri ve Farkları</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
              <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #60a5fa; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Ektomorf</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">İnce kemik yapısı, hızlı metabolizma, düşük doğal kas kütlesi. Kilo almakta ve kas yapmakta güçlük çeker. Yüksek kalori ve karbonhidrat alımı kritiktir.</p>
              </div>
              <div style="background: rgba(204,255,0,0.1); border: 1px solid rgba(204,255,0,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #ccff00; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Mezomorf</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Atletik yapı, orta-geniş kemik çerçevesi, hızlı kas yanıtı. Kas kazanımına ve yağ yakmaya en yatkın tip. Dikkat edilmezse yağ birikimi de hızlı olabilir.</p>
              </div>
              <div style="background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.2); border-radius: 0.75rem; padding: 1rem;">
                <div style="color: #fb923c; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Endomorf</div>
                <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6;">Geniş kemik yapısı, yavaş metabolizma, yağ depolamaya yüksek eğilim. Kas kazanımı görece kolaydır; ancak yağ altında kalır.</p>
              </div>
            </div>
            <p style="margin-bottom: 1rem;">Bu üç tip arasındaki en kritik fark <strong style="color:#fff;">insülin duyarlılığı ve metabolik hızdır</strong>. Ektomorflar genellikle yüksek insülin duyarlılığına ve hızlı metabolizmaya sahiptir. Endomorflar ise insülin direncine daha yatkın oldukları için karbonhidrat toleransları daha düşük olabilir.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Tipine Göre Antrenman ve Beslenme Stratejisi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Ektomorflar için:</strong> Kalori fazlası ve yüksek karbonhidrat tüketimi önceliklidir. Haftada 3-4 gün yoğun direnç antrenmanı, minimum kardio. Kompound hareketler (squat, deadlift, bench press, row) kas büyümesini en hızlı tetikleyen egzersizlerdir. Protein alımı kilogram başına 2-2.5 gram olmalıdır.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Mezomorflar için:</strong> En fazla esnekliğe sahip olan bu tip, hem kas kazanımı hem de yağ kaybı için hızlı sonuç alabilir. Periyodik diyet dönemleri ve çeşitlendirilmiş antrenman programları mezomorfların uzun vadede en iyi formlarını korumalarını sağlar.</p>
            <p style="margin-bottom: 1rem;"><strong style="color:#fff;">Endomorflar için:</strong> Kalori kontrolü ve kardiyovasküler antrenman öne çıkar. Düşük-orta karbonhidrat, yüksek protein ve sağlıklı yağ ağırlıklı beslenme tercih edilir. Yüksek hacimli direnç antrenmanı ile interval kardio kombinasyonu en etkili yaklaşımdır.</p>
          </div>
        </section>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Vücut Tipine Göre Özel Beslenme ve Antrenman Planı Rehberi</h2>
          <div style="color: #a3a3a3; line-height: 1.8; font-size: 0.95rem;">
            <p style="margin-bottom: 1rem;">"Ektomorf nasıl kilo alır?", "Endomorf nasıl zayıflar?", "Mezomorf için en iyi antrenman programı hangisi?" — bu sorular vücut tipi hesabı yapan herkesi meşgul eden sorulardır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Ektomorf Kilo Nasıl Alır?</h3>
            <p style="margin-bottom: 1rem;">Ektomorflar için kilo almanın en büyük engeli genellikle iştah eksikliği ve yüksek metabolizmadır. Günde 3 büyük öğün yerine 5-6 daha küçük öğün, kalori alımını zorlanmadan artırmanın pratik yoludur. Kalori yoğun besinler (fındık ezmesi, avokado, zeytinyağı, tam tahıllar, kuru meyveler) hacim artışı olmaksızın önemli kalori katkısı sağlar.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Endomorf Nasıl Zayıflar?</h3>
            <p style="margin-bottom: 1rem;">Endomorflar için kilo yönetiminin anahtarı insülin duyarlılığını artırmak ve metabolizmayı canlı tutmaktır. Karbonhidrat alımının egzersiz etrafında yoğunlaştırılması (antrenman öncesi ve sonrası), karbonhidratın yağ olarak depolanma eğilimini azaltır.</p>
            <h3 style="color: #fff; font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem;">Vücut Tipi Zamanla Değişir Mi?</h3>
            <p style="margin-bottom: 1rem;">Kısmen evet. Somatotip ağırlıklı olarak genetik tarafından belirlense de yaşam tarzı değişiklikleriyle önemli ölçüde değişebilir. Yıllarca yoğun direnç antrenmanı yapan bir ektomorf dışarıdan mezomorf gibi görünebilir. Vücut tipini bir sınır olarak değil, başlangıç noktası olarak görmek motivasyonu koruyarak gerçekçi bir ilerleme planı yapmanızı sağlar.</p>
          </div>
        </section>
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
