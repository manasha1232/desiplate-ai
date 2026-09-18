import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function Processing({ onComplete, analysisTask }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Image preprocessing',
    'Mask R-CNN detection',
    'Instance segmentation',
    'Food identification',
    'Visual feature extraction',
    'Preparation analysis',
    'Nutrition estimation'
  ];

  useEffect(() => {
    // Step animation timer
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Trigger actual API analysis task
    if (analysisTask) {
      analysisTask().then((result) => {
        // Ensure steps finish visually
        setTimeout(() => {
          onComplete(result);
        }, 800);
      }).catch((err) => {
        console.error("Analysis error:", err);
      });
    }
  }, [analysisTask]);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-accentBorder card-shadow space-y-8">
        
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-terracotta to-saffron animate-spin opacity-20 absolute"></div>
          <div className="w-16 h-16 rounded-full bg-orange-50 text-terracotta flex items-center justify-center relative z-10 shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-charcoal">Analyzing Meal Image</h2>
          <p className="text-sm text-subtleGrey mt-1">
            Running PyTorch Mask R-CNN ResNet-50 FPN instance segmentation...
          </p>
        </div>

        {/* Stage Timeline */}
        <div className="space-y-3 text-left max-w-sm mx-auto pt-4">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  isCurrent ? 'bg-orange-50/70 border border-terracotta/30' : 'bg-transparent'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-sage shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-terracotta animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0"></div>
                )}
                <span className={`text-sm font-medium ${isDone ? 'text-charcoal' : isCurrent ? 'text-terracotta font-bold' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
