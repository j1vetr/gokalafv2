export interface EmailTemplate {
  subject: string;
  html: string;
}

const baseStyles = `
  body { 
    font-family: 'Helvetica Neue', Arial, sans-serif; 
    background-color: #050505; 
    color: #ffffff; 
    margin: 0; 
    padding: 0; 
    line-height: 1.6;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background-color: #0a0a0a; 
    border-radius: 16px;
    overflow: hidden;
  }
  .header { 
    background: linear-gradient(135deg, #ccff00 0%, #a3cc00 100%); 
    padding: 40px 30px; 
    text-align: center; 
  }
  .header h1 { 
    color: #000000; 
    font-size: 32px; 
    font-weight: 800; 
    margin: 0; 
    text-transform: uppercase; 
    letter-spacing: 2px;
  }
  .header .subtitle { 
    color: #333333; 
    font-size: 14px; 
    margin-top: 8px; 
    text-transform: uppercase; 
    letter-spacing: 1px;
  }
  .content { 
    padding: 40px 30px; 
    background-color: #0a0a0a; 
  }
  .greeting { 
    font-size: 24px; 
    font-weight: 700; 
    color: #ffffff; 
    margin-bottom: 20px; 
  }
  .text { 
    color: #b0b0b0; 
    font-size: 16px; 
    margin-bottom: 20px; 
  }
  .highlight-box { 
    background: linear-gradient(135deg, rgba(204, 255, 0, 0.1) 0%, rgba(204, 255, 0, 0.05) 100%); 
    border: 1px solid rgba(204, 255, 0, 0.3); 
    border-radius: 12px; 
    padding: 24px; 
    margin: 24px 0; 
  }
  .highlight-title { 
    color: #ccff00; 
    font-size: 18px; 
    font-weight: 700; 
    margin-bottom: 12px; 
    text-transform: uppercase;
  }
  .stat-row { 
    display: flex; 
    justify-content: space-between; 
    padding: 12px 0; 
    border-bottom: 1px solid rgba(255,255,255,0.1); 
  }
  .stat-label { 
    color: #888888; 
  }
  .stat-value { 
    color: #ffffff; 
    font-weight: 600; 
  }
  .cta-button { 
    display: inline-block; 
    background: linear-gradient(135deg, #ccff00 0%, #a3cc00 100%); 
    color: #000000 !important; 
    text-decoration: none; 
    padding: 16px 40px; 
    border-radius: 8px; 
    font-weight: 700; 
    font-size: 16px; 
    text-transform: uppercase; 
    letter-spacing: 1px;
    margin: 20px 0;
  }
  .cta-button:hover { 
    background: #a3cc00; 
  }
  .footer { 
    background-color: #050505; 
    padding: 30px; 
    text-align: center; 
    border-top: 1px solid rgba(255,255,255,0.1); 
  }
  .footer-text { 
    color: #666666; 
    font-size: 12px; 
    margin: 0; 
  }
  .footer-brand { 
    color: #ccff00; 
    font-weight: 700; 
    font-size: 14px; 
    margin-bottom: 10px; 
    text-transform: uppercase; 
    letter-spacing: 2px;
  }
  .divider { 
    height: 1px; 
    background: linear-gradient(90deg, transparent, rgba(204,255,0,0.3), transparent); 
    margin: 30px 0; 
  }
  .tip-box { 
    background-color: rgba(255,255,255,0.05); 
    border-radius: 8px; 
    padding: 16px; 
    margin: 16px 0; 
  }
  .tip-title { 
    color: #ccff00; 
    font-size: 14px; 
    font-weight: 600; 
    margin-bottom: 8px; 
  }
  .tip-text { 
    color: #888888; 
    font-size: 14px; 
  }
  .icon { 
    width: 48px; 
    height: 48px; 
    margin-bottom: 16px; 
  }
`;

const wrapTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gokalaf Coaching</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div style="background-color: #050505; padding: 20px;">
    <div class="container">
      ${content}
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  welcome: (data: { fullName: string; email: string }): EmailTemplate => ({
    subject: "Gokalaf Ailesine Hoş Geldin! 💪",
    html: wrapTemplate(`
      <div class="header">
        <h1>GOKALAF</h1>
        <div class="subtitle">Coaching</div>
      </div>
      <div class="content">
        <div class="greeting">Merhaba ${data.fullName}! 👋</div>
        <p class="text">
          Gokalaf Coaching ailesine katıldığın için çok mutluyuz! 
          Fitness yolculuğunda yanında olacağız ve hedeflerine ulaşman için 
          seni destekleyeceğiz.
        </p>
        
        <div class="highlight-box">
          <div class="highlight-title">🎯 İlk Adımlar</div>
          <p style="color: #b0b0b0; margin: 0;">
            1. Profilini tamamla<br>
            2. Hedeflerini belirle<br>
            3. Koçluk paketini seç<br>
            4. Dönüşümüne başla!
          </p>
        </div>

        <p class="text">
          Sorularının olursa her zaman bize ulaşabilirsin. 
          Birlikte harika sonuçlar elde edeceğiz!
        </p>

        <div style="text-align: center;">
          <a href="https://gokalaf.com/packages" class="cta-button">
            Paketleri İncele
          </a>
        </div>

        <div class="divider"></div>

        <div class="tip-box">
          <div class="tip-title">💡 Bilgi</div>
          <div class="tip-text">
            Hesabın ${data.email} e-posta adresi ile oluşturuldu. 
            Dashboard'dan tüm ilerleme ve ölçümlerini takip edebilirsin.
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">
          Performans • Güç • Disiplin
        </p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
      </div>
    `)
  }),

  orderConfirmation: (data: { 
    fullName: string; 
    packageName: string; 
    weeks: number; 
    totalPrice: string;
    startDate: string;
    endDate: string;
  }): EmailTemplate => ({
    subject: `Siparişin Onaylandı - ${data.packageName} 🎉`,
    html: wrapTemplate(`
      <div class="header">
        <h1>GOKALAF</h1>
        <div class="subtitle">Sipariş Onayı</div>
      </div>
      <div class="content">
        <div class="greeting">Tebrikler ${data.fullName}! 🎉</div>
        <p class="text">
          Koçluk paketin başarıyla aktif edildi. 
          Artık dönüşüm yolculuğun resmi olarak başladı!
        </p>
        
        <div class="highlight-box">
          <div class="highlight-title">📦 Paket Detayları</div>
          <div style="margin-top: 16px;">
            <div class="stat-row">
              <span class="stat-label">Paket</span>
              <span class="stat-value">${data.packageName}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Süre</span>
              <span class="stat-value">${data.weeks} Hafta</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Başlangıç</span>
              <span class="stat-value">${data.startDate}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Bitiş</span>
              <span class="stat-value">${data.endDate}</span>
            </div>
            <div class="stat-row" style="border-bottom: none;">
              <span class="stat-label">Tutar</span>
              <span class="stat-value" style="color: #ccff00;">${data.totalPrice} ₺</span>
            </div>
          </div>
        </div>

        <p class="text">
          Dashboard üzerinden günlük ilerleme ve ölçümlerini kaydetmeyi unutma. 
          Düzenli takip, başarının anahtarıdır!
        </p>

        <div style="text-align: center;">
          <a href="https://gokalaf.com/dashboard" class="cta-button">
            Dashboard'a Git
          </a>
        </div>

        <div class="divider"></div>

        <div class="tip-box">
          <div class="tip-title">🏋️ Başlarken</div>
          <div class="tip-text">
            İlk ölçümlerini gir, hedeflerini belirle ve koçunla iletişime geç. 
            Birlikte harika sonuçlar elde edeceğiz!
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">
          Performans • Güç • Disiplin
        </p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
      </div>
    `)
  }),

  packageExpiry: (data: { 
    fullName: string; 
    packageName: string; 
    daysRemaining: number;
    endDate: string;
  }): EmailTemplate => ({
    subject: `Paketin ${data.daysRemaining} Gün İçinde Bitiyor ⏰`,
    html: wrapTemplate(`
      <div class="header" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);">
        <h1>GOKALAF</h1>
        <div class="subtitle" style="color: #fff;">Hatırlatma</div>
      </div>
      <div class="content">
        <div class="greeting">Merhaba ${data.fullName}! ⏰</div>
        <p class="text">
          ${data.packageName} paketin <strong style="color: #ff6b35;">${data.daysRemaining} gün</strong> içinde sona erecek. 
          Yolculuğuna devam etmek için şimdiden yeni paketini seçebilirsin!
        </p>
        
        <div class="highlight-box" style="border-color: rgba(255, 107, 53, 0.3); background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);">
          <div class="highlight-title" style="color: #ff6b35;">📅 Paket Bilgisi</div>
          <div style="margin-top: 16px;">
            <div class="stat-row">
              <span class="stat-label">Paket</span>
              <span class="stat-value">${data.packageName}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Bitiş Tarihi</span>
              <span class="stat-value" style="color: #ff6b35;">${data.endDate}</span>
            </div>
            <div class="stat-row" style="border-bottom: none;">
              <span class="stat-label">Kalan Gün</span>
              <span class="stat-value" style="color: #ff6b35;">${data.daysRemaining} gün</span>
            </div>
          </div>
        </div>

        <p class="text">
          Şimdiye kadar harika ilerleme kaydettin! Bu ivmeyi kaybetmemek için 
          yeni dönemini planla.
        </p>

        <div style="text-align: center;">
          <a href="https://gokalaf.com/packages" class="cta-button" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);">
            Paketi Yenile
          </a>
        </div>

        <div class="divider"></div>

        <div class="tip-box">
          <div class="tip-title" style="color: #ff6b35;">💪 Devam Et!</div>
          <div class="tip-text">
            İlerlemeni durdurmak istemiyorsan, paketin bitmeden önce 
            yenileme yapman önerilir. Böylece programın kesintisiz devam eder.
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">
          Performans • Güç • Disiplin
        </p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
      </div>
    `)
  }),

  dailyReminder: (data: { 
    fullName: string; 
    streak?: number;
    lastWeight?: string;
  }): EmailTemplate => ({
    subject: "Günlük İlerleme Zamanı! 📊",
    html: wrapTemplate(`
      <div class="header">
        <h1>GOKALAF</h1>
        <div class="subtitle">Günlük Hatırlatma</div>
      </div>
      <div class="content">
        <div class="greeting">Merhaba ${data.fullName}! 🌟</div>
        <p class="text">
          Bugünkü ilerleme ve ölçümlerini kaydetme zamanı geldi! 
          Düzenli takip, başarının en önemli anahtarıdır.
        </p>
        
        <div class="highlight-box">
          <div class="highlight-title">📝 Bugün Kaydet</div>
          <p style="color: #b0b0b0; margin: 12px 0 0 0;">
            ✓ Su tüketimini ekle<br>
            ✓ Antrenmanını işaretle<br>
            ✓ Uyku sürenizi gir<br>
            ${data.lastWeight ? `✓ Son kilonuz: ${data.lastWeight} kg` : '✓ Haftalık kilo ölçümü yap'}
          </p>
        </div>

        ${data.streak && data.streak > 0 ? `
        <div class="tip-box" style="background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%); border: 1px solid rgba(255, 107, 53, 0.2);">
          <div class="tip-title" style="color: #ff6b35;">🔥 ${data.streak} Gün Seri!</div>
          <div class="tip-text">
            Harika gidiyorsun! Bu seriyi bozmamak için bugün de kayıt yapmayı unutma.
          </div>
        </div>
        ` : ''}

        <div style="text-align: center;">
          <a href="https://gokalaf.com/dashboard" class="cta-button">
            Kayıt Yap
          </a>
        </div>

        <div class="divider"></div>

        <div class="tip-box">
          <div class="tip-title">💡 Günün İpucu</div>
          <div class="tip-text">
            Antrenman öncesi ve sonrası protein alımı, kas gelişimi için kritik öneme sahiptir. 
            Her öğünde yeterli protein aldığından emin ol!
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">
          Performans • Güç • Disiplin
        </p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
      </div>
    `)
  }),

  adminNewUser: (data: { 
    fullName: string; 
    email: string;
    phone?: string;
    registeredAt: string;
  }): EmailTemplate => ({
    subject: `Yeni Kullanıcı Kaydı - ${data.fullName}`,
    html: wrapTemplate(`
      <div class="header" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);">
        <h1>GOKALAF</h1>
        <div class="subtitle" style="color: #fff;">Admin Bildirimi</div>
      </div>
      <div class="content">
        <div class="greeting">Yeni Kullanıcı Kaydı! 👤</div>
        <p class="text">
          Sisteme yeni bir kullanıcı kayıt oldu.
        </p>
        
        <div class="highlight-box" style="border-color: rgba(76, 175, 80, 0.3); background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);">
          <div class="highlight-title" style="color: #4CAF50;">👤 Kullanıcı Bilgileri</div>
          <div style="margin-top: 16px;">
            <div class="stat-row">
              <span class="stat-label">Ad Soyad</span>
              <span class="stat-value">${data.fullName}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">E-posta</span>
              <span class="stat-value">${data.email}</span>
            </div>
            ${data.phone ? `
            <div class="stat-row">
              <span class="stat-label">Telefon</span>
              <span class="stat-value">${data.phone}</span>
            </div>
            ` : ''}
            <div class="stat-row" style="border-bottom: none;">
              <span class="stat-label">Kayıt Tarihi</span>
              <span class="stat-value" style="color: #4CAF50;">${data.registeredAt}</span>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="https://gokalaf.com/gokadmin" class="cta-button" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);">
            Admin Paneli
          </a>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">Admin Bildirim Sistemi</p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
      </div>
    `)
  }),

  adminNewOrder: (data: { 
    customerName: string; 
    customerEmail: string;
    customerPhone?: string;
    packageName: string;
    weeks: number;
    totalPrice: string;
    orderId: string;
    orderDate: string;
  }): EmailTemplate => ({
    subject: `Yeni Sipariş - ${data.packageName} (${data.totalPrice} ₺)`,
    html: wrapTemplate(`
      <div class="header" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);">
        <h1>GOKALAF</h1>
        <div class="subtitle" style="color: #fff;">Yeni Sipariş</div>
      </div>
      <div class="content">
        <div class="greeting">Yeni Sipariş Geldi! 💰</div>
        <p class="text">
          Bir müşteri yeni bir koçluk paketi satın aldı.
        </p>
        
        <div class="highlight-box" style="border-color: rgba(33, 150, 243, 0.3); background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);">
          <div class="highlight-title" style="color: #2196F3;">📦 Sipariş Detayları</div>
          <div style="margin-top: 16px;">
            <div class="stat-row">
              <span class="stat-label">Paket</span>
              <span class="stat-value">${data.packageName}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Süre</span>
              <span class="stat-value">${data.weeks} Hafta</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Tutar</span>
              <span class="stat-value" style="color: #4CAF50; font-size: 18px;">${data.totalPrice} ₺</span>
            </div>
            <div class="stat-row" style="border-bottom: none;">
              <span class="stat-label">Sipariş Tarihi</span>
              <span class="stat-value">${data.orderDate}</span>
            </div>
          </div>
        </div>

        <div class="highlight-box">
          <div class="highlight-title">👤 Müşteri Bilgileri</div>
          <div style="margin-top: 16px;">
            <div class="stat-row">
              <span class="stat-label">Ad Soyad</span>
              <span class="stat-value">${data.customerName}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">E-posta</span>
              <span class="stat-value">${data.customerEmail}</span>
            </div>
            ${data.customerPhone ? `
            <div class="stat-row" style="border-bottom: none;">
              <span class="stat-label">Telefon</span>
              <span class="stat-value">${data.customerPhone}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div style="text-align: center;">
          <a href="https://gokalaf.com/gokadmin" class="cta-button" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);">
            Siparişi Görüntüle
          </a>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">Admin Bildirim Sistemi</p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
      </div>
    `)
  }),

  purchaseReminder: (data: { fullName: string; daysSinceRegistration: number }): EmailTemplate => ({
    subject: "Dönüşümün Seni Bekliyor! 💪 - Gokalaf",
    html: wrapTemplate(`
      <div class="header">
        <h1>GOKALAF</h1>
        <div class="subtitle">Performans • Güç • Disiplin</div>
      </div>
      <div class="content">
        <div class="greeting">Merhaba ${data.fullName}! 👋</div>
        <p class="text">
          Kayıt olduğun için teşekkürler! Henüz bir koçluk paketi almadığını fark ettik. 
          Hedeflerine ulaşmak için en doğru zamanda harekete geçmenin tam zamanı.
        </p>
        
        <div class="highlight-box">
          <div class="highlight-title">🎯 Sana Özel Avantajlar</div>
          <div style="margin-top: 16px; color: #b0b0b0;">
            <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
              ✓ Kişiye özel antrenman programı
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
              ✓ Detaylı beslenme planlaması
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
              ✓ Haftalık form takibi ve video analizi
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
              ✓ 7/24 WhatsApp iletişim
            </div>
            <div style="padding: 8px 0;">
              ✓ Sürekli güncellenen program
            </div>
          </div>
        </div>

        <div class="tip-box" style="background-color: rgba(204, 255, 0, 0.1); border: 1px solid rgba(204, 255, 0, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="color: #ccff00; font-weight: 700; margin: 0 0 8px 0;">💡 Bilgi</p>
          <p style="color: #b0b0b0; margin: 0;">
            Yüzlerce danışan ile çalıştım ve en iyi sonuçlar erken başlayanlardan geldi. 
            Bugün başla, 8 hafta sonra farkı gör!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://gokalaf.com/paketler" class="cta-button">
            Paketleri İncele
          </a>
        </div>

        <div class="divider"></div>

        <p class="text" style="font-size: 14px; text-align: center;">
          Sorularını yanıtlamak için buradayım. WhatsApp üzerinden bana ulaşabilirsin!
        </p>
      </div>
      <div class="footer">
        <div class="footer-brand">GOKALAF COACHING</div>
        <p class="footer-text">Hedef Değil, Sistem.</p>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır.
        </p>
        <p class="footer-text" style="margin-top: 10px; font-size: 11px; color: #555;">
          Bu e-postayı almak istemiyorsan lütfen bize bildirin.
        </p>
      </div>
    `)
  })
};
