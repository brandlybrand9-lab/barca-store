import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, MapPin, Phone, User, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { wilayas } from '../data/wilayas';
import { supabase } from '../lib/supabase';

export const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    address: '',
    notes: ''
  });

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/catalog');
    }
  }, [items, navigate]);

  useEffect(() => {
    const selectedWilaya = wilayas.find(w => w.id === formData.wilaya);
    if (selectedWilaya) {
      setDeliveryFee(selectedWilaya.deliveryFee);
    } else {
      setDeliveryFee(0);
    }
  }, [formData.wilaya]);

  const total = cartTotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.wilaya || !formData.address) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedWilayaName = wilayas.find(w => w.id === formData.wilaya)?.name || '';

      // Try to save to Supabase if configured
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            full_name: formData.fullName,
            phone: formData.phone,
            wilaya: selectedWilayaName,
            address: formData.address,
            notes: formData.notes,
            total_amount: cartTotal,
            delivery_fee: deliveryFee,
            status: 'pending'
          })
          .select()
          .single();

        if (orderError) throw orderError;

        if (orderData) {
          const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
            price_at_time: item.product.price
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) throw itemsError;
        }
      }

      // Format order for WhatsApp
      let message = `*NOUVELLE COMMANDE - BARÇA STORE DZ*%0A%0A`;
      message += `*CLIENT*%0A`;
      message += `Nom: ${formData.fullName}%0A`;
      message += `Tél: ${formData.phone}%0A`;
      message += `Wilaya: ${selectedWilayaName}%0A`;
      message += `Adresse: ${formData.address}%0A`;
      if (formData.notes) message += `Notes: ${formData.notes}%0A`;
      
      message += `%0A*COMMANDE*%0A`;
      items.forEach(item => {
        message += `- ${item.quantity}x ${item.product.name}`;
        if (item.size) message += ` (Taille: ${item.size})`;
        if (item.color) message += ` (Couleur: ${item.color})`;
        message += ` - ${item.product.price * item.quantity} DA%0A`;
      });

      message += `%0A*TOTAL*%0A`;
      message += `Sous-total: ${cartTotal} DA%0A`;
      message += `Livraison: ${deliveryFee} DA%0A`;
      message += `*Total à payer: ${total} DA*%0A`;

      // Replace with actual WhatsApp number
      const whatsappNumber = '213000000000';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Clear cart and redirect to success
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer ou nous contacter sur WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 text-gray-500 hover:text-[#004D98] flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Retour au panier
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#004D98] mb-2">Finaliser la commande</h1>
          <p className="text-gray-600">Remplissez vos informations pour la livraison. Le paiement se fera à la réception.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-[#A50044]" />
                Informations de livraison
              </h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User size={16} /> Nom Complet *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] focus:border-transparent transition-all outline-none"
                      placeholder="Ex: Yacine Brahimi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone size={16} /> Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] focus:border-transparent transition-all outline-none"
                      placeholder="Ex: 0555 00 00 00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya *</label>
                  <select
                    name="wilaya"
                    required
                    value={formData.wilaya}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] focus:border-transparent transition-all outline-none bg-white"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {wilayas.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] focus:border-transparent transition-all outline-none"
                    placeholder="Quartier, rue, numéro de bâtiment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optionnel)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Indications supplémentaires pour le livreur..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="text-[#004D98]" />
                Résumé de la commande
              </h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-gray-500 text-xs">
                          {item.quantity}x • {item.size && `T: ${item.size}`} {item.color && `C: ${item.color}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{(item.product.price * item.quantity).toLocaleString()} DA</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{cartTotal.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison</span>
                  <span>{formData.wilaya ? `${deliveryFee.toLocaleString()} DA` : 'À calculer'}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#004D98]">{total.toLocaleString()} DA</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full mt-8 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-[#25D366]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <MessageCircle size={24} />
                )}
                {isSubmitting ? 'Traitement...' : 'Commander via WhatsApp'}
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                En cliquant sur ce bouton, vous serez redirigé vers WhatsApp pour confirmer votre commande. Le paiement se fera à la livraison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
