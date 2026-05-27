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

const VALID_DISCIPLINES: Prompt['discipline'][] = ['Website', 'Sales', 'Marketing', 'SAAS', 'Strategy', 'Personal', 'Music', 'Image Generation', 'SEO', 'Content Creation', 'Business Planning', 'Other'];
const VALID_DOMAINS = ['Copy Creation', 'Vibe Coding', 'Automation', 'Sales', 'Systems', 'Story'];
const VALID_FORMATS = ['Text', 'Code', 'JSON', 'Markdown', 'Table', 'List', 'Image', 'CSV', 'Audio', 'Lyrics', 'MusicXML', 'SVG', 'Figma'];
const VALID_MODELS = ['Generic', 'GPT-4', 'Claude 3', 'DALL-E 3', 'Midjourney', 'Suno', 'Udio', 'Stable Diffusion', 'Llama 3'];

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

function includesAny(content: string, keywords: string[]) {
    return keywords.some(keyword => content.includes(keyword));
}

function toTitleCase(value: string) {
    return value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 8)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function generateFallbackTitle(content: string) {
    const firstLine = content
        .split(/\r?\n/)
        .map(line => line.trim())
        .find(Boolean) || 'Captured Prompt';

    const cleaned = firstLine
        .replace(/^(act as|you are|create|write|generate|build|make|draft|design|analyze)\b[:,\s-]*/i, '')
        .replace(/[^\w\s/+-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const title = toTitleCase(cleaned || firstLine);
    return title.slice(0, 50) || 'Captured Prompt';
}

export function fallbackCategorizePrompt(content: string): CategorizationResult {
    const normalized = content.toLowerCase();
    const tags = new Set<string>();
    const domain = new Set<string>();
    let discipline: Prompt['discipline'] = 'Other';
    let format = 'Text';
    let model = 'Generic';

    if (includesAny(normalized, ['website', 'landing page', 'web app', 'frontend', 'react', 'html', 'css', 'tailwind', 'component'])) {
        discipline = 'Website';
        domain.add('Vibe Coding');
        tags.add('website');
        tags.add('frontend');
    }

    if (includesAny(normalized, ['sales', 'lead', 'prospect', 'cold email', 'objection', 'pipeline', 'crm', 'outreach'])) {
        discipline = 'Sales';
        domain.add('Sales');
        tags.add('sales');
        tags.add('outreach');
    }

    if (includesAny(normalized, ['marketing', 'campaign', 'ad copy', 'social media', 'seo', 'brand', 'funnel'])) {
        discipline = includesAny(normalized, ['seo', 'keyword', 'search intent']) ? 'SEO' : 'Marketing';
        domain.add('Copy Creation');
        tags.add('marketing');
    }

    if (includesAny(normalized, ['blog', 'article', 'newsletter', 'copy', 'caption', 'headline', 'email'])) {
        if (discipline === 'Other') discipline = 'Content Creation';
        domain.add('Copy Creation');
        tags.add('copywriting');
    }

    if (includesAny(normalized, ['business plan', 'go-to-market', 'strategy', 'market analysis', 'competitor', 'pricing'])) {
        discipline = includesAny(normalized, ['business plan']) ? 'Business Planning' : 'Strategy';
        domain.add('Systems');
        tags.add('strategy');
    }

    if (includesAny(normalized, ['midjourney', 'dall-e', 'stable diffusion', 'image prompt', 'photorealistic', 'logo'])) {
        discipline = 'Image Generation';
        format = 'Image';
        tags.add('image');
    }

    if (includesAny(normalized, ['song', 'lyrics', 'suno', 'udio', 'musicxml', 'melody', 'chord'])) {
        discipline = 'Music';
        tags.add('music');
        if (normalized.includes('lyrics')) format = 'Lyrics';
        if (normalized.includes('musicxml')) format = 'MusicXML';
    }

    if (includesAny(normalized, ['json', 'schema'])) format = 'JSON';
    else if (includesAny(normalized, ['markdown', 'md'])) format = 'Markdown';
    else if (includesAny(normalized, ['table', 'spreadsheet'])) format = 'Table';
    else if (includesAny(normalized, ['list', 'bullets', 'bullet points'])) format = 'List';
    else if (includesAny(normalized, ['code', 'script', 'function', 'typescript', 'javascript', 'python'])) format = 'Code';
    else if (includesAny(normalized, ['csv'])) format = 'CSV';
    else if (includesAny(normalized, ['svg'])) format = 'SVG';
    else if (includesAny(normalized, ['figma'])) format = 'Figma';

    if (normalized.includes('claude')) model = 'Claude 3';
    else if (normalized.includes('gpt-4')) model = 'GPT-4';
    else if (normalized.includes('dall-e')) model = 'DALL-E 3';
    else if (normalized.includes('midjourney')) model = 'Midjourney';
    else if (normalized.includes('suno')) model = 'Suno';
    else if (normalized.includes('udio')) model = 'Udio';
    else if (normalized.includes('stable diffusion')) model = 'Stable Diffusion';
    else if (normalized.includes('llama')) model = 'Llama 3';

    const keywordMatches = normalized.match(/\b[a-z][a-z0-9-]{3,}\b/g) || [];
    for (const keyword of keywordMatches) {
        if (tags.size >= 5) break;
        if (!['create', 'write', 'generate', 'using', 'with', 'that', 'this', 'from', 'into', 'please', 'following'].includes(keyword)) {
            tags.add(keyword);
        }
    }

    return sanitizeCategorizationResult({
        title: generateFallbackTitle(content),
        discipline,
        domain: Array.from(domain).slice(0, 3),
        format,
        model,
        tags: Array.from(tags).slice(0, 5),
    });
}

function sanitizeCategorizationResult(result: Partial<CategorizationResult>): CategorizationResult {
    const discipline = VALID_DISCIPLINES.includes(result.discipline as Prompt['discipline'])
        ? result.discipline as Prompt['discipline']
        : 'Other';

    const domain = Array.isArray(result.domain)
        ? result.domain.filter(item => VALID_DOMAINS.includes(item)).slice(0, 3)
        : [];

    const format = result.format && VALID_FORMATS.includes(result.format) ? result.format : 'Text';
    const model = result.model && VALID_MODELS.includes(result.model) ? result.model : 'Generic';
    const tags = Array.isArray(result.tags)
        ? result.tags.map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 5)
        : [];

    return {
        title: result.title?.trim().slice(0, 50) || 'Untitled Auto-Prompt',
        discipline,
        domain,
        format,
        model,
        tags: [...new Set(tags)],
    };
}

export async function autoCategorizePrompt(content: string): Promise<CategorizationResult | null> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("OpenAI API Key is missing. Cannot auto-categorize.");
        return fallbackCategorizePrompt(content);
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

        return sanitizeCategorizationResult(result);
    } catch (error) {
        console.error("AI Categorization failed:", error);
        return fallbackCategorizePrompt(content);
    }
}
