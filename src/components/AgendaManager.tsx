import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  User, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  BookOpen,
  Settings,
  Star,
  GraduationCap,
  MessageSquare,
  Search,
  Filter,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type EventType = 'regular' | 'reposicao' | 'experimental' | 'reuniao_pais' | 'treinamento';

interface AgendaEvent {
  id: string;
  tutor_id: string;
  turma_id?: string;
  aluno_id?: string;
  tipo_evento: EventType;
  titulo: string;
  descricao?: string;
  link_reuniao?: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: string;
  visibilidade: string;
  pauta?: string;
  ata?: string;
  tutores?: { nome: string };
  turmas?: { nome: string };
  alunos?: { nome: string };
}

export const AgendaManager = ({ 
  mode = 'admin', 
  userId,
  tutorId,
  parentId 
}: { 
  mode?: 'admin' | 'tutor' | 'parent', 
  userId?: string,
  tutorId?: string,
  parentId?: string
}) => {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  
  // State for new event form
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo_evento: 'regular' as EventType,
    tutor_id: tutorId || '',
    turma_id: '',
    aluno_id: '',
    data_hora_inicio: '',
    data_hora_fim: '',
    link_reuniao: '',
    descricao: '',
    visibilidade: 'publico'
  });

  // Data for selects
  const [tutores, setTutores] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
    if (mode === 'admin') {
      fetchSupportData();
    }
  }, [currentDate, view, mode]);

  const fetchSupportData = async () => {
    const [tRes, trRes, aRes] = await Promise.all([
      supabase.from('tutores').select('id, nome').eq('status', 'ativo'),
      supabase.from('turmas').select('id, nome'),
      supabase.from('alunos').select('id, nome')
    ]);
    setTutores(tRes.data || []);
    setTurmas(trRes.data || []);
    setAlunos(aRes.data || []);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('agenda_eventos')
        .select('*, tutores(nome), turmas(nome), alunos(nome)');

      if (mode === 'tutor' && tutorId) {
        query = query.eq('tutor_id', tutorId);
      } else if (mode === 'parent' && parentId) {
        // For parents, we need to find events for their children
        const { data: children } = await supabase.from('alunos').select('id').eq('parent_id', parentId);
        const childIds = children?.map(c => c.id) || [];
        query = query.or(`aluno_id.in.(${childIds.join(',')}),turma_id.in.(select turma_id from alunos where parent_id = '${parentId}')`);
        query = query.eq('visibilidade', 'publico');
      }

      const { data, error } = await query.order('data_hora_inicio', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('agenda_eventos')
        .insert([formData]);
      
      if (error) throw error;
      toast.success('Evento agendado com sucesso!');
      setIsEventModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      toast.error('Erro ao agendar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'regular': return 'bg-blue-500';
      case 'reposicao': return 'bg-orange-500';
      case 'experimental': return 'bg-emerald-500';
      case 'reuniao_pais': return 'bg-amber-500';
      case 'treinamento': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventLabel = (type: EventType) => {
    switch (type) {
      case 'regular': return 'Aula Regular';
      case 'reposicao': return 'Reposição';
      case 'experimental': return 'Experimental';
      case 'reuniao_pais': return 'Reunião de Pais';
      case 'treinamento': return 'Treinamento';
      default: return 'Evento';
    }
  };

  // Simple Calendar Helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-8">
      {/* Header da Agenda */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-secondary tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Agenda Phaleduc
          </h2>
          <p className="text-secondary/60 font-medium">
            {mode === 'admin' ? 'Gestão global de horários e compromissos.' : 
             mode === 'tutor' ? 'Seu painel de trabalho e aulas.' : 
             'Acompanhe os encontros do seu filho.'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setView('month')}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'month' ? "bg-white text-primary shadow-sm" : "text-secondary/40")}
            >Mês</button>
            <button 
              onClick={() => setView('week')}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'week' ? "bg-white text-primary shadow-sm" : "text-secondary/40")}
            >Semana</button>
            <button 
              onClick={() => setView('day')}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", view === 'day' ? "bg-white text-primary shadow-sm" : "text-secondary/40")}
            >Hoje</button>
          </div>

          {mode !== 'parent' && (
            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Novo Evento
            </button>
          )}
        </div>
      </header>

      {/* Calendário Grid */}
      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-secondary/40" />
            </button>
            <h3 className="text-xl font-black text-secondary capitalize">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-secondary/40" />
            </button>
          </div>

          <div className="flex gap-2">
            {['regular', 'reposicao', 'experimental', 'reuniao_pais', 'treinamento'].map((type) => (
              <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                <div className={cn("w-2 h-2 rounded-full", getEventColor(type as EventType))} />
                <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40">{getEventLabel(type as EventType)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-secondary/20">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px]">
          {blanks.map(i => <div key={`blank-${i}`} className="border-r border-b border-gray-50 bg-gray-50/30" />)}
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.data_hora_inicio.startsWith(dateStr));
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <div key={day} className={cn(
                "border-r border-b border-gray-50 p-3 hover:bg-gray-50/50 transition-all group relative",
                isToday && "bg-primary/5"
              )}>
                <span className={cn(
                  "text-sm font-black mb-2 block",
                  isToday ? "text-primary" : "text-secondary/20"
                )}>{day}</span>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
                  {dayEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={cn(
                        "w-full text-left px-2 py-1 rounded-lg text-[9px] font-bold text-white truncate hover:brightness-110 transition-all flex items-center gap-1",
                        getEventColor(event.tipo_evento)
                      )}
                    >
                      <Clock className="w-2 h-2" />
                      {new Date(event.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {event.titulo}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes do Evento */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className={cn("p-8 text-white", getEventColor(selectedEvent.tipo_evento))}>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {getEventLabel(selectedEvent.tipo_evento)}
                  </span>
                  <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-2xl font-black mb-2">{selectedEvent.titulo}</h3>
                <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(selectedEvent.data_hora_inicio).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(selectedEvent.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(selectedEvent.data_hora_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {selectedEvent.descricao && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Descrição</h4>
                    <p className="text-secondary/70 font-medium leading-relaxed">{selectedEvent.descricao}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Tutor</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-secondary/40 font-black text-xs">
                        {selectedEvent.tutores?.nome?.charAt(0)}
                      </div>
                      <span className="font-bold text-secondary">{selectedEvent.tutores?.nome}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Destinatário</h4>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary/40" />
                      <span className="font-bold text-secondary">
                        {selectedEvent.turmas?.nome || selectedEvent.alunos?.nome || 'Geral'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedEvent.link_reuniao && (
                  <a 
                    href={selectedEvent.link_reuniao}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                  >
                    <Video className="w-5 h-5" />
                    Entrar na Sala Virtual
                  </a>
                )}

                {mode === 'tutor' && selectedEvent.status === 'agendado' && (
                  <button 
                    onClick={() => setIsAttendanceModalOpen(true)}
                    className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Fazer Chamada / Notas
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Criação de Evento (Admin/Tutor) */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEventModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black text-secondary">Novo Agendamento</h3>
                  <p className="text-secondary/40 font-medium">Crie um novo compromisso na agenda.</p>
                </div>
                <button onClick={() => setIsEventModalOpen(false)} className="p-4 bg-gray-50 rounded-2xl text-secondary/40 hover:text-danger transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Título do Evento</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Tipo</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.tipo_evento}
                      onChange={(e) => setFormData({ ...formData, tipo_evento: e.target.value as EventType })}
                    >
                      <option value="regular">Aula Regular</option>
                      <option value="reposicao">Reposição</option>
                      <option value="experimental">Aula Experimental</option>
                      <option value="reuniao_pais">Reunião de Pais</option>
                      <option value="treinamento">Treinamento Interno</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Visibilidade</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.visibilidade}
                      onChange={(e) => setFormData({ ...formData, visibilidade: e.target.value })}
                    >
                      <option value="publico">Público (Pais e Alunos)</option>
                      <option value="interno">Interno (Apenas Tutores)</option>
                      <option value="privado">Privado (Apenas Admin)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Início</label>
                    <input 
                      required
                      type="datetime-local"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.data_hora_inicio}
                      onChange={(e) => setFormData({ ...formData, data_hora_inicio: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Término</label>
                    <input 
                      required
                      type="datetime-local"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.data_hora_fim}
                      onChange={(e) => setFormData({ ...formData, data_hora_fim: e.target.value })}
                    />
                  </div>

                  {mode === 'admin' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Tutor Responsável</label>
                      <select 
                        required
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                        value={formData.tutor_id}
                        onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
                      >
                        <option value="">Selecione um tutor</option>
                        {tutores.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Turma (Opcional)</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.turma_id}
                      onChange={(e) => setFormData({ ...formData, turma_id: e.target.value, aluno_id: '' })}
                    >
                      <option value="">Nenhuma (Aula Individual)</option>
                      {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Link da Reunião (Zoom/Meet)</label>
                    <input 
                      type="url"
                      placeholder="https://meet.google.com/..."
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                      value={formData.link_reuniao}
                      onChange={(e) => setFormData({ ...formData, link_reuniao: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-gray-100 text-secondary/60 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Agendar Evento'}
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
