import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0]);
      setSelectedColor(product.colors?.[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Produit introuvable</h2>
        <button onClick={() => navigate('/catalog')} className="text-[#004D98] hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Retour à la boutique
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.in_stock) return;
    
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 text-gray-500 hover:text-[#004D98] flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden relative"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {!product.in_stock && (
                <div className="absolute top-4 left-4 bg-black/80 text-white font-bold px-4 py-2 rounded-full backdrop-blur-sm">
                  Rupture de stock
                </div>
              )}
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-[#004D98] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-[#A50044] font-bold tracking-wider uppercase text-sm">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4 leading-tight">{product.name}</h1>
              <p className="text-3xl font-bold text-[#004D98]">{product.price.toLocaleString()} DA</p>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

            <div className="space-y-8 mb-10 border-t border-b border-gray-100 py-8">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900">Taille</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-xl font-bold flex items-center justify-center transition-all ${
                          selectedSize === size 
                            ? 'bg-[#004D98] text-white shadow-md scale-105' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Couleur</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          selectedColor === color 
                            ? 'bg-[#A50044] text-white shadow-md scale-105' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Quantité</h3>
                <div className="flex items-center w-32 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#004D98] transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#004D98] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
                  !product.in_stock 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : isAdded 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#EDBB00] text-[#004D98] hover:bg-yellow-400 hover:scale-[1.02]'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <Check size={24} /> Ajouté au panier
                    </motion.div>
                  ) : (
                    <motion.div key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <ShoppingCart size={24} /> Ajouter au panier
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Truck className="text-[#004D98]" size={24} />
                  <span>Livraison 58 Wilayas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <ShieldCheck className="text-[#A50044]" size={24} />
                  <span>Paiement à la livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
