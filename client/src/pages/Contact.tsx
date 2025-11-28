import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Mesajınız Gönderildi!",
      description: "En kısa sürede size dönüş yapacağım.",
    });
    reset();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505] relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase mb-6 text-white tracking-tighter">
            İletişime <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Geç</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Hedeflerin hakkında konuşalım. Başlamak için veya aklına takılanları sormak için formu doldurman yeterli.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-stretch">
          
          {/* Left Side: Contact Info & Visual */}
          <div className="flex flex-col gap-8">
             {/* Visual Card */}
            <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-auto md:flex-grow min-h-[300px] border border-white/10 group">
              <img 
                src="https://www.gokalaf.com/wp-content/uploads/2025/05/7643ad1f-5471-4991-a38d-8eb91249ecd9.png" 
                alt="Gokalaf Contact" 
                className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity duration-700 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold uppercase rounded-full mb-3">Gokalaf Coaching</div>
                <h3 className="text-3xl font-heading font-bold uppercase text-white mb-1">İstanbul, Türkiye</h3>
                <p className="text-gray-300">Online & Uzaktan Eğitim</p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="mailto:info@gokalaf.com" className="group">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Mail />
                  </div>
                  <h4 className="font-bold uppercase text-xs text-gray-500 mb-1">E-Posta</h4>
                  <p className="text-lg font-bold text-white">info@gokalaf.com</p>
                </div>
              </a>
              
              <a href="https://wa.me/905550000000" className="group">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle />
                  </div>
                  <h4 className="font-bold uppercase text-xs text-gray-500 mb-1">WhatsApp</h4>
                  <p className="text-lg font-bold text-white">+90 555 000 00 00</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Side: Glass Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h3 className="text-3xl font-heading font-bold uppercase mb-8 text-white relative z-10">Mesaj Gönder</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Adın</label>
                  <Input {...register("name", { required: true })} placeholder="İsim" className="bg-black/30 border-white/10 focus:border-primary h-14 text-white placeholder:text-gray-600 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Soyadın</label>
                  <Input {...register("surname", { required: true })} placeholder="Soyisim" className="bg-black/30 border-white/10 focus:border-primary h-14 text-white placeholder:text-gray-600 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">E-Posta Adresi</label>
                <Input {...register("email", { required: true })} type="email" placeholder="ornek@mail.com" className="bg-black/30 border-white/10 focus:border-primary h-14 text-white placeholder:text-gray-600 rounded-xl" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Konu / Hedefin</label>
                <Input {...register("subject")} placeholder="Örn: Kilo vermek istiyorum" className="bg-black/30 border-white/10 focus:border-primary h-14 text-white placeholder:text-gray-600 rounded-xl" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Mesajın</label>
                <Textarea {...register("message", { required: true })} placeholder="Bize hedeflerinden bahset..." className="min-h-[160px] bg-black/30 border-white/10 focus:border-primary text-white placeholder:text-gray-600 rounded-xl resize-none p-4" />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-16 text-lg rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all">
                Gönder <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
