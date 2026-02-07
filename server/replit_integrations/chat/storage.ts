import { db } from "../../db.js";
import { conversations, messages } from "@shared/schema";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  getAllConversationsWithStats(): Promise<any[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  },

  async getAllConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  },

  async getAllConversationsWithStats() {
    const allConvs = await db.select().from(conversations).orderBy(desc(conversations.createdAt));
    const result = [];
    for (const conv of allConvs) {
      const msgs = await db.select().from(messages).where(eq(messages.conversationId, conv.id)).orderBy(messages.createdAt);
      const userMessages = msgs.filter(m => m.role === "user");
      const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      result.push({
        ...conv,
        messageCount: msgs.length,
        userMessageCount: userMessages.length,
        lastMessageAt: lastMessage?.createdAt || conv.createdAt,
        firstUserMessage: userMessages.length > 0 ? userMessages[0].content : null,
        messages: msgs,
      });
    }
    return result;
  },

  async createConversation(title: string) {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  },

  async deleteConversation(id: number) {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  },

  async getMessagesByConversation(conversationId: number) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  },
};

