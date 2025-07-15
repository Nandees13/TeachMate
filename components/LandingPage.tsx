
import React from 'react';
import { APP_TITLE } from '../constants';
import { BrainCircuitIcon, GoogleIcon, LightbulbIcon, NoteIcon, QAPlusIcon } from './Icons';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="bg-white text-gray-800">
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BrainCircuitIcon className="w-8 h-8 text-primary-600 mr-2" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </div>
          <button
            onClick={onLogin}
            className="hidden sm:flex items-center justify-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gray-50 min-h-screen flex items-center justify-center text-center p-8 overflow-hidden">
             <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_10%,transparent)]"></div>
            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    <span className="text-primary-600">{APP_TITLE}</span> – Your AI Assistant for Smarter Teaching
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
                    Streamline your academic workflow. Instantly generate Q&As, create lecture notes, and explain complex topics with the power of Google's Gemini API.
                </p>
                <button
                    onClick={onLogin}
                    className="flex items-center justify-center mx-auto bg-primary-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-700 transition-transform transform hover:scale-105 duration-300 shadow-lg"
                >
                    <GoogleIcon className="w-6 h-6 mr-3" />
                    Login with Google to Get Started
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2">Empowering Educators with AI</h2>
            <p className="text-gray-500 mb-12 max-w-2xl mx-auto">Save time on preparation and focus on what matters most: teaching.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <QAPlusIcon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Q&A Generator</h3>
                <p className="text-gray-600">Instantly create short answer and multiple-choice questions from any topic, ready for assessments.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <NoteIcon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lecture Note Generator</h3>
                <p className="text-gray-600">Turn simple keywords or outlines into structured, comprehensive lecture notes with headings and examples.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <LightbulbIcon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Concept Explainer</h3>
                <p className="text-gray-600">Simplify complex ideas for diverse learners. Get clear, concise explanations in multiple languages.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 px-4 bg-primary-50">
             <div className="container mx-auto max-w-3xl text-center">
                <p className="text-2xl font-medium text-gray-800">"TeachMate has revolutionized my course preparation. I'm saving at least 5 hours a week on content creation, and my students are more engaged than ever."</p>
                <p className="mt-4 text-lg font-semibold text-primary-700">- A Professor from a Leading University</p>
            </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-1">Powered by Google Technologies</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
