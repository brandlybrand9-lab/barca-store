import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = ['Tous', 'Maillots', 'Survêtements', 'Accessoires', 'Lifestyle'];

export const Catalog = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'Tous';
  
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'Tous') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
    setIsFilterOpen(false);
  };

  const filteredProducts = activeCategory === 'Tous' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-[#004D98] mb-4">Boutique Officielle</h1>
          <p className="text-gray-600 max-w-2xl">Découvrez notre collection complète d'articles du FC Barcelone. Des maillots aux accessoires, équipez-vous comme un vrai Culer.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="font-bold text-gray-700">Filtres ({activeCategory})</span>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 bg-gray-100 rounded-lg text-[#004D98]"
            >
              {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg mb-6 text-gray-900 border-b pb-4">Catégories</h3>
              <ul className="space-y-3">
                {CATEGORIES.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeCategory === category 
                          ? 'bg-[#004D98] text-white font-bold' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-[#A50044]'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-500 font-medium">{loading ? 'Chargement...' : `${filteredProducts.length} produits trouvés`}</p>
            </div>

            {loading ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                <p className="text-xl text-gray-500">Chargement des produits...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                <p className="text-xl text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
                <button 
                  onClick={() => handleCategoryChange('Tous')}
                  className="mt-4 text-[#004D98] font-bold hover:underline"
                >
                  Voir tous les produits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
