import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images from public folder
  const backgroundImages = [
    '/images/Gemini_Generated_Image_8ycvin8ycvin8ycv.png',
    '/images/Gemini_Generated_Image_by24xsby24xsby24.png',
    '/images/Gemini_Generated_Image_e49weue49weue49w.png',
    '/images/Gemini_Generated_Image_fpfkt1fpfkt1fpfk.png'
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Simple slideshow effect
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 animate-fade-in-down">
          <Store className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold tracking-wider">Rately</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/80 to-gray-900 z-10" />
            <img 
              src={img} 
              alt="Background" 
              className="w-full h-full object-cover transform scale-105 animate-slow-zoom" 
            />
          </div>
        ))}

        <div className="relative z-20 container mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
                Discover & Rate
              </span>
              <br />
              The Best Local Stores
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Your voice matters. Join our community to share your shopping experiences, 
              find hidden gems, and help businesses grow through honest feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                >
                  <span className="relative z-10 flex items-center">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register"
                    className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <Link 
                    to="/login"
                    className="px-8 py-4 rounded-full border border-gray-500 hover:border-white hover:bg-white/5 transition-all duration-300 text-lg font-medium backdrop-blur-sm"
                  >
                    Existing User?
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-1 h-16 rounded-full bg-gradient-to-b from-yellow-400 to-transparent opacity-50"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Star className="w-10 h-10 text-yellow-400" />}
              title="Honest Ratings"
              description="Read and write authentic reviews. Our platform ensures transparency in every rating shared."
              delay="0"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-10 h-10 text-blue-400" />}
              title="Track Performance"
              description="Store owners can visualize their performance trends and understand customer satisfaction better."
              delay="200"
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-green-400" />}
              title="Verified Users"
              description="Join a trusted community where quality feedback is prioritized over quantity."
              delay="400"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-50" />
        <img 
          src="/images/Gemini_Generated_Image_jxbvimjxbvimjxbv.png" 
          alt="CTA Background" 
          className="absolute inset-0 w-full h-full object-cover object-top opacity-20 mix-blend-overlay"
        />
        
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Make an Impact?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already shaping the future of local commerce. 
            Your opinion has the power to improve services around you.
          </p>
          <Link 
            to="/register"
            className="inline-block px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full font-bold text-xl text-gray-900 shadow-xl hover:scale-105 hover:shadow-orange-500/50 transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Store className="w-6 h-6 text-gray-400" />
              <span className="text-xl font-bold text-gray-300">Rately</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 Rately Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate;
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <div 
    className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300 hover:-translate-y-2 group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mb-6 p-4 bg-gray-900 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/50">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default Landing;