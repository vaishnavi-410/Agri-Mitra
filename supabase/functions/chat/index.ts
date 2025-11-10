import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const languageMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      mr: 'Marathi (मराठी)'
    };
    const responseLanguage = languageMap[language] || 'English';

    const systemPrompt = `You are an expert agricultural assistant helping Indian farmers protect their crops.
Analyze the image of this crop leaf carefully. Identify which crop it belongs to and whether the leaf shows any signs of disease.

IMPORTANT: Respond in ${responseLanguage}. Use the native script and vocabulary appropriate for ${responseLanguage}.

If a disease is detected, explain it clearly in simple and farmer-friendly language.

Give your response in the following format:

🌿 Crop Name:
🌾 Disease Name (if any):
🩺 Description: (Explain what the disease does and how it looks on the leaf.)
💊 Treatment / Cure: (Suggest proper remedies such as organic or chemical sprays with names and frequency.)
⚠️ Precautions for Farmers: (Explain what to avoid and what to follow.)
🌦️ Season-wise Advice: (Give tips based on the current season—summer, monsoon, or winter—like irrigation care, spraying schedule, humidity control, etc.)

If the leaf looks healthy, kindly reply warmly and motivate the farmer by saying the crop is healthy and share short preventive advice to keep it that way.

Keep your tone positive, supportive, and respectful — like you are personally guiding a farmer friend.

Use short sentences and emojis for friendliness.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
