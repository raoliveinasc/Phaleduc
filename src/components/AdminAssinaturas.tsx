import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Plus, 
  Search, 
  Loader2,
  UserPlus,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AdminAssinaturas = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    email: '',
    plan_type: 'mensal',
    duration_days: 30
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, pais(nome, email)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewStudents = async (sub: any) => {
    setSelectedSubscription(sub);
    setIsStudentsModalOpen(true);
    setLoadingStudents(true);
    try {
      // Fetch students linked to this parent (user_id)
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('parent_id', sub.user_id);
      
      if (error) throw error;
      setLinkedStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Find user by email
      // Note: This requires a profiles or users table that we can query by email
      // For this demo, we'll assume we have a way to get the user_id or just store the email
      
      // Mocking user lookup
      const { data: userData, error: userError } = await supabase
        .from('pais')
        .select('id')
        .eq('email', manualFormData.email)
        .single();

      if (userError || !userData) {
        throw new Error('Usuário não encontrado com este e-mail.');
      }

      const now = new Date();
      const expiration = new Date();
      expiration.setDate(now.getDate() + manualFormData.duration_days);

      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userData.id,
          plan_type: manualFormData.plan_type,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: expiration.toISOString(),
          stripe_customer_id: 'manual_grant'
        }]);

      if (error) throw error;

      alert('Acesso concedido com sucesso!');
      setIsManualModalOpen(false);
      fetchSubscriptions();
    } catch (err: any) {
      alert(err.message || 'Erro ao conceder acesso.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.stripe_customer_id?.toLowerCase().includes(search.toLowerCase()) ||
    sub.plan_type.toLowerCase().includes(search.toLowerCase()) ||
    sub.pais?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    sub.pais?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black text-secondary tracking-tight">Gestão de Assinaturas</h2>
          </div>
          <p className="text-secondary/60 font-medium">Controle os planos e acessos dos pais da Phaleduc.</p>
        </div>
        
        <button 
          onClick={() => setIsManualModalOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-5 h-5" />
          Liberação Manual
        </button>
      </header>

      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30" />
            <input 
              type="text" 
              placeholder="Buscar assinante..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">Assinante</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">Plano</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">Início</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">Expiração</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="font-bold text-secondary/40">Carregando assinaturas...</p>
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="font-bold text-secondary/40">Nenhuma assinatura encontrada.</p>
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black">
                          {sub.pais?.nome?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-secondary">{sub.pais?.nome || 'Assinante'}</p>
                          <p className="text-[10px] text-secondary/40 font-mono">{sub.pais?.email || sub.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-50">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">
                        {sub.plan_type}
                      </span>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        {sub.status === 'active' ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-danger" />
                        )}
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          sub.status === 'active' ? "text-success" : "text-danger"
                        )}>
                          {sub.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-50">
                      <span className="text-xs font-bold text-secondary/60">
                        {new Date(sub.current_period_start).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-50">
                      <span className="text-xs font-bold text-secondary/60">
                        {new Date(sub.current_period_end).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-50 text-right">
                      <button 
                        onClick={() => handleViewStudents(sub)}
                        className="p-2 text-secondary/20 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Visualizar Alunos Vinculados"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Grant Modal */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManualModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black text-secondary">Liberação Manual</h3>
                  <p className="text-secondary/40 font-medium">Conceda acesso temporário.</p>
                </div>
                <button onClick={() => setIsManualModalOpen(false)} className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-danger transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleManualGrant} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">E-mail do Usuário</label>
                  <input 
                    required
                    type="email"
                    placeholder="exemplo@email.com"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                    value={manualFormData.email}
                    onChange={(e) => setManualFormData({ ...manualFormData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Plano</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={manualFormData.plan_type}
                      onChange={(e) => setManualFormData({ ...manualFormData, plan_type: e.target.value })}
                    >
                      <option value="mensal">Mensal</option>
                      <option value="semestral">Semestral</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Duração (Dias)</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={manualFormData.duration_days}
                      onChange={(e) => setManualFormData({ ...manualFormData, duration_days: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Conceder Acesso'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Linked Students Modal */}
      <AnimatePresence>
        {isStudentsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStudentsModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-secondary text-white">
                <div>
                  <h3 className="text-3xl font-black">Alunos Vinculados</h3>
                  <p className="text-white/60 font-medium">Dependentes desta assinatura.</p>
                </div>
                <button onClick={() => setIsStudentsModalOpen(false)} className="p-4 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10">
                {loadingStudents ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="font-bold text-secondary/40">Buscando alunos...</p>
                  </div>
                ) : linkedStudents.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <Users className="w-16 h-16 text-secondary/10 mx-auto" />
                    <p className="font-bold text-secondary/40">Nenhum aluno vinculado a este pai.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {linkedStudents.map(student => (
                      <div key={student.id} className="p-6 bg-gray-50 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black">
                          {student.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-secondary">{student.nome}</p>
                          <p className="text-[10px] text-secondary/40 font-black uppercase tracking-widest">{student.idade} Anos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
