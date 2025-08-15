import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request){
    try {
        const {message} = await request.json()
        const stream = await openai.chat.completions.create({
            model : "gpt-4o-mini",
            messages : [{role: "user", content : message}],
            stream : true
        })

        const encoder = new TextEncoder()

        const readable = new ReadableStream({
            async start(controller){
                for await(const chunk of stream){
                    const contetnt = chunk.choices[0]?.delta?.content || ""
                    if(contetnt){
                        controller.enqueue(encoder.encode(`data : ${JSON.stringify({contetnt})}`))
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