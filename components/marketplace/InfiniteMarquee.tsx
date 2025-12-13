// components/marketplace/InfiniteMarquee.tsx
'use client';

export function InfiniteMarquee() {
  const announcements = [
    "🎉 NEW: Sustainable shopping made easy",
    "📦 Free delivery for orders over KSh 5000", 
    "♻️ Join our decluttering community today",
    "🔥 LIMITED TIME: Fashion sale you can't resist",
    "🆕 New customers save 10% with code: ENTRY07",
    "🚚 FREE SHIPPING AND RETURNS",
    "⭐ Get 10% OFF on selected items"
  ];

  return (
    <div className="bg-red-600 text-white text-xs py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {announcements.map((text, index) => (
          <span key={index} className="mx-8">
            {text}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {announcements.map((text, index) => (
          <span key={`dup-${index}`} className="mx-8">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}