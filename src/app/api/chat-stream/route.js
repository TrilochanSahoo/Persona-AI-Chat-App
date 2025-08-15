import OpenAI from "openai"
import { personaPrompts } from "@/prompts";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request){
    try {
        const {message, persona} = await request.json()

        const systemPrompt = personaPrompts[persona?.toLowerCase()];
        if (!systemPrompt) {
            return new Response(
                JSON.stringify({ error: "Invalid persona" }),
                { status: 400 }
            );
        }

        const stream = await openai.chat.completions.create({
            model : "gpt-4o-mini",
            messages : [
                { role: "system", content: systemPrompt },
                {role: "user", content : message}
            ],
            stream : true
        })

        const encoder = new TextEncoder()

        const readable = new ReadableStream({
            async start(controller){
                for await(const chunk of stream){
                    const content = chunk.choices[0]?.delta?.content || ""
                    if(content){
                        controller.enqueue(encoder.encode(`data : ${JSON.stringify({content})}\n\n`))
                    }
                    
                }
                controller.close()
            }
        }) 

        return new Response(readable,{
            headers : {
                'Content-Type' : "text/event-stream",
                'Cache-Control' : "no-cache",
                'Connection' : "keep-alive"
            }
        })

    } catch (error) {
        return Response.json({
            error : "Failed to process the request"
        },{status : 500})
    }
}