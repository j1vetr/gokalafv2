import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
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
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-6">
            İletişime <span className="text-primary">Geç</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Hedeflerin hakkında konuşalım. Başlamak için veya aklına takılanları sormak için formu doldurman yeterli.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden aspect-video mb-8 border border-white/10">
              <img 
                src="https://www.gokalaf.com/wp-content/uploads/2025/05/7643ad1f-5471-4991-a38d-8eb91249ecd9.png" 
                alt="Gokalaf Contact" 
                className="w-full h-full object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-heading font-bold uppercase text-white">Gokalaf Coaching</h3>
                <p className="text-primary font-medium">İstanbul, Türkiye</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-card/50 border-white/5 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm text-muted-foreground">E-Posta</h4>
                    <p className="text-lg font-medium">info@gokalaf.com</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-white/5 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageCircle />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm text-muted-foreground">WhatsApp</h4>
                    <p className="text-lg font-medium">+90 555 000 00 00</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold uppercase h-14 text-lg shadow-lg shadow-green-900/20">
              <MessageCircle className="mr-2 h-6 w-6" /> WhatsApp ile Hızlı İletişim
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="bg-card border-white/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-heading font-bold uppercase mb-6">Mesaj Gönder</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Adın</label>
                    <Input {...register("name", { required: true })} placeholder="Adın" className="bg-background/50 border-white/10 focus:border-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Soyadın</label>
                    <Input {...register("surname", { required: true })} placeholder="Soyadın" className="bg-background/50 border-white/10 focus:border-primary h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">E-Posta Adresi</label>
                  <Input {...register("email", { required: true })} type="email" placeholder="ornek@mail.com" className="bg-background/50 border-white/10 focus:border-primary h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Konu / Hedefin</label>
                  <Input {...register("subject")} placeholder="Örn: Kilo vermek istiyorum" className="bg-background/50 border-white/10 focus:border-primary h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Mesajın</label>
                  <Textarea {...register("message", { required: true })} placeholder="Detaylı bilgi..." className="min-h-[150px] bg-background/50 border-white/10 focus:border-primary resize-none" />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase h-14">
                  Gönder <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
