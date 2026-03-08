import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  Loader2,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Types ---

interface ParentFormData {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

interface StudentFormData {
  nome: string;
  data_nascimento: string;
  nivel: string;
  observacoes: string;
}

interface TutorFormData {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  bio: string;
  senha?: string;
}

// --- Components ---

export const StudentParentRegistration = ({ planName, onSuccess }: { planName: string, onSuccess: () => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState<ParentFormData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [studentData, setStudentData] = useState<StudentFormData>({
    nome: '',
    data_nascimento: '',
    nivel: 'Iniciante',
    observacoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register/Update Parent
      // Note: In a real app, we'd use auth.signUp first if they don't have an account.
      // For this demo, we'll assume the user might already be logged in or we just insert into the table.
      // The SQL provided uses auth.uid() for pais.id, so we need a session.
      
      const { data: { session } } = await supabase.auth.getSession();
      
      let parentId: string;

      if (session) {
        parentId = session.user.id;
        // Upsert parent info
        const { error: pError } = await supabase
          .from('pais')
          .upsert({
            id: parentId,
            nome: parentData.nome,
            email: parentData.email,
            telefone: parentData.telefone,
            endereco: parentData.endereco
          });
        if (pError) throw pError;
      } else {
        // If no session, we might need to create one or use a different ID strategy.
        // For now, let's try to insert and let Supabase handle the ID if it's not auth.uid()
        // But the SQL says DEFAULT auth.uid(). Let's assume the user needs to be logged in.
        alert("Por favor, faça login ou crie uma conta no Portal da Família antes de se inscrever.");
        setLoading(false);
        return;
      }

      // 2. Register Student
      const { error: sError } = await supabase
        .from('alunos')
        .insert({
          nome: studentData.nome,
          data_nascimento: studentData.data_nascimento,
          nivel: studentData.nivel,
          parent_id: parentId,
          observacoes: `Plano: ${planName}. ${studentData.observacoes}`
        });

      if (sError) throw sError;

      alert("Inscrição realizada com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error("Erro na inscrição:", error);
      alert("Erro ao realizar inscrição: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-12">
        <div className="flex gap-2">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className={`w-12 h-2 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-gray-100'}`} 
            />
          ))}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-secondary/40">
          Passo {step} de 2
        </span>
      </div>

      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }}>
        {step === 1 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-3xl font-black text-secondary tracking-tighter">Dados do Responsável</h3>
            <p className="text-secondary/50 font-medium">Precisamos de algumas informações para contato.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={parentData.nome}
                  onChange={(e) => setParentData({...parentData, nome: e.target.value})}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={parentData.email}
                  onChange={(e) => setParentData({...parentData, email: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
                <input 
                  type="tel" 
                  placeholder="Telefone" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={parentData.telefone}
                  onChange={(e) => setParentData({...parentData, telefone: e.target.value})}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Endereço Completo" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={parentData.endereco}
                  onChange={(e) => setParentData({...parentData, endereco: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2"
            >
              Próximo Passo <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-3xl font-black text-secondary tracking-tighter">Dados do Aluno</h3>
            <p className="text-secondary/50 font-medium">Agora, conte-nos sobre quem vai aprender!</p>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Nome do Aluno" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={studentData.nome}
                  onChange={(e) => setStudentData({...studentData, nome: e.target.value})}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
                <input 
                  type="date" 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={studentData.data_nascimento}
                  onChange={(e) => setStudentData({...studentData, data_nascimento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-4">Nível de Português</label>
                <select 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={studentData.nivel}
                  onChange={(e) => setStudentData({...studentData, nivel: e.target.value})}
                >
                  <option value="Iniciante">Iniciante (Não fala/entende pouco)</option>
                  <option value="Intermediário">Intermediário (Entende mas fala pouco)</option>
                  <option value="Avançado">Avançado (Fala bem, quer melhorar escrita)</option>
                  <option value="Nativo">Nativo (Fluente)</option>
                </select>
              </div>
              <textarea 
                placeholder="Observações ou necessidades especiais" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all resize-none h-32"
                value={studentData.observacoes}
                onChange={(e) => setStudentData({...studentData, observacoes: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-5 bg-gray-100 text-secondary rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Voltar
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finalizar Inscrição'}
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export const TutorRegistration = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TutorFormData>({
    nome: '',
    email: '',
    telefone: '',
    especialidade: 'Alfabetização',
    bio: '',
    senha: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tutores')
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          especialidade: formData.especialidade,
          bio: formData.bio,
          senha: formData.senha,
          status: 'pendente' // New tutors start as pending review
        });

      if (error) throw error;

      alert("Cadastro de tutor realizado com sucesso! Entraremos em contato em breve.");
      onSuccess();
    } catch (error: any) {
      console.error("Erro no cadastro de tutor:", error);
      alert("Erro ao realizar cadastro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mx-auto mb-6">
          <GraduationCap className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-secondary tracking-tighter">Seja um Tutor Phaleduc</h3>
        <p className="text-secondary/50 font-medium">Junte-se à nossa rede de educadores apaixonados.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nome Completo" 
              required
              className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none font-bold transition-all"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
            <input 
              type="email" 
              placeholder="E-mail Profissional" 
              required
              className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none font-bold transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
            <input 
              type="tel" 
              placeholder="Telefone / WhatsApp" 
              required
              className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none font-bold transition-all"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-4">Sua Especialidade Principal</label>
            <select 
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none font-bold transition-all"
              value={formData.especialidade}
              onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
            >
              <option value="Alfabetização">Alfabetização</option>
              <option value="Gramática">Gramática / Escrita</option>
              <option value="Cultura">Cultura Brasileira / POLH</option>
              <option value="Psicopedagogia">Psicopedagogia</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <textarea 
            placeholder="Conte um pouco sobre sua experiência com educação e língua de herança..." 
            required
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none font-bold transition-all resize-none h-40"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          />
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Crie uma Senha de Acesso" 
              required
              minLength={6}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none font-bold transition-all"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enviar Candidatura'}
        </button>
      </form>
    </div>
  );
};
