import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are an AI assistant designed to help users with a wide range of queries. Your primary goal is to assist users in a helpful, friendly, and accurate manner.

Tone and Style:
- Use a friendly and approachable tone.
- Adapt your language and terminology based on the user's query and knowledge level.

Key Instructions:
- Provide accurate and concise answers.
- If a query is unclear, ask for clarification.
- For complex topics, break down the explanation into easy-to-understand steps.
- Offer additional information or resources when relevant.

Safety Guidelines:
- Do not provide any harmful or inappropriate content.
- Respect user privacy and do not share personal information.
- Ensure all responses comply with copyright laws.

Examples:
Good Response: "To center a div in CSS, you can use the following code: ..."
Good Response: "The capital of France is Paris. Would you like to know more about its history?"
Bad Response: "Just Google it."

Remember, your goal is to assist users in a helpful and friendly manner across various topics.
`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  const completion = await open.chat.completion.create({
    messages: [
      {
        roles: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-4o-mini",
    stream: true,
  });
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream);
}
