import React, { useState, useEffect } from 'react';
import { 
  Routes, 
  Route, 
  Link, 
  useLocation, 
  useNavigate,
  Navigate
} from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  LayoutDashboard, 
  ChevronRight, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserCheck,
  BookOpen,
  X,
  Backpack,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Admin Components ---

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Pais', path: '/admin/pais', icon: Users },
    { name: 'Alunos', path: '/admin/alunos', icon: Backpack },
    { name: 'Tutores', path: '/admin/tutores', icon: GraduationCap },
  ];

  return (
    <div className="w-64 bg-secondary text-white h-screen sticky top-0 flex flex-col">
      <div className="p-8 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-widest text-xs">Voltar ao Site</span>
        </Link>
        <h1 className="text-2xl font-black mt-6 tracking-tighter">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black">AD</div>
          <div>
            <p className="text-sm font-black">Administrador</p>
            <p className="text-[10px] text-white/40 uppercase font-bold">Acesso Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ pais: 0, alunos: 0, tutores: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [paisCount, alunosCount, tutoresCount] = await Promise.all([
          supabase.from('pais').select('*', { count: 'exact', head: true }),
          supabase.from('alunos').select('*', { count: 'exact', head: true }),
          supabase.from('tutores').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          pais: paisCount.count || 0,
          alunos: alunosCount.count || 0,
          tutores: tutoresCount.count || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { name: 'Pais Cadastrados', value: stats.pais, icon: Users, color: 'bg-blue-500', path: '/admin/pais' },
    { name: 'Alunos Ativos', value: stats.alunos, icon: Backpack, color: 'bg-primary', path: '/admin/alunos' },
    { name: 'Tutores Certificados', value: stats.tutores, icon: GraduationCap, color: 'bg-orange-500', path: '/admin/tutores' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black text-secondary tracking-tight">Dashboard</h2>
        <p className="text-secondary/60 font-medium">Bem-vindo à área de administração da Phaleduc.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center gap-6 group hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => navigate(card.path)}
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", card.color)}>
              <card.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-secondary/40 font-black uppercase text-[10px] tracking-widest">{card.name}</p>
              <p className="text-4xl font-black text-secondary">{loading ? '...' : card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-6">
          <h3 className="text-2xl font-black text-secondary">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/pais" className="p-6 bg-gray-50 rounded-3xl flex flex-col items-center text-center gap-3 hover:bg-primary/5 transition-all group">
              <UserPlus className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-secondary text-sm">Novo Pai</span>
            </Link>
            <Link to="/admin/alunos" className="p-6 bg-gray-50 rounded-3xl flex flex-col items-center text-center gap-3 hover:bg-primary/5 transition-all group">
              <PlusCircle className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-secondary text-sm">Novo Aluno</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-secondary p-10 rounded-[40px] shadow-xl text-white space-y-6">
          <h3 className="text-2xl font-black">Status do Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="font-bold">Supabase API</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-success/20 text-success px-3 py-1 rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-primary" />
                <span className="font-bold">Autenticação</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-primary/20 text-primary px-3 py-1 rounded-full">Ativa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Generic Management Component ---
const ManageResource = ({ 
  title, 
  table, 
  columns, 
  fields,
  icon: Icon,
  customSelect = '*',
  extraActions
}: { 
  title: string, 
  table: string, 
  columns: { key: string, label: string, render?: (val: any, item?: any) => React.ReactNode }[],
  fields: { key: string, label: string, type: string, options?: (string | { value: string, label: string })[] }[],
  icon: any,
  customSelect?: string,
  extraActions?: (item: any, reload: () => void) => React.ReactNode
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [table]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.from(table).select(customSelect).order('created_at', { ascending: false });
      if (error) throw error;
      setData(result || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Clean up data: remove empty strings and handle UUIDs
      const cleanData = { ...formData };
      Object.keys(cleanData).forEach(key => {
        // Remove empty strings so Supabase can use NULL or default values
        if (cleanData[key] === '') {
          delete cleanData[key];
        }
        // Ensure ID is not sent on insert
        if (!editingItem && key === 'id') {
          delete cleanData[key];
        }
      });

      let result;
      if (editingItem) {
        result = await supabase
          .from(table)
          .update(cleanData)
          .eq('id', editingItem.id);
      } else {
        result = await supabase
          .from(table)
          .insert([cleanData]);
      }

      if (result.error) throw result.error;

      await fetchData();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving:', err);
      const message = err.message || err.details || err.hint || 'Erro desconhecido';
      alert(`Erro ao salvar: ${message}\n\nVerifique se todos os campos obrigatórios estão preenchidos corretamente.`);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('ID copiado para a área de transferência!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Erro ao excluir o registro.');
    }
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black text-secondary tracking-tight">{title}</h2>
          </div>
          <p className="text-secondary/60 font-medium">Gerencie o cadastro de {title.toLowerCase()} da Phaleduc.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Adicionar {title.slice(0, -1)}
        </button>
      </header>

      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30" />
            <input 
              type="text" 
              placeholder={`Buscar ${title.toLowerCase()}...`}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-primary transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-primary transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {columns.map(col => (
                  <th key={col.key} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">
                    {col.label}
                  </th>
                ))}
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100">
                  ID
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary/40 border-b border-gray-100 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="font-bold text-secondary/40">Carregando dados...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-secondary/10" />
                    </div>
                    <p className="font-bold text-secondary/40">Nenhum registro encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, i) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    {columns.map(col => (
                      <td key={col.key} className="px-8 py-6 border-b border-gray-50">
                        {col.render ? col.render(item[col.key], item) : (
                          <span className="font-bold text-secondary">{item[col.key] || '-'}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-8 py-6 border-b border-gray-50">
                      <button 
                        onClick={() => copyToClipboard(item.id)}
                        className="text-[10px] font-mono bg-gray-100 hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors"
                        title="Clique para copiar o ID"
                      >
                        {item.id.slice(0, 8)}...
                      </button>
                    </td>
                    <td className="px-8 py-6 border-b border-gray-50 text-right">
                      <div className="flex justify-end gap-2">
                        {extraActions && extraActions(item, fetchData)}
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-secondary/20 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
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
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black text-secondary">
                    {editingItem ? 'Editar' : 'Adicionar'} {title.slice(0, -1)}
                  </h3>
                  <p className="text-secondary/40 font-medium">Preencha os campos abaixo.</p>
                </div>
                <button onClick={handleCloseModal} className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-danger transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-6">
                <div className="grid gap-6">
                  {fields.map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select 
                          required
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        >
                          <option value="">Selecione...</option>
                          {field.options?.map(opt => {
                            const value = typeof opt === 'string' ? opt : opt.value;
                            const label = typeof opt === 'string' ? opt : opt.label;
                            return <option key={value} value={value}>{label}</option>;
                          })}
                        </select>
                      ) : (
                        <input 
                          required
                          type={field.type}
                          placeholder={field.label}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-8 py-4 bg-gray-50 text-secondary/60 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
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
                      editingItem ? 'Salvar Alterações' : 'Cadastrar agora'
                    )}
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

// --- Main Admin Area ---

export const AdminArea = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [parents, setParents] = useState<{ value: string, label: string }[]>([]);
  const [tutors, setTutors] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          throw new Error('Credenciais do Supabase não encontradas. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
        }
        
        setIsAuthenticated(true);

        // Fetch parents and tutors for the Alunos form
        const [paisRes, tutoresRes] = await Promise.all([
          supabase.from('pais').select('id, nome').order('nome'),
          supabase.from('tutores').select('id, nome').order('nome')
        ]);

        if (paisRes.data) {
          setParents(paisRes.data.map(p => ({ value: p.id, label: p.nome })));
        }
        if (tutoresRes.data) {
          setTutors(tutoresRes.data.map(t => ({ value: t.id, label: t.nome })));
        }
      } catch (err: any) {
        console.error('AdminArea config error:', err);
        setConfigError(err.message);
        setIsAuthenticated(false);
      }
    }
    init();
  }, []);

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-2xl w-full bg-white p-12 rounded-[40px] shadow-2xl space-y-8 border border-danger/10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center text-danger mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-secondary">Erro de Configuração</h2>
            <p className="text-secondary/60 font-medium">{configError}</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl space-y-4 border border-gray-100">
            <h3 className="font-black text-secondary uppercase tracking-widest text-xs">Como resolver no Vercel:</h3>
            <ol className="space-y-3 text-sm text-secondary/70 list-decimal ml-4 font-medium">
              <li>Acesse o dashboard do seu projeto no <a href="https://vercel.com" target="_blank" className="text-primary underline">Vercel</a>.</li>
              <li>Vá em <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
              <li>Adicione as seguintes variáveis:
                <ul className="mt-2 space-y-2 font-mono text-[10px] bg-white p-4 rounded-xl border border-gray-200">
                  <li className="flex justify-between">
                    <span className="font-bold">VITE_SUPABASE_URL</span>
                    <span className="text-secondary/40">Sua URL do Supabase</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-bold">VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-secondary/40">Sua Anon Key do Supabase</span>
                  </li>
                </ul>
              </li>
              <li>Após adicionar, faça um novo <strong>Redeploy</strong> do seu projeto para aplicar as mudanças.</li>
            </ol>
          </div>

          <div className="pt-4 text-center">
            <Link to="/" className="inline-block bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all">
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/pais" element={
              <ManageResource 
                title="Pais" 
                table="pais" 
                icon={Users}
                columns={[
                  { key: 'nome', label: 'Nome' },
                  { key: 'email', label: 'E-mail' },
                  { key: 'telefone', label: 'Telefone' },
                  { key: 'endereco', label: 'Endereço' },
                  { key: 'created_at', label: 'Cadastro', render: (val) => new Date(val).toLocaleDateString() }
                ]}
                fields={[
                  { key: 'nome', label: 'Nome Completo', type: 'text' },
                  { key: 'email', label: 'E-mail', type: 'email' },
                  { key: 'telefone', label: 'Telefone', type: 'tel' },
                  { key: 'endereco', label: 'Endereço', type: 'text' },
                  { key: 'parent_pin', label: 'PIN de Segurança (4 dígitos)', type: 'text' }
                ]}
              />
            } />
            <Route path="/alunos" element={
              <ManageResource 
                title="Alunos" 
                table="alunos" 
                icon={Backpack}
                customSelect="*, pais(nome), tutores(nome)"
                columns={[
                  { key: 'nome', label: 'Nome' },
                  { key: 'data_nascimento', label: 'Nascimento', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
                  { key: 'nivel', label: 'Nível' },
                  { key: 'parent_id', label: 'Responsável', render: (_, item) => item.pais?.nome || '-' },
                  { key: 'tutor_id', label: 'Tutor', render: (_, item) => item.tutores?.nome || '-' },
                  { key: 'status', label: 'Status' },
                ]}
                fields={[
                  { key: 'nome', label: 'Nome do Aluno', type: 'text' },
                  { key: 'data_nascimento', label: 'Data de Nascimento', type: 'date' },
                  { key: 'nivel', label: 'Nível/Turma', type: 'select', options: ['Iniciante', 'Intermediário', 'Avançado', 'Nativo'] },
                  { key: 'status', label: 'Status', type: 'select', options: ['ativo', 'inativo'] },
                  { key: 'parent_id', label: 'Responsável', type: 'select', options: parents },
                  { key: 'tutor_id', label: 'Tutor', type: 'select', options: tutors },
                  { key: 'observacoes', label: 'Observações', type: 'text' }
                ]}
              />
            } />
            <Route path="/tutores" element={
              <ManageResource 
                title="Tutores" 
                table="tutores" 
                icon={GraduationCap}
                columns={[
                  { key: 'nome', label: 'Nome' },
                  { key: 'email', label: 'E-mail' },
                  { key: 'especialidade', label: 'Especialidade' },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      val === 'ativo' ? "bg-success/10 text-success" : "bg-yellow-500/10 text-yellow-600"
                    )}>
                      {val || 'Pendente'}
                    </span>
                  )}
                ]}
                fields={[
                  { key: 'nome', label: 'Nome do Tutor', type: 'text' },
                  { key: 'email', label: 'E-mail', type: 'email' },
                  { key: 'telefone', label: 'Telefone', type: 'tel' },
                  { key: 'especialidade', label: 'Especialidade', type: 'text' },
                  { key: 'bio', label: 'Biografia/Experiência', type: 'text' },
                  { key: 'status', label: 'Status', type: 'select', options: ['ativo', 'pendente', 'inativo'] }
                ]}
                extraActions={(tutor, reload) => {
                  const handleInvite = async () => {
                    if (tutor.status !== 'ativo') {
                      alert('O tutor precisa estar com status "ativo" para receber um convite.');
                      return;
                    }

                    const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
                    
                    if (!confirm(`Deseja gerar uma senha temporária para ${tutor.nome}?\n\nNova senha: ${tempPassword}`)) return;

                    try {
                      const { error } = await supabase
                        .from('tutores')
                        .update({ 
                          senha_temporaria: tempPassword,
                          convite_enviado_em: new Date().toISOString()
                        })
                        .eq('id', tutor.id);

                      if (error) throw error;
                      
                      alert(`Convite gerado com sucesso!\n\nSenha Temporária: ${tempPassword}\n\nO tutor agora pode acessar o portal usando seu e-mail e esta senha.`);
                      reload();
                    } catch (err: any) {
                      console.error('Error inviting tutor:', err);
                      alert('Erro ao gerar convite. Verifique se a tabela de tutores possui os campos "senha_temporaria" e "convite_enviado_em".');
                    }
                  };

                  return (
                    <button 
                      onClick={handleInvite}
                      title="Enviar Convite (Gerar Senha)"
                      className="p-2 text-secondary/20 hover:text-success hover:bg-success/10 rounded-lg transition-all"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  );
                }}
              />
            } />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminArea;
