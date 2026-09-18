import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-accentBorder mt-16 py-8 text-subtleGrey text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <p className="font-semibold text-charcoal text-sm">DesiPlate AI — Mask R-CNN Based Meal Analysis</p>
            <p className="mt-1">Primary Instance Segmentation Architecture: ResNet-50 FPN Mask R-CNN</p>
          </div>
          <div className="max-w-md bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Scientific Disclaimer:</strong> Single RGB photographs provide probabilistic estimates of visible surface preparation and approximate nutritional values. Detection confidence is distinct from model accuracy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
