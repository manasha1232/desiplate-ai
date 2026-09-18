import React, { useState } from 'react';
import FoodCard from '../components/FoodCard';
import PrepCard from '../components/PrepCard';
import NutritionChart from '../components/NutritionChart';
import { Layers, Flame, Activity, FileText, Info, RefreshCw } from 'lucide-react';

export default function Results({ data, onNewScan }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'prep', 'nutrition'

  if (!data) return null;

  return (
    <div className="space-y-8 py-4">
      
      {/* Top Header & New Scan CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-accentBorder card-shadow">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal">Meal Analysis Dashboard</h2>
          <p className="text-sm text-subtleGrey">Analyzed on {data.timestamp}</p>
        </div>

        <button
          onClick={onNewScan}
          className="bg-bgLight hover:bg-gray-200 text-charcoal px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border border-gray-300 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Scan Another Meal</span>
        </button>
      </div>

      {/* Main Grid: Mask R-CNN Image Canvas + Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mask R-CNN Instance Segmentation Overlay Image */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-accentBorder card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <Layers className="w-5 h-5 text-terracotta" /> Mask R-CNN Instance Segmentation
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              {data.foods.length} Items Detected
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black/5 flex justify-center border border-gray-200">
            <img
              src={data.segmented_image_url}
              alt="Mask R-CNN Segmented Meal"
              className="max-h-[460px] w-full object-contain rounded-2xl"
            />
          </div>

          {/* Mask Legend explanation */}
          <div className="text-xs text-subtleGrey flex flex-wrap gap-3 pt-1">
            <span className="font-semibold text-charcoal">Instance Masks:</span>
            {data.foods.map((food, idx) => (
              <span key={idx} className="flex items-center gap-1 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta"></span>
                {food.name}
              </span>
            ))}
          </div>
        </div>

        {/* Meal Observations Summary Panel */}
        <div className="bg-white p-6 rounded-3xl border border-accentBorder card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-saffron" /> Meal Observations
            </h3>

            <div className="space-y-3">
              {data.meal_observations.map((obs, i) => (
                <div key={i} className="p-3.5 bg-orange-50/60 border border-orange-100 rounded-2xl text-xs sm:text-sm text-charcoal leading-relaxed font-medium">
                  • {obs}
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Disclaimer Note */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <span>{data.scientific_disclaimer}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Navigation for Detailed Sections */}
      <div className="flex border-b border-gray-200 space-x-6 pt-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-base font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'overview' ? 'border-terracotta text-terracotta' : 'border-transparent text-subtleGrey hover:text-charcoal'
          }`}
        >
          <Layers className="w-4 h-4" /> Detected Foods ({data.foods.length})
        </button>
        <button
          onClick={() => setActiveTab('prep')}
          className={`pb-3 text-base font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'prep' ? 'border-terracotta text-terracotta' : 'border-transparent text-subtleGrey hover:text-charcoal'
          }`}
        >
          <Flame className="w-4 h-4" /> Preparation Profile
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`pb-3 text-base font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'nutrition' ? 'border-terracotta text-terracotta' : 'border-transparent text-subtleGrey hover:text-charcoal'
          }`}
        >
          <Activity className="w-4 h-4" /> Nutritional Estimation
        </button>
      </div>

      {/* Tab Content 1: Detected Food Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.foods.map((food, idx) => (
            <FoodCard key={idx} item={food} />
          ))}
        </div>
      )}

      {/* Tab Content 2: Preparation Profile Cards */}
      {activeTab === 'prep' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.foods.map((food, idx) => (
            <PrepCard key={idx} item={food} />
          ))}
        </div>
      )}

      {/* Tab Content 3: Nutrition Chart & Summary */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          <NutritionChart totalNutrition={data.total_nutrition} />
        </div>
      )}

    </div>
  );
}
