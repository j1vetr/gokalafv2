-- Gokalaf Content Export
-- Bu dosya sadece yazılar ve paketleri içerir
-- Mevcut müşteri verilerini etkilemez (ON CONFLICT DO NOTHING)

-- ============================================
-- PAKETLER (mevcut olanları atla)
-- ============================================

INSERT INTO packages (id, name, weeks, price, features, is_active, created_at)
VALUES 
('fc1cf71c-6aeb-4021-9784-ee3100c89909', 'Normal Plan - 8 Hafta', 8, 5950.00, '{"Kişisel Antrenman Programı","Beslenme Planlaması","Kardiyo Planlaması","Vitamin & Supplement Önerisi","Form Analizi (Foto/Video)","Teknik Düzeltme Geri Bildirimleri","Haftalık Kontrol","Geri Dönüşe Göre Plan Güncelleme","Haftalık Teknik Video Analizi","Makro Güncellemesi (Gelişime Göre)","Yaşam Tarzına Uygun Planlama","Haftalık Q&A Destek","7/24 Whatsapp İletişim"}', t, '2025-11-28 22:29:20.774943'),
('f5b94c0e-2159-4a87-abd6-8a32b441f7a8', 'Normal Plan - 12 Hafta', 12, 7280.00, '{"Kişisel Antrenman Programı","Beslenme Planlaması","Kardiyo Planlaması","Vitamin & Supplement Önerisi","Form Analizi (Foto/Video)","Teknik Düzeltme Geri Bildirimleri","Haftalık Kontrol","Geri Dönüşe Göre Plan Güncelleme","Haftalık Teknik Video Analizi","Makro Güncellemesi (Gelişime Göre)","Yaşam Tarzına Uygun Planlama","Haftalık Q&A Destek","7/24 Whatsapp İletişim"}', t, '2025-11-28 22:29:20.774943'),
('2cfb9889-79e2-4066-8052-c239fcb923e4', 'Normal Plan - 16 Hafta', 16, 8660.00, '{"Kişisel Antrenman Programı","Beslenme Planlaması","Kardiyo Planlaması","Vitamin & Supplement Önerisi","Form Analizi (Foto/Video)","Teknik Düzeltme Geri Bildirimleri","Haftalık Kontrol","Geri Dönüşe Göre Plan Güncelleme","Haftalık Teknik Video Analizi","Makro Güncellemesi (Gelişime Göre)","Yaşam Tarzına Uygun Planlama","Haftalık Q&A Destek","7/24 Whatsapp İletişim"}', t, '2025-11-28 22:29:20.774943'),
('27373bba-a207-4ba6-b08b-2d1a87189e39', 'Normal Plan - 24 Hafta', 24, 12000.00, '{"Kişisel Antrenman Programı","Beslenme Planlaması","Kardiyo Planlaması","Vitamin & Supplement Önerisi","Form Analizi (Foto/Video)","Teknik Düzeltme Geri Bildirimleri","Haftalık Kontrol","Geri Dönüşe Göre Plan Güncelleme","Haftalık Teknik Video Analizi","Makro Güncellemesi (Gelişime Göre)","Yaşam Tarzına Uygun Planlama","Haftalık Q&A Destek","7/24 Whatsapp İletişim"}', t, '2025-11-28 22:29:20.774943'),
('99054085-2546-4965-9e9d-69fbe7c888b7', 'Test Paketi', 1, 1.00, '{"Kişisel Antrenman Programı","Beslenme Planlaması","Kardiyo Planlaması","Vitamin & Supplement Önerisi","Form Analizi (Foto/Video)","Teknik Düzeltme Geri Bildirimleri","Haftalık Kontrol","Geri Dönüşe Göre Plan Güncelleme","Haftalık Teknik Video Analizi","Makro Güncellemesi (Gelişime Göre)","Yaşam Tarzına Uygun Planlama","Haftalık Q&A Destek","7/24 Whatsapp İletişim"}', f, '2025-12-10 12:44:03.032051')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- YAZILAR (mevcut olanları atla)
-- ============================================

