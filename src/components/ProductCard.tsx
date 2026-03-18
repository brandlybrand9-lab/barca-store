import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size/color if available
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden aspect-[4/5] bg-gray-50">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {!product.in_stock && (
          <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            Rupture de stock
          </div>
        )}
        {product.featured && product.in_stock && (
          <div className="absolute top-3 left-3 bg-[#EDBB00] text-[#004D98] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Nouveau
          </div>
        )}
        
        {/* Quick Add Button Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 to-transparent">
          <button 
            onClick={handleQuickAdd}
            disabled={!product.in_stock}
            className="w-full bg-white text-[#004D98] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#EDBB00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <ShoppingCart size={18} />
            Ajouter au panier
          </button>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-bold text-[#A50044] uppercase tracking-wider mb-2">{product.category}</div>
        <Link to={`/product/${product.id}`} className="block group-hover:text-[#004D98] transition-colors">
          <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-black text-[#004D98]">{product.price.toLocaleString()} DA</span>
        </div>
      </div>
    </motion.div>
  );
};
