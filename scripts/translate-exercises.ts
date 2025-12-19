import OpenAI from "openai";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema";
import { isNull, eq } from "drizzle-orm";
import pLimit from "p-limit";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, schema });

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const limit = pLimit(5);

async function translateInstructions(instructions: string[]): Promise<string[]> {
  const prompt = `Translate the following exercise instructions from English to Turkish. Keep them clear, concise and professional. Only return the translated instructions as a JSON array of strings, nothing else.

Instructions to translate:
${JSON.stringify(instructions, null, 2)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || "[]";
  try {
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse response:", content);
    return instructions;
  }
}

async function main() {
  console.log("Starting exercise translation with parallel processing...");

  const exercises = await db
    .select()
    .from(schema.exercises)
    .where(isNull(schema.exercises.instructionsTr));

  console.log(`Found ${exercises.length} exercises to translate`);

  let translated = 0;
  let failed = 0;

  const promises = exercises.map((exercise) =>
    limit(async () => {
      try {
        const turkishInstructions = await translateInstructions(exercise.instructionsEn);
        
        await db
          .update(schema.exercises)
          .set({ instructionsTr: turkishInstructions })
          .where(eq(schema.exercises.id, exercise.id));
        
        translated++;
        
        if (translated % 20 === 0) {
          console.log(`Progress: ${translated}/${exercises.length} (${Math.round(translated/exercises.length*100)}%)`);
        }
        
        return { success: true, name: exercise.name };
      } catch (error: any) {
        console.error(`Failed: ${exercise.name} - ${error?.message || error}`);
        failed++;
        return { success: false, name: exercise.name };
      }
    })
  );

  await Promise.all(promises);

  console.log(`\nTranslation complete!`);
  console.log(`Translated: ${translated}`);
  console.log(`Failed: ${failed}`);
  
  await pool.end();
}

main().catch(console.error);
