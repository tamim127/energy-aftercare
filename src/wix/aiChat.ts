import { SYSTEM_PROMPT, queryKnowledgeBase } from '../content/knowledgeBase';

export interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
  action?: { label: string; to: string };
}

/**
 * Returns the configured Wix / OpenAI API key from environment variables or local storage.
 */
export function getAIApiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_WIX_AI_API_KEY) return import.meta.env.VITE_WIX_AI_API_KEY;
    if (import.meta.env.VITE_OPENAI_API_KEY) return import.meta.env.VITE_OPENAI_API_KEY;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('wix_ai_api_key') || '';
  }
  return '';
}

/**
 * Sends a message to the AI Chat service.
 * If an API key is provided, connects to the AI provider using the strict knowledge base prompt.
 * If no key is set yet, uses the deterministic knowledge base engine.
 */
export async function sendAIChatMessage(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<{ text: string; action?: { label: string; to: string } }> {
  const apiKey = getAIApiKey();
  const latestUserMessage = messages[messages.length - 1]?.content || '';

  // 1. If no API key is configured, use the Knowledge Base Engine directly
  if (!apiKey) {
    // Artificial small delay to feel like a real conversational assistant
    await new Promise((res) => setTimeout(res, 450));
    const kbResult = queryKnowledgeBase(latestUserMessage);
    return {
      text: kbResult.answer,
      action: kbResult.action,
    };
  }

  // 2. If API Key is present, invoke OpenAI / Wix AI API with strict guardrails
  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.3, // low temperature to ensure strict adherence to facts
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.warn('Wix AI API call failed, falling back to local Knowledge Base', response.statusText);
      const fallback = queryKnowledgeBase(latestUserMessage);
      return { text: fallback.answer, action: fallback.action };
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || '';

    // Match action if available
    const kb = queryKnowledgeBase(latestUserMessage);

    return {
      text: replyText || kb.answer,
      action: kb.action,
    };
  } catch (err) {
    console.error('Error invoking AI Chat API:', err);
    // Graceful fallback to Knowledge Base
    const fallback = queryKnowledgeBase(latestUserMessage);
    return { text: fallback.answer, action: fallback.action };
  }
}
