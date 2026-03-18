import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Menu, X, MessageCircle, ChevronRight, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#004D98] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#A50044] rounded-full flex items-center justify-center font-bold text-white border-2 border-[#EDBB00]">
                FCB
              </div>
              <span className="font-bold text-xl tracking-tight text-[#EDBB00]">Barça Store DZ</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-[#EDBB00] transition-colors font-medium">Accueil</Link>
            <Link to="/catalog" className="hover:text-[#EDBB00] transition-colors font-medium">Boutique</Link>
            <Link to="/catalog?category=Maillots" className="hover:text-[#EDBB00] transition-colors font-medium">Maillots</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-[#A50044] rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#EDBB00] text-[#004D98] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2 hover:bg-[#A50044] rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#003876] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#A50044] font-medium">Accueil</Link>
              <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#A50044] font-medium">Boutique</Link>
              <Link to="/catalog?category=Maillots" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-[#A50044] font-medium">Maillots</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#004D98] text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart size={20} />
                Votre Panier
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-[#A50044] rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingCart size={64} className="opacity-20" />
                  <p className="text-lg">Votre panier est vide</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 bg-[#004D98] text-white rounded-full font-medium hover:bg-[#003876] transition-colors"
                  >
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">{item.product.name}</h3>
                          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            {item.size && <p>Taille: {item.size}</p>}
                            {item.color && <p>Couleur: {item.color}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                              className="p-1 text-gray-500 hover:text-[#004D98] hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                              className="p-1 text-gray-500 hover:text-[#004D98] hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#004D98]">{item.product.price.toLocaleString()} DA</span>
                            <button 
                              onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                              className="text-red-400 hover:text-red-600 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-xl font-bold text-[#004D98]">{cartTotal.toLocaleString()} DA</span>
                </div>
                <p className="text-xs text-gray-500 mb-4 text-center">Les frais de livraison seront calculés à l'étape suivante.</p>
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#A50044] hover:bg-[#8A0039] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#A50044]/20"
                >
                  Passer la commande
                  <ChevronRight size={20} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/213000000000?text=Bonjour,%20j'ai%20une%20question%20concernant%20la%20boutique."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-40 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#141414] text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#A50044] rounded-full flex items-center justify-center font-bold text-white border-2 border-[#EDBB00]">
                FCB
              </div>
              <span className="font-bold text-xl tracking-tight text-[#EDBB00]">Barça Store DZ</span>
            </div>
            <p className="text-gray-400 text-sm">
              La boutique non-officielle numéro 1 pour les fans du FC Barcelone en Algérie. Produits de qualité, livraison rapide (COD).
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#EDBB00]">Liens Rapides</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Boutique</Link></li>
              <li><Link to="/catalog?category=Maillots" className="hover:text-white transition-colors">Maillots</Link></li>
              <li><Link to="/catalog?category=Survêtements" className="hover:text-white transition-colors">Survêtements</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#EDBB00]">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: contact@barcastoredz.com</li>
              <li>Tél: +213 00 00 00 00</li>
              <li>Alger, Algérie</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Barça Store DZ. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <p>Ceci est un projet de démonstration. Non affilié au FC Barcelone.</p>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
