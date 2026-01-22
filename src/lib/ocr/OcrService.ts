import Tesseract from 'tesseract.js';

export interface OcrResult {
    text: string;
    confidence: number;
    blocks: {
        text: string;
        confidence: number;
        bbox: {
            x0: number;
            y0: number;
            x1: number;
            y1: number;
        };
    }[];
}

export class OcrService {
    private static instance: OcrService;
    private worker: Tesseract.Worker | null = null;

    private constructor() { }

    public static getInstance(): OcrService {
        if (!OcrService.instance) {
            OcrService.instance = new OcrService();
        }
        return OcrService.instance;
    }

    public async initialize() {
        if (!this.worker) {
            this.worker = await Tesseract.createWorker('eng');
        }
    }

    public async recognize(image: string | Blob): Promise<OcrResult> {
        if (!this.worker) {
            await this.initialize();
        }

        if (!this.worker) throw new Error("OCR Worker failed to initialize");

        const { data } = await this.worker.recognize(image);

        return {
            text: data.text,
            confidence: data.confidence,
            blocks: data.blocks?.map(block => ({
                text: block.text,
                confidence: block.confidence,
                bbox: block.bbox
            })) || []
        };
    }

    public async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
        }
    }
}

export const ocrService = OcrService.getInstance();
