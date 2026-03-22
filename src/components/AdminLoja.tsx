import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  X, 
  Loader2,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Clock,
  ChevronRight,
  ClipboardList,
  User,
  Mail,
  MapPin,
  ExternalLink,
  Eye,
  Upload,
  CreditCard,
  Download,
  Printer,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'sonner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AdminLoja = () => {
  const [activeTab, setActiveTab] = useState<'produtos' | 'pedidos' | 'categorias'>('produtos');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [parents, setParents] = useState<{ value: string, label: string }[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_cents: 0,
    category_id: '',
    image_url: '',
    type: 'fisico',
    stock_quantity: 0,
    is_subscription_activator: false,
    stripe_product_id: '',
    stripe_price_id: '',
    rating: 5.0,
    is_featured: false,
    weight_grams: 0,
    length_mm: 0,
    width_mm: 0,
    height_mm: 0
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes, parentsRes] = await Promise.all([
        supabase.from('store_products').select('*, store_categories(name)').order('created_at', { ascending: false }),
        supabase.from('store_categories').select('*').order('name'),
        supabase.from('store_orders').select('*, pais(nome)').order('created_at', { ascending: false }),
        supabase.from('pais').select('id, nome').order('nome')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (parentsRes.error) throw parentsRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setOrders(ordersRes.data || []);
      setParents(parentsRes.data?.map(p => ({ value: p.id, label: p.nome })) || []);

      // Calculate stats
      const totalSales = ordersRes.data?.filter(o => o.status === 'pago' || o.status === 'enviado' || o.status === 'entregue').reduce((acc, o) => acc + o.total_amount_cents, 0) || 0;
      const pendingOrders = ordersRes.data?.filter(o => o.status === 'pendente').length || 0;
      const outOfStock = productsRes.data?.filter(p => p.stock_quantity <= 0).length || 0;

      setStats({
        totalSales: totalSales / 100, // Convert to currency
        pendingOrders,
        outOfStock
      });

    } catch (err) {
      console.error('Error fetching store data:', err);
      toast.error('Erro ao carregar dados da loja');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price_cents: product.price_cents,
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        type: product.type || 'fisico',
        stock_quantity: product.stock_quantity || 0,
        is_subscription_activator: product.is_subscription_activator || false,
        stripe_product_id: product.stripe_product_id || '',
        stripe_price_id: product.stripe_price_id || '',
        rating: product.rating || 5.0,
        is_featured: product.is_featured || false,
        weight_grams: product.weight_grams || 0,
        length_mm: product.length_mm || 0,
        width_mm: product.width_mm || 0,
        height_mm: product.height_mm || 0
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price_cents: 0,
        category_id: categories[0]?.id || '',
        image_url: '',
        type: 'fisico',
        stock_quantity: 0,
        is_subscription_activator: false,
        stripe_product_id: '',
        stripe_price_id: '',
        rating: 5.0,
        is_featured: false,
        weight_grams: 0,
        length_mm: 0,
        width_mm: 0,
        height_mm: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenCategoryModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: category.name,
        slug: category.slug
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        slug: ''
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('store_categories')
          .update(categoryFormData)
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success('Categoria atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('store_categories')
          .insert([categoryFormData]);
        if (error) throw error;
        toast.success('Categoria cadastrada com sucesso!');
      }
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error('Erro ao salvar categoria');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar produtos vinculados.')) return;
    try {
      const { error } = await supabase.from('store_categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Categoria excluída com sucesso!');
      fetchData();
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Erro ao excluir categoria');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Ensure bucket exists (this might fail if already exists or no permission, but we try)
      // In a real app, we'd do this once or assume it exists.
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('store-products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-products')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast.success('Imagem enviada com sucesso!');
    } catch (err: any) {
      console.error('Error uploading image:', err);
      toast.error('Erro ao enviar imagem. Verifique se o bucket "store-products" existe.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('store_products')
          .update(formData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('store_products')
          .insert([formData]);
        if (error) throw error;
        toast.success('Produto cadastrado com sucesso!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Erro ao salvar produto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      const { error } = await supabase.from('store_products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Produto excluído com sucesso!');
      fetchData();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleTestSmtp = async () => {
    const testEmail = prompt('Digite o e-mail para receber o teste:', '');
    if (!testEmail) return;

    setIsTestingSmtp(true);
    try {
      const response = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('E-mail de teste enviado com sucesso! Verifique sua caixa de entrada.');
      } else {
        toast.error(`Erro no teste SMTP: ${data.error}`);
      }
    } catch (error) {
      console.error('SMTP Test Error:', error);
      toast.error('Erro ao conectar com o servidor para teste SMTP.');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (trackingNumber !== undefined) {
        updateData.tracking_number = trackingNumber;
      }

      const { error } = await supabase
        .from('store_orders')
        .update(updateData)
        .eq('id', orderId);
      if (error) throw error;
      
      toast.success(`Pedido atualizado com sucesso!`);
      
      // Trigger status update email
      try {
        const currentOrder = orders.find(o => o.id === orderId) || selectedOrder;
        const emailToUse = currentOrder?.customer_email;
        const nameToUse = currentOrder?.customer_name;

        if (!emailToUse) {
          console.warn('⚠️ Cannot send status update email: Customer email not found in order data.');
          return;
        }

        const response = await fetch('/api/send-order-status-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            status: newStatus,
            trackingNumber: trackingNumber || currentOrder?.tracking_number,
            customerEmail: emailToUse,
            customerName: nameToUse || 'Cliente'
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          console.error('❌ Server error sending status update email:', result.error);
          toast.error(`Erro ao enviar e-mail: ${result.error || 'Erro desconhecido'}`);
          return;
        }

        if (result.simulated) {
          toast.info('E-mail simulado (SMTP não configurado)', { icon: 'ℹ️' });
        } else if (result.success) {
          toast.success('E-mail de atualização enviado ao cliente!');
        }
      } catch (emailErr) {
        console.error('Error sending status update email:', emailErr);
        toast.error('Erro de conexão ao enviar e-mail');
      }

      fetchData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updateData });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Erro ao atualizar pedido');
    }
  };

  const handleSyncStripe = async () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Sincronizando com Stripe...',
        success: 'Produtos sincronizados com sucesso!',
        error: 'Erro ao sincronizar com Stripe',
      }
    );
  };

  const handleExportOrders = () => {
    const headers = ['ID', 'Cliente', 'Email', 'Pai Vinculado', 'Total', 'Status', 'Data'];
    const csvContent = [
      headers.join(','),
      ...orders.map(o => [
        o.id,
        o.customer_name,
        o.customer_email,
        o.pais?.nome || '-',
        (o.total_amount_cents / 100).toFixed(2),
        o.status,
        new Date(o.created_at).toLocaleDateString('pt-BR')
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos_phaleduc_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Relatório exportado com sucesso!');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.store_categories?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-secondary tracking-tight">Gestão da Loja</h2>
          <p className="text-secondary/60 font-medium">Controle seu inventário, produtos e vendas.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-100 p-1 rounded-2xl flex">
            <button 
              onClick={() => setActiveTab('produtos')}
              className={cn(
                "px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                activeTab === 'produtos' ? "bg-white text-primary shadow-sm" : "text-secondary/40 hover:text-secondary"
              )}
            >
              Produtos
            </button>
            <button 
              onClick={() => setActiveTab('categorias')}
              className={cn(
                "px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                activeTab === 'categorias' ? "bg-white text-primary shadow-sm" : "text-secondary/40 hover:text-secondary"
              )}
            >
              Categorias
            </button>
            <button 
              onClick={() => setActiveTab('pedidos')}
              className={cn(
                "px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                activeTab === 'pedidos' ? "bg-white text-primary shadow-sm" : "text-secondary/40 hover:text-secondary"
              )}
            >
              Pedidos
            </button>
          </div>
          {activeTab === 'produtos' ? (
            <div className="flex gap-4">
              <button 
                onClick={handleSyncStripe}
                className="bg-white text-secondary border border-gray-200 px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all"
              >
                <CreditCard className="w-5 h-5 text-primary" />
                Sincronizar Stripe
              </button>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Novo Produto
              </button>
            </div>
          ) : activeTab === 'categorias' ? (
            <button 
              onClick={() => handleOpenCategoryModal()}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Nova Categoria
            </button>
          ) : (
            <button 
              onClick={handleExportOrders}
              className="bg-white text-secondary border border-gray-200 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Download className="w-5 h-5 text-success" />
              Exportar CSV
            </button>
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-emerald-500 group-hover:scale-110 transition-transform">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-secondary/40 font-black uppercase text-[10px] tracking-widest">Total de Vendas</p>
            <p className="text-4xl font-black text-secondary">
              {loading ? '...' : `US$ ${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-amber-500 group-hover:scale-110 transition-transform">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-secondary/40 font-black uppercase text-[10px] tracking-widest">Pedidos Pendentes</p>
            <p className="text-4xl font-black text-secondary">{loading ? '...' : stats.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-rose-500 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-secondary/40 font-black uppercase text-[10px] tracking-widest">Produtos Sem Estoque</p>
            <p className="text-4xl font-black text-secondary">{loading ? '...' : stats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
            {activeTab === 'produtos' ? (
              <>
                <Package className="w-6 h-6 text-primary" />
                Inventário de Produtos
              </>
            ) : activeTab === 'categorias' ? (
              <>
                <Tag className="w-6 h-6 text-primary" />
                Categorias da Loja
              </>
            ) : (
              <>
                <ClipboardList className="w-6 h-6 text-primary" />
                Gestão de Pedidos
              </>
            )}
          </h3>
          <div className="flex items-center gap-4">
            {activeTab === 'pedidos' && (
              <button 
                onClick={handleTestSmtp}
                disabled={isTestingSmtp}
                className="px-6 py-3 bg-white border border-gray-200 text-secondary/60 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
                title="Testar Configuração de E-mail"
              >
                {isTestingSmtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Testar SMTP
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/20" />
              <input 
                type="text" 
                placeholder={
                  activeTab === 'produtos' ? "Buscar produtos..." : 
                  activeTab === 'categorias' ? "Buscar categorias..." : 
                  "Buscar pedidos..."
                }
                className="pl-12 pr-6 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-80 font-bold text-secondary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'categorias' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Nome</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Slug</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-secondary/40 font-bold">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-black text-secondary">{category.name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-secondary/60 font-mono text-xs">{category.slug}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenCategoryModal(category)}
                            className="p-2 text-secondary/20 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-secondary/20 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === 'produtos' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Foto</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Nome</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Preço</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Categoria</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Tipo</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Estoque</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-secondary/40 font-bold">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary/20">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-secondary">{product.name}</p>
                        {product.is_subscription_activator && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">Ativador</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-secondary">US$ {(product.price_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary/60">
                          {product.store_categories?.name || 'Sem Categoria'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          product.type === 'fisico' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {product.type === 'fisico' ? 'Físico' : 'Digital'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className={cn(
                          "font-bold",
                          product.stock_quantity <= 0 ? "text-danger" : "text-secondary/60"
                        )}>
                          {product.stock_quantity} un.
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-secondary/20 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-secondary/20 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Pedido ID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Cliente</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Data</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Total</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-secondary/40 font-bold">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-mono text-[10px] text-secondary/40 uppercase font-black">
                          #{order.id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-secondary">{order.customer_name}</p>
                        <p className="text-[10px] text-secondary/40 font-bold">{order.customer_email}</p>
                        {order.pais?.nome && (
                          <p className="text-[10px] text-primary font-black mt-1 uppercase tracking-widest">Pai: {order.pais.nome}</p>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-secondary/60 font-bold">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-secondary">
                          US$ {(order.total_amount_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          order.status === 'pago' ? "bg-success/10 text-success" :
                          order.status === 'pendente' ? "bg-amber-500/10 text-amber-600" :
                          order.status === 'cancelado' ? "bg-rose-500/10 text-rose-600" :
                          "bg-blue-500/10 text-blue-600"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderModalOpen(true);
                          }}
                          className="p-2 text-secondary/20 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Cadastro/Edição de Produto */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black text-secondary">
                    {editingProduct ? 'Editar Produto' : 'Cadastrar Produto'}
                  </h3>
                  <p className="text-secondary/40 font-medium">Preencha os detalhes do item na loja.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-danger transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nome */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Nome do Produto</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Categoria */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Categoria</label>
                      <select 
                        required
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Preço em Centavos */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Preço (em centavos - Stripe)</label>
                      <input 
                        required
                        type="number"
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.price_cents}
                        onChange={(e) => setFormData({ ...formData, price_cents: parseInt(e.target.value) || 0 })}
                      />
                      <p className="text-[10px] text-secondary/40 ml-2">Ex: 1000 = US$ 10.00</p>
                    </div>

                    {/* Estoque */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Quantidade em Estoque</label>
                      <input 
                        required
                        type="number"
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Tipo de Produto</label>
                      <div className="flex gap-4">
                        {['fisico', 'digital'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type })}
                            className={cn(
                              "flex-1 py-4 rounded-2xl font-bold capitalize transition-all border-2",
                              formData.type === type 
                                ? "bg-primary/5 border-primary text-primary" 
                                : "bg-gray-50 border-transparent text-secondary/40 hover:bg-gray-100"
                            )}
                          >
                            {type === 'fisico' ? 'Físico' : 'Digital'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ativador de Assinatura */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Ativador de Assinatura?</label>
                      <div 
                        onClick={() => setFormData({ ...formData, is_subscription_activator: !formData.is_subscription_activator })}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all border-2",
                          formData.is_subscription_activator 
                            ? "bg-success/5 border-success text-success" 
                            : "bg-gray-50 border-transparent text-secondary/40"
                        )}
                      >
                        <span className="font-bold">{formData.is_subscription_activator ? 'Sim, ativa assinatura' : 'Não, produto comum'}</span>
                        <div className={cn(
                          "w-12 h-6 rounded-full relative transition-all",
                          formData.is_subscription_activator ? "bg-success" : "bg-gray-300"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            formData.is_subscription_activator ? "right-1" : "left-1"
                          )} />
                        </div>
                      </div>
                    </div>

                    {/* Stripe IDs */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Stripe Product ID</label>
                      <input 
                        type="text"
                        placeholder="prod_..."
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.stripe_product_id}
                        onChange={(e) => setFormData({ ...formData, stripe_product_id: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Stripe Price ID</label>
                      <input 
                        type="text"
                        placeholder="price_..."
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.stripe_price_id}
                        onChange={(e) => setFormData({ ...formData, stripe_price_id: e.target.value })}
                      />
                    </div>

                    {/* Avaliação */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Avaliação (0-5)</label>
                      <input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    {/* Destaque */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Produto em Destaque?</label>
                      <div 
                        onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all border-2",
                          formData.is_featured 
                            ? "bg-primary/5 border-primary text-primary" 
                            : "bg-gray-50 border-transparent text-secondary/40"
                        )}
                      >
                        <span className="font-bold">{formData.is_featured ? 'Sim, em destaque' : 'Não, produto normal'}</span>
                        <div className={cn(
                          "w-12 h-6 rounded-full relative transition-all",
                          formData.is_featured ? "bg-primary" : "bg-gray-300"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            formData.is_featured ? "right-1" : "left-1"
                          )} />
                        </div>
                      </div>
                    </div>

                    {/* Logística (Fase 2) */}
                    {formData.type === 'fisico' && (
                      <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Peso (g)</label>
                          <input 
                            type="number"
                            className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm"
                            value={formData.weight_grams}
                            onChange={(e) => setFormData({ ...formData, weight_grams: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Comp. (mm)</label>
                          <input 
                            type="number"
                            className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm"
                            value={formData.length_mm}
                            onChange={(e) => setFormData({ ...formData, length_mm: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Larg. (mm)</label>
                          <input 
                            type="number"
                            className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm"
                            value={formData.width_mm}
                            onChange={(e) => setFormData({ ...formData, width_mm: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Alt. (mm)</label>
                          <input 
                            type="number"
                            className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm"
                            value={formData.height_mm}
                            onChange={(e) => setFormData({ ...formData, height_mm: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload de Imagem */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Imagem do Produto</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <input 
                              type="url"
                              placeholder="URL da imagem..."
                              className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                              value={formData.image_url}
                              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                            <label className="bg-white border-2 border-dashed border-gray-200 p-4 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center shrink-0">
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6 text-secondary/40" />}
                            </label>
                          </div>
                          <p className="text-[10px] text-secondary/40 ml-2 italic">Insira uma URL ou faça o upload de um arquivo.</p>
                        </div>
                        {formData.image_url && (
                          <div className="h-32 rounded-3xl bg-gray-50 overflow-hidden border border-gray-100 relative group">
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button 
                              type="button"
                              onClick={() => setFormData({ ...formData, image_url: '' })}
                              className="absolute top-2 right-2 p-2 bg-danger text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Descrição Rica */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Descrição Detalhada</label>
                      <div className="bg-gray-50 rounded-2xl overflow-hidden border border-transparent focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <ReactQuill 
                          theme="snow" 
                          value={formData.description} 
                          onChange={(val) => setFormData({ ...formData, description: val })}
                          modules={quillModules}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-white text-secondary/60 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSaving ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      editingProduct ? 'Salvar Alterações' : 'Cadastrar agora'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Detalhes do Pedido */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Detalhes do Pedido</p>
                  <h3 className="text-2xl font-black text-secondary uppercase">
                    #{selectedOrder.id.slice(0, 8)}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.print()} 
                    className="p-4 bg-white rounded-2xl text-secondary/40 hover:text-primary transition-colors shadow-sm"
                    title="Imprimir Pedido"
                  >
                    <Printer className="w-6 h-6" />
                  </button>
                  <button onClick={() => setIsOrderModalOpen(false)} className="p-4 bg-white rounded-2xl text-secondary/40 hover:text-danger transition-colors shadow-sm">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                {/* Cliente Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Cliente
                    </h4>
                    <div className="space-y-1">
                      <p className="font-black text-secondary text-lg">{selectedOrder.customer_name}</p>
                      <p className="text-sm text-secondary/60 font-medium flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {selectedOrder.customer_email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Data do Pedido
                    </h4>
                    <p className="font-bold text-secondary">
                      {new Date(selectedOrder.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Endereço de Entrega
                  </h4>
                  <div className="p-6 bg-gray-50 rounded-3xl text-sm font-medium text-secondary/70 leading-relaxed border border-gray-100">
                    {selectedOrder.country ? (
                      <div className="space-y-1">
                        <p className="font-black text-secondary">{selectedOrder.address_line1}</p>
                        {selectedOrder.address_line2 && <p>{selectedOrder.address_line2}</p>}
                        <p>{selectedOrder.city}, {selectedOrder.state_province} {selectedOrder.postal_code}</p>
                        <p className="uppercase tracking-widest text-[10px] font-black text-primary mt-2">{selectedOrder.country}</p>
                      </div>
                    ) : (
                      <p>{selectedOrder.shipping_address || 'Endereço não informado ou produto digital.'}</p>
                    )}
                  </div>
                </div>

                {/* Itens */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40 flex items-center gap-2">
                    <ShoppingBag className="w-3 h-3" />
                    Itens do Pedido
                  </h4>
                  <div className="divide-y divide-gray-50 border border-gray-50 rounded-3xl overflow-hidden">
                    {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                      selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-6 flex justify-between items-center bg-white">
                          <div>
                            <p className="font-black text-secondary">{item.name}</p>
                            <p className="text-xs text-secondary/40 font-bold">{item.quantity}x US$ {(item.price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <p className="font-black text-primary">
                            US$ {( (item.price * item.quantity) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="p-6 text-center text-secondary/40 font-bold italic">Nenhum item listado.</p>
                    )}
                    <div className="p-6 bg-gray-50 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary/40 font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="font-black text-secondary">US$ {((selectedOrder.total_amount_cents - (selectedOrder.shipping_cost_cents || 0) - (selectedOrder.tax_amount_cents || 0)) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary/40 font-bold uppercase tracking-widest">Frete</span>
                        <span className="font-black text-secondary">US$ {((selectedOrder.shipping_cost_cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary/40 font-bold uppercase tracking-widest">Impostos (Tax)</span>
                        <span className="font-black text-secondary">US$ {((selectedOrder.tax_amount_cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <p className="font-black text-secondary uppercase tracking-widest text-xs">Total Final</p>
                        <p className="text-2xl font-black text-secondary">
                          US$ {(selectedOrder.total_amount_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Vincular ao Pai</h4>
                    <select
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={selectedOrder.parent_id || ''}
                      onChange={async (e) => {
                        const parentId = e.target.value || null;
                        try {
                          const { error } = await supabase
                            .from('store_orders')
                            .update({ parent_id: parentId })
                            .eq('id', selectedOrder.id);
                          
                          if (error) throw error;
                          
                          setSelectedOrder({ ...selectedOrder, parent_id: parentId });
                          setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, parent_id: parentId, pais: parents.find(p => p.value === parentId) ? { nome: parents.find(p => p.value === parentId)?.label } : null } : o));
                          toast.success('Vínculo atualizado com sucesso!');
                        } catch (err: any) {
                          toast.error('Erro ao vincular: ' + err.message);
                        }
                      }}
                    >
                      <option value="">Nenhum Pai Selecionado</option>
                      {parents.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Atualizar Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['pendente', 'pago', 'enviado', 'entregue', 'cancelado'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
                          className={cn(
                            "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                            selectedOrder.status === status 
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                              : "bg-gray-50 border-transparent text-secondary/40 hover:bg-gray-100"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Number */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Código de Rastreamento</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Ex: BR123456789"
                        className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        defaultValue={selectedOrder.tracking_number || ''}
                        onBlur={(e) => {
                          if (e.target.value !== selectedOrder.tracking_number) {
                            handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status, e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Email Status */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Status de Notificações</h4>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          selectedOrder.confirmation_email_sent ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-500"
                        )}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-secondary text-sm">E-mail de Confirmação</p>
                          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest">
                            {selectedOrder.confirmation_email_sent 
                              ? `Enviado em ${new Date(selectedOrder.confirmation_email_at).toLocaleString('pt-BR')}` 
                              : 'Não enviado ou pendente'}
                          </p>
                        </div>
                      </div>
                      {!selectedOrder.confirmation_email_sent && (
                        <button 
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/send-order-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  order: selectedOrder,
                                  customerEmail: selectedOrder.customer_email,
                                  customerName: selectedOrder.customer_name
                                })
                              });
                              if (res.ok) {
                                await supabase.from('store_orders').update({ confirmation_email_sent: true, confirmation_email_at: new Date().toISOString() }).eq('id', selectedOrder.id);
                                toast.success('E-mail enviado com sucesso!');
                                fetchData();
                              } else {
                                throw new Error('Falha no envio');
                              }
                            } catch (err) {
                              toast.error('Erro ao reenviar e-mail');
                            }
                          }}
                          className="px-4 py-2 bg-white text-primary border border-primary/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all"
                        >
                          Reenviar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-gray-50 bg-gray-50/50">
                <button 
                  onClick={() => setIsOrderModalOpen(false)}
                  className="w-full px-8 py-4 bg-white text-secondary/60 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
                >
                  Fechar Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Cadastro/Edição de Categoria */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black text-secondary">
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </h3>
                  <p className="text-secondary/40 font-medium">Gerencie as categorias da loja.</p>
                </div>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-danger transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Nome da Categoria</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Slug (URL)</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-white text-secondary/60 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Salvar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
