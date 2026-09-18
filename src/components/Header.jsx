import React from 'react';
import { Utensils, History, BarChart2, Camera, ShieldCheck } from 'lucide-react';

export default function Header({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Utensils },
    { id: 'upload', label: 'Scan Meal', icon: Camera },
    { id: 'history', label: 'Meal History', icon: History },
    { id: 'evaluation', label: 'Mask R-CNN Evaluation', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-accentBorder">
      <div className="max-w-7xl mx-mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-saffron flex items-center justify-center text-white shadow-md">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-charcoal tracking-tight">DesiPlate AI</span>
                <span className="bg-sageLight text-sage text-xs font-semibold px-2 py-0.5 rounded-full border border-sage/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Mask R-CNN
                </span>
              </div>
              <p className="text-xs text-subtleGrey">Preparation-Aware Indian Meal Analysis</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-charcoal text-white shadow-sm'
                      : 'text-subtleGrey hover:text-charcoal hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
}
