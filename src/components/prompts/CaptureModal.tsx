import { useState, useEffect } from 'react';
import { Modal } from '@/components/layout/Modal';
import { CaptureZone } from './CaptureZone';
import { ReviewEditor } from './ReviewEditor';
import { ocrService, type OcrResult } from '@/lib/ocr/OcrService';
import { PromptForm } from './PromptForm';
import { type Prompt } from '@/db/db';

interface CaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Prompt>) => void;
    promptToEdit?: Prompt | null;
}

type Step = 'CAPTURE' | 'REVIEW' | 'EDIT';

export function CaptureModal({ isOpen, onClose, onSave, promptToEdit }: CaptureModalProps) {
    const [step, setStep] = useState<Step>('CAPTURE');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [finalText, setFinalText] = useState('');
    const [sourceType, setSourceType] = useState<Prompt['source_type']>('OCR');

    // Initialize for editing
    useEffect(() => {
        if (isOpen && promptToEdit) {
            setStep('EDIT');
            setFinalText(promptToEdit.content_raw);
            setSourceType(promptToEdit.source_type);
        } else if (isOpen && !promptToEdit) {
            setStep('CAPTURE');
            setFinalText('');
            setSourceType('OCR');
            setImageFile(null);
            setOcrResult(null);
        }
    }, [isOpen, promptToEdit]);

    const handleImageCaptured = async (file: File) => {
        setImageFile(file);
        setIsProcessing(true);
        setSourceType('OCR');
        try {
            const result = await ocrService.recognize(file);
            setOcrResult(result);
            setStep('REVIEW');
        } catch (error) {
            console.error("OCR Failed:", error);
            // TODO: Show error toast
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextCaptured = (text: string) => {
        setFinalText(text);
        setSourceType('CLIPBOARD');
        setStep('EDIT');
    };

    const handleReviewComplete = (text: string) => {
        setFinalText(text);
        setStep('EDIT');
    };

    const handleSave = (data: Partial<Prompt>) => {
        onSave({
            ...data,
            source_type: sourceType,
        });
        // Don't reset here, wait for close to prevent flashing
    };

    const reset = () => {
        setStep('CAPTURE');
        setImageFile(null);
        setOcrResult(null);
        setFinalText('');
        setSourceType('OCR');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                step === 'CAPTURE' ? 'Capture Prompt' :
                    step === 'REVIEW' ? 'Review Extraction' :
                        'Finalize Prompt'
            }
        >
            {step === 'CAPTURE' && (
                <CaptureZone
                    onImageCaptured={handleImageCaptured}
                    onTextCaptured={handleTextCaptured}
                    isProcessing={isProcessing}
                />
            )}

            {step === 'REVIEW' && (
                <ReviewEditor
                    imageFile={imageFile}
                    ocrResult={ocrResult}
                    onSave={handleReviewComplete}
                    onRetake={reset}
                />
            )}

            {step === 'EDIT' && (
                <PromptForm
                    initialData={promptToEdit || {
                        content_raw: finalText,
                        source_type: sourceType,
                        discipline: 'Website', // Default
                        domain: [],
                        tags: [],
                    }}
                    onSubmit={handleSave}
                    onCancel={reset}
                />
            )}
        </Modal>
    );
}
