
import React, { useState, useCallback } from 'react';
import { explainConcept } from '../services/geminiService';
import { LANGUAGES } from '../constants';
import Card from './common/Card';
import Spinner from './common/Spinner';

const ConceptExplainer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Please enter a concept to explain.');
      return;
    }
    setLoading(true);
    setError(null);
    setExplanation(null);
    try {
      const response = await explainConcept(topic, language);
      setExplanation(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [topic, language]);

  return (
    <div className="p-8 space-y-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Concept Explainer</h2>
        <p className="text-gray-500 mb-6">Get simple, clear explanations for complex topics in various languages.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Explain 'Quantum Computing' in simple terms"
            className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            disabled={loading}
          />
           <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
        </div>
        <div className="flex justify-end">
             <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors duration-200 h-[50px] w-full md:w-auto"
              >
                {loading ? <Spinner /> : 'Explain'}
              </button>
        </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mt-4">{error}</div>}
      </div>
      
      {explanation && (
        <div className="max-w-3xl mx-auto mt-8">
            <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Explanation</h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{explanation}</p>
            </Card>
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
