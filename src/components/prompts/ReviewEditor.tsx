import { useState, useEffect } from 'react';
import { type OcrResult } from '@/lib/ocr/OcrService';
import { Type, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

interface ReviewEditorProps {
    imageFile: File | null;
    ocrResult: OcrResult | null;
    onSave: (text: string) => void;
    onRetake: () => void;
}

export function ReviewEditor({ imageFile, ocrResult, onSave, onRetake }: ReviewEditorProps) {
    const [text, setText] = useState(ocrResult?.text || '');
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageSrc(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    useEffect(() => {
        if (ocrResult) setText(ocrResult.text);
    }, [ocrResult]);

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                {/* Left: Image Preview */}
                <div className="border rounded-md bg-muted/30 p-4 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        Original Screenshot
                    </div>
                    <div className="flex-1 overflow-auto flex items-center justify-center bg-black/5 rounded border">
                        {imageSrc ? (
                            <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="text-muted-foreground">No image</span>
                        )}
                    </div>
                </div>

                {/* Right: Text Editor */}
                <div className="border rounded-md bg-background flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Type className="h-4 w-4" />
                            Extracted Text
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Confidence: {Math.round(ocrResult?.confidence || 0)}%
                        </div>
                    </div>
                    <textarea
                        className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="OCR output will appear here..."
                    />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t">
                <button
                    onClick={onRetake}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Start Over
                </button>
                <button
                    onClick={() => onSave(text)}
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-2 text-sm font-medium shadow hover:bg-primary/90 transition-colors"
                >
                    <Check className="h-4 w-4 mr-2" />
                    Use This Text
                </button>
            </div>
        </div>
    );
}
