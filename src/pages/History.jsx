import React, { useEffect, useState } from 'react';
import { getMealHistory, getMealStats, getMealDetails } from '../services/api';
import { History as HistoryIcon, Flame, Activity, Calendar, Eye, RefreshCw } from 'lucide-react';
import Results from './Results';

export default function History() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([getMealHistory(), getMealStats()])
      .then(([historyData, statsData]) => {
        setHistory(historyData);
        setStats(statsData);
      })
      .catch((err) => console.error("Error loading history:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewMeal = (mealId) => {
    getMealDetails(mealId).then((details) => {
      setSelectedMeal(details);
    }).catch(err => console.error(err));
  };

  if (selectedMeal) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedMeal(null)}
          className="text-sm font-bold text-terracotta hover:underline mb-2 inline-flex items-center gap-1"
        >
          ← Back to Meal History List
        </button>
        <Results data={selectedMeal} onNewScan={() => setSelectedMeal(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-accentBorder card-shadow">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal">Meal History & Analytics</h2>
          <p className="text-sm text-subtleGrey mt-1">Review past analyzed Indian meals and historical nutritional averages.</p>
        </div>
        <button
          onClick={loadData}
          className="bg-bgLight hover:bg-gray-200 text-charcoal p-3 rounded-xl border border-gray-300 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Aggregate Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-accentBorder card-shadow text-center">
            <div className="text-xs uppercase tracking-wider text-subtleGrey font-semibold">Total Scanned Meals</div>
            <div className="text-3xl font-extrabold text-charcoal mt-1">{stats.total_meals}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-accentBorder card-shadow text-center">
            <div className="text-xs uppercase tracking-wider text-subtleGrey font-semibold">Avg Estimated Calories</div>
            <div className="text-3xl font-extrabold text-terracotta mt-1">{stats.avg_calories} <span className="text-sm">kcal</span></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-accentBorder card-shadow text-center">
            <div className="text-xs uppercase tracking-wider text-subtleGrey font-semibold">Avg Daily Protein</div>
            <div className="text-3xl font-extrabold text-sage mt-1">{stats.avg_protein} <span className="text-sm">g</span></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-accentBorder card-shadow text-center">
            <div className="text-xs uppercase tracking-wider text-subtleGrey font-semibold">Avg Daily Carbs</div>
            <div className="text-3xl font-extrabold text-saffron mt-1">{stats.avg_carbs} <span className="text-sm">g</span></div>
          </div>
        </div>
      )}

      {/* History Meal Cards List */}
      <div>
        <h3 className="text-lg font-bold text-charcoal mb-4">Recent Meal Analyses</h3>

        {loading ? (
          <div className="text-center py-12 text-subtleGrey">Loading meal history...</div>
        ) : history.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-accentBorder">
            <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-charcoal">No Meal History Found</h4>
            <p className="text-sm text-subtleGrey mt-1">Scan a meal using Mask R-CNN to start building your meal history log.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-2xl p-5 border border-accentBorder card-shadow card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden mb-3 h-40 bg-black/5">
                    <img
                      src={meal.segmented_image_url || meal.image_url}
                      alt="Segmented Meal"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center text-xs text-subtleGrey gap-1 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(meal.timestamp).toLocaleString()}</span>
                  </div>

                  <h4 className="text-base font-bold text-charcoal mb-2 truncate">
                    {meal.detected_foods.join(', ') || 'Indian Meal'}
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-bgLight p-2.5 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-subtleGrey block text-[10px]">Calories</span>
                      <span className="font-bold text-terracotta">{meal.total_calories} kcal</span>
                    </div>
                    <div>
                      <span className="text-subtleGrey block text-[10px]">Protein</span>
                      <span className="font-bold text-sage">{meal.total_protein}g</span>
                    </div>
                    <div>
                      <span className="text-subtleGrey block text-[10px]">Carbs</span>
                      <span className="font-bold text-saffron">{meal.total_carbs}g</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewMeal(meal.id)}
                  className="mt-4 w-full bg-charcoal hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> View Full Analysis
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
