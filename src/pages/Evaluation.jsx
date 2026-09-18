import React, { useEffect, useState } from 'react';
import { getEvaluationData } from '../services/api';
import { BarChart2, ShieldCheck, AlertTriangle, Play, RefreshCw, Zap } from 'lucide-react';

export default function Evaluation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const runEval = () => {
    setLoading(true);
    getEvaluationData()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    runEval();
  }, []);

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-accentBorder card-shadow">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-1 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Pure Mask R-CNN Evaluation Suite
          </div>
          <h2 className="text-2xl font-extrabold text-charcoal">Model Evaluation & Error Analysis</h2>
          <p className="text-sm text-subtleGrey mt-0.5">Empirical evaluation metrics on held-out annotated Indian meal test set.</p>
        </div>

        <button
          onClick={runEval}
          disabled={loading}
          className="bg-charcoal hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{loading ? 'Evaluating...' : 'Run Evaluation Suite'}</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-accentBorder text-subtleGrey">
          Running Mask R-CNN inference over held-out test dataset and computing mAP@50 and Mask IoU metrics...
        </div>
      ) : data ? (
        <>
          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            <div className="bg-white p-4 rounded-2xl border border-accentBorder card-shadow text-center">
              <div className="text-[11px] uppercase tracking-wider text-subtleGrey font-semibold">mAP @ 50</div>
              <div className="text-2xl font-extrabold text-terracotta mt-1">{data.mAP50}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-accentBorder card-shadow text-center">
              <div className="text-[11px] uppercase tracking-wider text-subtleGrey font-semibold">mAP @ 50:95</div>
              <div className="text-2xl font-extrabold text-saffron mt-1">{data.mAP50_95}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-accentBorder card-shadow text-center">
              <div className="text-[11px] uppercase tracking-wider text-subtleGrey font-semibold">Mask IoU</div>
              <div className="text-2xl font-extrabold text-sage mt-1">{data.mask_iou}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-accentBorder card-shadow text-center">
              <div className="text-[11px] uppercase tracking-wider text-subtleGrey font-semibold">Dice Score</div>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">{data.dice_score}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-accentBorder card-shadow text-center">
              <div className="text-[11px] uppercase tracking-wider text-subtleGrey font-semibold">Precision</div>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">{data.precision}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-accentBorder card-shadow text-center">
              <div className="text-[11px] uppercase tracking-wider text-subtleGrey font-semibold">FPS (Speed)</div>
              <div className="text-2xl font-extrabold text-charcoal mt-1 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" /> {data.fps}
              </div>
            </div>

          </div>

          {/* Visual Evaluation Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-white p-6 rounded-3xl border border-accentBorder card-shadow space-y-3">
              <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-terracotta" /> Confusion Matrix
              </h3>
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-black/5 flex justify-center">
                <img src={data.confusion_matrix_plot_url} alt="Confusion Matrix" className="w-full object-contain" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-accentBorder card-shadow space-y-3">
              <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-sage" /> Metrics Summary Chart
              </h3>
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-black/5 flex justify-center">
                <img src={data.summary_plot_url} alt="Metrics Summary Chart" className="w-full object-contain" />
              </div>
            </div>

          </div>

          {/* Documented Error Analysis & Failure Cases */}
          <div className="bg-white p-8 rounded-3xl border border-accentBorder card-shadow space-y-6">
            <h3 className="text-xl font-extrabold text-charcoal flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-saffron" /> Documented Failure Cases & Scientific Limitations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.failure_cases.map((fc) => (
                <div key={fc.id} className="bg-red-50/50 border border-red-100 p-5 rounded-2xl space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-700">Failure Case #{fc.id}</div>
                  <h4 className="text-base font-bold text-charcoal">{fc.title}</h4>
                  <p className="text-xs text-subtleGrey"><strong>Root Cause:</strong> {fc.cause}</p>
                  <p className="text-xs text-subtleGrey"><strong>Model Impact:</strong> {fc.impact}</p>
                  <div className="pt-2 border-t border-red-200 text-xs text-emerald-800 font-medium">
                    💡 <strong>Mitigation:</strong> {fc.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

    </div>
  );
}
