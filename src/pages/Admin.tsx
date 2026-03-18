import React, { useState, useEffect } from 'react';
import { supabase, Order, Product } from '../lib/supabase';
import { Package, ShoppingBag, LogOut, Loader2, Plus, Edit, Trash2 } from 'lucide-react';

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, activeTab]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === 'orders') {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const toggleProductStock = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (!import.meta.env.VITE_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#004D98] mb-4">Configuration Supabase Requise</h2>
          <p className="text-gray-600 mb-6">
            Pour accéder au tableau de bord administrateur, vous devez configurer Supabase.
          </p>
          <div className="text-left text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-bold mb-2">Étapes :</p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Créez un projet sur supabase.com</li>
              <li>Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les variables d'environnement (Secrets)</li>
              <li>Exécutez le script SQL fourni pour créer les tables</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#004D98]">Administration</h2>
            <p className="text-gray-500 mt-2">Connectez-vous pour gérer votre boutique</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004D98] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004D98] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#003876] transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[#004D98]">Tableau de bord</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
          <div className="flex gap-8 border-t border-gray-100">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'orders' ? 'border-[#004D98] text-[#004D98]' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <ShoppingBag size={18} /> Commandes
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'products' ? 'border-[#004D98] text-[#004D98]' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Package size={18} /> Produits
            </button>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#004D98]" size={32} />
          </div>
        ) : activeTab === 'orders' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">ID / Date</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Wilaya</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Aucune commande trouvée</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-gray-500 mb-1">{order.id.split('-')[0]}</div>
                          <div>{new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.full_name}</div>
                          <div className="text-gray-500">{order.phone}</div>
                        </td>
                        <td className="px-6 py-4">{order.wilaya}</td>
                        <td className="px-6 py-4 font-bold text-[#004D98]">
                          {(order.total_amount + order.delivery_fee).toLocaleString()} DA
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1 rounded-full outline-none border-0 cursor-pointer ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-[#004D98] hover:underline text-xs font-medium">Voir détails</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-6">
              <button className="bg-[#004D98] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#003876] transition-colors">
                <Plus size={18} /> Ajouter un produit
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Produit</th>
                      <th className="px-6 py-4">Catégorie</th>
                      <th className="px-6 py-4">Prix</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucun produit trouvé</td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                {product.images?.[0] && (
                                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                )}
                              </div>
                              <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{product.category}</td>
                          <td className="px-6 py-4 font-medium">{product.price.toLocaleString()} DA</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => toggleProductStock(product.id, product.in_stock)}
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.in_stock ? 'En stock' : 'Rupture'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button className="text-gray-400 hover:text-[#004D98] transition-colors"><Edit size={18} /></button>
                              <button className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
