'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, Mail, MessageCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I buy items on Decluttr?',
      answer: 'Browse products, add to cart, and checkout securely. You can pay via M-Pesa, credit card, or other supported methods. All transactions are protected by our buyer guarantee.'
    },
    {
      question: 'How do I list an item for sale?',
      answer: 'Click "Sell Item" on the navbar, upload photos, add details, set price, and publish. Your item will be live within minutes after verification.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, credit/debit cards (Visa, MasterCard), bank transfers, and mobile wallets. All payments are processed securely.'
    },
    {
      question: 'Is it safe to pay on Decluttr?',
      answer: 'Yes! We use bank-level encryption and secure payment gateways. Your financial information is never shared with sellers.'
    },
    {
      question: 'When do sellers receive payment?',
      answer: 'Sellers receive payment 24 hours after confirmed delivery to ensure buyer satisfaction with the item.'
    },
    {
      question: 'How does shipping work?',
      answer: 'Sellers can choose to ship via our partner couriers or arrange local pickup. Shipping costs vary by size and location.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Nairobi deliveries: 1-2 days. Other major cities: 2-4 days. Rural areas: 3-7 days. You can track your order in real-time.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer 14-day returns for items that don\'t match the description or are damaged. Refunds are processed within 3-5 business days.'
    },
    {
      question: 'How do you verify sellers?',
      answer: 'All sellers undergo ID verification, phone verification, and we monitor their activity and ratings continuously.'
    },
    {
      question: 'What if an item is not as described?',
      answer: 'Contact us immediately. We offer buyer protection and will mediate disputes to ensure fair resolution.'
    },
    {
      question: 'Are there any fees for selling?',
      answer: 'We charge a small commission only when your item sells successfully. Listing items is completely free with no hidden costs.'
    },
    {
      question: 'Can I pick up items locally?',
      answer: 'Yes! Many sellers offer local pickup. Use the filter option to find items available for pickup in your area.'
    }
  ];

  return (
    <div className="py-16 md:py-24 bg-gary-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked <span className="text-red-600">Questions</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about buying and selling on Decluttr
          </p>
        </div>
        
        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-center justify-between w-full text-left py-5 group"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8 group-hover:text-red-600 transition-colors">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  openIndex === index 
                    ? 'bg-red-600 rotate-180' 
                    : 'bg-gray-100 group-hover:bg-red-50'
                }`}>
                  <ChevronDown 
                    className={`w-5 h-5 transition-colors ${
                      openIndex === index 
                        ? 'text-white' 
                        : 'text-gray-600 group-hover:text-red-600'
                    }`}
                  />
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 md:p-10 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-300 text-lg">
              Our support team is here to help you 24/7
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div className="text-sm text-gray-300 mb-1">Call Us</div>
              <div className="font-semibold">+254 712 345 678</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-7 h-7" />
              </div>
              <div className="text-sm text-gray-300 mb-1">Email Us</div>
              <div className="font-semibold">support@decluttr.co.ke</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div className="text-sm text-gray-300 mb-1">Live Chat</div>
              <button className="font-semibold hover:text-red-400 transition-colors">
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;