import { motion } from "framer-motion";
import { Shield, Lock, Eye, Users, Globe, Bell, FileText, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Gizlilik Sözleşmesi</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-tight">
                Gizlilik Sözleşmesi
              </h1>
              <p className="text-gray-400 mt-1">Kişisel verilerinizin korunması bizim önceliğimizdir</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Gizlilik Taahhüdü</h2>
                    <p className="text-gray-300 leading-relaxed">
                      SEFA GÖKTUĞ ALAF, kişisel bilgi ve veri güvenliğini önemsemekte ve bu hususta gerekli olan tüm tedbirleri almaya özen göstermektedir. Kullanıcılar da Uygulamayı kullanarak işbu gizlilik sözleşmesi hükümlerine uygun davranacaklarını kabul, beyan ve taahhüt ederler.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      İşbu Gizlilik Sözleşmesi, Sitenin tüm bölümlerinde geçerli olacaktır.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Bilgilerin Korunması</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Kullanıcıların bilgilerinin korunması ve gizliliğin sürdürülebilmesi SEFA GÖKTUĞ ALAF'ın birinci önceliğidir. Bu nedenle Kullanıcıların vermiş olduğu bilgiler sözleşmede belirtilen kurallar ve amaçlar dışında herhangi bir kapsamda kullanılmayacak, üçüncü şahıslarla paylaşılmayacaktır.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bell className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">İletişim Hakkı</h2>
                    <p className="text-gray-300 leading-relaxed">
                      SEFA GÖKTUĞ ALAF'ın, Kullanıcı tarafından siteye kayıt formunda belirtilen veya daha sonra kendisi tarafından güncellenen adresi, e-posta adresi, sabit ve mobil telefon hatları ve diğer iletişim bilgileri üzerinden mektup, e-posta, SMS, telefon görüşmesi ve diğer yollarla iletişim, pazarlama, bildirim ve diğer amaçlarla Kullanıcıya ulaşma hakkı bulunmaktadır.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      Kullanıcı, işbu sözleşmeyi kabul etmekle aksine bir yazılı bildirimi olmadığı müddetçe SEFA GÖKTUĞ ALAF'ın kendisine yönelik yukarıda belirtilen iletişim faaliyetlerinde bulunabileceğini kabul ve beyan etmektedir.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Bilgi Erişimi ve Paylaşımı</h2>
                    <p className="text-gray-300 leading-relaxed">
                      SEFA GÖKTUĞ ALAF, websitesi kapsamında Kullanıcı tarafından paylaşılmış olan bilgilere erişebilir. SEFA GÖKTUĞ ALAF, bu bilgileri websitesinin kullanımına yönelik olarak yalnızca iştirakçileri ile paylaşacağını taahhüt eder. Kullanıcı da bu bilgilerin websitesinin amacına yönelik olarak kendisi ile iletişime geçilmek için kullanılacağını kabul eder.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      SEFA GÖKTUĞ ALAF, kendisine iletilen kişisel verileri ve bilgileri, bilgilerin toplanması ile ilgili açıklanan yukarıdaki amaçlar dışında üçüncü kişilerle kesinlikle paylaşmayacak, satışını yapmayacak ve hiç bir şart altında kullanılmasına izin vermeyecektir.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">IP Adresi ve Teknik Veriler</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Websitesi ile ilgili sorunların tanımlanabilmesi ve websitesinde çıkabilecek muhtemel sorunların acil olarak giderilmesi için, SEFA GÖKTUĞ ALAF gerektiğinde Kullanıcıların IP adresini, sosyal ağ kullanıcı hesabında kayıtlı bilgileri kaydedebilir ve bu kayıtları anılan bu amaçlarla kullanabilir.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      Bu IP adresleri, SEFA GÖKTUĞ ALAF tarafından kullanıcılarını ve ziyaretçilerini genel anlamda tanımlamak ve kapsamlı şekilde demografik veri toplayabilmek amacıyla kullanılabilir.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">İstisna Durumları</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      SEFA GÖKTUĞ ALAF, aşağıda sayılan hallerde işbu gizlilik bildirimi hükümleri dışına çıkarak kullanıcılara ait bilgileri üçüncü kişilere açıklayabilecektir:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Hukuk kurallarının getirdiği zorunluluklara uyulmasının gerektiği haller</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-gray-300">SEFA GÖKTUĞ ALAF'ın, Kullanıcılarıyla arasındaki sözleşmelerin gereklerinin yerine getirilmesi ve bunların uygulamaya konulmalarıyla ilgili haller</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Yetkili idari ve/veya adli makamlar tarafından usuli yöntemine uygun olarak yürütülen bir araştırma veya soruşturma doğrultusunda Kullanıcılarla ilgili bilgi talep edilmesi halleri</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Kullanıcıların haklarını veya güvenliklerini koruma amacıyla bilgi verilmesinin gerekli olduğu haller</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Gizlilik Taahhüdü</h2>
                    <p className="text-gray-300 leading-relaxed">
                      SEFA GÖKTUĞ ALAF, kendisine verilen gizli bilgileri kesinlikle özel ve gizli tutmayı, bunu bir sır olarak saklamayı yükümlülük olarak kabul ettiğini ve gizliliğin sağlanıp sürdürülmesi, gizli bilginin tamamının veya herhangi bir parçasının kamu alanına girmesini veya yetkisiz kullanımını veya üçüncü bir kişiye açıklanmasını önleme gereği olan gerekli tüm tedbirleri almayı ve üzerine düşen tüm özeni tam olarak göstermeyi taahhüt etmektedir.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">KVKK Uyumu</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Metnin onayıyla birlikte SEFA GÖKTUĞ ALAF da KVKK'ye uyacağını ve verileri Kanun'un öngördüğü şekilde işleyeceğini ve hukuki sorumluluk altına gireceğini de kabul eder.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      SEFA GÖKTUĞ ALAF, işbu gizlilik bildiriminde geçen hükümleri gerekli gördüğü zamanda Uygulamada yayınlamak şartıyla değiştirebilir. SEFA GÖKTUĞ ALAF'ın değişiklik yaptığı gizlilik bildirimi hükümleri Uygulamada yayınlandığı tarihte yürürlüğe girmiş kabul edilir.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/kvkk" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/iptal-iade" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              İptal ve İade Politikası
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
