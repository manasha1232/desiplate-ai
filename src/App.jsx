import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import Results from './pages/Results';
import History from './pages/History';
import Evaluation from './pages/Evaluation';
import { analyzeMeal } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [pendingTask, setPendingTask] = useState(null);

  const handleStartAnalysis = ({ file, sampleFilename }) => {
    // Set up task promise for Processing page
    const task = () => analyzeMeal(file, sampleFilename);
    setPendingTask(() => task);
    setCurrentTab('processing');
  };

  const handleAnalysisComplete = (resultData) => {
    setAnalysisResult(resultData);
    setCurrentTab('results');
  };

  return (
    <div className="flex flex-col min-h-screen bg-bgLight">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <Home onScanClick={() => setCurrentTab('upload')} />
        )}

        {currentTab === 'upload' && (
          <Upload onStartAnalysis={handleStartAnalysis} />
        )}

        {currentTab === 'processing' && (
          <Processing
            analysisTask={pendingTask}
            onComplete={handleAnalysisComplete}
          />
        )}

        {currentTab === 'results' && (
          <Results
            data={analysisResult}
            onNewScan={() => setCurrentTab('upload')}
          />
        )}

        {currentTab === 'history' && (
          <History />
        )}

        {currentTab === 'evaluation' && (
          <Evaluation />
        )}
      </main>

      <Footer />
    </div>
  );
}
