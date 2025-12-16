import MarkdownIt from "markdown-it";
import type { Article, Package } from "@shared/schema";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

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
      <p style="font-size: 2rem; font-weight: 700; color: #ccff00;">${pkg.price.toLocaleString('tr-TR')} ₺</p>
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

  const publishedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <article style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <header style="margin-bottom: 2rem;">
          ${categoryLabel ? `<span style="background: rgba(204, 255, 0, 0.1); color: #ccff00; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; text-transform: uppercase;">${categoryLabel}</span>` : ''}
          <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin: 1rem 0;">${escapeHtml(article.title)}</h1>
          ${publishedDate ? `<time style="color: #666; font-size: 0.875rem;">${publishedDate}</time>` : ''}
        </header>
        
        ${article.heroImage ? `
          <img 
            src="${article.heroImage}" 
            alt="${escapeHtml(article.title)}" 
            style="width: 100%; height: auto; border-radius: 1rem; margin-bottom: 2rem; max-height: 500px; object-fit: cover;"
          />
        ` : ''}
        
        <div class="article-content" style="color: #e5e5e5; line-height: 1.8; font-size: 1.125rem;">
          ${contentHtml}
        </div>
        
        ${article.ctaText && article.ctaLink ? `
          <div style="margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, rgba(204, 255, 0, 0.1), transparent); border: 1px solid rgba(204, 255, 0, 0.2); border-radius: 1rem; text-align: center;">
            <a href="${article.ctaLink}" style="display: inline-block; background: #ccff00; color: #000; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
              ${escapeHtml(article.ctaText)}
            </a>
          </div>
        ` : ''}
      </article>
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
  return `
    <div class="ssr-content" style="background-color: #050505; color: #fff; min-height: 100vh;">
      <main style="max-width: 900px; margin: 0 auto; padding: 2rem;">
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem;">Fitness Araçları</h1>
        <p style="color: #a3a3a3; margin-bottom: 2rem;">
          Antrenman ve beslenme planlaması için ücretsiz hesaplayıcılar.
        </p>
        <div style="display: grid; gap: 1rem;">
          <a href="/araclar/bmi" style="display: block; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; text-decoration: none;">
            <h2 style="color: #ccff00; margin-bottom: 0.5rem;">BMI Hesaplayıcı</h2>
            <p style="color: #a3a3a3;">Vücut kitle indeksinizi hesaplayın</p>
          </a>
          <a href="/araclar/kalori" style="display: block; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; text-decoration: none;">
            <h2 style="color: #ccff00; margin-bottom: 0.5rem;">Kalori Hesaplayıcı</h2>
            <p style="color: #a3a3a3;">Günlük kalori ihtiyacınızı öğrenin</p>
          </a>
          <a href="/araclar/tdee" style="display: block; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; text-decoration: none;">
            <h2 style="color: #ccff00; margin-bottom: 0.5rem;">TDEE Hesaplayıcı</h2>
            <p style="color: #a3a3a3;">Toplam günlük enerji harcamanızı hesaplayın</p>
          </a>
          <a href="/araclar/makro" style="display: block; padding: 1.5rem; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 0.75rem; text-decoration: none;">
            <h2 style="color: #ccff00; margin-bottom: 0.5rem;">Makro Hesaplayıcı</h2>
            <p style="color: #a3a3a3;">Protein, karbonhidrat ve yağ oranlarınızı belirleyin</p>
          </a>
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
