import { ArrowRight, Palette } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="BM TECH SOLUTIONS Logo" 
                className="h-24 w-auto"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full">
                <Palette className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              BM TECH SOLUTIONS
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional graphics design and tech solutions specializing in branding, print design, digital solutions, and software & hardware installations.
            Let's create something extraordinary together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              View Portfolio
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
