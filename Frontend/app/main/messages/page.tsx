'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, ExternalLink } from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Chat via WhatsApp
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg mb-6">
            We've upgraded! Now you can message sellers directly through WhatsApp for faster, more convenient communication.
          </p>

          {/* How it works */}
          <div className="bg-green-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              How it works:
            </h3>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">1.</span>
                <span>Browse products in the marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">2.</span>
                <span>Click the "WhatsApp" button on any product</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">3.</span>
                <span>Chat directly with the seller on WhatsApp</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/main/marketplace')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2"
            >
              Browse Products
              <ExternalLink className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/main/profile')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-red-600 hover:text-red-600 transition-all"
            >
              Go to Profile
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Why WhatsApp?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="font-semibold text-gray-900">Instant Messaging</span>
                <span className="text-gray-600">Real-time conversations</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔔</span>
                </div>
                <span className="font-semibold text-gray-900">Push Notifications</span>
                <span className="text-gray-600">Never miss a message</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <span className="font-semibold text-gray-900">Mobile Friendly</span>
                <span className="text-gray-600">Chat on the go</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}