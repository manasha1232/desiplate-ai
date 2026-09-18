import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function NutritionChart({ totalNutrition }) {
  const data = [
    { name: 'Protein (g)', value: totalNutrition.protein, color: '#10B981' },
    { name: 'Carbohydrates (g)', value: totalNutrition.carbohydrates, color: '#D97706' },
    { name: 'Fat (g)', value: totalNutrition.fat, color: '#2563EB' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-accentBorder card-shadow">
      <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center justify-between">
        <span>Macronutrient Composition</span>
        <span className="text-2xl font-extrabold text-terracotta">{totalNutrition.calories} kcal</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Recharts Pie Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Grams */}
        <div className="space-y-4">
          {data.map((macro) => (
            <div key={macro.name} className="flex items-center justify-between p-3 rounded-xl bg-bgLight">
              <div className="flex items-center space-x-3">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: macro.color }}></div>
                <span className="text-sm font-medium text-charcoal">{macro.name}</span>
              </div>
              <span className="text-base font-bold text-charcoal">{macro.value} g</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
