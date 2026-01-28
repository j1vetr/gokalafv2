import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">İptal ve İade Politikası</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase tracking-tight">
                İptal ve İade Politikası
              </h1>
              <p className="text-gray-400 mt-1">Cayma Hakkı İstisnası</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              <section>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-6">Önemli Bilgilendirme ve Cayma Hakkı İstisnası</h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-300 leading-relaxed">
                        Alıcı tarafından satın alınan online koçluk hizmeti; alıcının kişisel bilgileri, hedefleri ve ihtiyaçları doğrultusunda kişiye özel olarak hazırlanan beslenme ve antrenman programlarını kapsamaktadır.
                      </p>
                      
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                        <p className="text-orange-300 m-0">
                          6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca, <strong>kişiye özel hazırlanan hizmetlerde cayma hakkı bulunmamaktadır.</strong>
                        </p>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed">
                        Alıcı, hizmetin satın alma işleminin tamamlanmasıyla birlikte program hazırlama sürecinin başlayacağını, bu kapsamda cayma hakkından feragat ettiğini ve programın kendisine dijital ortamda sunulmasının ardından ücret iadesi talep edemeyeceğini kabul, beyan ve taahhüt eder.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/gizlilik" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              Gizlilik Sözleşmesi
            </Link>
            <Link href="/kvkk" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/mesafeli-satis" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
