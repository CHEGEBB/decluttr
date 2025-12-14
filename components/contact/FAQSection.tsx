'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, ShoppingBag, CreditCard, Truck, Shield, RefreshCw, User, PhoneCall, Mail } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      icon: ShoppingBag,
      title: 'Buying & Selling',
      color: 'from-red-500 to-orange-500',
      items: [
        {
          question: 'How do I buy items on Decluttr?',
          answer: 'Browse products, add to cart, and checkout securely. You can pay via M-Pesa, credit card, or other supported methods. All transactions are protected by our buyer guarantee.'
        },
        {
          question: 'How do I list an item for sale?',
          answer: 'Click "Sell Item" on the navbar, upload photos, add details, set price, and publish. Your item will be live within minutes after verification.'
        },
        {
          question: 'Are there any fees for selling?',
          answer: 'We charge a small commission only when your item sells successfully. Listing items is completely free with no hidden costs.'
        },
        {
          question: 'How do I price my items?',
          answer: 'Check similar items on our platform, consider condition, age, and market demand. We also provide pricing suggestions based on market data.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payments & Transactions',
      color: 'from-green-500 to-emerald-500',
      items: [
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
          question: 'Can I get a refund?',
          answer: 'Yes, we offer 14-day returns for items that don\'t match the description or are damaged. Refunds are processed within 3-5 business days.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      color: 'from-blue-500 to-cyan-500',
      items: [
        {
          question: 'How does shipping work?',
          answer: 'Sellers can choose to ship via our partner couriers or arrange local pickup. Shipping costs vary by size and location.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Many sellers offer free shipping for orders over KSh 5,000. Look for the "Free Shipping" badge on product listings.'
        },
        {
          question: 'How long does delivery take?',
          answer: 'Nairobi deliveries: 1-2 days. Other major cities: 2-4 days. Rural areas: 3-7 days. You can track your order in real-time.'
        },
        {
          question: 'Can I pick up items locally?',
          answer: 'Yes! Many sellers offer local pickup. Use the filter option to find items available for pickup in your area.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          question: 'How do you verify sellers?',
          answer: 'All sellers undergo ID verification, phone verification, and we monitor their activity and ratings continuously.'
        },
        {
          question: 'What if an item is not as described?',
          answer: 'Contact us immediately. We offer buyer protection and will mediate disputes to ensure fair resolution.'
        },
        {
          question: 'Are my personal details safe?',
          answer: 'We never share your contact information without consent. Communication happens through our secure messaging system.'
        },
        {
          question: 'How do I report suspicious activity?',
          answer: 'Use the "Report" button on any listing or profile, or contact our support team directly.'
        }
      ]
    }
  ];

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about buying, selling, and donating on Decluttr.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {faqCategories.slice(0, 2).map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className={`bg-gradient-to-r ${category.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{category.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-4 last:mb-0">
                        <button
                          onClick={() => toggleFAQ(categoryIndex * 4 + itemIndex)}
                          className="flex items-center justify-between w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="font-medium text-gray-900">{item.question}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === categoryIndex * 4 + itemIndex ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${openIndex === categoryIndex * 4 + itemIndex ? 'max-h-48 mt-3' : 'max-h-0'}`}
                        >
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-gray-700">{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {faqCategories.slice(2).map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className={`bg-gradient-to-r ${category.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{category.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-4 last:mb-0">
                        <button
                          onClick={() => toggleFAQ((categoryIndex + 2) * 4 + itemIndex)}
                          className="flex items-center justify-between w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="font-medium text-gray-900">{item.question}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === (categoryIndex + 2) * 4 + itemIndex ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${openIndex === (categoryIndex + 2) * 4 + itemIndex ? 'max-h-48 mt-3' : 'max-h-0'}`}
                        >
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-gray-700">{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Support Card */}
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Still Need Help?</h3>
                  <p className="text-gray-300 text-sm">Our support team is ready to assist you</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>+254 712 345 678</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@decluttr.co.ke</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all">
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;