'use server';

/**
 * @fileOverview A chatbot for answering tenant questions about society rules, services, and events.
 *
 * - residentQueryChatbot - A function that handles the chatbot query process.
 * - ResidentQueryChatbotInput - The input type for the residentQueryChatbot function.
 * - ResidentQueryChatbotOutput - The return type for the residentQueryChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResidentQueryChatbotInputSchema = z.object({
  query: z.string().describe('The tenant\'s question or query.'),
});
export type ResidentQueryChatbotInput = z.infer<typeof ResidentQueryChatbotInputSchema>;

const ResidentQueryChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot\'s answer to the tenant\'s query.'),
});
export type ResidentQueryChatbotOutput = z.infer<typeof ResidentQueryChatbotOutputSchema>;

export async function residentQueryChatbot(input: ResidentQueryChatbotInput): Promise<ResidentQueryChatbotOutput> {
  return residentQueryChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'residentQueryChatbotPrompt',
  input: {schema: ResidentQueryChatbotInputSchema},
  output: {schema: ResidentQueryChatbotOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a helpful AI assistant for residents of the Asraya Society Hub.
  Your purpose is to answer questions about society rules, services, and events.
  Use the following information to answer the resident\'s query:

  Society Rules: [Provide a summary of key society rules here]
  Services: [Provide a list of available services and how to access them]
  Events: [Provide a calendar or list of upcoming community events]

  Resident Query: {{{query}}}

  Please provide a concise and informative answer. If you don\'t know the answer, say you don\'t know.`,
});

const residentQueryChatbotFlow = ai.defineFlow(
  {
    name: 'residentQueryChatbotFlow',
    inputSchema: ResidentQueryChatbotInputSchema,
    outputSchema: ResidentQueryChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
