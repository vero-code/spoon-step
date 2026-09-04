import { GoogleGenAI } from '@google/genai';

// 1. API Key accessor & storage helpers
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

export function getCustomApiKey(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('spoon_gemini_api_key') || '';
  }
  return '';
}

export function setStoredGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('spoon_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('spoon_gemini_api_key');
    }
  }
}

export function removeStoredGeminiApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('spoon_gemini_api_key');
  }
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
        // Parse arguments if Gemini returned them as a JSON string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rawArgs: any = step.arguments;
        if (typeof rawArgs === 'string') {
          try {
            rawArgs = JSON.parse(rawArgs);
          } catch (e) {
            throw new Error(`Failed to parse tool arguments JSON: ${rawArgs}`);
          }
        }

        if (step.name === 'decompose_task') {
          const list = Array.isArray(rawArgs)
            ? rawArgs
            : rawArgs.steps || rawArgs.micro_steps || rawArgs.items || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const steps = list.map((s: any) => String(s).trim()).filter(Boolean);
          console.log('🤖 [Agent invoked Tool: decompose_task]:', steps);

          if (steps.length > 0) {
            return { toolCalled: 'decompose_task', steps };
          }
          throw new Error(`Tool decompose_task was called, but steps array is empty: ${JSON.stringify(rawArgs)}`);
        }

        if (step.name === 'comfort_user') {
          const msg = (rawArgs.comfort_message || rawArgs.message || '').trim();
          console.log('🤖 [Agent invoked Tool: comfort_user]:', msg);

          if (msg) {
            return { toolCalled: 'comfort_user', comfortMessage: msg };
          }
          throw new Error(`Tool comfort_user was called, but message is empty: ${JSON.stringify(rawArgs)}`);
        }
      }
    }
  }

  throw new Error('Agent did not call any tools. Raw response: ' + JSON.stringify(interaction?.steps || interaction));
}

// -------------------------------------------------------------
// Convenience helper functions for components
// -------------------------------------------------------------

export async function decomposeTaskWithGemini(taskName: string): Promise<string[]> {
  const result = await runSpoonStepAgent(
    `Please call the decompose_task tool to break down this task: "${taskName}" into 5 to 8 single, atomic, low-cognitive-load physical movements. Do NOT call comfort_user.`
  );

  if (result.toolCalled === 'decompose_task' && result.steps && result.steps.length > 0) {
    return result.steps;
  }

  throw new Error(`Agent called "${result.toolCalled}" instead of decompose_task.`);
}

export async function fetchComfortingResponse(ventText: string): Promise<string> {
  const result = await runSpoonStepAgent(
    `The user is exhausted/overwhelmed and vented: "${ventText}". Call comfort_user to hold space and give them validation. Do NOT call decompose_task.`
  );

  if (result.toolCalled === 'comfort_user' && result.comfortMessage) {
    return result.comfortMessage;
  }

  throw new Error(`Agent called "${result.toolCalled}" instead of comfort_user.`);
}
