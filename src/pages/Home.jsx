import React from 'react';
import { Camera, ShieldCheck, Eye, Flame, Layers, ArrowRight } from 'lucide-react';

export default function Home({ onScanClick }) {
  return (
    <div className="space-y-12 py-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 rounded-3xl p-8 sm:p-12 border border-accentBorder card-shadow relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-terracotta/10 text-terracotta px-3.5 py-1 rounded-full text-xs font-semibold mb-4 border border-terracotta/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pure Mask R-CNN Instance Segmentation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
            DesiPlate AI
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-terracotta mt-2">
            Understand your Indian meal beyond the plate.
          </p>
          <p className="text-subtleGrey text-base sm:text-lg mt-4 leading-relaxed">
            Upload a meal photo to identify individual food items using Mask R-CNN pixel masks, analyze their surface oiliness, browning, and moisture, and infer likely cooking preparations.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={onScanClick}
              className="bg-charcoal hover:bg-black text-white px-7 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-lg flex items-center gap-2 group"
            >
              <Camera className="w-5 h-5" />
              <span>Scan My Meal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="hidden lg:block absolute -right-6 -bottom-6 w-80 h-80 bg-gradient-to-tl from-saffron/10 to-terracotta/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Pipeline Feature Cards */}
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-6">Core Computer Vision Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-accentBorder card-shadow card-hover">
            <div className="w-12 h-12 bg-amber-100 text-saffron rounded-xl flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Mask R-CNN Segmentation</h3>
            <p className="text-sm text-subtleGrey leading-relaxed">
              Backbone ResNet-50 FPN + Region Proposal Network isolates exact pixel-level masks for every detected food item on the thali plate.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-accentBorder card-shadow card-hover">
            <div className="w-12 h-12 bg-orange-100 text-terracotta rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Visual Surface Extraction</h3>
            <p className="text-sm text-subtleGrey leading-relaxed">
              Isolates food pixels to quantify visible surface oiliness (specular reflection), browning ratios, and moisture/gravy appearance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-accentBorder card-shadow card-hover">
            <div className="w-12 h-12 bg-emerald-100 text-sage rounded-xl flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Preparation Inference</h3>
            <p className="text-sm text-subtleGrey leading-relaxed">
              Probabilistically infers likely preparations (Pan-fried vs Boiled vs Gravy Curry) to adjust standard Indian nutrition estimates.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
