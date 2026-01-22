import { useState, useCallback, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaptureZoneProps {
    onImageCaptured: (file: File) => void;
    onTextCaptured: (text: string) => void;
    isProcessing: boolean;
}

export function CaptureZone({ onImageCaptured, onTextCaptured, isProcessing }: CaptureZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (items) {
            // Check for images first
            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        onImageCaptured(file);
                        return;
                    }
                }
            }
            // If no image, check for text
            for (const item of items) {
                if (item.type === 'text/plain') {
                    item.getAsString((text) => {
                        if (text.trim()) onTextCaptured(text);
                    });
                    return;
                }
            }
        }
    }, [onImageCaptured, onTextCaptured]);

    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onImageCaptured(file);
            }
        }
    };

    return (
        <div
            className={cn(
                "relative border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                isProcessing && "opacity-50 pointer-events-none"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                ) : (
                    <div className="p-4 bg-muted rounded-full">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}

                <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                        {isProcessing ? "Processing Image..." : "Capture Prompt"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Paste a screenshot (Ctrl+V), drag an image, or <strong>paste text</strong> directly.
                    </p>
                </div>
            </div>
        </div>
    );
}
