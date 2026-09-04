import { GoogleGenAI } from '@google/genai';

// 1. API Key accessor
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

// -------------------------------------------------------------
// TOOL 1: Action Inertia Breaker (Decomposition)
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// TOOL 2: Sanctuary Comfort & Nervous System Regulation
// -------------------------------------------------------------
export const comfortUserTool = {
  type: 'function' as const,
  name: 'comfort_user',
  description:
    'Provides gentle, neurodiversity-affirming emotional validation and non-judgmental comfort for a user experiencing burnout, ADHD paralysis, or guilt.',
  parameters: {
    type: 'object',
    properties: {
      comfort_message: {
        type: 'string',
        description:
          'Warm, quiet 2-sentence validation acknowledging that their nervous system is overwhelmed and giving full permission to put down the weight. Zero toxic positivity.',
      },
    },
    required: ['comfort_message'],
  },
};

// Toolset of our unified SpoonStep Agent
export const SPOON_STEP_TOOLS = [decomposeTaskTool, comfortUserTool];

// -------------------------------------------------------------
// THE UNIFIED SPOONSTEP AGENT
// -------------------------------------------------------------
export interface AgentResponse {
  toolCalled: 'decompose_task' | 'comfort_user';
  steps?: string[];
  comfortMessage?: string;
}

/**
 * Single Agent entry point equipped with both tools simultaneously
 */
export async function runSpoonStepAgent(userInput: string): Promise<AgentResponse> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY.');
  }

  const client = new GoogleGenAI({ apiKey });

  // Call the Agent with the full toolset!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interaction: any = await (client as any).interactions.create({
    model: 'gemini-3.8-flash',
    input: userInput,
    tools: SPOON_STEP_TOOLS,
  });

  if (interaction?.steps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const step of interaction.steps) {
      if (step.type === 'function_call') {
        if (step.name === 'decompose_task') {
          const args = step.arguments as { steps?: string[] };
          const steps = (args.steps || []).map((s) => String(s).trim()).filter(Boolean);
          console.log('🤖 [Agent invoked Tool: decompose_task]:', steps);
          return { toolCalled: 'decompose_task', steps };
        }

        if (step.name === 'comfort_user') {
          const args = step.arguments as { comfort_message?: string };
          const msg = (args.comfort_message || '').trim();
          console.log('🤖 [Agent invoked Tool: comfort_user]:', msg);
          return { toolCalled: 'comfort_user', comfortMessage: msg };
        }
      }
    }
  }

  throw new Error('Agent did not call any tools.');
}

// -------------------------------------------------------------
// Convenience helper functions for components
// -------------------------------------------------------------

export async function decomposeTaskWithGemini(taskName: string): Promise<string[]> {
  const result = await runSpoonStepAgent(
    `The user feels paralyzed by this task: "${taskName}". Break it down into single physical movements.`
  );
  if (result.steps && result.steps.length > 0) {
    return result.steps;
  }
  throw new Error('Failed to decompose task');
}

export async function fetchComfortingResponse(ventText: string): Promise<string> {
  try {
    const result = await runSpoonStepAgent(
      `The user feels burned out and just vented: "${ventText}". Hold space and comfort them.`
    );
    if (result.comfortMessage) {
      return result.comfortMessage;
    }
  } catch (error) {
    console.warn('⚠️ Agent comfort fallback:', error);
  }

  throw new Error('Failed to get comforting response.');
}
