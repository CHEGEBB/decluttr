/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { 
  Smartphone, 
  Shirt, 
  Footprints, 
  Sofa, 
  BookOpen, 
  Glasses 
} from 'lucide-react';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  category: string;
  products: any[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: any) => void;
  icon: any;
}

const CategorySection = ({ category, products, favorites, onToggleFavorite, onAddToCart, icon: Icon }: CategorySectionProps) => {
  const categoryTitles: Record<string, string> = {
    electronics: 'Electronics & Gadgets',
    clothes: 'Fashion & Clothing',
    shoes: 'Footwear & Sneakers',
    furniture: 'Home & Furniture',
    books: 'Books & Education',
    accessories: 'Accessories & More'
  };

  const categoryColors: Record<string, string> = {
    electronics: 'from-blue-600 to-purple-600',
    clothes: 'from-pink-600 to-rose-600',
    shoes: 'from-amber-600 to-orange-600',
    furniture: 'from-emerald-600 to-teal-600',
    books: 'from-indigo-600 to-violet-600',
    accessories: 'from-cyan-600 to-sky-600'
  };

  const categoryImages: Record<string, string> = {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h-300&fit=crop',
    clothes: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h-300&fit=crop',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h-300&fit=crop',
    furniture: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h-300&fit=crop',
    books: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h-300&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=1200&h-300&fit=crop'
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-10">
      {/* Category Banner */}
      <div className="relative rounded-xl overflow-hidden h-40 md:h-48 mb-6">
        <img 
          src={categoryImages[category] || categoryImages.electronics} 
          alt={category}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${categoryColors[category]} bg-opacity-80`} />
        <div className="absolute inset-0 flex items-center p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black capitalize">
                {categoryTitles[category]}
              </h2>
              <p className="text-sm md:text-base opacity-90">{products.length} products available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;