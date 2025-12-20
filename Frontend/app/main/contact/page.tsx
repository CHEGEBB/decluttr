'use client';

import { Navbar } from '@/components/marketplace/Navbar';
import Footer from '@/components/footer';
import { 
  ContactHero,
  ContactInfo,
  ContactForm,
  FAQSection,
  MapSection
} from '@/components/contact';
import { InfiniteMarquee } from '@/components/marketplace/InfiniteMarquee';

export default function ContactPage() {

  const handleSell = () => {
    window.location.href = '/main/profile';
  }

  const handleBrowse = () => {
    window.location.href = '/main/marketplace';
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
              <InfiniteMarquee />

      <Navbar onSearch={() => {}} />
      
      {/* Contact Hero Section */}
      <ContactHero />
      
      {/* Contact Information */}
      <ContactInfo />
      
      {/* Contact Form */}
      <ContactForm />
      
      {/* FAQ Section */}
      <FAQSection />
      
     
      
      {/* CTA Banner */}
      <div className="py-12 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Ready to Declutter Your Life?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of Kenyans who are buying, selling, and donating pre-loved items
              to create a more sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl cursor-pointer hover:bg-emerald-400 hover:text-white transition-all" onClick={handleSell}>
                Start Selling Now
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white cursor-pointer font-bold rounded-xl hover:bg-red-400 transition-all" onClick={handleBrowse}>
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}