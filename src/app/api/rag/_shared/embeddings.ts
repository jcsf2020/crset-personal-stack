import OpenAI from "openai";

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

export function embeddingsClient() {
  // IMPORTANTE: Usar AGI_OPENAI_KEY primeiro para evitar erro 401 com gsk_ keys
  // NUNCA usar EMBEDDING_OPENAI_API_KEY pois é uma Global Key (gsk_) que causa 401
  const apiKey = 
    process.env.AGI_OPENAI_KEY || 
    process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing OpenAI API key for embeddings (AGI_OPENAI_KEY or OPENAI_API_KEY required)");
  }

  // Usar a mesma base URL do AGI
  const baseURL = 
    process.env.AGI_OPENAI_BASE_URL || 
    process.env.OPENAI_BASE_URL || 
    "https://api.openai.com/v1";

  return new OpenAI({ apiKey, baseURL });
}

export async function embed(text: string): Promise<number[]> {
  const client = embeddingsClient();
  const response = await client.embeddings.create({ 
    model: EMBEDDING_MODEL, 
    input: text 
  });
  return response.data[0].embedding as number[];
}
