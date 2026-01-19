import { OPENROUTER_API_URL, MODEL_ID, INTAKE_SYSTEM_PROMPT } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database";

export const runtime = "edge";

// Create admin client for saving intakes
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

async function saveIntake(
  intakeData: {
    business_name?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    prd?: unknown;
  },
  conversationHistory: unknown[]
) {
  const supabase = createAdminClient();
  if (!supabase) return;

  const intake: TablesInsert<"intakes"> = {
    business_name: intakeData.business_name || null,
    contact_name: intakeData.contact_name || null,
    contact_email: intakeData.contact_email || null,
    contact_phone: intakeData.contact_phone || null,
    prd_content: intakeData.prd as TablesInsert<"intakes">["prd_content"],
    conversation_history:
      conversationHistory as TablesInsert<"intakes">["conversation_history"],
    status: "new",
  };

  await supabase.from("intakes").insert(intake);
}

export async function POST(request: Request) {
  try {
    const { messages, locale } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenRouter API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Adjust system prompt for language
    const systemPrompt =
      locale === "en"
        ? INTAKE_SYSTEM_PROMPT.replace(
            "Je bent de virtuele assistent van Bureau Zwartjes",
            "You are the virtual assistant of Bureau Zwartjes"
          ).replace(
            "Begin het gesprek door jezelf voor te stellen en te vragen naar de naam van het bedrijf.",
            "Begin the conversation by introducing yourself and asking for the business name."
          )
        : INTAKE_SYSTEM_PROMPT;

    // Prepare messages for OpenRouter (OpenAI-compatible format)
    const openRouterMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Call OpenRouter API with streaming
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100",
        "X-Title": "Bureau Zwartjes Intake",
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: openRouterMessages,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", response.status, error);
      return new Response(
        JSON.stringify({ error: `OpenRouter error: ${error}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a ReadableStream to process and forward the SSE response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // Skip invalid JSON lines
                }
              }
            }
          }

          // Check if intake is complete and save to database
          if (fullResponse.includes("[INTAKE_COMPLETE]")) {
            try {
              const jsonMatch = fullResponse.match(
                /\[INTAKE_COMPLETE\]([\s\S]*?)\[\/INTAKE_COMPLETE\]/
              );

              if (jsonMatch) {
                const intakeData = JSON.parse(jsonMatch[1].trim());
                await saveIntake(intakeData, messages);
              }
            } catch (parseError) {
              console.error("Failed to parse/save intake:", parseError);
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
