import { useEffect, useState, useRef } from 'react';
import { useTour } from '../context/TourContext';

export default function TourGuide() {
    const { tourState, nextStep, stopTour } = useTour();
    const { isActive, steps, stepIndex } = tourState;
    const [styles, setStyles] = useState({
        highlight: { display: 'none' },
        dialog: { display: 'none' }
    });
    const dialogRef = useRef(null);

    const currentStep = steps[stepIndex];

    useEffect(() => {
        if (!isActive || !currentStep?.selector) {
            setStyles({ highlight: { display: 'none' }, dialog: { display: 'none' } });
            return;
        }

        const element = document.querySelector(currentStep.selector);
        const dialog = dialogRef.current;

        if (element && dialog) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const elementRect = element.getBoundingClientRect();
            const dialogRect = dialog.getBoundingClientRect();
            const margin = 16;
            
            // Calculate Highlight Box Style
            const padding = 10;
            const highlight = {
                width: `${elementRect.width + padding * 2}px`,
                height: `${elementRect.height + padding * 2}px`,
                top: `${elementRect.top - padding}px`,
                left: `${elementRect.left - padding}px`,
            };

            // Calculate Dialog Box Position
            let top = elementRect.top + (elementRect.height / 2) - (dialogRect.height / 2);
            let left;

            if (elementRect.right + dialogRect.width + margin < window.innerWidth) {
                // Place to the right
                left = elementRect.right + margin;
            } else {
                // Place to the left
                left = elementRect.left - dialogRect.width - margin;
            }
            
            // Clamp position to stay within viewport
            if (top < margin) top = margin;
            if (left < margin) left = margin;
            if (top + dialogRect.height > window.innerHeight - margin) top = window.innerHeight - dialogRect.height - margin;
            if (left + dialogRect.width > window.innerWidth - margin) left = window.innerWidth - dialogRect.width - margin;

            const dialogStyle = { top: `${top}px`, left: `${left}px` };

            setStyles({ highlight, dialog: dialogStyle });
        }
    }, [isActive, currentStep]);

    if (!isActive || !currentStep) return null;

    const isLastStep = stepIndex === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50">
             <div
                className="absolute bg-transparent rounded-lg shadow-2xl transition-all duration-300 ease-in-out"
                style={{ ...styles.highlight, boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)' }}
            ></div>
            <div
                ref={dialogRef}
                className="absolute p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] rounded-lg shadow-xl z-50 max-w-sm transition-all duration-300 ease-in-out"
                style={styles.dialog}
            >
                <h3 className="text-xl font-bold mb-2">{currentStep.title}</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">{currentStep.content}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-muted)] text-sm">{stepIndex + 1} / {steps.length}</span>
                    <div>
                        <button onClick={stopTour} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mr-4">تخطي</button>
                        <button onClick={nextStep} className="bg-[var(--color-accent-primary)] hover:opacity-90 px-6 py-2 rounded-md transition-all">
                            {isLastStep ? 'إنهاء' : 'التالي'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}