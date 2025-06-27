"use client";

import Navbar from "../navbar/navbar";
import { useAppContext } from '../context/useAppContext';

export default function Home() {
  const { 
    setShowAuthModal,
  } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-blue-800 mb-6">
              Streamline Your Feedback Process
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              A seamless platform for employees and managers to exchange constructive feedback,
              fostering growth and organizational excellence.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
              >
                Submit Feedback
              </button>
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Our Feedback System?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="text-blue-600 text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold mb-3">Continuous Improvement</h3>
                <p className="text-gray-600">
                  Regular, structured feedback cycles between employees and managers to drive
                  professional growth.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="text-blue-600 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Two-Way Communication</h3>
                <p className="text-gray-600">
                  Encourages open dialogue with features for both upward and downward feedback.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="text-blue-600 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
                <p className="text-gray-600">
                  Analytics and tracking to identify trends and measure progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Simple and Effective Process
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-3">
                  1
                </div>
                <h3 className="font-semibold">Submit Feedback</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Managers initiate feedback
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-3">
                  2
                </div>
                <h3 className="font-semibold">Review</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recipient acknowledges and reviews
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-3">
                  3
                </div>
                <h3 className="font-semibold">Discussion</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Schedule follow-up meetings if needed
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-3">
                  4
                </div>
                <h3 className="font-semibold">Action Plan</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Create measurable improvement goals
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="text-yellow-400 text-4xl mb-4">★ ★ ★ ★ ★</div>
            <blockquote className="text-xl italic text-gray-700 mb-6">
              &quot;This system has transformed how we handle feedback in our organization. What used to
              be an annual stressful event is now an ongoing, constructive conversation.&quot;
            </blockquote>
            <div className="font-semibold text-gray-800">Sarah Johnson, HR Director</div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Feedback Culture?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of organizations fostering growth through continuous feedback.
            </p>
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
            >
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col justify-center bg-gray-800 text-white py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">Feedback Central © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}