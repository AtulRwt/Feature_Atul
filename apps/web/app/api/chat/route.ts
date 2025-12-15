import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    try {
        console.log('Chat API called with', messages.length, 'messages');
        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: 'You are a helpful NBFC loan assistant. Help users with loan eligibility, document upload, and application tracking.',
            messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error('Chat API error:', error);
        console.error('Error message:', error?.message);
        console.error('Error statusCode:', error?.statusCode);
        return new Response(
            JSON.stringify({
                error: 'Failed to process chat. Please ensure GOOGLE_GENERATIVE_AI_API_KEY is set in your environment variables.'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
