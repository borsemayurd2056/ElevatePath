import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { careers, stage, type, history } = await req.json();
    const AI_GATEWAY_KEY = Deno.env.get("AI_GATEWAY_KEY");
    if (!AI_GATEWAY_KEY) throw new Error("AI_GATEWAY_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "quiz") {
      systemPrompt = `You are a career counselor designing an adaptive psychometric and career interest test for an Indian student. 
The student's education stage is: ${stage}.
Generate ONE multiple-choice question to determine their career interests. The question must be adaptive and logically follow their previous answers (if any).
IMPORTANT: Keep the question very short (1-2 sentences maximum). Keep each option text very short (1 line maximum).
Return ONLY a valid JSON object in this exact format, with no markdown formatting or backticks:
{
  "question": "The short question text here?",
  "options": [
    { "label": "Short option 1 text", "value": "opt1", "categories": ["engineering", "it_software"] },
    { "label": "Short option 2 text", "value": "opt2", "categories": ["medical"] },
    { "label": "Short option 3 text", "value": "opt3", "categories": ["management"] },
    { "label": "Short option 4 text", "value": "opt4", "categories": ["skill_based"] }
  ]
}
Valid categories are ONLY: engineering, medical, management, civil_services, defense, it_software, diploma, skill_based. Assign 1 to 3 relevant categories to each option. Provide exactly 4 options.`;
      
      let historyText = "No previous questions.";
      if (history && history.length > 0) {
        historyText = history.map((h: any, i: number) => `Q${i+1}: ${h.question}\nAnswer: ${h.answer}`).join("\n\n");
      }
      userPrompt = `Previous Q&A History:\n${historyText}\n\nGenerate the next question (Question ${history ? history.length + 1 : 1} of 10). Respond ONLY with the raw JSON object, no markdown blocks.`;
    } else if (type === "roadmap") {
      systemPrompt = "You are a career guidance expert for Indian students. Generate a clear, step-by-step career roadmap. Return a JSON object with: {steps: [{title: string, description: string, duration: string}]}. Keep it practical and specific to the Indian education system.";
      userPrompt = `Generate a career roadmap for becoming a "${careers}" starting from education stage "${stage}". Include 5-7 actionable steps.`;
    } else {
      systemPrompt = "You are a career counselor. Provide personalized career advice for Indian students. Be concise and actionable.";
      userPrompt = `Based on these top career categories: ${JSON.stringify(careers)}, and education stage: "${stage}", provide brief personalized advice (3-4 sentences) on how to proceed.`;
    }

    const response = await fetch("https://ai.gateway.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
