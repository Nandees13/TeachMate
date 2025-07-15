
import React, { useState, useCallback } from 'react';
import { generateQA } from '../services/geminiService';
import type { QAResponse } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

const QAGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qaResponse, setQaResponse] = useState<QAResponse | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setLoading(true);
    setError(null);
    setQaResponse(null);
    try {
      const response = await generateQA(topic);
      setQaResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  return (
    <div className="p-8 space-y-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Q&A Generator</h2>
        <p className="text-gray-500 mb-6">Enter a topic and generate short answer and multiple-choice questions instantly.</p>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, DBMS Joins, The French Revolution"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors duration-200 h-[50px] w-[150px]"
          >
            {loading ? <Spinner /> : 'Generate'}
          </button>
        </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
      </div>
      
      {qaResponse && (
        <div className="max-w-3xl mx-auto space-y-8 mt-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Short Answer Questions</h3>
            <ul className="space-y-4 list-decimal list-inside">
              {qaResponse.shortAnswerQuestions.map((q, index) => (
                <li key={index} className="text-gray-800">{q.question}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Multiple Choice Questions</h3>
            <div className="space-y-6">
              {qaResponse.multipleChoiceQuestions.map((mcq, index) => (
                <div key={index} className="border-t border-gray-200 pt-4">
                  <p className="font-medium text-gray-800 mb-2">{index + 1}. {mcq.question}</p>
                  <div className="space-y-2 pl-4">
                    {mcq.options.map((option, optIndex) => (
                      <div key={optIndex} className={`p-2 rounded-md ${option === mcq.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-gray-50'}`}>
                        <span className="font-mono mr-2">{String.fromCharCode(65 + optIndex)}.</span>{option}
                      </div>
                    ))}
                  </div>
                   <p className="text-sm text-green-700 font-semibold mt-2 pl-4">Correct Answer: {mcq.correctAnswer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QAGenerator;
