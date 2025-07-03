import { createContext, useState, useContext } from 'react';

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
    const [tourState, setTourState] = useState({
        isActive: false,
        stepIndex: 0,
        steps: []
    });

    const startTour = (steps) => {
        setTourState({
            isActive: true,
            stepIndex: 0,
            steps: steps
        });
    };

    const nextStep = () => {
        setTourState(prev => {
            if (prev.stepIndex < prev.steps.length - 1) {
                return { ...prev, stepIndex: prev.stepIndex + 1 };
            }
            // End of tour
            return { ...prev, isActive: false };
        });
    };

    const stopTour = () => {
        setTourState({ isActive: false, stepIndex: 0, steps: [] });
    };

    const value = {
        tourState,
        startTour,
        nextStep,
        stopTour
    };

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    );
}; 