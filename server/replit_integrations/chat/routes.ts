import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Sen Gokalaf'ın yapay zeka fitness asistanısın. Adın "Gokalaf Asistan". Türkçe konuşuyorsun.

Görevlerin:
1. Fitness, beslenme, antrenman, supplement, kilo verme, kas yapma gibi konularda kullanıcılara bilgi vermek
2. Kullanıcıları Gokalaf'ın online koçluk hizmetine yönlendirmek
3. Motivasyon sağlamak

Kurallar:
- Her zaman Türkçe cevap ver
- Kısa ve net cevaplar ver, gereksiz uzatma
- Tıbbi tavsiye verme, doktora yönlendir
- Kullanıcı detaylı program veya kişisel plan istediğinde Gokalaf'ın koçluk paketlerine yönlendir: "Kişisel programınız için gokalaf.com/paketler sayfasından koçluk paketlerimize göz atabilirsiniz."
- Genel bilgi sorularını cevapla (kalori hesaplama, egzersiz formları, besin değerleri vs.)
- Samimi ama profesyonel ol, "sen" diye hitap et
- Emoji kullanabilirsin ama abartma
- Cevaplarını markdown formatında yaz

Gokalaf Hakkında:
- Online fitness ve vücut geliştirme koçluk platformu
- 8, 12, 16 ve 24 haftalık koçluk paketleri var
- Kişisel antrenman programı, beslenme planı, haftalık takip, 7/24 WhatsApp iletişim
- Koç: Sefa Göktuğ Alaf
- Site: gokalaf.com`;

export function registerChatRoutes(app: Express): void {
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
