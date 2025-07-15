
import React, { useState, useCallback } from 'react';
import { generateNotes } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';

// For a better user experience, install react-markdown and remark-gfm:
// npm install react-markdown remark-gfm
// Then, uncomment the following lines and replace the <pre> tag with <ReactMarkdown>.
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

const NoteGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Please enter a topic or keywords.');
      return;
    }
    setLoading(true);
    setError(null);
    setNotes(null);
    try {
      const response = await generateNotes(topic);
      setNotes(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  return (
    <div className="p-8 space-y-6">
       <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lecture Note Generator</h2>
        <p className="text-gray-500 mb-6">Provide keywords or a topic outline to generate structured lecture notes.</p>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Key principles of microeconomics, History of AI"
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
      
      {notes && (
        <div className="max-w-4xl mx-auto mt-8">
            <Card className="prose prose-lg max-w-none prose-h1:text-primary-700 prose-h2:text-primary-600 prose-strong:text-gray-800 prose-a:text-primary-600 hover:prose-a:text-primary-800">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Generated Lecture Notes</h3>
                {/* For a better UX, replace this <pre> tag with a Markdown renderer */}
                <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{notes}</pre>
                {/* 
                Example with react-markdown:
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {notes}
                </ReactMarkdown> 
                */}
            </Card>
        </div>
      )}
    </div>
  );
};

export default NoteGenerator;
