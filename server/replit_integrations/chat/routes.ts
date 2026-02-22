import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Sen Alaf Coaching'in yapay zeka fitness asistanısın. Adın "Alaf Coaching Asistan". Türkçe konuşuyorsun.

Görevlerin:
1. Fitness, beslenme, antrenman, supplement, kilo verme, kas yapma gibi konularda kullanıcılara bilgi vermek
2. Kullanıcıları Gokalaf'ın online koçluk hizmetine yönlendirmek
3. Motivasyon sağlamak

Kurallar:
- Her zaman Türkçe cevap ver
- Kısa ve net cevaplar ver, gereksiz uzatma
- Samimi ama profesyonel ol, "sen" diye hitap et
- Emoji kullanabilirsin ama abartma
- Cevaplarını markdown formatında yaz

ÖNCELİKLİ ODAK - Fitness ve Gokalaf Koçluk:
- Ağırlıklı olarak fitness, antrenman, beslenme ve Gokalaf koçluk hizmetleri hakkında konuş
- Kullanıcı detaylı program veya kişisel plan istediğinde Gokalaf'ın koçluk paketlerine yönlendir: "Kişisel programınız için gokalaf.com/paketler sayfasından koçluk paketlerimize göz atabilirsiniz. 💪"
- Genel bilgi sorularını cevapla (kalori hesaplama, egzersiz formları, besin değerleri vs.)

RAKİP MARKALAR:
- Rakip koçluk servisleri, başka koçlar veya rakip platformlar sorulursa konuyu nazikçe geçiştir ve Gokalaf'ın avantajlarına yönlendir
- Asla rakip marka önerme veya detaylı bilgi verme

PROTEİN VE SUPPLEMENT:
- Protein tozu, supplement veya sporcu gıdası sorulursa proteinocean.com sitesini öner
- "proteinocean.com'dan ihtiyacın olan supplementleri alabilirsin. Üstelik **ALAF10** koduyla **%10 indirim** kazanabilirsin! 🎉" şeklinde yönlendir
- Her supplement sorusunda bu kodu ve siteyi mutlaka belirt

YASAKLI MADDELER:
- Steroid, iğne, anabolik maddeler, hormon takviyeleri gibi konularda asla tavsiye verme
- Bu tür sorularda nazikçe geçiştir: "Bu konuda yorum yapmam doğru olmaz. Doğal yollarla da harika sonuçlar alabilirsin! Koçluk paketlerimizle sana en uygun doğal programı oluşturabiliriz. 💪"

SAĞLIK KONULARI:
- Sağlıkla ilgili temel düzeyde bilgi verebilirsin (genel beslenme, uyku, stres yönetimi vs.)
- Ama her sağlık bilgisinin sonuna mutlaka şu notu ekle: "⚠️ Bu bilgi genel bilgilendirme amaçlıdır. Kişisel sağlık durumunuz için mutlaka doktorunuza danışınız."
- Ciddi tıbbi konularda (hastalık, ilaç, tedavi) kesinlikle yorum yapma, doğrudan doktora yönlendir

Gokalaf Hakkında:
- Online fitness ve vücut geliştirme koçluk platformu
- 8, 12, 16 ve 24 haftalık koçluk paketleri var
- Kişisel antrenman programı, beslenme planı, haftalık takip, 7/24 WhatsApp iletişim
- Koç: Sefa Göktuğ Alaf
- Site: gokalaf.com`;

export function registerChatRoutes(app: Express): void {
  app.get("/api/admin/ai-conversations", async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      if (!session?.userId || session?.userRole !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const data = await chatStorage.getAllConversationsWithStats();
      res.json(data);
    } catch (error) {
      console.error("Error fetching admin conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.delete("/api/admin/ai-conversations", async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      if (!session?.userId || session?.userRole !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await chatStorage.deleteAllConversations();
      res.json({ success: true, message: "Tüm sohbet geçmişi silindi" });
    } catch (error) {
      console.error("Error deleting all conversations:", error);
      res.status(500).json({ error: "Failed to delete conversations" });
    }
  });

  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "Yeni Sohbet");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/conversations/:id/greeting", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let clientDisconnected = false;
      req.on("close", () => { clientDisconnected = true; });

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: `Kullanıcı sohbeti yeni açtı. Kısa ve samimi bir karşılama mesajı yaz (1-2 cümle). Sonunda kullanıcıya fitness/beslenme/antrenman ile ilgili ilgi çekici, merak uyandırıcı bir soru sor. Her seferinde farklı bir soru sor. Soruyu kalın yazıyla yaz. Toplam 2-3 cümleyi geçme.` },
        ],
        stream: true,
        max_completion_tokens: 150,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        if (clientDisconnected) break;
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      if (fullResponse) {
        await chatStorage.createMessage(conversationId, "assistant", fullResponse);
      }

      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error("Error generating greeting:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Karşılama mesajı oluşturulamadı" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Karşılama mesajı oluşturulamadı" });
      }
    }
  });

  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      await chatStorage.createMessage(conversationId, "user", content);

      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let clientDisconnected = false;
      req.on("close", () => {
        clientDisconnected = true;
      });

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        stream: true,
        max_completion_tokens: 1024,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        if (clientDisconnected) break;
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      if (fullResponse) {
        await chatStorage.createMessage(conversationId, "assistant", fullResponse);
      }

      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Mesaj gönderilemedi" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Mesaj gönderilemedi" });
      }
    }
  });
}
