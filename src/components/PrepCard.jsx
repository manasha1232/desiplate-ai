import React from 'react';
import { Sparkles, Droplets, Flame, Waves } from 'lucide-react';

export default function PrepCard({ item }) {
  const vf = item.visual_features;

  const getOilinessBadge = (oiliness) => {
    if (oiliness === 'High') return 'bg-amber-100 text-amber-800 border-amber-300';
    if (oiliness === 'Moderate') return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  const getBrowningBadge = (browning) => {
    if (browning === 'High') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (browning === 'Moderate') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-accentBorder card-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-base font-bold text-charcoal">{item.name}</h4>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Likely Preparation
          </span>
        </div>

        {/* Inferred Preparation Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-saffron">Visual Preparation Indication</div>
          <div className="text-lg font-bold text-charcoal mt-0.5">{item.likely_preparation}</div>
          <div className="text-xs text-subtleGrey mt-0.5">Inference Confidence: {item.prep_confidence}</div>
        </div>

        {/* Feature Indicators */}
        <div className="space-y-2.5 text-xs">
          
          {/* Visible Surface Oiliness */}
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              <Droplets className="w-3.5 h-3.5 text-amber-600" /> Visible Surface Oiliness
            </span>
            <span className={`px-2 py-0.5 rounded-md font-semibold border ${getOilinessBadge(vf.visible_oiliness)}`}>
              {vf.visible_oiliness}
            </span>
          </div>

          {/* Visible Browning */}
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              <Flame className="w-3.5 h-3.5 text-terracotta" /> Visible Browning
            </span>
            <span className={`px-2 py-0.5 rounded-md font-semibold border ${getBrowningBadge(vf.visible_browning)}`}>
              {vf.visible_browning}
            </span>
          </div>

          {/* Moisture / Gravy Appearance */}
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              <Waves className="w-3.5 h-3.5 text-blue-500" /> Moisture / Gravy Appearance
            </span>
            <span className="px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              {vf.moisture_appearance}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
