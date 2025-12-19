import MarkdownIt from "markdown-it";
import type { Article, Package } from "@shared/schema";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
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
    .article-content h2 { color: #fff; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; }
    .article-content h3 { color: #ccff00; font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; }
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

export function renderArticleDetail(article: Article): string {
  const contentHtml = article.content ? md.render(article.content) : '';
  
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
  const faqItems = [
    { q: "Vücut Kitle İndeksi (VKİ) nedir?", a: "Vücut Kitle İndeksi (VKİ veya BMI), kilonuzun boyunuza göre sağlıklı bir aralıkta olup olmadığını gösteren bir ölçüttür. Kilonuzun (kg) boyunuzun karesine (m²) bölünmesiyle hesaplanır." },
    { q: "Normal VKİ değeri kaçtır?", a: "Dünya Sağlık Örgütü'ne göre normal VKİ aralığı 18.5-24.9 arasındadır. 18.5'in altı zayıf, 25-29.9 fazla kilolu, 30 ve üzeri obez olarak değerlendirilir." },
    { q: "VKİ hesaplama formülü nedir?", a: "VKİ = Kilo (kg) / Boy² (m²) formülü ile hesaplanır. Örneğin, 70 kg ağırlığında ve 1.75 m boyunda birinin VKİ değeri 70 / (1.75 × 1.75) = 22.9 olur." },
    { q: "VKİ kas kütlesini dikkate alır mı?", a: "Hayır, VKİ yağ ve kas kütlesini ayırt edemez. Bu nedenle sporcular ve kas kütlesi yüksek kişilerde yanıltıcı sonuçlar verebilir." },
    { q: "Çocuklar için VKİ nasıl değerlendirilir?", a: "Çocuk ve ergenlerde VKİ yaşa ve cinsiyete göre persentil grafikleri kullanılarak değerlendirilir. Yetişkin kategorileri çocuklar için geçerli değildir." }
  ];

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
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderCalorieTool(): string {
  const faqItems = [
    { q: "Günlük kalori ihtiyacı nasıl hesaplanır?", a: "Günlük kalori ihtiyacı, bazal metabolizma hızı (BMH) ile aktivite seviyesi çarpılarak hesaplanır. Yaş, cinsiyet, boy, kilo ve günlük aktivite düzeyi bu hesaplamada temel faktörlerdir." },
    { q: "Kilo vermek için kaç kalori almalıyım?", a: "Kilo vermek için günlük kalori ihtiyacınızdan 300-500 kalori açık oluşturmanız önerilir. Haftada 0.5-1 kg kilo kaybı sağlıklı bir hedeftir." },
    { q: "Bazal Metabolizma Hızı (BMH) nedir?", a: "Bazal Metabolizma Hızı, vücudunuzun tamamen dinlenme halindeyken temel yaşam fonksiyonlarını sürdürmek için harcadığı kalori miktarıdır." },
    { q: "Kalori açığı nedir ve nasıl oluşturulur?", a: "Kalori açığı, aldığınız kaloriden daha fazla kalori harcamanızdır. Daha az yemek, daha fazla hareket etmek veya her ikisini birleştirerek kalori açığı oluşturabilirsiniz." },
    { q: "Kas yapmak için kaç kalori almalıyım?", a: "Kas yapmak için günlük kalori ihtiyacınızın 200-300 kalori üzerinde beslenmeli ve yeterli protein almalısınız." }
  ];

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
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Kalori Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Günlük kalori ihtiyacınızı hesaplayarak kilo vermek, korumak veya almak için gereken kalori miktarını öğrenin. 
          Hesaplama yaş, cinsiyet, boy, kilo ve aktivite seviyenize göre yapılır.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderTdeeTool(): string {
  const faqItems = [
    { q: "TDEE nedir?", a: "TDEE (Total Daily Energy Expenditure), Toplam Günlük Enerji Harcaması anlamına gelir. Bazal metabolizma hızınız ve günlük aktivitelerinizin toplamından oluşan, bir günde harcadığınız toplam kalori miktarıdır." },
    { q: "TDEE nasıl hesaplanır?", a: "TDEE, bazal metabolizma hızınız (BMH) ile aktivite faktörünüzün çarpılmasıyla hesaplanır. Aktivite faktörü hareketsiz yaşamdan çok aktif yaşama kadar 1.2 ile 1.9 arasında değişir." },
    { q: "TDEE ve BMR arasındaki fark nedir?", a: "BMR (Bazal Metabolizma Hızı) vücudunuzun dinlenme halinde harcadığı kaloridir. TDEE ise BMR'ye günlük aktivitelerinizin eklenmesiyle oluşur." },
    { q: "TDEE ne için kullanılır?", a: "TDEE, kilo yönetimi için temel referans noktasıdır. Kilo vermek için TDEE'nin altında, kilo almak için üzerinde kalori almalısınız." },
    { q: "Aktivite seviyemi nasıl belirlerim?", a: "Hareketsiz: Masa başı iş, egzersiz yok. Hafif aktif: Haftada 1-3 gün. Orta aktif: Haftada 3-5 gün. Çok aktif: Haftada 6-7 gün yoğun egzersiz." }
  ];

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
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">TDEE Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Toplam Günlük Enerji Harcaması (TDEE), gün boyunca yaktığınız toplam kalori miktarıdır. 
          Bu değer bazal metabolizma hızınız ve aktivite seviyenizin birleşiminden oluşur.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderMacroTool(): string {
  const faqItems = [
    { q: "Makro besinler nelerdir?", a: "Makro besinler vücudumuzun enerji kaynağı olan üç temel besin grubudur: Protein (1g = 4 kalori), karbonhidrat (1g = 4 kalori) ve yağ (1g = 9 kalori)." },
    { q: "Günlük protein ihtiyacı nasıl hesaplanır?", a: "Protein ihtiyacı hedefinize göre değişir. Sedanter bireyler için kg başına 0.8-1g, aktif bireyler için 1.2-1.6g, kas yapmak isteyenler için 1.6-2.2g protein önerilir." },
    { q: "Karbonhidrat ve yağ oranı ne olmalı?", a: "Genel öneri toplam kalorinin %45-65'i karbonhidrat, %20-35'i yağ olmalıdır. Düşük karbonhidrat diyetlerinde bu oran değişebilir." },
    { q: "Makro takibi neden önemli?", a: "Sadece kalori saymak yeterli değildir. Doğru makro dağılımı kas kaybını önler, enerji seviyenizi dengeler, hormon üretimini destekler." },
    { q: "Makro hesaplarken nelere dikkat etmeliyim?", a: "Önce günlük kalori ihtiyacınızı belirleyin. Ardından hedefinize göre makro yüzdeleri seçin. Protein ve yağ ihtiyacınızı sabitleyip kalan kaloriyi karbonhidrata ayırabilirsiniz." }
  ];

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
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Makro Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize uygun makro besin dağılımını öğrenerek 
          beslenme planınızı optimize edin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderIdealKiloTool(): string {
  const faqItems = [
    { q: "İdeal kilo nasıl hesaplanır?", a: "İdeal kilo, boy, cinsiyet ve vücut yapısına göre çeşitli formüllerle hesaplanır. En yaygın formüller Devine, Robinson, Miller ve Hamwi formülleridir." },
    { q: "İdeal kilo formülleri nelerdir?", a: "Devine formülü erkekler için 50 + 2.3 × (boy inç - 60), kadınlar için 45.5 + 2.3 × (boy inç - 60) şeklindedir." },
    { q: "İdeal kilo herkes için aynı mıdır?", a: "Hayır, ideal kilo kişiden kişiye değişir. Kas kütlesi, kemik yapısı, yaş ve genel sağlık durumu ideal kiloyu etkiler." },
    { q: "İdeal kilomdan uzaksam ne yapmalıyım?", a: "Öncelikle sağlıklı ve sürdürülebilir bir plan oluşturun. Haftada 0.5-1 kg kayıp veya artış hedefleyin." }
  ];

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
          Boyunuza ve cinsiyetinize göre ideal kilonuzu hesaplayın. Devine, Robinson, Miller ve Hamwi formülleriyle 
          bilimsel hesaplama yaparak sağlıklı kilo hedeflerinizi belirleyin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderVucutYagiTool(): string {
  const faqItems = [
    { q: "Vücut yağ oranı nedir?", a: "Vücut yağ oranı, toplam vücut ağırlığınızın yüzde kaçının yağ dokusundan oluştuğunu gösterir. Sağlıklı aralık erkeklerde %10-20, kadınlarda %18-28 arasındadır." },
    { q: "Vücut yağ oranı nasıl hesaplanır?", a: "US Navy formülü ile boyun, bel ve kalça ölçüleri kullanılarak hesaplanır. Bu yöntem profesyonel ölçüm cihazlarına yakın sonuçlar verir." },
    { q: "Yağsız kütle nedir?", a: "Yağsız kütle (Lean Body Mass), vücudunuzun yağ dışındaki tüm dokularının ağırlığıdır: kaslar, kemikler, organlar ve su." },
    { q: "Erkek ve kadın için ideal yağ oranı nedir?", a: "Atletler için: Erkek %6-13, Kadın %14-20. Fitness: Erkek %14-17, Kadın %21-24. Kabul edilebilir: Erkek %18-24, Kadın %25-31." },
    { q: "Vücut yağ oranını düşürmek için ne yapmalıyım?", a: "Kalori açığı oluşturun, yeterli protein alın, direnç antrenmanı yapın ve yeterli uyuyun. Haftada %0.5-1 yağ kaybı sağlıklı bir hedeftir." }
  ];

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
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderOneRepMaxTool(): string {
  const faqItems = [
    { q: "1RM (One Rep Max) nedir?", a: "1RM, bir harekette tek seferde kaldırabileceğiniz maksimum ağırlıktır. Antrenman programlaması ve güç seviyenizi ölçmek için kullanılan temel göstergedir." },
    { q: "1RM nasıl hesaplanır?", a: "Epley formülü ile: 1RM = Ağırlık × (1 + Tekrar/30). Brzycki formülü: 1RM = Ağırlık × (36 / (37 - Tekrar)). 10 tekrarın altındaki setler daha doğru sonuç verir." },
    { q: "1RM bilgisini nasıl kullanmalıyım?", a: "Antrenman yoğunluğunu belirlemek için kullanın. Güç için %85-95, hipertrofi için %65-85, dayanıklılık için %50-65 1RM ile çalışın." },
    { q: "1RM testini ne sıklıkla yapmalıyım?", a: "Her 4-8 haftada bir 1RM testi yapabilirsiniz. Formül ile hesaplama daha güvenlidir ve sakatlanma riskini azaltır." },
    { q: "1RM hesaplamak için ideal tekrar sayısı nedir?", a: "3-5 tekrar en doğru sonucu verir. 10 tekrarın üzerindeki setlerde hata payı artar." }
  ];

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
          Kaldırdığınız ağırlık ve tekrar sayısından maksimum kaldırma kapasiteni hesaplayın. 
          Epley ve Brzycki formülleriyle güç seviyenizi ölçün ve antrenman programınızı optimize edin.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderSuTuketimiTool(): string {
  const faqItems = [
    { q: "Günlük ne kadar su içmeliyim?", a: "Genel öneri kg başına 30-35 ml sudur. 70 kg bir kişi günde 2.1-2.5 litre su içmelidir. Aktivite seviyesi ve iklim bu miktarı artırabilir." },
    { q: "Egzersiz yaparken ne kadar su içmeliyim?", a: "Egzersiz öncesi 500ml, egzersiz sırasında her 15-20 dakikada 150-250ml, egzersiz sonrası kaybedilen her 0.5 kg için 500-750ml su içmelisiniz." },
    { q: "Susuzluk belirtileri nelerdir?", a: "Koyu renk idrar, baş ağrısı, yorgunluk, konsantrasyon güçlüğü, kuru cilt ve dudaklar, kas krampları susuzluk belirtileridir." },
    { q: "Çok su içmenin zararı var mı?", a: "Aşırı su tüketimi (hiponatremi) elektrolit dengesizliğine yol açabilir. Günde 4-5 litreden fazla su içmekten kaçının." },
    { q: "Kahve ve çay su yerine geçer mi?", a: "Kafeinli içecekler hafif diüretik etkiye sahiptir ancak günlük sıvı alımına katkıda bulunur. Yine de saf su içmek en iyisidir." }
  ];

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
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderKalpAtisiTool(): string {
  const faqItems = [
    { q: "Maksimum kalp atış hızı nasıl hesaplanır?", a: "En yaygın formül: Maksimum Kalp Atış Hızı = 220 - Yaş. 30 yaşında biri için maksimum kalp hızı 190 atım/dakikadır." },
    { q: "Kalp atış hızı bölgeleri nelerdir?", a: "Bölge 1 (%50-60): Toparlanma. Bölge 2 (%60-70): Yağ yakımı. Bölge 3 (%70-80): Aerobik. Bölge 4 (%80-90): Anaerobik. Bölge 5 (%90-100): Maksimum efor." },
    { q: "Yağ yakmak için hangi bölgede çalışmalıyım?", a: "Yağ yakımı için Bölge 2-3 (%60-80) idealdir. Bu bölgelerde vücut enerji için yağları kullanır." },
    { q: "Dinlenme kalp atış hızı ne olmalı?", a: "Sağlıklı yetişkinlerde 60-100 atım/dakika normaldir. Atletlerde 40-60 olabilir." },
    { q: "Kalp atış hızı nasıl ölçülür?", a: "Bileğinizden veya boynunuzdan nabzınızı sayın. 15 saniye sayıp 4 ile çarpın. Akıllı saatler daha doğru sürekli ölçüm sağlar." }
  ];

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
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderProteinTool(): string {
  const faqItems = [
    { q: "Günlük protein ihtiyacı ne kadardır?", a: "Sedanter bireyler için kg başına 0.8g, aktif bireyler için 1.2-1.6g, kas yapımı hedefleyenler için 1.6-2.2g protein önerilir." },
    { q: "Protein ne zaman alınmalı?", a: "Protein gün boyunca eşit aralıklarla dağıtılmalıdır. Her öğünde 20-40g protein ideal. Antrenman sonrası 30 dakika içinde protein almak kas onarımını destekler." },
    { q: "En iyi protein kaynakları nelerdir?", a: "Hayvansal: tavuk, hindi, balık, yumurta, süt ürünleri. Bitkisel: mercimek, nohut, kinoa, tofu. Takviye: whey, kazein protein tozları." },
    { q: "Çok protein almanın zararı var mı?", a: "Sağlıklı bireylerde yüksek protein (2.2g/kg'a kadar) genellikle güvenlidir. Böbrek hastalığı olanlar dikkatli olmalı." },
    { q: "Protein eksikliği belirtileri nelerdir?", a: "Kas kaybı, yorgunluk, saç dökülmesi, yavaş yara iyileşmesi, zayıf bağışıklık protein eksikliği belirtileri olabilir." }
  ];

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
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
        </section>
      </main>
    </div>
  `;
}

export function renderDinlenmeTool(): string {
  const faqItems = [
    { q: "Setler arasında ne kadar dinlenmeliyim?", a: "Güç antrenmanı için 3-5 dakika, hipertrofi için 60-90 saniye, dayanıklılık için 30-60 saniye dinlenme önerilir." },
    { q: "Kısa dinlenme mi uzun dinlenme mi daha iyi?", a: "Kas büyümesi için 60-90 saniye metabolik stres oluşturur. Güç artışı için 3-5 dakika tam toparlanma gerekir." },
    { q: "Kas grupları arasında kaç gün dinlenmeliyim?", a: "Aynı kas grubunu tekrar çalıştırmadan önce 48-72 saat bekleyin. Büyük kas grupları daha uzun toparlanma gerektirir." },
    { q: "Fazla dinlenmek antrenmanı etkiler mi?", a: "Evet, uzun dinlenme kasları soğutur ve metabolik etkiyi azaltır. Ancak güç antrenmanlarında tam toparlanma performansı artırır." },
    { q: "Aktif dinlenme nedir?", a: "Aktif dinlenme, setler arasında tamamen durgunluk yerine hafif hareket yapmaktır. Kan dolaşımını artırır ve toparlanmayı hızlandırabilir." }
  ];

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
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Dinlenme Süresi Hesaplayıcı</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem; line-height: 1.8;">
          Antrenman tipinize göre ideal set arası dinlenme sürenizi öğrenin. 
          Güç, hipertrofi ve dayanıklılık hedeflerinize göre optimal dinlenme önerileri alın.
        </p>
        <div style="background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 1rem; padding: 2rem;">
          <p style="color: #666; text-align: center;">Hesaplayıcıyı kullanmak için JavaScript'i etkinleştirin.</p>
        </div>
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.75rem; color: #fff; margin-bottom: 1.5rem;">Sıkça Sorulan Sorular</h2>
          ${faqItems.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem;">
              <h3 style="color: #ccff00; font-size: 1.1rem; margin-bottom: 0.75rem;">${escapeHtml(faq.q)}</h3>
              <p style="color: #a3a3a3; line-height: 1.7;">${escapeHtml(faq.a)}</p>
            </div>
          `).join('')}
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
