import React from 'react';
import { Percent, Info, Flame, Activity } from 'lucide-react';

export default function FoodCard({ item }) {
  const confPercent = Math.round(item.detection_confidence * 100);

  return (
    <div className="bg-white rounded-2xl p-5 border border-accentBorder card-shadow card-hover flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-lg font-bold text-charcoal">{item.name}</h4>
            <span className="text-xs text-subtleGrey font-mono">
              Box: [{item.bounding_box.join(', ')}]
            </span>
          </div>
          
          {/* Detection Confidence Badge */}
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Percent className="w-3 h-3 mr-1" />
              {confPercent}% Detection Confidence
            </span>
          </div>
        </div>

        {/* Confidence Disclaimer */}
        <div className="mb-4 bg-gray-50 text-gray-500 text-[11px] p-2 rounded-lg flex items-center gap-1.5 border border-gray-200">
          <Info className="w-3.5 h-3.5 text-subtleGrey shrink-0" />
          <span>Explicit score: <strong>Detection Confidence</strong> (not model accuracy).</span>
        </div>

        {/* Nutritional Breakdown Grid */}
        <div className="grid grid-cols-4 gap-2 text-center bg-bgLight p-3 rounded-xl border border-gray-100 mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-subtleGrey font-medium">Calories</div>
            <div className="text-sm font-bold text-terracotta">{item.nutrition.calories} kcal</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-subtleGrey font-medium">Protein</div>
            <div className="text-sm font-bold text-sage">{item.nutrition.protein}g</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-subtleGrey font-medium">Carbs</div>
            <div className="text-sm font-bold text-saffron">{item.nutrition.carbohydrates}g</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-subtleGrey font-medium">Fat</div>
            <div className="text-sm font-bold text-blue-600">{item.nutrition.fat}g</div>
          </div>
        </div>
      </div>

      {/* Individual Mask Link */}
      {item.mask_url && (
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-subtleGrey font-medium">Instance Segmentation Mask</span>
          <a
            href={item.mask_url}
            target="_blank"
            rel="noreferrer"
            className="text-terracotta hover:underline font-semibold"
          >
            View Binary Mask PNG →
          </a>
        </div>
      )}
    </div>
  );
}
