import React, { useState, useEffect } from 'react';
import { Upload as UploadIcon, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { getSampleImages } from '../services/api';

export default function Upload({ onStartAnalysis }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    getSampleImages().then((data) => {
      setSamples(data);
      // Pre-select first sample for instant testing
      if (data && data.length > 0) {
        setSelectedSample(data[0].filename);
        setPreviewUrl(data[0].url);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedSample(null);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSampleSelect = (sample) => {
    setSelectedFile(null);
    setSelectedSample(sample.filename);
    setPreviewUrl(sample.url);
  };

  const handleSubmit = () => {
    if (selectedFile || selectedSample) {
      onStartAnalysis({ file: selectedFile, sampleFilename: selectedSample, previewUrl });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-charcoal">Choose or Take a Photo of Your Meal</h2>
        <p className="text-subtleGrey mt-2">
          Upload an image of an Indian thali or dish, or pick from pre-loaded sample meal cards below.
        </p>
      </div>

      {/* Pre-loaded Sample Meal Selection Grid */}
      {samples.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-accentBorder card-shadow">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Try 1-Click Sample Indian Meals</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {samples.map((sample) => {
              const isSelected = selectedSample === sample.filename;
              return (
                <div
                  key={sample.filename}
                  onClick={() => handleSampleSelect(sample)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    isSelected ? 'border-terracotta ring-4 ring-terracotta/20 scale-[1.02]' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={sample.url} alt={sample.title} className="w-full h-28 object-cover" />
                  <div className="p-2 bg-white text-center">
                    <span className="text-xs font-semibold text-charcoal block truncate">{sample.title}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-terracotta text-white rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Upload Dropzone */}
      <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-accentBorder hover:border-terracotta transition-colors text-center relative card-shadow">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 bg-orange-50 text-terracotta rounded-2xl flex items-center justify-center">
            <UploadIcon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-base font-bold text-charcoal">Click to upload custom image</span>
            <span className="text-sm text-subtleGrey block">PNG, JPG, or JPEG (Max 10MB)</span>
          </div>
        </div>
      </div>

      {/* Selected Image Preview */}
      {previewUrl && (
        <div className="bg-white p-6 rounded-3xl border border-accentBorder card-shadow space-y-4">
          <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-terracotta" /> Image Preview
          </h3>
          <div className="relative rounded-2xl overflow-hidden max-h-96 bg-black/5 flex justify-center">
            <img src={previewUrl} alt="Meal preview" className="max-h-96 object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* Analyze CTA */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleSubmit}
          disabled={!previewUrl}
          className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center gap-3 ${
            previewUrl
              ? 'bg-gradient-to-r from-terracotta to-saffron text-white hover:opacity-95 hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-6 h-6" />
          <span>Analyze Meal</span>
        </button>
      </div>

    </div>
  );
}
