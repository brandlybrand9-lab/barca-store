import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const Success = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="text-green-500 w-24 h-24" />
          </motion.div>
        </div>
        
        <div>
          <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">
            Commande Envoyée !
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Merci pour votre commande. Notre équipe va la traiter dans les plus brefs délais.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Vous serez contacté sur WhatsApp pour la confirmation de l'expédition.
          </p>
        </div>

        <div className="mt-8">
          <Link
            to="/catalog"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#004D98] hover:bg-[#003876] transition-colors shadow-lg shadow-[#004D98]/20"
          >
            Continuer vos achats
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
