import { GoogleGenAI } from '@google/genai';

// Retrieve API key from Vite env or localStorage
export function getGeminiApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('spoon_gemini_api_key');
    if (stored) return stored.trim();
  }
  return '';
}

/**
 * Function declaration according to Google Gen AI documentation:
 * Instead of generating text responses, the model determines when to call specific
 * functions and provides the necessary parameters to execute real-world actions.
 */
export const decomposeTaskTool = {
  type: 'function' as const,
  name: 'decompose_task',
  description:
    'Decomposes an overwhelming real-world task into 5 to 8 single, atomic, low-cognitive-load physical micro-steps tailored for executive dysfunction (ADHD, Autism, Burnout).',
  parameters: {
    type: 'object',
    properties: {
      steps: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Ordered sequence of 5 to 8 atomic micro-steps. Strictly ONE single physical movement per step (e.g., "Stand up", "Rinse one cup").',
      },
    },
    required: ['steps'],
  },
};

/**
 * Calls Gemini 3.8 Flash using Interactions API Function Calling per official docs
 */
export async function decomposeTaskWithGemini(taskName: string): Promise<string[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const client = new GoogleGenAI({ apiKey });

  // Strictly per official Google documentation: client.interactions.create with gemini-3.8-flash
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interaction: any = await (client as any).interactions.create({
    model: 'gemini-3.8-flash',
    input: `The user feels paralyzed by this task: "${taskName}". Break it down into 5 to 8 single physical movements.`,
    tools: [decomposeTaskTool],
  });

  if (interaction?.steps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const step of interaction.steps) {
      if (step.type === 'function_call' && step.name === 'decompose_task') {
        const args = step.arguments as { steps?: string[] };
        if (args?.steps && Array.isArray(args.steps) && args.steps.length > 0) {
          const cleanSteps = args.steps.map((s) => String(s).trim()).filter(Boolean);
          console.log('🤖 [Gemini 3.8 Flash Function Calling Result]:', cleanSteps);
          return cleanSteps;
        }
      }
    }
  }

  throw new Error('Gemini did not return function_call steps for decompose_task.');
}
