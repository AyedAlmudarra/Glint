// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// IMPORTANT: Ensure you have set the COHERE_API_KEY environment variable in your Supabase project.
const COHERE_API_KEY = Deno.env.get("COHERE_API_KEY");

// Add a check to ensure the API key is present.
if (!COHERE_API_KEY) {
  throw new Error("COHERE_API_KEY is not set in the function's environment variables. Please add it in your project's settings.");
}

const COHERE_API_URL = "https://api.cohere.com/v2/chat";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Hello from Sanad AI Assistant!")

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, context, userProfile, tasks, progress } = await req.json();

    const systemPrompt = `You are 'Sanad' (سَند), a highly knowledgeable and encouraging AI career counselor for students on the 'Glint' (جلينت) platform. Your knowledge is an authoritative reflection of the platform's content.

**Your Persona:**
- You are friendly, professional, and supportive.
- Your goal is to help students explore career paths, understand their skills, and find relevant simulations on the Glint platform.
- You are an expert in the Saudi job market and educational pathways.
- **You MUST communicate exclusively in Arabic.** Do not use any other language.
- Your name "سَند" means "support" in Arabic - you are here to support and guide students in their career exploration journey.

**Core Directives:**
- **Maintain Persona:** Never reveal that you are an AI or language model. You are Sanad (سَند). All your knowledge comes from the Glint platform itself.
- **Speak with Authority:** Do not use hedging language like "Here are a few examples..." or "The platform may have...". Speak as if you have complete and total knowledge of all simulations and career paths available on Glint.
- **Use Your Tools:** To answer any questions about the platform's content (such as available simulations or tasks), you MUST use the tools provided to you. Do not invent answers or rely on general knowledge for this information. Always fetch the real, up-to-date data before answering.

**Student & Progress Context:**
- Name: ${userProfile?.full_name || 'N/A'}
- Career Goal: ${userProfile?.career_goal || 'Not specified'}
- Skills: ${userProfile?.skills ? userProfile.skills.join(', ') : 'Not specified'}
- Completed Tasks: ${progress?.completed_count || 0}
- Current Simulation: ${progress?.current_simulation || 'None'}

Based on all the provided context (student info, progress, and conversation history), provide a concise, helpful, and encouraging response in Arabic.`;

    const tools = [
      {
        type: "function",
        function: {
            name: "get_platform_content",
            description: "Fetches a list of content from the Glint platform. Use this to find available 'simulations' or 'tasks'.",
            parameters: {
                type: "object",
                properties: {
                    content_type: {
                        type: "string",
                        description: "The type of content to fetch.",
                        enum: ["simulations", "tasks"],
                    },
                },
                required: ["content_type"],
            }
        }
      }
    ];

    const conversationHistory = context.map(msg => ({
      role: msg.sender,
      content: msg.text
    }));

    let messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // --- First API Call to Cohere (no streaming) ---
    // The goal is to see if the AI wants to use a tool.
    const initialResponse = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "command-r-plus-08-2024",
        messages: messages,
        tools: tools,
        temperature: 0.3,
        stream: false 
      })
    });
    
    if (!initialResponse.ok) {
        const errorBody = await initialResponse.text();
        throw new Error(`Cohere API error (initial call): ${initialResponse.status} ${initialResponse.statusText} - ${errorBody}`);
    }

    const cohereResponse = await initialResponse.json();

    if (cohereResponse.finish_reason === 'TOOL_CALL') {
      // AI wants to use a tool.
      
      // Add the assistant's turn (containing the tool call) to the conversation history.
      messages.push(cohereResponse.message);

      for (const call of cohereResponse.message.tool_calls) {
        console.log(`AI wants to use tool: ${call.function.name}`);

        if (call.function.name === 'get_platform_content') {
          const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
          );

          const { content_type } = JSON.parse(call.function.parameters);

          if (content_type === 'simulations') {
            const { data: toolData, error } = await supabaseClient
              .from('simulations')
              .select('title, description');

            if (error) throw error;
            
            const formattedSimulations = toolData.map(s => `- Title: ${s.title}, Description: ${s.description}`).join('\n');

            messages.push({
                role: "tool",
                content: formattedSimulations,
                tool_call_id: call.id
            });
          } else if (content_type === 'tasks') {
            const { data: toolData, error } = await supabaseClient
              .from('tasks')
              .select('title, description, definition');

            if (error) throw error;
            
            const formattedTasks = toolData.map(t => `- Title: ${t.title}, Description: ${t.description}, Definition: ${t.definition}`).join('\n');
            
            messages.push({
                role: "tool",
                content: formattedTasks,
                tool_call_id: call.id
            });
          }
        }
      }
      
      // --- Second API Call to Cohere (with streaming) ---
      // This time, we send the conversation history plus the new tool messages.
      const finalResponse = await fetch(COHERE_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              messages: messages,
              model: "command-r-plus-08-2024",
              temperature: 0.3,
              stream: true
          })
      });

      if (!finalResponse.ok) {
        const errorBody = await finalResponse.text();
        throw new Error(`Cohere API error (final call): ${finalResponse.status} ${finalResponse.statusText} - ${errorBody}`);
      }

      return new Response(finalResponse.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
        },
      });

    } else {
      // The AI answered directly without needing a tool.
      // We re-run the request with streaming enabled to deliver the response.
       const streamingResponse = await fetch(COHERE_API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${COHERE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages,
                model: "command-r-plus-08-2024",
                temperature: 0.3,
                stream: true
            })
        });

        return new Response(streamingResponse.body, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
          },
        });
    }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chat-with-sanad' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

