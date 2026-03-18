import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop" 
            alt="Camp Nou" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D98]/90 via-[#004D98]/70 to-[#A50044]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#EDBB00] text-[#004D98] font-bold text-sm mb-6 tracking-widest uppercase">
              Nouvelle Collection 24/25
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              VIVEZ VOTRE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDBB00] to-yellow-300">PASSION BLAUGRANA</span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto font-light text-gray-200">
              La boutique numéro 1 en Algérie pour les vrais Culers. Livraison dans les 58 wilayas, paiement à la livraison.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/catalog" 
                className="bg-[#EDBB00] text-[#004D98] hover:bg-yellow-400 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                Découvrir la boutique
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/catalog?category=Maillots" 
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
              >
                Voir les maillots
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="w-14 h-14 bg-[#004D98]/10 text-[#004D98] rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Livraison 58 Wilayas</h3>
                <p className="text-gray-500 text-sm">Partout en Algérie</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="w-14 h-14 bg-[#A50044]/10 text-[#A50044] rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Paiement Sécurisé</h3>
                <p className="text-gray-500 text-sm">Paiement à la livraison (COD)</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="w-14 h-14 bg-[#EDBB00]/20 text-[#B38D00] rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Support Rapide</h3>
                <p className="text-gray-500 text-sm">Service client via WhatsApp</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                Nouveautés <span className="text-[#A50044]">Blaugrana</span>
              </h2>
              <p className="text-gray-500">Les derniers articles ajoutés à la boutique</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 text-[#004D98] font-bold hover:text-[#A50044] transition-colors">
              Voir tout <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">Chargement des nouveautés...</div>
            ) : (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/catalog" className="inline-flex items-center gap-2 text-[#004D98] font-bold hover:text-[#A50044] transition-colors bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
              Voir tout le catalogue <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-20 bg-[#004D98] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#A50044] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#EDBB00] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Prêt à porter les couleurs ?</h2>
          <p className="text-xl text-blue-100 mb-10">Rejoignez des milliers de fans en Algérie et commandez votre équipement officiel dès aujourd'hui.</p>
          <Link 
            to="/catalog" 
            className="inline-block bg-white text-[#004D98] hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-xl transition-transform transform hover:scale-105 shadow-2xl"
          >
            Acheter maintenant
          </Link>
        </div>
      </section>
    </div>
  );
};
