import OpenAI from 'openai';
import { type Prompt } from '@/db/db';

export interface CategorizationResult {
    title: string;
    discipline: Prompt['discipline'];
    domain: string[];
    format: string;
    model: string;
    tags: string[];
}

const SYSTEM_PROMPT = `You are an expert AI prompt librarian. Your job is to analyze a raw AI prompt and accurately categorize it.

You MUST return a raw JSON object (without any markdown formatting like \`\`\`json) matching this exact schema:
{
  "title": "A short, descriptive title (max 50 chars)",
  "discipline": "Must be exactly one of: 'Website', 'Sales', 'Marketing', 'SAAS', 'Strategy', 'Personal', 'Music', 'Image Generation', 'SEO', 'Content Creation', 'Business Planning', or 'Other'",
  "domain": ["Array of up to 3 domains from: 'Copy Creation', 'Vibe Coding', 'Automation', 'Sales', 'Systems', 'Story'"],
  "format": "The expected output format (e.g., 'Text', 'Code', 'JSON', 'Markdown', 'Table', 'List', 'Image', 'CSV', 'Audio', 'Lyrics', 'MusicXML', 'SVG', 'Figma'). Be specific if the prompt asks for one.",
  "model": "The intended AI model (e.g., 'Generic', 'GPT-4', 'Claude 3', 'DALL-E 3', 'Midjourney', 'Suno', 'Udio', 'Stable Diffusion', 'Llama 3'). Guess based on syntax or default to 'Generic'.",
  "tags": ["Array of 2-5 relevant keyword tags, lowercase"]
}`;

export async function autoCategorizePrompt(content: string): Promise<CategorizationResult | null> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("OpenAI API Key is missing. Cannot auto-categorize.");
        return null;
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Since this is a local/client-side tool 
    });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast and cheap for this task
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Please categorize the following prompt:\n\n${content}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
        });

        const resultText = response.choices[0]?.message?.content;
        if (!resultText) return null;

        const result = JSON.parse(resultText) as CategorizationResult;

        // Ensure values are within safety bounds or defaults
        return {
            title: result.title || "Untitled Auto-Prompt",
            discipline: result.discipline || "Other",
            domain: Array.isArray(result.domain) ? result.domain : [],
            format: result.format || "Text",
            model: result.model || "Generic",
            tags: Array.isArray(result.tags) ? result.tags : []
        };
    } catch (error) {
        console.error("AI Categorization failed:", error);
        return null;
    }
}
