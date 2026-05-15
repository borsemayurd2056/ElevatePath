import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const systemInstruction = `You are GURU, an AI assistant for the ElevatePath platform. 
Your sole purpose is to answer questions regarding career and education. 
If a user asks a question about ANY topic other than career or education, you MUST reply with EXACTLY this sentence and nothing else: "Please message regarding educational purposes only".
IMPORTANT RULE: Your replies must always be a minimum of one word and a maximum of 10 lines. Keep your answers concise and well-structured within this limit.`;

serve(async (req) => {
  // Handle CORS preflight request for browser compatibility (Vercel/Netlify/Localhost)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { history, message } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: Message is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable.')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    let responseText = ""

    try {
      // Attempt with latest model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction,
      })
      const chat = model.startChat({ history: history || [] })
      const result = await chat.sendMessage(message)
      responseText = result.response.text()
    } catch (primaryError) {
      console.warn("Primary model failed, attempting fallback to gemini-2.0-flash:", primaryError.message)
      
      // Fallback to gemini-2.0-flash if 2.5 is not available
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemInstruction,
      })
      const chat = fallbackModel.startChat({ history: history || [] })
      const result = await chat.sendMessage(message)
      responseText = result.response.text()
    }

    return new Response(
      JSON.stringify({ response: responseText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred while processing your request.' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
