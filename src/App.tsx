import React, { useEffect, useState, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { supabase } from './lib/supabase';
import { 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Link as LinkIcon, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Quote, 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Trophy, 
  Star, 
  Play,
  MapPin,
  Music,
  Coffee,
  Bird,
  Target,
  Compass,
  LayoutDashboard,
  Calendar,
  Gamepad,
  Menu,
  X,
  Check,
  Clock,
  Home,
  Info,
  Camera,
  GraduationCap,
  ShoppingBag,
  Award,
  FileText,
  MessageSquare,
  Download,
  Video,
  Lock,
  UserPlus,
  Bell,
  Plus,
  Filter,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Brain,
  Sparkles,
  Mic,
  Pencil,
  Package,
  Settings,
  BarChart3,
  Heart,
  Backpack,
  Map,
  ArrowRight,
  Unlock,
  Gamepad2,
  Globe,
  CreditCard,
  Truck,
  ShieldCheck,
  ShoppingCart,
  PlusCircle,
  MinusCircle,
  Trash2,
  RefreshCw,
  Loader2,
  Minus,
  AlertCircle
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (Simulated for now)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Placeholder');
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Toaster, toast } from 'sonner';

import { AdminArea } from './components/AdminArea';
import { StudentParentRegistration, TutorRegistration } from './components/RegistrationForms';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const LOGO_URL = "https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/logo-phaleduc.png";
const MASCOT_URL = "https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/mascote.png";
const HERO_IMAGE_URL = "https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/hero-image.png";
const ABOUT_ALE_URL = "https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/about-ale.png";

const GALLERY_IMAGES = [
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4914.jpg",
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4915.jpg",
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4916.jpg",
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4917.jpg",
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4918.jpg",
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4919.jpg",
  "https://phaleduc.com/wp-content/uploads/2023/01/IMG_4920.jpg"
];

// --- Components ---

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8 font-display">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-secondary tracking-tight">Ops! Algo deu errado.</h1>
              <p className="text-secondary/60 font-medium">
                Ocorreu um erro inesperado no aplicativo. Por favor, tente recarregar a página.
              </p>
              {this.state.error && (
                <div className="p-4 bg-gray-50 rounded-2xl text-left text-xs font-mono text-rose-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </div>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SupabaseStatus = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Simple check that doesn't require a specific table
        const { error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }
        
        setStatus('connected');
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setError(err.message || 'Erro desconhecido ao conectar ao Supabase');
      }
    }

    checkConnection();
  }, []);

  if (status === 'loading') return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-black uppercase tracking-widest border",
          status === 'connected' 
            ? "bg-success/10 text-success border-success/20" 
            : "bg-danger/10 text-danger border-danger/20"
        )}
      >
        <div className={cn("w-2 h-2 rounded-full animate-pulse", status === 'connected' ? "bg-success" : "bg-danger")} />
        {status === 'connected' ? 'Supabase Conectado' : 'Erro de Configuração'}
        {status === 'error' && (
          <button 
            onClick={() => alert(`Erro: ${error}\n\nVerifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas no Vercel.`)}
            className="ml-1 underline hover:opacity-80"
          >
            Como resolver?
          </button>
        )}
      </motion.div>
    </div>
  );
};

const TopBar = () => (
  <div className="hidden md:block py-3 bg-brand-green text-secondary text-sm font-bold">
    <div className="max-w-7xl mx-auto px-12 flex justify-between items-center">
      <div className="flex gap-8">
        <a href="tel:469-476-6590" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Phone className="w-4 h-4" />
          469-476-6590
        </a>
        <a href="mailto:contato@phaleduc.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Mail className="w-4 h-4" />
          contato@phaleduc.com
        </a>
      </div>
      <div className="flex gap-4">
        <a href="https://fb.com/phaleduc.education" target="_blank" className="bg-success p-2 rounded-full text-white hover:opacity-80 transition-opacity">
          <Facebook className="w-4 h-4" fill="currentColor" />
        </a>
        <a href="https://www.instagram.com/phaleduc" target="_blank" className="bg-success p-2 rounded-full text-white hover:opacity-80 transition-opacity">
          <Instagram className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Sobre', path: '/sobre', icon: Info },
    { name: 'Aulas', path: '/aulas', icon: BookOpen },
    { name: 'Assinaturas', path: '/assinaturas', icon: CreditCard },
    { name: 'Loja Virtual', path: '/loja', icon: ShoppingBag },
    { name: 'Fotos', path: '/fotos', icon: Camera },
    { name: 'Contato', path: '/contato', icon: Phone },
  ];

  return (
    <div className="bg-brand-green pb-6 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[32px] px-6 h-20 flex items-center shadow-lg overflow-x-auto no-scrollbar">
          {/* Logo - Left */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center">
              <img src={LOGO_URL} alt="Phaleduc" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
            </Link>
          </div>
          
          {/* Navigation - Center */}
          <div className="flex-shrink-0 flex justify-center items-center gap-2 md:gap-4 px-4">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[58px] md:min-w-[72px] group",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary" 
                    : "text-secondary hover:bg-secondary/5"
                )}
                title={item.name}
              >
                <item.icon className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Action Buttons - Right */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden lg:block" />
            
            <Link 
              to="/alunos-pais" 
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[80px] md:min-w-[90px] shadow-sm group",
                location.pathname === '/alunos-pais'
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <Users className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Aluno & Pais</span>
            </Link>

            <Link 
              to="/tutores" 
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[70px] md:min-w-[80px] shadow-sm group",
                location.pathname === '/tutores'
                  ? "bg-secondary text-white"
                  : "bg-secondary/10 text-secondary hover:bg-secondary/20"
              )}
            >
              <GraduationCap className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Tutores</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

const Hero = () => (
  <section className="bg-brand-green pt-10 pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex justify-center md:justify-start order-2 md:order-1"
      >
        <img 
          src={HERO_IMAGE_URL} 
          alt="Phaleduc Hero" 
          className="w-full max-w-lg lg:max-w-2xl h-auto drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8 md:space-y-12 text-center md:text-left order-1 md:order-2"
      >
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[0.9] tracking-tighter">
            Aprender <br />
            português é <br />
            divertido!
          </h1>
          <p className="text-base md:text-lg font-bold text-secondary">Matrículas Abertas!</p>
        </div>
        
        <Link 
          to="/inscricao" 
          className="inline-block bg-primary text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black text-lg md:text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-primary/30"
        >
          QUERO ME INSCREVER
        </Link>
      </motion.div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-24 bg-white relative z-10 -mt-20">
    <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8">
      {[
        { 
          title: "Aquisição", 
          color: "bg-danger", 
          icon: Quote, 
          desc: "Estudos e obtenção da linguagem: aquisição da língua materna, segunda língua e da escrita nos processos de alfabetização." 
        },
        { 
          title: "Manutenção", 
          color: "bg-success", 
          icon: Star, 
          desc: "Permite que as crianças brasileiras nascidas no exterior ou emigradas reforçem os laços com a pátria." 
        },
        { 
          title: "Desenvolvimento", 
          color: "bg-primary", 
          icon: Mail,
          desc: "Estudos que variam entre registros formais e informais para ampliação do repertório de insumo linguístico." 
        },
      ].map((feature, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("relative p-12 pt-20 rounded-[40px] text-white text-center shadow-2xl overflow-hidden", feature.color)}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
          </div>
          
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center">
            <feature.icon className={cn("w-12 h-12", feature.title === "Aquisição" ? "text-danger" : feature.title === "Manutenção" ? "text-success" : "text-primary")} />
          </div>
          
          <h3 className="text-3xl font-black mb-6">{feature.title}</h3>
          <p className="text-lg font-bold leading-relaxed opacity-90">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const TeacherIntro = () => (
  <section className="py-32 bg-white overflow-hidden relative">
    {/* Decorative background elements */}
    <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/5 skew-x-12 transform -translate-x-1/4 -z-10" />
    
    <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, x: 30 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative order-2 lg:order-2"
      >
        {/* Harmonious frame */}
        <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 border-primary/30 rounded-tl-3xl" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-4 border-r-4 border-success/30 rounded-br-3xl" />
        
        <div className="relative z-10 rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white">
          <img 
            src={ABOUT_ALE_URL} 
            alt="Teacher Ale" 
            className="w-full h-auto transform hover:scale-105 transition-transform duration-700" 
            referrerPolicy="no-referrer" 
          />
        </div>
        
        {/* Floating badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-4 -left-4 lg:left-12 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-100"
        >
          <p className="text-primary font-black text-xl">25+ Anos</p>
          <p className="text-secondary/60 font-bold text-sm uppercase tracking-wider">de Experiência</p>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-10 order-1 lg:order-1"
      >
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-black uppercase tracking-widest">
            Fundadora & CEO
          </span>
          <h2 className="text-4xl lg:text-6xl font-black text-secondary leading-[1.1]">
            Olá, eu sou a <span className="text-primary">Teacher Ale!</span>
          </h2>
        </div>
        
        <p className="text-lg lg:text-xl text-secondary/70 font-medium leading-relaxed">
          Eu sou a Alessandra de Andrade, fundadora da PHALEDUC. Minha missão é conectar crianças brasileiras ao redor do mundo com suas raízes através da língua e cultura.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            "Pedagoga & Psicopedagoga",
            "Especialista em Bilinguismo",
            "Alfabetização & Letramento",
            "Língua de Herança (POLH)"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <span className="font-bold text-secondary">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-6">
          <Link to="/sobre" className="bg-secondary text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl text-center">
            Minha História
          </Link>
          <Link to="/inscricao" className="bg-white text-secondary border-2 border-secondary/10 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all text-center">
            Falar com a Ale
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const LoopSemanal = () => {
  const steps = [
    { day: "Segunda", title: "História", icon: BookOpen, color: "bg-red-500" },
    { day: "Terça", title: "Jogo", icon: Gamepad2, color: "bg-blue-500" },
    { day: "Quarta", title: "Produção", icon: Trophy, color: "bg-yellow-500" },
    { day: "Sexta", title: "Missão", icon: Target, color: "bg-green-500" },
  ];

  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black text-secondary tracking-tight">Loop Semanal: A Jornada</h2>
          <p className="text-xl text-secondary/60 mt-4 font-medium">Um caminho divertido de aprendizado constante</p>
        </div>

        <div className="relative">
          {/* Dashed Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-primary/30 -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid lg:grid-cols-4 gap-12 relative">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-10 rounded-[40px] shadow-xl border border-white relative z-10 group hover:shadow-2xl transition-all"
              >
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform",
                  step.color
                )}>
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-primary font-black uppercase tracking-widest text-xs">{step.day}</p>
                  <h3 className="text-3xl font-black text-secondary">{step.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CulturalCollections = () => {
  const items = [
    { name: "Pandeiro", icon: Music, color: "text-red-500" },
    { name: "Brigadeiro", icon: Coffee, color: "text-brown-500" },
    { name: "Saci", icon: Bird, color: "text-primary" },
    { name: "Arara-Azul", icon: Bird, color: "text-blue-500" },
    { name: "Capoeira", icon: Users, color: "text-yellow-600" },
    { name: "Amazônia", icon: Star, color: "text-green-600" },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-6xl font-black text-secondary leading-tight">Coleções Culturais</h2>
            <p className="text-2xl text-secondary/70 font-medium leading-relaxed">
              A cada conquista, a criança desbloqueia itens icônicos da nossa cultura brasileira. É um álbum de figurinhas digital que celebra nossas raízes!
            </p>
            <div className="flex flex-wrap gap-4">
              {["Cultura", "História", "Brasil", "Conquistas"].map(tag => (
                <span key={tag} className="bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
                className="bg-gray-50 p-8 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-transparent hover:border-primary/20 transition-all"
              >
                <div className={cn("w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <p className="font-black text-secondary uppercase text-xs tracking-widest">{item.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ParentsPanel = () => {
  const data = [
    { subject: 'Oralidade', A: 120, fullMark: 150 },
    { subject: 'Escrita', A: 98, fullMark: 150 },
    { subject: 'Compreensão', A: 86, fullMark: 150 },
    { subject: 'Cultura', A: 99, fullMark: 150 },
    { subject: 'Gramática', A: 85, fullMark: 150 },
    { subject: 'Vocabulário', A: 65, fullMark: 150 },
  ];

  return (
    <section className="py-32 bg-secondary text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border-8 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border-8 border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[60px] border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-primary p-4 rounded-2xl">
                  <LayoutDashboard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Painel dos Pais</h3>
                  <p className="text-white/60 font-medium">Acompanhe o progresso real</p>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} />
                    <Radar
                      name="Progresso"
                      dataKey="A"
                      stroke="#76c06b"
                      fill="#76c06b"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-10 order-1 lg:order-2">
            <h2 className="text-6xl font-black leading-tight tracking-tighter">Você no controle do aprendizado</h2>
            <p className="text-2xl text-white/70 font-medium leading-relaxed">
              Nosso dashboard exclusivo permite que você acompanhe cada etapa do desenvolvimento do seu filho. Oralidade, escrita e compreensão cultural em um só lugar.
            </p>
            <div className="grid gap-6">
              {[
                { title: "Relatórios Semanais", icon: Calendar },
                { title: "Feedback da Teacher", icon: Mail },
                { title: "Metas de Fluência", icon: Target },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                  <item.icon className="w-8 h-8 text-primary" />
                  <span className="text-xl font-bold">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MascotSection = () => (
  <section className="py-20 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-8 relative">
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center gap-12 bg-primary/10 p-16 rounded-[80px] relative"
      >
        <div className="relative w-64 h-64 flex-shrink-0">
          <img 
            src={MASCOT_URL} 
            alt="Phal Mascote" 
            className="w-full h-auto drop-shadow-2xl relative z-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 rounded-full blur-2xl"></div>
        </div>
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-5xl font-black text-secondary">Oi, eu sou o Phal!</h2>
          <p className="text-2xl text-secondary/70 font-medium leading-relaxed">
            Estou aqui para guiar seu filho em cada aventura pelo mundo da língua portuguesa. Vamos voar juntos?
          </p>
          <button className="bg-primary text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Conhecer a Plataforma
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-secondary text-white pt-32 pb-16">
    <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
      <div className="space-y-8">
        <h3 className="text-3xl font-black">Aprender português é divertido!</h3>
        <div className="space-y-4 text-lg font-medium text-white/70">
          <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /> Frisco, Texas</p>
          <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /> 469-476-6590</p>
          <p className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /> contato@phaleduc.com</p>
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="text-xl font-black uppercase tracking-widest text-primary">SOBRE NÓS</h4>
        <p className="text-lg font-medium text-white/60 leading-relaxed">
          Temos como objetivo disseminar a Língua Portuguesa e Cultura Brasileira para crianças.
        </p>
        <div className="flex gap-4">
          <a href="https://fb.com/phaleduc.education" target="_blank" className="bg-white/10 p-4 rounded-2xl hover:bg-primary transition-all">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="https://www.instagram.com/phaleduc" target="_blank" className="bg-white/10 p-4 rounded-2xl hover:bg-primary transition-all">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="https://wa.me/14694766590" target="_blank" className="bg-white/10 p-4 rounded-2xl hover:bg-primary transition-all">
            <Phone className="w-6 h-6" />
          </a>
          <a href="https://linktr.ee/phaleduc" target="_blank" className="bg-white/10 p-4 rounded-2xl hover:bg-primary transition-all">
            <LinkIcon className="w-6 h-6" />
          </a>
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="text-xl font-black uppercase tracking-widest text-primary">Links Rápidos</h4>
        <ul className="space-y-4 text-lg font-medium text-white/60">
          <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre</Link></li>
          <li><Link to="/aulas" className="hover:text-primary transition-colors">Aulas</Link></li>
          <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
        </ul>
      </div>

      <div className="space-y-8">
        <h4 className="text-xl font-black uppercase tracking-widest text-primary">Acompanhe as novidades</h4>
        <div className="space-y-4">
          <p className="text-white/60 font-medium">Fique por dentro de tudo que acontece na Phaleduc.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Seu e-mail" className="bg-white/10 border border-white/20 p-4 rounded-xl outline-none focus:border-primary transition-all flex-grow" />
            <button className="bg-primary text-white p-4 rounded-xl hover:brightness-110 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-8 mt-32 pt-10 border-t border-white/10 text-center text-white/40 font-bold">
      <p>Feito com ❤️ por <a href="https://magic.social" target="_blank" className="hover:text-primary">Magic Social</a> © 2022-2023 Phaleduc</p>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <SupabaseStatus />
    <Hero />
    <Features />
    <TeacherIntro />
    <HomeReviews />
    <HomeGalleryCTA />
    <EnrollmentCTA />
  </motion.div>
);

const HomeReviews = () => (
  <section className="py-32 bg-gray-50">
    <div className="max-w-7xl mx-auto px-8">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black text-secondary tracking-tight">Reviews</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        {[
          {
            text: "Meu filho apesar de entender português, ele tinha uma dificuldade e resistência muito grande em falar. Foi então, que encontrei a Alessandra, uma pessoa maravilhosa, carinhosa e muito profissional. Meu filho simplesmente esta amando fazer as aulas e está cada dia falando melhor.",
            author: "Elisangela",
            sub: "Mãe do Nicholas"
          },
          {
            text: "Um privilégio ter meus filhos estudando na Phaleduc. Eles evoluem rápido e amam as vivências com a cultura brasileira.",
            author: "Andréia Oliveira",
            sub: "Mãe do Gabriel e Rafael"
          }
        ].map((review, i) => (
          <div key={i} className="bg-white p-12 rounded-[60px] shadow-xl relative border border-gray-100">
            <Quote className="w-16 h-16 text-primary/10 absolute top-10 right-10" />
            <p className="text-xl italic font-medium text-secondary/80 leading-relaxed mb-8">"{review.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
              <div>
                <h4 className="font-black text-secondary">{review.author}</h4>
                <p className="text-primary text-sm font-bold">{review.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomeGalleryCTA = () => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-8 text-center space-y-12">
      <h2 className="text-4xl font-black text-secondary tracking-tight">Nossas aventuras</h2>
      <Link 
        to="/fotos" 
        className="inline-block bg-secondary text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
      >
        ver galeria de fotos
      </Link>
    </div>
  </section>
);

const EnrollmentCTA = () => (
  <section className="py-32 bg-brand-green">
    <div className="max-w-4xl mx-auto px-8 text-center space-y-10">
      <h2 className="text-4xl font-black text-secondary tracking-tight">Inscrições abertas</h2>
      <p className="text-lg text-secondary/80 font-medium leading-relaxed">
        Que tal despertar o prazer do seu filho em falar Português? Na Phaleduc, as aulas são desenvolvidas com temas variados com o objetivo de promover a língua portuguesa como língua de herança. As aulas são presenciais e focadas em compreensão, oralidade, aquisição de novos vocabulários e conexão entre os brasileirinhos.
      </p>
      <Link 
        to="/inscricao" 
        className="inline-block bg-primary text-white px-16 py-8 rounded-3xl font-black text-xl uppercase tracking-widest hover:scale-110 transition-all shadow-2xl shadow-primary/30"
      >
        EU QUERO
      </Link>
    </div>
  </section>
);

const PageHeader = ({ title }: { title: string }) => (
  <section className="py-24 bg-gray-50 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-8">
      <h1 className="text-5xl md:text-6xl font-black text-secondary tracking-tighter">{title}</h1>
    </div>
  </section>
);

const SobrePage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <PageHeader title="Sobre" />
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-success/10 rounded-[60px] lg:rounded-[100px] -rotate-3 group-hover:rotate-0 transition-transform duration-500 -z-10"></div>
            <div className="relative rounded-[60px] lg:rounded-[80px] overflow-hidden shadow-2xl border-8 border-white max-w-md mx-auto lg:mx-0">
              <img src={ABOUT_ALE_URL} alt="Alessandra Andrade" className="w-full h-auto" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-3xl lg:text-4xl font-black text-secondary">Alessandra Andrade</h3>
            <p className="text-lg lg:text-xl font-bold text-primary uppercase tracking-widest">CEO e fundadora da PHALEDUC</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 lg:space-y-10 text-lg lg:text-xl text-secondary/80 leading-relaxed font-medium"
        >
          <h3 className="text-3xl lg:text-4xl font-black text-secondary tracking-tight">Sobre a Ale</h3>
          <p>Possui experiência de mais de 25 anos na area de educacao infantil e ensino fundamental, tendo atuado ao longo de sua carreira como Professora, Coordenadora Pedagógica e Diretora de Ensino em institucoes de ensino privada.</p>
          <p>Formada em Magistério, com Bacharel em Pedagogia, Pos Graduada em Educacao Infantil, possui Especializações em Praticas em Alfabetização, Distúrbios do Aprendizado e questões Bilingue e Português como Língua de Herança.</p>
          <p>Em sua trajetória profissional teve a oportunidade de implantar, reestruturar e desenvolver diferentes projetos pedagógicos, participar ativamente de processos estruturais decorrentes de mudanças na legislação de ensino e atuar no acolhimento de alunos brasileiros nascidos ou migrados no exterior em sua adaptação no retorno ao Brasil.</p>
          <p>Em 2017 estabeleceu-se fora do Brasil mudando-se para Europa, mais precisamente Budapeste/Hungria, seguindo seu esposo em sua oportunidade profissional, e mais recentemente à partir de 2019 esta baseada no Texas/USA.</p>
          <p>A partir destas andanças, aliado ao desejo de manter a Língua Portuguesa como herança para o seus filhos e observando o mesmo desafio em diversas comunidades Brasileras identificou a necessidade de désenvolver um projeto direcionado a filhos de Brasileiros emigradas ou nascidos no exterior de aprender e desenvolver a Lingua Portuguesa Brasileira e manter os laços culturais com seu país, nascendo assim a Phaleduc.</p>
          <p>A PHALEDUC (Portuguese as Heritage Language Education) tem como objetivo auxiliar os interessados em manter e disseminar a Língua Portuguesa e Cultura Brasileira, especialmente filhos e herdeiros de pais Brasileiros que vivem fora do Brasil e pessoas interessadas em saber mais sobre a lingua e cultura.</p>
          <p>Alem dos desafios com o projeto Phaleduc, Alessandra Andrade é casada mãe do Pedro e Malu que são suas fontes de inspiração e tem contribuído de forma prática com o projeto e investe suas horas vagas em culinária e filmes/leituras sobre relações humanas.</p>
          <div className="pt-10">
            <Link to="/inscricao" className="bg-primary text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
              Fazer parte da turminha
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 space-y-20">
        <div className="text-center">
          <h2 className="text-4xl font-black text-secondary">A Phaleduc</h2>
          <p className="text-xl text-secondary/60 mt-4 font-bold">Portuguese Heritage as Language Education</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Aquisição",
              desc: "Propõe-se estudos e obtenção da linguagem através de diversas áreas como por exemplo: aquisição da língua materna, aquisição de uma segunda língua e aquisição da escrita nos processos de alfabetização."
            },
            {
              title: "Manutenção",
              desc: "Permite que as crianças brasileiras nascidas no exterior ou emigradas tenha acesso ao idioma e a nossa cultura, reforçando assim laços com a pátria."
            },
            {
              title: "Desenvolvimento",
              desc: "Utilizar-se de uma política linguística em conjunto escola e família, oferecendo materiais que variem entre registros formais e informais e que possibilitem a ampliação do repertorio de insumo linguístico a que os aprendizers têm acesso diariamente."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-12 rounded-[50px] shadow-xl border border-gray-100">
              <h4 className="text-2xl font-black text-primary mb-6">{item.title}</h4>
              <p className="text-lg font-medium text-secondary/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary text-white p-16 rounded-[60px] space-y-8">
          <h3 className="text-3xl font-black">Por que manter o Português como Herança?</h3>
          <p className="text-lg font-medium text-white/80 leading-relaxed">
            Além dos benefícios básicos como Fortalecimento dos laços familiares, Preservação da Cultura, e Diferencial Competitivo, o desenvolvimento da Língua Portuguesa auxilia as crianças nos desafios inerentes a socialização tais como facilitar Interação com outras crianças da mesma língua, adaptação junto à Comunidade da Língua Portuguesa Brasileira ou Reintegração em caso de retorno para seu país.
          </p>
        </div>
      </div>
    </section>
  </motion.div>
);

const AulasPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <PageHeader title="Nossas Aulas" />
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8 space-y-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-secondary">4-13 anos</h2>
            <p className="text-xl text-secondary/70 font-medium leading-relaxed">
              Crianças entre 4 a 13 anos, nascidas no Brasil ou em outros países e que tenham o contato com a Língua Portuguesa em casa ou em comunidades Brasileiras.
            </p>
            <h2 className="text-3xl font-black text-secondary pt-8">Metodologia de Ensino</h2>
            <p className="text-lg text-secondary/70 font-medium leading-relaxed">
              Nosso método de ensino é desenvolvido unindo o dinamismo das tecnologias e a ludicidade que auxiliam no desenvolvimento do plano de ensino, ou seja, unimos educação + jogos + conteúdos digitais + praticidade para atingirmos nossos objetivos.
            </p>
            <p className="text-lg text-secondary/70 font-medium leading-relaxed">
              As aulas são divididas em três momentos que envolvem atividades de escrita, leitura e interpretação e jogo relacionado ao tema da aula.
            </p>
          </div>
          <div className="relative">
            <div className="bg-primary/10 w-full aspect-square rounded-[80px] flex items-center justify-center">
              <Gamepad className="w-48 h-48 text-primary opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 bg-gray-50 p-16 rounded-[60px]">
            <h3 className="text-2xl font-black text-secondary mb-8">Conteúdo programático</h3>
            <p className="text-lg text-secondary/70 font-medium leading-relaxed mb-6">
              O conteúdo programático é planejado abrangendo a cultura brasileira e suas datas comemorativas, as características da comunidade e demonstrações dos aspectos locais e de uma população.
            </p>
            <p className="text-lg text-secondary/70 font-medium leading-relaxed">
              A abordagem da pluralidade cultural do Brasil é enfatizada através de diferentes jogos e brincadeiras, gêneros textuais, conteúdos digitais e produções escritas.
            </p>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h3 className="text-2xl font-black text-secondary">Desenvolvimento</h3>
            <ul className="space-y-6">
              {[
                "Participação ativa dos alunos no contexto de sua aprendizagem.",
                "Percepção do papel do professor como facilitador efetivo e mediador do conhecimento.",
                "Conteúdo de linguagem (oralidade e escrita) de acordo com o nível de aprendizagem do aluno."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-lg font-bold text-secondary">
                  <CheckCircle2 className="w-8 h-8 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-16">
          <h2 className="text-3xl font-black text-secondary text-center">Objetivos por Faixa Etária</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                age: "4 à 5 anos",
                items: [
                  "Identificar as letras do alfabeto",
                  "Identificar os sons de letras do alfabeto",
                  "Identificar as vogais",
                  "Arriscar a escrita de palavras",
                  "Cantar e memorizar músicas",
                  "Recontar pequenas histórias",
                  "Interpretar e responder perguntas",
                  "Produzir pequenas frases",
                  "Identificar e nomear objetos"
                ]
              },
              {
                age: "6 à 8 anos",
                items: [
                  "Identificar e nomear letras",
                  "Identificar sons das letras",
                  "Escrita utilizando letras para sílabas",
                  "Escrita com sílabas simples",
                  "Comparar registros diferentes",
                  "Perceber registros em tempos diferentes",
                  "Expressar ideias e sentimentos",
                  "Comunicar-se com autonomia"
                ]
              },
              {
                age: "9 à 13 anos",
                items: [
                  "Identificar sons das letras",
                  "Escrita com sílabas simples e complexas",
                  "Aplicar singular e plural",
                  "Gêneros masculino e feminino",
                  "Produzir diversos gêneros textuais",
                  "Expressar-se no passado, presente e futuro",
                  "Ler com autonomia",
                  "Conversação espontânea"
                ]
              }
            ].map((group, i) => (
              <div key={i} className="bg-white p-10 rounded-[50px] shadow-xl border border-gray-100">
                <h4 className="text-2xl font-black text-primary mb-8">{group.age}</h4>
                <ul className="space-y-4">
                  {group.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-secondary/70 font-bold">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const DepoimentosPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <PageHeader title="Depoimentos" />
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-center mb-16">
          <a href="https://www.facebook.com/phaleduc.education/reviews" target="_blank" className="bg-primary text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            envie sua review
          </a>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              text: "Meu filho apesar de entender português, ele tinha uma dificuldade e resistência muito grande em falar. Foi então, que encontrei a Alessandra, uma pessoa maravilhosa, carinhosa e muito profissional. Meu filho simplesmente esta amando fazer as aulas e está cada dia falando melhor. Estou muito grata e feliz por ver a evolução dele.",
              author: "Elisangela",
              sub: "Mãe do Nicholas"
            },
            {
              text: "Um privilégio ter meus filhos estudando na Phaleduc. Eles evoluem rápido e amam as vivências com a cultura brasileira.",
              author: "Andréia Oliveira",
              sub: "Mãe do Gabriel e Rafael"
            }
          ].map((review, i) => (
            <div key={i} className="bg-gray-50 p-16 rounded-[60px] space-y-8 relative">
              <Quote className="w-20 h-20 text-primary/10 absolute top-10 right-10" />
              <p className="text-xl italic font-medium text-secondary/80 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full"></div>
                <div>
                  <h4 className="text-xl font-black text-secondary">{review.author}</h4>
                  <p className="text-secondary/60 font-medium">{review.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

const AssinaturasPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'mensal',
      name: 'Plano Mensal',
      price: '$ 19.90',
      period: '/mês',
      description: 'Ideal para experimentar o método.',
      features: ['Acesso total ao Método', 'Área de Atividades Exclusiva', 'Suporte Pedagógico'],
      color: 'bg-primary',
      buttonColor: 'bg-primary',
      stripePriceId: 'price_monthly_id' // Placeholder
    },
    {
      id: 'semestral',
      name: 'Plano Semestral',
      price: '$ 99.00',
      period: '/6 meses',
      description: 'O melhor custo-benefício para sua família.',
      features: ['Acesso total ao Método', 'Área de Atividades Exclusiva', 'Suporte Pedagógico', 'Desconto de 15%'],
      color: 'bg-secondary',
      buttonColor: 'bg-secondary',
      popular: true,
      stripePriceId: 'price_semiannual_id' // Placeholder
    },
    {
      id: 'anual',
      name: 'Plano Anual',
      price: '$ 179.00',
      period: '/ano',
      description: 'Compromisso total com o bilinguismo.',
      features: ['Acesso total ao Método', 'Área de Atividades Exclusiva', 'Suporte Pedagógico', 'Desconto de 25%', 'Mentoria em Grupo'],
      color: 'bg-success',
      buttonColor: 'bg-success',
      stripePriceId: 'price_annual_id' // Placeholder
    }
  ];

  const handleSubscribe = async (plan: any) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Por favor, faça login para assinar.');
        navigate('/alunos-pais');
        return;
      }

      // In a real app, you'd call a backend endpoint to create a Stripe Checkout Session
      // For this demo, we'll simulate a successful subscription or redirect
      toast.info(`Iniciando checkout para o ${plan.name}...`);
      
      // Mocking redirect to Stripe
      setTimeout(() => {
        toast.success('Assinatura simulada com sucesso!');
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error in subscription:', error);
      toast.error('Erro ao processar assinatura.');
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      <PageHeader title="Assinaturas" />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-black text-secondary tracking-tighter">Escolha o plano ideal para sua <span className="text-primary">família</span></h2>
            <p className="text-lg text-secondary/60 font-medium">Invista no futuro bilíngue do seu filho com o Método Phaleduc.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative bg-white rounded-[40px] p-8 shadow-2xl border-2 flex flex-col",
                  plan.popular ? "border-primary scale-105 z-10" : "border-gray-50"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div className="space-y-6 flex-1">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg", plan.color)}>
                    <CreditCard className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-secondary">{plan.name}</h3>
                    <p className="text-secondary/60 font-medium text-sm">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-secondary">{plan.price}</span>
                    <span className="text-secondary/40 font-bold">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 pt-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-secondary/70 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-widest mt-8 transition-all hover:scale-[1.02] shadow-xl",
                    plan.buttonColor,
                    "text-white shadow-primary/20"
                  )}
                >
                  {loading ? 'Processando...' : 'Assinar Agora'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-black text-secondary tracking-tighter">Perguntas Frequentes</h2>
            <p className="text-secondary/60 font-medium">Tudo o que você precisa saber sobre o Método Phaleduc.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Preciso ser professor para usar o método?",
                a: "Não, a Phaleduc guia você passo a passo. Nosso método foi desenhado para que pais, mesmo sem formação pedagógica, consigam aplicar as vivências de forma natural e divertida."
              },
              {
                q: "Posso usar para mais de um filho?",
                a: "Sim, nossos planos permitem múltiplos perfis de alunos dentro da mesma conta familiar, garantindo que cada criança tenha seu próprio acompanhamento de progresso."
              },
              {
                q: "Como funciona o cancelamento?",
                a: "Você pode cancelar sua assinatura a qualquer momento diretamente pelo seu painel. O acesso continuará ativo até o final do período já pago."
              },
              {
                q: "O suporte pedagógico está incluído?",
                a: "Sim! Todos os nossos assinantes têm acesso ao nosso canal de suporte para tirar dúvidas sobre a aplicação das atividades e o desenvolvimento bilíngue."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4"
              >
                <h4 className="text-lg font-black text-secondary flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {item.q}
                </h4>
                <p className="text-secondary/60 font-medium leading-relaxed pl-5">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const LojaPage = () => {
  const navigate = useNavigate();
  const [currency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'info' | 'success'>('cart');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    country: 'United States',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province: '',
    postal_code: '',
    termsAccepted: false,
    privacyAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    scrollToProducts();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, sessionRes] = await Promise.all([
          supabase.from('store_products').select('*, store_categories(name), product_variants(*)').order('created_at', { ascending: false }),
          supabase.from('store_categories').select('*').order('name'),
          supabase.auth.getSession()
        ]);
        
        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) setCategories(catRes.data);

        // Auto-fill customer info if logged in
        if (sessionRes.data.session?.user) {
          const { data: parent } = await supabase
            .from('pais')
            .select('nome, email, address_line1, address_line2, city, state_province, postal_code, country')
            .eq('id', sessionRes.data.session.user.id)
            .maybeSingle();
          
          if (parent) {
            setCustomerInfo({
              name: parent.nome || '',
              email: parent.email || '',
              country: parent.country || 'United States',
              address_line1: parent.address_line1 || '',
              address_line2: parent.address_line2 || '',
              city: parent.city || '',
              state_province: parent.state_province || '',
              postal_code: parent.postal_code || '',
              termsAccepted: false,
              privacyAccepted: false
            });
          }
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Map database categories to their visual styles
  const categoryStyles: Record<string, { icon: any, color: string, desc: string }> = {
    'mala-rosa': { icon: Package, color: 'bg-primary', desc: 'Kit de atividades físicas' },
    'vestuario': { icon: ShoppingBag, color: 'bg-success', desc: 'Camisetas e bonés' },
    'educadores': { icon: GraduationCap, color: 'bg-secondary', desc: 'Materiais para franqueados' },
    'biblioteca': { icon: BookOpen, color: 'bg-accent', desc: 'Livros físicos curados' },
  };

  const addToCart = (product: any, variant?: any) => {
    // If product has variants but none selected, open modal
    if (product.product_variants?.length > 0 && !variant) {
      setSelectedProductForDetails(product);
      setSelectedVariant(null);
      return;
    }

    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
    const sku = variant?.sku || product.sku || `SKU-${product.id.slice(0, 4)}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        ...product, 
        cartItemId, 
        variant, 
        sku,
        quantity: 1 
      }];
    });
    
    setIsCartOpen(true);
    setCheckoutStep('cart');
    setSelectedProductForDetails(null);
    toast.success(`${product.name}${variant ? ` (${variant.name})` : ''} adicionado à mochila!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);

  // Shipping and Tax Calculation Logic
  const shippingCost = customerInfo.country === 'United States' ? 0 : 2500; // US$ 25.00 for international
  const taxRate = customerInfo.country === 'United States' ? 0.07 : 0; // 7% for US, 0 for international (simplified)
  const taxAmount = Math.round(cartTotal * taxRate);
  const finalTotal = cartTotal + shippingCost + taxAmount;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.termsAccepted || !customerInfo.privacyAccepted) {
      toast.error("Você precisa aceitar os termos e a política de privacidade.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Pending Order first to get a real ID
      const { data: parent } = await supabase
        .from('pais')
        .select('id')
        .eq('email', customerInfo.email)
        .maybeSingle();

      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        country: customerInfo.country,
        address_line1: customerInfo.address_line1,
        address_line2: customerInfo.address_line2,
        city: customerInfo.city,
        state_province: customerInfo.state_province,
        postal_code: customerInfo.postal_code,
        total_amount_cents: finalTotal,
        shipping_cost_cents: shippingCost,
        tax_amount_cents: taxAmount,
        currency: 'USD',
        status: 'pendente',
        terms_accepted: customerInfo.termsAccepted,
        privacy_accepted: customerInfo.privacyAccepted,
        parent_id: parent?.id || null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price_cents,
          quantity: item.quantity,
          type: item.type,
          is_subscription_activator: item.is_subscription_activator,
          variant_id: item.variant?.id || null,
          variant_name: item.variant?.name || null,
          sku: item.sku
        }))
      };

      const { data: newOrder, error: orderError } = await supabase
        .from('store_orders')
        .insert([orderData])
        .select()
        .single();
      
      if (orderError) throw orderError;
      setCurrentOrderId(newOrder.id);

      // 2. Create Payment Intent on our server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
          country: customerInfo.country,
          customerEmail: customerInfo.email,
          orderId: newOrder.id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao processar pagamento (${response.status}). Verifique se o servidor está rodando.`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setClientSecret(data.clientSecret);
      setCheckoutStep('payment' as any);
    } catch (error: any) {
      console.error('Error initiating checkout:', error);
      toast.error(error.message || 'Erro ao iniciar checkout.');
      setIsSubmitting(false);
    }
  };

  const finalizeOrder = async (paymentIntentId?: string) => {
    setIsSubmitting(true);
    try {
      if (!currentOrderId) throw new Error('Order ID not found');

      // If simulated, we call the simulation endpoint to trigger fulfillment
      if (paymentIntentId?.startsWith('pi_simulated')) {
        const res = await fetch('/api/simulate-payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: currentOrderId, paymentIntentId })
        });
        if (!res.ok) throw new Error('Failed to simulate fulfillment');
      }

      // The server (webhook or simulation) handles the heavy lifting.
      // We just show success here.
      setCheckoutStep('success');
      setCart([]);
      toast.success('Pagamento confirmado e pedido realizado!');
    } catch (error) {
      console.error('Error finalizing order:', error);
      toast.error('Erro ao finalizar pedido. Por favor, verifique seu e-mail para confirmação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const PaymentForm = ({ clientSecret, onCancel, onSuccess }: { clientSecret: string, onCancel: () => void, onSuccess: (id: string) => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setIsProcessing(true);

      // Simulation mode check
      if (clientSecret.startsWith('pi_simulated')) {
        setTimeout(() => {
          onSuccess(clientSecret);
          setIsProcessing(false);
        }, 1500);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Erro no pagamento');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#141414',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }} />
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-100 text-secondary font-black rounded-2xl hover:bg-gray-200 transition-all"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Pagar US$ {(finalTotal / 100).toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-white font-display"
    >
      {/* Store Header */}
      <header className="bg-white border-b border-gray-100 sticky top-[112px] z-40">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col lg:flex-row items-center gap-8">
          {/* Logo - Left */}
          <div className="flex-shrink-0 flex items-center gap-3 min-w-[200px]">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-secondary tracking-tighter uppercase leading-none">
              Loja<br/><span className="text-primary">Phaleduc</span>
            </span>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl w-full relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
            <input 
              type="text"
              placeholder="O que seu brasileirinho precisa hoje?"
              className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-[24px] border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all font-bold text-secondary shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Cart - Right */}
          <div className="flex-shrink-0 flex items-center gap-4 min-w-[200px] justify-end">
            <button 
              onClick={() => navigate('/assinaturas')}
              className="relative group"
              title="Planos de Assinatura"
            >
              <div className="flex items-center gap-3 bg-primary/10 text-primary px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">
                <Sparkles className="w-5 h-5" />
                <span className="hidden xl:inline">Assinaturas</span>
              </div>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative group"
            >
              <div className="flex items-center gap-3 bg-secondary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20">
                <Backpack className="w-5 h-5" />
                <span className="hidden xl:inline">Minha Mochila</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-black border-4 border-white animate-bounce shadow-lg">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Store Menu */}
        <nav className="bg-gray-50/50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-4 flex flex-wrap justify-center gap-8">
            <button 
              onClick={() => handleCategorySelect(null)}
              className={cn(
                "text-xs font-black uppercase tracking-widest transition-colors",
                !selectedCategory ? "text-primary" : "text-secondary/60 hover:text-primary"
              )}
            >
              Todos os Produtos
            </button>
            <button 
              onClick={() => navigate('/assinaturas')}
              className="text-xs font-black uppercase tracking-widest text-secondary/60 hover:text-primary transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              Planos Phaleduc
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  "text-xs font-black uppercase tracking-widest transition-colors",
                  selectedCategory === cat.id ? "text-primary" : "text-secondary/60 hover:text-primary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1920" 
            alt="Criança Phaleduc" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8 h-full flex flex-col justify-center items-start">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="max-w-2xl space-y-8"
          >
            <span className="inline-block px-6 py-2 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest">
              Coleção 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
              Leve o Português para o <span className="text-primary">Mundo Real</span>
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-lg">
              Produtos pensados para fortalecer o bilinguismo de herança com afeto, diversão e muito orgulho brasileiro.
            </p>
            <button className="px-12 py-6 bg-[#FFD700] text-secondary rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-yellow-500/20 hover:scale-105 transition-all">
              Ver Coleção
            </button>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => {
            const style = categoryStyles[cat.slug] || { icon: Package, color: 'bg-gray-400', desc: '' };
            return (
              <button 
                onClick={() => handleCategorySelect(cat.id)}
                className="group cursor-pointer"
              >
                <div className={cn(
                  "aspect-square rounded-[40px] p-10 flex flex-col justify-between transition-all shadow-xl shadow-black/5", 
                  style.color,
                  selectedCategory === cat.id && "ring-4 ring-offset-4 ring-primary"
                )}>
                  <style.icon className="w-12 h-12 text-white" />
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight leading-none mb-2">{cat.name}</h3>
                    <p className="text-white/70 text-sm font-medium">{style.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Showcase */}
      <section ref={productsRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-widest text-xs">
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Os mais amados'}
              </span>
              <h2 className="text-4xl font-black text-secondary tracking-tighter">
                {selectedCategory ? 'Explorar Coleção' : 'Favoritos da Turminha'}
              </h2>
            </div>
            {selectedCategory && (
              <button 
                onClick={() => handleCategorySelect(null)}
                className="text-secondary font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:text-primary transition-colors"
              >
                Ver tudo <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-black/5 group border border-transparent hover:border-primary/10 transition-all"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={product.image_url || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors shadow-lg">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {product.store_categories?.name || 'Geral'}
                        </span>
                        <h3 className="text-lg font-black text-secondary tracking-tight leading-tight">{product.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-black text-secondary">{product.rating || '5.0'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-2xl font-black text-secondary">
                        US$ {(product.price_cents / 100).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => {
                          if (product.product_variants?.length > 0) {
                            setSelectedProductForDetails(product);
                            setSelectedVariant(null);
                          } else {
                            addToCart(product);
                          }
                        }}
                        className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (product.product_variants?.length > 0) {
                          setSelectedProductForDetails(product);
                          setSelectedVariant(null);
                        } else {
                          addToCart(product);
                        }
                      }}
                      className="w-full py-4 bg-gray-50 text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD700] hover:text-secondary transition-all"
                    >
                      {product.product_variants?.length > 0 ? 'Ver Opções' : 'Quero para meu filho'}
                    </button>
                  </div>
                </motion.div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-secondary/40 font-bold">Nenhum produto encontrado nesta categoria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Backpack className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase">Minha Mochila</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {checkoutStep === 'cart' && (
                  <div className="space-y-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-20 space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-secondary/20">
                          <ShoppingBag className="w-10 h-10" />
                        </div>
                        <p className="text-secondary/40 font-bold">Sua mochila está vazia.</p>
                        <button 
                          onClick={() => setIsCartOpen(false)}
                          className="text-primary font-black uppercase tracking-widest text-xs"
                        >
                          Começar a comprar
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.cartItemId} className="flex gap-4 p-4 bg-gray-50 rounded-3xl group">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-secondary text-sm truncate">{item.name}</h4>
                            {item.variant && (
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.variant.name}</p>
                            )}
                            <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">SKU: {item.sku}</p>
                            <p className="text-primary font-black text-sm mt-1">US$ {(item.price_cents / 100).toFixed(2)}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-secondary w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-secondary/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {checkoutStep === 'info' && (
                  <div className="space-y-6">
                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Nome Completo</label>
                          <input 
                            required
                            type="text"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">E-mail</label>
                          <input 
                            required
                            type="email"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">País</label>
                          <select 
                            required
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.country}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                          >
                            <option value="United States">United States</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Portugal">Portugal</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Endereço (Rua, Número)</label>
                          <input 
                            required
                            type="text"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.address_line1}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, address_line1: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Apto / Suíte / Complemento</label>
                          <input 
                            type="text"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.address_line2}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, address_line2: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Cidade</label>
                          <input 
                            required
                            type="text"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.city}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">Estado / Província</label>
                          <input 
                            required
                            type="text"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.state_province}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, state_province: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-2">ZIP / Código Postal</label>
                          <input 
                            required
                            type="text"
                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                            value={customerInfo.postal_code}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, postal_code: e.target.value })}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-4 pt-4">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input 
                              type="checkbox"
                              required
                              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={customerInfo.termsAccepted}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, termsAccepted: e.target.checked })}
                            />
                            <span className="text-xs font-medium text-secondary/60 group-hover:text-secondary transition-colors">
                              Eu aceito os <button type="button" className="text-primary underline">Termos de Serviço</button> e as condições de venda internacional.
                            </span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input 
                              type="checkbox"
                              required
                              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={customerInfo.privacyAccepted}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, privacyAccepted: e.target.checked })}
                            />
                            <span className="text-xs font-medium text-secondary/60 group-hover:text-secondary transition-colors">
                              Eu li e concordo com a <button type="button" className="text-primary underline">Política de Privacidade</button> e o processamento de meus dados.
                            </span>
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {(checkoutStep as any) === 'payment' && clientSecret && (
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                        <CreditCard className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase">Pagamento Seguro</h3>
                      <p className="text-xs font-medium text-secondary/40 uppercase tracking-widest">Processado pelo Stripe em USD</p>
                    </div>

                    <PaymentForm 
                      clientSecret={clientSecret} 
                      onCancel={() => setCheckoutStep('info')}
                      onSuccess={(id) => finalizeOrder(id)}
                    />

                    <div className="flex items-center justify-center gap-6 opacity-40 grayscale pt-4">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-secondary tracking-tighter uppercase">Pedido Recebido!</h3>
                      <p className="text-secondary/60 font-medium">Obrigado por fortalecer o bilinguismo de herança. Entraremos em contato em breve.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        setCheckoutStep('cart');
                      }}
                      className="w-full py-6 bg-secondary text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20"
                    >
                      Continuar Navegando
                    </button>
                  </div>
                )}
              </div>

              {cart.length > 0 && checkoutStep !== 'success' && (checkoutStep as any) !== 'payment' && (
                <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                      <span className="font-black text-secondary">US$ {(cartTotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary/40 font-bold uppercase tracking-widest text-[10px]">Frete</span>
                      <span className="font-black text-secondary">{shippingCost === 0 ? 'Grátis' : `US$ ${(shippingCost / 100).toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary/40 font-bold uppercase tracking-widest text-[10px]">Impostos (Tax)</span>
                      <span className="font-black text-secondary">US$ {(taxAmount / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-secondary/40 font-black uppercase tracking-widest text-xs">Total do Pedido</span>
                      <span className="text-3xl font-black text-secondary">US$ {(finalTotal / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {checkoutStep === 'cart' ? (
                    <button 
                      onClick={() => setCheckoutStep('info')}
                      className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                      Finalizar Pedido <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setCheckoutStep('cart')}
                        className="flex-1 py-6 bg-white text-secondary border-2 border-gray-200 rounded-3xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                      >
                        Voltar
                      </button>
                      <button 
                        form="checkout-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Pedido'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Details Modal (Variants) */}
      <AnimatePresence>
        {selectedProductForDetails && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductForDetails(null)}
              className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[201] rounded-[48px] overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-50">
                  <img 
                    src={selectedProductForDetails.image_url} 
                    alt={selectedProductForDetails.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setSelectedProductForDetails(null)}
                    className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary hover:text-primary transition-all shadow-lg md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {selectedProductForDetails.store_categories?.name || 'Geral'}
                        </span>
                        <h3 className="text-3xl font-black text-secondary tracking-tighter leading-tight">{selectedProductForDetails.name}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedProductForDetails(null)}
                        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all hidden md:flex"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-secondary/60 font-medium leading-relaxed mb-8">
                      {selectedProductForDetails.description || 'Um produto exclusivo Phaleduc para o desenvolvimento bilíngue do seu filho.'}
                    </p>

                    {selectedProductForDetails.product_variants?.length > 0 && (
                      <div className="space-y-4 mb-8">
                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-2">Selecione a Variante</label>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProductForDetails.product_variants.map((variant: any) => (
                            <button
                              key={variant.id}
                              onClick={() => setSelectedVariant(variant)}
                              className={cn(
                                "p-4 rounded-2xl border-2 transition-all text-left group",
                                selectedVariant?.id === variant.id 
                                  ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                                  : "border-gray-100 hover:border-primary/30"
                              )}
                            >
                              <p className={cn(
                                "text-xs font-black uppercase tracking-widest mb-1",
                                selectedVariant?.id === variant.id ? "text-primary" : "text-secondary/40"
                              )}>
                                {variant.name}
                              </p>
                              <p className="text-[10px] font-bold text-secondary/20 group-hover:text-secondary/40 transition-colors">
                                SKU: {variant.sku}
                              </p>
                              {variant.stock_quantity <= 5 && variant.stock_quantity > 0 && (
                                <p className="text-[8px] font-black text-orange-500 uppercase mt-1">Últimas unidades!</p>
                              )}
                              {variant.stock_quantity === 0 && (
                                <p className="text-[8px] font-black text-red-500 uppercase mt-1">Esgotado</p>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-secondary">
                        US$ {(selectedProductForDetails.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(selectedProductForDetails, selectedVariant)}
                      disabled={selectedProductForDetails.product_variants?.length > 0 && !selectedVariant}
                      className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {selectedProductForDetails.product_variants?.length > 0 && !selectedVariant 
                        ? 'Selecione uma opção' 
                        : 'Adicionar à Mochila'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* B2B Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="bg-secondary rounded-[60px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <GraduationCap className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block px-6 py-2 bg-white/10 text-white rounded-full font-black text-xs uppercase tracking-widest">
                Área do Tutor & Franqueado
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Profissionalize sua <span className="text-primary">Metodologia</span>
              </h2>
              <p className="text-xl text-white/60 font-medium">
                Kits exclusivos para educadores PLH, planners estruturados e materiais de apoio para franqueados Phaleduc.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-2xl shadow-primary/20">
                  Kit do Educador PLH
                </button>
                <button className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all">
                  Planners Estruturados
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-white/5 rounded-[40px] p-8 border border-white/10 backdrop-blur-sm">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" 
                  alt="Materiais Educador" 
                  className="rounded-3xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges & Footer */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-secondary uppercase tracking-widest text-sm">Envio Internacional</h4>
                <p className="text-xs text-secondary/40 font-bold">Para brasileirinhos em todo o mundo.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-secondary uppercase tracking-widest text-sm">Método Validado</h4>
                <p className="text-xs text-secondary/40 font-bold">Materiais que seguem nossa pedagogia.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-secondary uppercase tracking-widest text-sm">Pagamento Seguro</h4>
                <p className="text-xs text-secondary/40 font-bold">Transações protegidas e criptografadas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const FotosPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <PageHeader title="Galeria" />
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {GALLERY_IMAGES.map((url, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid rounded-[40px] overflow-hidden shadow-xl border-4 border-white"
            >
              <img src={url} alt={`Galeria ${i}`} className="w-full h-auto" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

const BlogPage = () => {
  const posts = [
    {
      title: "10 Dicas Infalíveis para Ensinar Português aos Filhos em Casa",
      date: "November 2, 2024",
      excerpt: "Preservar o português para crianças que vivem fora do Brasil vai além de ensiná-las a se comunicar: é uma forma...",
      category: "Dicas",
      link: "https://phaleduc.com/10-dicas-infaliveis-para-ensinar-portugues-aos-filhos-em-casa/"
    },
    {
      title: "Língua de Herança: Uma Ponte para Identidade e Conexão",
      date: "November 2, 2024",
      excerpt: "No mundo cada vez mais globalizado, as línguas de herança, como o português, desempenham um papel essencial para crianças que...",
      category: "Aprendizado",
      link: "https://phaleduc.com/portugues-como-uma-lingua-de-heranca-uma-ponte-para-identidade-e-conexao/"
    },
    {
      title: "Minha Jornada: De Educadora a Fundadora da Phaleduc",
      date: "October 27, 2024",
      excerpt: "Ao longo de mais de 25 anos, minha trajetória na educação infantil e ensino fundamental me proporcionou experiências ricas e...",
      category: "Sobre",
      link: "https://phaleduc.com/minha-jornada-de-educadora-a-fundadora-da-phaleduc/"
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHeader title="Blog" />
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {posts.map((post, i) => (
              <article key={i} className="space-y-6 group">
                <div className="bg-gray-100 aspect-video rounded-[40px] overflow-hidden">
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-primary opacity-20" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm font-bold text-primary uppercase tracking-widest">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="text-secondary/40">{post.date}</span>
                  </div>
                  <h2 className="text-2xl font-black text-secondary group-hover:text-primary transition-colors leading-tight">
                    <a href={post.link} target="_blank">{post.title}</a>
                  </h2>
                  <p className="text-lg text-secondary/60 font-medium leading-relaxed">{post.excerpt}</p>
                  <a href={post.link} target="_blank" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:gap-4 transition-all">
                    Ler mais <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-12">
            <div className="bg-gray-50 p-10 rounded-[40px] space-y-8">
              <h4 className="text-xl font-black text-secondary">Pesquisar</h4>
              <div className="relative">
                <input type="text" placeholder="Buscar no blog..." className="w-full p-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm" />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/40" />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-black text-secondary">Artigos Recentes</h4>
              <ul className="space-y-4">
                {posts.map((post, i) => (
                  <li key={i}>
                    <a href={post.link} target="_blank" className="text-base font-bold text-secondary/70 hover:text-primary transition-colors leading-tight block">
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-black text-secondary">Categorias</h4>
              <ul className="space-y-4">
                {["Aprendizado", "Dicas", "Sobre"].map((cat, i) => (
                  <li key={i}>
                    <a href="#" className="flex justify-between items-center text-base font-bold text-secondary/70 hover:text-primary transition-colors">
                      {cat}
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">1</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </motion.div>
  );
};

const InscricaoPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const plans = [
    {
      name: "Online",
      price: "90",
      features: [
        "1 Child",
        "Online",
        "Até 3 alunos por turma"
      ]
    },
    {
      name: "Presencial",
      price: "120",
      features: [
        "1 Criança",
        "Material Incluso",
        "Até 4 alunos por turma"
      ],
      featured: true
    },
    {
      name: "Cursos Virtuais",
      price: "Diversos",
      features: [
        "Crianças, Pais e Tutores",
        "Conteúdo Virtual",
        "Escolha seu curso"
      ]
    }
  ];

  if (showForm && selectedPlan) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <PageHeader title={`Inscrição: ${selectedPlan}`} />
        <section className="py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <button 
              onClick={() => setShowForm(false)}
              className="mb-8 flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs hover:text-primary transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para Planos
            </button>
            <StudentParentRegistration 
              planName={selectedPlan} 
              onSuccess={() => {
                setShowForm(false);
                setSelectedPlan(null);
              }} 
            />
          </div>
        </section>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHeader title="Inscrição" />
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {plans.map((plan, i) => (
              <div key={i} className={cn(
                "p-16 rounded-[60px] border-4 transition-all flex flex-col",
                plan.featured 
                  ? "bg-secondary text-white border-primary shadow-2xl scale-105 relative z-10" 
                  : "bg-gray-50 text-secondary border-transparent hover:border-primary/20"
              )}>
                {plan.featured && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-2 rounded-full font-black uppercase tracking-widest text-sm">
                    Mais Popular
                  </span>
                )}
                <h3 className="text-2xl font-black mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-4xl font-black">${plan.price}</span>
                  {plan.price !== "Diversos" && <span className="text-lg opacity-60 font-bold">/ mensal</span>}
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-4 text-lg font-bold">
                      <CheckCircle2 className={cn("w-6 h-6", plan.featured ? "text-primary" : "text-primary")} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    setShowForm(true);
                  }}
                  className={cn(
                    "w-full py-6 rounded-3xl font-black uppercase tracking-widest text-center transition-all",
                    plan.featured 
                      ? "bg-primary text-white hover:brightness-110 shadow-xl shadow-primary/20" 
                      : "bg-secondary text-white hover:bg-secondary/90"
                  )}
                >
                  Quero este
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ContatoPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <PageHeader title="Contato" />
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <h2 className="text-4xl font-black text-secondary tracking-tight">Vamos Conversar?</h2>
          <p className="text-lg text-secondary/70 font-medium leading-relaxed">
            Tire suas dúvidas sobre matrículas, horários e nossa metodologia.
          </p>
          <div className="space-y-8">
            <div className="flex items-center gap-8">
              <div className="bg-primary/10 p-6 rounded-3xl text-primary">
                <Phone className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-secondary/40">Telefone</p>
                <p className="text-2xl font-black text-secondary">469-476-6590</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="bg-primary/10 p-6 rounded-3xl text-primary">
                <Mail className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-secondary/40">E-mail</p>
                <p className="text-2xl font-black text-secondary">contato@phaleduc.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-16 rounded-[80px] shadow-2xl space-y-8">
          <div className="grid gap-6">
            <input type="text" placeholder="Nome" className="w-full p-6 rounded-3xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm" />
            <input type="email" placeholder="E-mail" className="w-full p-6 rounded-3xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm" />
            <textarea rows={4} placeholder="Mensagem" className="w-full p-6 rounded-3xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm resize-none"></textarea>
          </div>
          <button className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">
            Enviar Mensagem
          </button>
        </div>
      </div>
    </section>
  </motion.div>
);

const GamesPlatform = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <PageHeader title="Plataforma de Jogos" />
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8 text-center space-y-12">
        <Gamepad2 className="w-32 h-32 text-primary mx-auto opacity-20" />
        <h2 className="text-3xl font-black text-secondary">Em breve: Novas Aventuras!</h2>
        <p className="text-lg text-secondary/70 font-medium max-w-2xl mx-auto">
          Estamos preparando uma plataforma incrível com jogos exclusivos para a turminha Phaleduc.
        </p>
      </div>
    </section>
  </motion.div>
);

// --- Mundo Phaleduc (Alunos & Pais) ---

const WEEKLY_STATIONS = [
  { id: 'historia', day: "Segunda", label: "Input", icon: BookOpen, color: "bg-primary", desc: "Livro/Vídeo" },
  { id: 'jogo', day: "Terça", label: "Prática", icon: Gamepad2, color: "bg-success", desc: "Game de Vocabulário" },
  { id: 'tarefa', day: "Quarta", label: "Produção", icon: Mic, color: "bg-secondary", desc: "Gravar Áudio" },
  { id: 'revisao', day: "Quinta", label: "Produção", icon: Pencil, color: "bg-accent", desc: "Escrever Texto" },
  { id: 'missao', day: "Sexta", label: "Missão", icon: Package, color: "bg-danger", desc: "Missão Offline", special: true },
];

const FAUNA_BRASILEIRA = [
  { id: 'onca', name: 'Onça-pintada', icon: '🐆' },
  { id: 'arara', name: 'Arara-azul', icon: '🦜' },
  { id: 'mico', name: 'Mico-leão-dourado', icon: '🐒' },
  { id: 'tuiuiu', name: 'Tuiuiú', icon: '🦢' },
  { id: 'boto', name: 'Boto-cor-de-rosa', icon: '🐬' },
  { id: 'tamandua', name: 'Tamanduá-bandeira', icon: '🐜' },
  { id: 'lobo', name: 'Lobo-guará', icon: '🦊' },
  { id: 'jacare', name: 'Jacaré-açu', icon: '🐊' },
  { id: 'capivara', name: 'Capivara', icon: '🐹' },
  { id: 'tucano', name: 'Tucano', icon: '🐦' },
  { id: 'preguica', name: 'Bicho-preguiça', icon: '🦥' },
  { id: 'tatu', name: 'Tatu-bola', icon: '🦔' }
];

const BADGES = [
  { id: 1, name: "Pão de Queijo", icon: "🧀", desc: "Cultura Mineira" },
  { id: 2, name: "Arara Azul", icon: "🦜", desc: "Fauna Brasileira" },
  { id: 3, name: "Berimbau", icon: "🪕", desc: "Ritmos do Brasil" },
];

const PARENT_STATS = [
  { subject: 'Oralidade', A: 85, fullMark: 100 },
  { subject: 'Compreensão', A: 92, fullMark: 100 },
  { subject: 'Escrita', A: 70, fullMark: 100 },
  { subject: 'Cultura', A: 95, fullMark: 100 },
];

// --- Interfaces do Banco de Dados (Supabase/PostgreSQL) ---
interface FamilyAccount {
  id: string;
  email: string;
  parent_pin: string; // PIN de 4 dígitos para o Modo Família
}

interface ChildProfile {
  id: string;
  family_id: string;
  name: string;
  age: number;
  proficiency_level: 'N0' | 'N1' | 'N2' | 'N3' | 'N4';
  avatar_url: string;
}

// --- Componentes Modulares do Portal ---

// --- Componentes Modulares do Portal ---

const PasswordCreationView = ({ 
  onSuccess, 
  userName, 
  userId,
  isTemp = false,
  email = ""
}: { 
  onSuccess: (newUserId?: string) => void, 
  userName: string, 
  userId: string,
  isTemp?: boolean,
  email?: string
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsSaving(true);
    try {
      if (isTemp && email) {
        console.log("Processando primeiro acesso para:", email);
        // 1. Criar conta no Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: newPassword,
          options: { data: { full_name: userName } }
        });
        
        if (authError) {
          if (authError.message.includes("already registered")) {
            alert("Este e-mail já está cadastrado. Por favor, use a opção de recuperar senha ou faça login normalmente.");
            return;
          }
          throw authError;
        }
        
        const newAuthId = authData.user?.id;
        if (!newAuthId) throw new Error("Falha ao criar conta de autenticação.");

        // 1.5 Buscar ID antigo para migrar dados relacionados se necessário
        const { data: oldPai } = await supabase.from('pais').select('id').eq('email', email).maybeSingle();
        const oldId = oldPai?.id;

        // 2. Atualizar registro na tabela 'pais' com o novo ID do Auth
        // Se já existia um registro com esse e-mail mas ID diferente, atualizamos o ID (PK)
        // O ON UPDATE CASCADE no banco cuidará de atualizar as referências em outras tabelas
        if (oldId && oldId !== newAuthId) {
          console.log("Migrando ID de", oldId, "para", newAuthId);
          const { error: updateError } = await supabase
            .from('pais')
            .update({ 
              id: newAuthId,
              user_id: newAuthId,
              nome: userName
            })
            .eq('id', oldId);
          
          if (updateError) throw updateError;
        } else {
          // Se não existia ou o ID já era o mesmo, fazemos um upsert normal
          const { error: upsertError } = await supabase
            .from('pais')
            .upsert({ 
              id: newAuthId,
              user_id: newAuthId,
              email: email,
              nome: userName
            }, { onConflict: 'email' });
          
          if (upsertError) throw upsertError;
        }

        // 3. Migrar dados relacionados manualmente apenas como garantia (opcional devido ao CASCADE)
        if (oldId && oldId !== newAuthId) {
          // Estes updates agora devem afetar 0 linhas se o CASCADE funcionou, o que é seguro
          await supabase.from('alunos').update({ parent_id: newAuthId }).eq('parent_id', oldId);
          await supabase.from('subscriptions').update({ user_id: newAuthId }).eq('user_id', oldId);
          await supabase.from('reflexoes_familia').update({ familia_id: newAuthId }).eq('familia_id', oldId);
          await supabase.from('store_orders').update({ parent_id: newAuthId }).eq('parent_id', oldId);
        }
        
        // Se o ID mudou, precisamos notificar o pai para atualizar o estado
        onSuccess(newAuthId);
      } else {
        // Caminho normal: apenas atualiza a senha no Auth
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) throw error;
        onSuccess();
      }
    } catch (err: any) {
      console.error("Error saving password:", err);
      alert("Erro ao salvar senha: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-8 min-h-[calc(100vh-112px)] bg-gray-50"
    >
      <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl border border-gray-100">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
          <Unlock className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-secondary text-center mb-2 tracking-tighter">Criar sua Senha</h2>
        <p className="text-base text-secondary/50 text-center mb-10 font-medium">Olá, {userName}! Para sua segurança, crie uma senha definitiva.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Nova Senha</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold text-base text-secondary"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Confirmar Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold text-base text-secondary"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Definir Senha"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const ChildRegistrationView = ({ 
  onSuccess, 
  parentId: initialParentId 
}: { 
  onSuccess: () => void, 
  parentId: string 
}) => {
  const [children, setChildren] = useState([{ name: "", age: "" }]);
  const [isSaving, setIsSaving] = useState(false);

  const addChild = () => setChildren([...children, { name: "", age: "" }]);
  const removeChild = (index: number) => setChildren(children.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (children.some(c => !c.name || !c.age)) {
      toast.error("Preencha todos os campos das crianças.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Verificar ID do pai (priorizar Auth se disponível)
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const parentId = authUser?.id || initialParentId;

      if (!parentId) {
        console.error("ChildRegistrationView: parentId is missing", { parentId, initialParentId });
        throw new Error("Sessão expirada ou usuário não identificado. Por favor, saia e entre novamente.");
      }

      console.log("Iniciando cadastro de crianças para parentId:", parentId);

      // 2. Garantir que o registro na tabela 'pais' existe (Upsert robusto)
      const userFullName = authUser?.user_metadata?.full_name || "Responsável";
      const userEmail = authUser?.email || '';

      console.log("Garantindo existência do registro na tabela 'pais'...");
      const { error: upsertError } = await supabase
        .from('pais')
        .upsert({
          id: parentId,
          email: userEmail,
          nome: userFullName,
          parent_pin: '0000' // PIN padrão se estiver criando agora
        }, { onConflict: 'id' });

      if (upsertError) {
        console.warn("Aviso ao garantir registro de pai (pode ser RLS):", upsertError);
      }

      // Pequena pausa para consistência eventual
      await new Promise(resolve => setTimeout(resolve, 300));

      // 3. Inserir as crianças
      const childrenToInsert = children.map(c => ({
        parent_id: parentId,
        nome: c.name,
        data_nascimento: new Date(new Date().getFullYear() - parseInt(c.age), 0, 1).toISOString().split('T')[0],
        nivel: 'Iniciante',
        status: 'ativo'
      }));

      console.log("Inserindo crianças na tabela 'alunos':", childrenToInsert);
      const { error: insertError } = await supabase
        .from('alunos')
        .insert(childrenToInsert);

      if (insertError) {
        console.error("Erro ao inserir alunos:", insertError);
        if (insertError.code === '23503') {
          // Tentar uma última vez se for erro de FK (pode ser delay no upsert anterior)
          console.log("Tentando novamente após erro de FK...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { error: retryError } = await supabase.from('alunos').insert(childrenToInsert);
          if (retryError) throw new Error("Erro de vínculo: O registro do responsável ainda não foi reconhecido pelo sistema. Por favor, tente novamente.");
        } else {
          throw insertError;
        }
      }

      toast.success("Crianças cadastradas com sucesso!");
      onSuccess();
    } catch (err: any) {
      console.error("Erro no cadastro de crianças:", err);
      toast.error(err.message || "Erro ao cadastrar crianças. Verifique sua conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-8 min-h-[calc(100vh-112px)] bg-gray-50"
    >
      <div className="max-w-2xl w-full bg-white rounded-[40px] p-12 shadow-2xl border border-gray-100">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
          <PlusCircle className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-secondary text-center mb-2 tracking-tighter">Cadastrar Crianças</h2>
        <p className="text-base text-secondary/50 text-center mb-10 font-medium">Adicione as crianças que farão parte da Phaleduc.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {children.map((child, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                {children.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeChild(index)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-danger text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Nome da Criança</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-3 bg-white rounded-2xl border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold text-base text-secondary"
                      placeholder="Nome completo"
                      value={child.name}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].name = e.target.value;
                        setChildren(newChildren);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Idade</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      max="18"
                      className="w-full px-6 py-3 bg-white rounded-2xl border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold text-base text-secondary"
                      placeholder="Ex: 7"
                      value={child.age}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].age = e.target.value;
                        setChildren(newChildren);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={addChild}
            className="w-full py-4 border-2 border-dashed border-primary/30 text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Adicionar outra criança
          </button>

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/20 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Concluir Cadastro"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const LoginView = ({ onLogin, onSwitchToRegister, onStudentLogin, onForgotPassword }: { onLogin: (data: any) => void, onSwitchToRegister: () => void, onStudentLogin: (code: string, pin: string) => void, onForgotPassword: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState<'parent' | 'student'>('parent');
  const [studentCode, setStudentCode] = useState("");
  const [parentPin, setParentPin] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-20 px-8 min-h-[calc(100vh-112px)] bg-gray-50"
    >
      <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/5 border border-gray-100">
        <div className="flex bg-gray-100 p-2 rounded-2xl mb-8">
          <button 
            onClick={() => setLoginMode('parent')}
            className={cn(
              "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
              loginMode === 'parent' ? "bg-white text-secondary shadow-sm" : "text-secondary/40 hover:text-secondary/60"
            )}
          >
            Pais
          </button>
          <button 
            onClick={() => setLoginMode('student')}
            className={cn(
              "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
              loginMode === 'student' ? "bg-white text-primary shadow-sm" : "text-secondary/40 hover:text-secondary/60"
            )}
          >
            Alunos
          </button>
        </div>

        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
          {loginMode === 'parent' ? <Users className="w-10 h-10" /> : <Gamepad2 className="w-10 h-10" />}
        </div>
        
        <h2 className="text-3xl font-black text-secondary text-center mb-2 tracking-tighter">
          {loginMode === 'parent' ? "Portal da Família" : "Mundo Phaleduc"}
        </h2>
        <p className="text-secondary/50 text-center mb-10 font-medium">
          {loginMode === 'parent' 
            ? "Acesse sua conta para gerenciar os perfis dos seus filhos." 
            : "Digite seu código de aluno e o PIN dos seus pais."}
        </p>
        
        {loginMode === 'parent' ? (
          <form onSubmit={(e) => { e.preventDefault(); onLogin({ email, password }); }} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-base text-secondary"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4">
                <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest">Senha</label>
                <button 
                  type="button"
                  onClick={() => {
                    if (!email) {
                      toast.error("Por favor, informe seu e-mail para recuperar a senha.");
                      return;
                    }
                    onForgotPassword(email);
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <input 
                type="password" 
                required
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-base text-secondary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/20"
            >
              Entrar no Portal
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); onStudentLogin(studentCode, parentPin); }} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Código do Aluno</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-black text-secondary text-center text-4xl tracking-[0.5em]"
                placeholder="000000"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">PIN dos Pais</label>
              <input 
                type="password" 
                required
                maxLength={4}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-black text-secondary text-center text-2xl tracking-[1em]"
                placeholder="••••"
                value={parentPin}
                onChange={(e) => setParentPin(e.target.value)}
              />
              <p className="text-xs text-secondary/30 font-bold text-center mt-2">Peça o código e o PIN para seu pai ou mãe.</p>
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              Começar a Jogar!
            </button>
          </form>
        )}
        
        {loginMode === 'parent' && (
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-secondary/40 font-medium">
              Novo por aqui? <button onClick={onSwitchToRegister} className="text-primary font-black hover:underline">Criar conta familiar</button>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const RegisterView = ({ onRegister, onSwitchToLogin }: { onRegister: (data: any) => void, onSwitchToLogin: () => void }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    parentPin: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert("Por favor, informe seu nome.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (formData.parentPin.length !== 4) {
      alert("O PIN deve ter 4 dígitos!");
      return;
    }
    onRegister(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-20 px-8 min-h-[calc(100vh-112px)] bg-gray-50"
    >
      <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/5 border border-gray-100">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
          <UserPlus className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-secondary text-center mb-2 tracking-tighter">Criar Conta Familiar</h2>
        <p className="text-base text-secondary/50 text-center mb-10 font-medium">Comece sua jornada bilingue hoje mesmo.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Seu Nome Completo</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-base text-secondary"
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-base text-secondary"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Senha</label>
              <input 
                type="password" 
                required
                className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-base text-secondary"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">Confirmar</label>
              <input 
                type="password" 
                required
                className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-base text-secondary"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest ml-4">PIN de Segurança (4 dígitos)</label>
            <input 
              type="password" 
              maxLength={4}
              required
              className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-black text-secondary text-center text-base tracking-[1em]"
              placeholder="••••"
              value={formData.parentPin}
              onChange={(e) => setFormData({ ...formData, parentPin: e.target.value })}
            />
            <p className="text-xs text-secondary/30 font-bold ml-4">Este PIN será usado para acessar o Modo Família.</p>
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-4"
          >
            Criar Conta Familiar
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-secondary/40 font-medium">
            Já tem uma conta? <button onClick={onSwitchToLogin} className="text-primary font-black hover:underline">Fazer login</button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ProfileSelectionView = ({ 
  profiles, 
  onSelectProfile, 
  onParentAccess, 
  onLogout,
  onUpdateAvatar,
  subscription
}: { 
  profiles: any[], 
  onSelectProfile: (p: any) => void, 
  onParentAccess: () => void,
  onLogout: () => void,
  onUpdateAvatar: (profileId: string, avatar: string) => Promise<void>,
  subscription: any
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfileForAvatar, setSelectedProfileForAvatar] = useState<any>(null);

  const profileColors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  const handleProfileClick = (profile: any) => {
    if (isEditing) {
      setSelectedProfileForAvatar(profile);
    } else {
      onSelectProfile(profile);
    }
  };

  const handleAvatarSelect = async (icon: string) => {
    if (selectedProfileForAvatar) {
      await onUpdateAvatar(selectedProfileForAvatar.id, icon);
      setSelectedProfileForAvatar(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#141414] flex flex-col items-center justify-center py-20 px-8 min-h-[calc(100vh-112px)]"
    >
      <h1 className="text-3xl md:text-5xl font-medium text-white mb-12 text-center tracking-tight">
        {isEditing ? 'Gerenciar Perfis' : 'Quem está aprendendo hoje?'}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-20">
        {profiles.map((profile, index) => (
          <button 
            key={profile.id}
            onClick={() => handleProfileClick(profile)}
            className="group flex flex-col items-center gap-4 relative"
          >
            <div className={cn(
              "w-28 h-28 md:w-36 md:h-36 rounded-md flex items-center justify-center text-5xl md:text-6xl transition-all duration-200 group-hover:ring-4 group-hover:ring-white group-hover:scale-105 relative overflow-hidden shadow-lg",
              profile.avatar ? "bg-white/10" : profileColors[index % profileColors.length]
            )}>
              {profile.avatar || profile.nome?.[0]?.toUpperCase() || '👶'}
              <div className={cn(
                "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center",
                isEditing && "bg-black/40"
              )}>
                {isEditing && <Pencil className="w-8 h-8 text-white" />}
              </div>
            </div>
            <span className="text-lg md:text-xl font-medium text-gray-400 group-hover:text-white transition-colors">{profile.nome}</span>
          </button>
        ))}
        
        {!isEditing && (
          <button 
            onClick={onParentAccess}
            className="group flex flex-col items-center gap-4"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-md bg-white/5 flex items-center justify-center text-gray-500 transition-all duration-200 group-hover:ring-4 group-hover:ring-white group-hover:scale-105">
              <Lock className="w-10 h-10" />
            </div>
            <span className="text-lg md:text-xl font-medium text-gray-500 group-hover:text-white transition-colors">Modo Família</span>
          </button>
        )}
      </div>

      {!isEditing && (
        <div className="mb-20">
          {subscription ? (
            <button 
              onClick={() => {
                // If they have a profile selected, go to activities
                if (profiles.length > 0) {
                  onSelectProfile(profiles[0]);
                }
              }}
              className="group flex items-center gap-6 bg-primary/10 hover:bg-primary/20 p-6 rounded-[32px] border border-primary/20 transition-all"
            >
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-white tracking-tight">Área de Atividades Exclusiva</h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest">Acesso liberado • Explore agora</p>
              </div>
              <ChevronRight className="w-6 h-6 text-primary ml-4" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/assinaturas')}
              className="group flex items-center gap-6 bg-danger/10 hover:bg-danger/20 p-6 rounded-[32px] border border-danger/20 transition-all"
            >
              <div className="w-16 h-16 bg-danger rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-white tracking-tight">Área de Atividades Exclusiva</h3>
                <p className="text-danger font-bold text-xs uppercase tracking-widest">Sua jornada Phaleduc está pausada</p>
                <p className="text-gray-400 text-[10px] font-medium mt-1">Clique aqui para reativar seu plano</p>
              </div>
              <ChevronRight className="w-6 h-6 text-danger ml-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-8">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-8 py-2 border border-gray-600 text-gray-500 font-medium tracking-widest uppercase text-xs hover:text-white hover:border-white transition-all"
        >
          {isEditing ? 'Concluído' : 'Gerenciar Perfis'}
        </button>
        {!isEditing && (
          <button 
            onClick={onLogout}
            className="text-gray-600 font-medium tracking-widest uppercase text-[10px] hover:text-white transition-all"
          >
            Trocar de Conta • Sair
          </button>
        )}
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {selectedProfileForAvatar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#181818] rounded-2xl p-8 md:p-12 max-w-4xl w-full border border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-medium text-white tracking-tight">Escolha seu Avatar</h3>
                  <p className="text-gray-400 font-medium mt-1">Animais da Fauna Brasileira</p>
                </div>
                <button 
                  onClick={() => setSelectedProfileForAvatar(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {FAUNA_BRASILEIRA.map((animal) => (
                  <button
                    key={animal.id}
                    onClick={() => handleAvatarSelect(animal.icon)}
                    className="group flex flex-col items-center gap-3"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-md bg-white/5 flex items-center justify-center text-4xl md:text-5xl transition-all group-hover:ring-4 group-hover:ring-white group-hover:scale-105">
                      {animal.icon}
                    </div>
                    <span className="text-[10px] md:text-xs font-medium text-gray-500 group-hover:text-white text-center">{animal.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PinVerificationModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  correctPin
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSuccess: () => void,
  correctPin: string
}) => {
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      onSuccess();
      setPin("");
    } else {
      alert("PIN incorreto!");
      setPin("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-secondary/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[40px] p-12 max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
              <Lock className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-secondary mb-4 tracking-tighter">Área dos Pais</h3>
            <p className="text-secondary/50 font-medium mb-8">Digite o PIN de 4 dígitos para continuar.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <input 
                type="password" 
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-5xl font-black tracking-[1em] py-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-primary focus:outline-none transition-all placeholder:text-gray-200"
                autoFocus
              />
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-100 text-secondary font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                >
                  Entrar
                </button>
              </div>
            </form>
            <p className="mt-8 text-[10px] font-black text-secondary/20 uppercase tracking-widest">Dica: O PIN padrão é 1234</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MaterialsView = ({ parentId, onBack }: { parentId: string, onBack: () => void }) => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        // Fetch paid orders for this parent
        const { data: orders, error } = await supabase
          .from('store_orders')
          .select('items')
          .eq('parent_id', parentId)
          .eq('status', 'pago');
        
        if (error) throw error;

        // Extract digital items
        const digitalItems: any[] = [];
        orders?.forEach(order => {
          const items = order.items as any[];
          items.forEach(item => {
            if (item.type === 'digital') {
              digitalItems.push(item);
            }
          });
        });

        // Remove duplicates by ID
        const uniqueMaterials = digitalItems.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );
        setMaterials(uniqueMaterials);
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [parentId]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-[calc(100vh-112px)] bg-white p-8 md:p-12 lg:p-20"
    >
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs mb-2">
            <BookOpen className="w-4 h-4" /> Meus Materiais Digitais
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">Biblioteca da Família</h2>
          <p className="text-secondary/40 font-medium mt-2">Acesse seus conteúdos digitais adquiridos na loja.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-gray-100 text-secondary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Voltar ao Painel
        </button>
      </header>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="font-bold text-secondary/40">Buscando seus materiais...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-secondary/10 mx-auto mb-6">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-secondary mb-2">Sua biblioteca está vazia</h3>
            <p className="text-secondary/40 font-medium mb-8">Você ainda não adquiriu materiais digitais na nossa loja.</p>
            <button 
              onClick={() => window.location.href = '/loja'}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              Visitar a Loja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.map((item) => (
              <div key={item.id} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-xl shadow-black/5 group hover:border-primary/30 transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-secondary mb-2">{item.name}</h3>
                <p className="text-sm text-secondary/40 font-medium mb-8">Material digital em formato PDF para impressão e atividades.</p>
                <button 
                  className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all flex items-center justify-center gap-2"
                  onClick={() => toast.info('O link de download será enviado para seu e-mail ou aberto em nova aba.')}
                >
                  <Download className="w-4 h-4" /> Baixar Agora
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AlunosPaisPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'register' | 'profiles' | 'child' | 'parent' | 'onboarding' | 'materials'>('login');
  const [onboardingStep, setOnboardingStep] = useState<'password' | 'pin' | 'children'>('password');
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [familyData, setFamilyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [childMetrics, setChildMetrics] = useState<any>(null);
  const [childFeedback, setChildFeedback] = useState<any[]>([]);
  const [loopConfig, setLoopConfig] = useState<any>(null);
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);
  const [reflection, setReflection] = useState({ engajamento: 5, comentario: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loginMode, setLoginMode] = useState<'parent' | 'student'>('parent');
  const [subscription, setSubscription] = useState<any>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [activeParentTab, setActiveParentTab] = useState<'dashboard' | 'orders'>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchOrders = async (userId: string) => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('store_orders')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCreatePortalSession = async () => {
    if (!familyData?.stripe_customer_id) {
      toast.error('Nenhuma assinatura ativa encontrada para gerenciar.');
      return;
    }

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: familyData.stripe_customer_id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão do portal');
      }
    } catch (err: any) {
      console.error('Portal error:', err);
      toast.error('Erro ao acessar o portal do cliente.');
    }
  };

  const logAuditAction = async (action: string, details: any) => {
    try {
      await supabase.from('audit_logs').insert([{
        user_id: user?.id,
        action,
        details
      }]);
    } catch (err) {
      console.error('Audit log error:', err);
    }
  };

  const handleDownloadInvoice = async (order: any) => {
    toast.info('Gerando fatura comercial (Invoice)...');
    await logAuditAction('invoice_download_attempt', { orderId: order.id });
    
    // Simulação de download de invoice
    setTimeout(() => {
      toast.success('Invoice gerada com sucesso! O download começará em instantes.');
      logAuditAction('invoice_download_success', { orderId: order.id });
    }, 1500);
  };

  useEffect(() => {
    if (view === 'parent' && user?.id) {
      fetchOrders(user.id);
    }
  }, [view, user?.id]);

  // Set initial active child when profiles are loaded
  useEffect(() => {
    if (profiles.length > 0 && !activeChildId) {
      setActiveChildId(profiles[0].id);
    }
  }, [profiles]);

  // Verificar sessão ao carregar
  const syncDataAndNavigate = async (userId: string) => {
    setLoading(true);
    try {
      console.log("Sincronizando dados para usuário:", userId);
      // 1. Garantir registro em 'pais'
      let { data: family, error: fError } = await supabase
        .from('pais')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (fError) console.error("Erro ao buscar dados da família:", fError);

      if (!family) {
        console.log("Registro de responsável não encontrado por ID. Verificando por e-mail...");
        const { data: userData } = await supabase.auth.getUser();
        const userFullName = userData.user?.user_metadata?.full_name || "Responsável";
        const userEmail = userData.user?.email || '';
        
        // Tentar encontrar por e-mail para migrar o ID se necessário
        const { data: existingByEmail } = await supabase
          .from('pais')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();

        if (existingByEmail) {
          console.log("Registro encontrado por e-mail. Migrando ID de", existingByEmail.id, "para", userId);
          const { data: updatedFamily, error: updateError } = await supabase
            .from('pais')
            .update({
              id: userId,
              user_id: userId,
              nome: existingByEmail.nome || userFullName
            })
            .eq('id', existingByEmail.id)
            .select()
            .maybeSingle();
          
          if (updateError) {
            console.error("Erro ao migrar ID do responsável:", updateError);
            family = existingByEmail; // Fallback para o registro antigo se falhar o update (improvável)
          } else {
            family = updatedFamily;
          }
        } else {
          console.log("Nenhum registro encontrado por e-mail. Criando novo...");
          const { data: newFamily, error: insertError } = await supabase
            .from('pais')
            .upsert({
              id: userId,
              email: userEmail,
              nome: userFullName,
              parent_pin: '0000'
            }, { onConflict: 'id' })
            .select()
            .maybeSingle();
          
          if (insertError) {
            console.error("Erro ao garantir registro de responsável:", insertError);
            family = { id: userId, nome: userFullName, email: userEmail };
          } else if (newFamily) {
            family = newFamily;
          }
        }
      }

      if (family) setFamilyData(family);

      // 2. Carregar crianças
      const { data: childProfiles, error: pError } = await supabase
        .from('alunos')
        .select('*')
        .eq('parent_id', userId);
      
      if (pError) {
        console.error("Erro ao buscar perfis de alunos:", pError);
      }
      
      const currentProfiles = childProfiles || [];
      console.log("Alunos encontrados:", currentProfiles.length);
      setProfiles(currentProfiles);
      
      // 3. Verificar Assinatura
      await checkSubscription(userId);

      // 4. Decidir destino
      if (!family?.parent_pin || family.parent_pin === '0000') {
        console.log("Redirecionando para onboarding: PIN não definido");
        setView('onboarding');
        setOnboardingStep('pin');
      } else if (currentProfiles.length === 0) {
        console.log("Redirecionando para onboarding: sem crianças");
        setView('onboarding');
        setOnboardingStep('children');
      } else {
        console.log("Redirecionando para perfis");
        setView('profiles');
      }
    } catch (err) {
      console.error("Erro crítico na sincronização:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await syncDataAndNavigate(session.user.id);
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const loadFamilyData = async (userId: string) => {
    // Esta função agora é usada apenas para recarregar dados sem navegar
    const { data: family } = await supabase
      .from('pais')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (family) setFamilyData(family);

    const { data: childProfiles } = await supabase
      .from('alunos')
      .select('*')
      .eq('parent_id', userId);
    
    if (childProfiles) setProfiles(childProfiles);
    
    return family;
  };

  const checkSubscription = async (userId: string) => {
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    if (view === 'child' || view === 'parent') {
      // Priorizar activeChildId se estiver no modo parent, caso contrário usar selectedChild
      const id = view === 'parent' ? activeChildId : (selectedChild?.id || activeChildId);
      if (id) {
        fetchChildData(id);
      }
    }
  }, [view, selectedChild?.id, activeChildId]);

  const [childExecutions, setChildExecutions] = useState<any[]>([]);

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  const fetchChildData = async (childId: string) => {
    if (!childId) return;
    
    // Reset local state to avoid showing stale data
    setLoopConfig(null);
    setChildExecutions([]);
    setChildMetrics(null);
    setChildFeedback([]);

    // 1. Buscar métricas mais recentes
    const { data: metrics } = await supabase
      .from('metricas_progresso')
      .select('*')
      .eq('aluno_id', childId)
      .order('semana_inicio', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (metrics) {
      // Transformar N0-N4 em porcentagem (N4 = 100%, N3 = 75%, etc)
      const transform = (val: number) => (val / 4) * 100;
      setChildMetrics([
        { subject: 'Oralidade', A: transform(metrics.oralidade), fullMark: 100 },
        { subject: 'Escrita', A: transform(metrics.escrita), fullMark: 100 },
        { subject: 'Compreensão', A: transform(metrics.compreensao), fullMark: 100 },
        { subject: 'Cultura', A: transform(metrics.cultura), fullMark: 100 },
      ]);
    } else {
      setChildMetrics([
        { subject: 'Oralidade', A: 0, fullMark: 100 },
        { subject: 'Escrita', A: 0, fullMark: 100 },
        { subject: 'Compreensão', A: 0, fullMark: 100 },
        { subject: 'Cultura', A: 0, fullMark: 100 },
      ]);
    }

    // 2. Buscar feedbacks
    const { data: feedbacks } = await supabase
      .from('feedbacks_pedagogicos')
      .select('*')
      .eq('aluno_id', childId)
      .order('semana_inicio', { ascending: false });
    
    if (feedbacks) setChildFeedback(feedbacks);

    // 3. Buscar config do loop semanal (Novo: loops_semanais)
    const mondayStr = getMonday(new Date());

    try {
      // 1. Buscar config individual
      let { data: individualConfig, error: configError } = await supabase
        .from('loops_semanais')
        .select('*, historia:historia_id(*), jogo:jogo_id(*), tarefa:tarefa_id(*), revisao:revisao_id(*), missao:missao_id(*)')
        .eq('aluno_id', childId)
        .eq('semana_referencia', mondayStr)
        .maybeSingle();
      
      if (configError) console.error("Erro ao buscar loops_semanais individual:", configError);
      
      // 2. Buscar config da turma (se o aluno tiver turma)
      let finalConfig = individualConfig || {};
      const { data: student } = await supabase.from('alunos').select('turma_id').eq('id', childId).maybeSingle();
      
      if (student?.turma_id) {
        const { data: turmaConfig } = await supabase
          .from('loops_semanais')
          .select('*, historia:historia_id(*), jogo:jogo_id(*), tarefa:tarefa_id(*), revisao:revisao_id(*), missao:missao_id(*)')
          .eq('turma_id', student.turma_id)
          .eq('semana_referencia', mondayStr)
          .maybeSingle();
        
        if (turmaConfig) {
          // Mescla: individual tem prioridade sobre turma em cada atividade
          finalConfig = {
            ...turmaConfig,
            ...individualConfig,
            // Garante que os objetos de recurso individuais (se existirem) sobrescrevam os da turma
            historia: individualConfig?.historia || turmaConfig.historia,
            jogo: individualConfig?.jogo || turmaConfig.jogo,
            tarefa: individualConfig?.tarefa || turmaConfig.tarefa,
            revisao: individualConfig?.revisao || turmaConfig.revisao,
            missao: individualConfig?.missao || turmaConfig.missao,
            // Mescla agendamentos também
            historia_agendamento: individualConfig?.historia_agendamento || turmaConfig.historia_agendamento,
            jogo_agendamento: individualConfig?.jogo_agendamento || turmaConfig.jogo_agendamento,
            tarefa_agendamento: individualConfig?.tarefa_agendamento || turmaConfig.tarefa_agendamento,
            revisao_agendamento: individualConfig?.revisao_agendamento || turmaConfig.revisao_agendamento,
            missao_agendamento: individualConfig?.missao_agendamento || turmaConfig.missao_agendamento,
          };
        }
      }

      let config = Object.keys(finalConfig).length > 0 ? finalConfig : null;

      // Buscar configurações extras (missão, desbloqueios)
      let { data: extraConfig, error: extraError } = await supabase
        .from('loop_semanal_config')
        .select('*')
        .eq('aluno_id', childId)
        .eq('semana_inicio', mondayStr)
        .maybeSingle();
      
      if (extraError) console.error("Erro ao buscar loop_semanal_config:", extraError);
      
      // Fallback para a turma se não houver config individual
      if (!extraConfig) {
        const { data: student } = await supabase.from('alunos').select('turma_id').eq('id', childId).maybeSingle();
        if (student?.turma_id) {
          const { data: turmaExtraConfig } = await supabase
            .from('loop_semanal_config')
            .select('*')
            .eq('turma_id', student.turma_id)
            .eq('semana_inicio', mondayStr)
            .maybeSingle();
          
          if (turmaExtraConfig) {
            extraConfig = turmaExtraConfig;
          }
        }
      }
      
      if (config) {
        if (extraConfig) {
          setLoopConfig({ ...config, ...extraConfig, loop_config_id: extraConfig.id });
        } else {
          setLoopConfig(config);
        }
      } else if (extraConfig) {
        setLoopConfig({ ...extraConfig, loop_config_id: extraConfig.id });
      }

      console.log(`[fetchChildData] childId: ${childId}, loopConfig:`, config ? { ...config, ...extraConfig } : extraConfig);
    } catch (err) {
      console.error("Erro geral em fetchChildData (Loop):", err);
    }

    // 4. Buscar execuções
    const { data: executions } = await supabase
      .from('execucoes_atividades')
      .select('*')
      .eq('aluno_id', childId);
    
    if (executions) setChildExecutions(executions);
  };

  const getStationStatus = (stationId: string) => {
    if (!loopConfig) return 'locked';
    
    const resource = loopConfig[stationId];
    // Se for missão, pode não ter recurso mas ter título/prompt
    if (!resource && stationId !== 'missao') return 'locked';

    // Verificar se está desbloqueado pelo tutor (se houver essa config)
    const unlockKey = stationId === 'missao' ? 'missao_sexta_desbloqueada' : 
                     stationId === 'jogo' ? 'jogo_desbloqueado' : `${stationId}_desbloqueada`;
    
    // Se a flag de desbloqueio existir e for explicitamente false, bloqueia.
    // Se for undefined (não configurado pelo tutor ainda), permitimos se houver recurso.
    if (loopConfig[unlockKey] === false) return 'locked';

    // Check scheduling
    const agendamento = loopConfig[`${stationId}_agendamento`];
    if (!loopConfig.liberacao_manual && agendamento && new Date(agendamento) > new Date()) {
      return 'scheduled';
    }

    // Check completion
    const isCompleted = stationId === 'missao' && !resource
      ? childExecutions.some(ex => 
          ex.tipo_atividade === 'missao' && 
          ex.semana_inicio === (loopConfig.semana_inicio || loopConfig.semana_referencia) && 
          ex.loop_config_id === loopConfig.loop_config_id
        )
      : resource && childExecutions.some(ex => ex.recurso_id === resource.id);
    
    if (isCompleted) return 'completed';

    return 'available';
  };

  const handleCompleteActivity = async (recursoId: string, tipo: string, isManual?: boolean) => {
    if (!activeChildId || !loopConfig) return;

    console.log('Completing activity:', { recursoId, tipo, activeChildId, isManual });

    try {
      // UUID validation regex
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const isValidUUID = uuidRegex.test(recursoId);

      const insertData = {
        aluno_id: activeChildId,
        recurso_id: isManual ? null : (isValidUUID ? recursoId : null),
        loop_config_id: isManual ? recursoId : null,
        tipo_atividade: tipo,
        semana_inicio: loopConfig.semana_inicio || loopConfig.semana_referencia,
        status: 'concluido',
        data_conclusao: new Date().toISOString()
      };

      console.log('Inserting activity execution:', insertData);

      const { error } = await supabase
        .from('execucoes_atividades')
        .insert([insertData]);

      if (error) {
        console.error('Supabase error finishing activity:', error);
        throw error;
      }

      // Atualizar lista local
      fetchChildData(activeChildId);
      alert('Parabéns! Atividade concluída com sucesso! 🌟');
    } catch (error) {
      console.error('Erro ao concluir atividade:', error);
      alert('Erro ao registrar conclusão da atividade.');
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChildId || !user?.id) {
      alert('Sessão expirada ou aluno não selecionado. Por favor, faça login novamente.');
      return;
    }

    setIsSubmittingReflection(true);
    try {
      const { error } = await supabase
        .from('reflexoes_familia')
        .insert([{
          aluno_id: activeChildId,
          familia_id: user.id,
          semana_inicio: loopConfig?.semana_inicio || null,
          loop_config_id: loopConfig?.loop_config_id || null,
          engajamento: reflection.engajamento,
          comentario: reflection.comentario
        }]);

      if (error) throw error;
      alert('Reflexão enviada com sucesso! Obrigado por participar.');
      setReflection({ engajamento: 5, comentario: '' });
    } catch (err: any) {
      console.error('Error saving reflection:', err);
      alert(`Erro ao enviar reflexão: ${err.message || 'Verifique se as tabelas foram criadas corretamente no banco de dados.'}`);
    } finally {
      setIsSubmittingReflection(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      console.error("Error resetting password:", err);
      toast.error("Erro ao enviar e-mail de recuperação: " + err.message);
    }
  };

  const handleLogin = async (data: any) => {
    setLoading(true);
    
    try {
      // 1. Tentar login via Supabase Auth (Caminho único e seguro)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (!authError && authData.user) {
        console.log("Login via Auth bem-sucedido");
        setUser(authData.user);
        await syncDataAndNavigate(authData.user.id);
        return;
      }

      // 2. Se falhar no Auth, verificar se é um usuário legado (migração)
      // Nota: Isso assume que ainda temos a coluna 'senha' ou 'senha_temporaria' no DB
      // para validar o primeiro acesso e migrar para o Auth.
      // Se já removemos, este passo falhará graciosamente.
      const { data: legacyFamily, error: legacyError } = await supabase
        .from('pais')
        .select('*')
        .eq('email', data.email)
        .maybeSingle();

      if (!legacyError && legacyFamily) {
        // Verificar se a senha coincide (legado)
        // Se o usuário tem senha_temporaria ou senha no DB, podemos tentar migrar
        // Mas como estamos removendo essas colunas, a migração deve ser feita
        // ANTES da remoção total ou via um fluxo de "Esqueci minha senha".
        
        // Se o usuário existe no DB mas não no Auth, podemos sugerir que ele crie uma senha
        // ou use o fluxo de recuperação.
        console.log("Usuário legado encontrado, mas sem conta no Auth.");
      }

      // 3. Se falhar, informar o usuário
      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          toast.error("E-mail ou senha incorretos. Verifique seus dados.");
        } else {
          toast.error(`Erro no login: ${authError.message}`);
        }
      }
    } catch (err) {
      console.error("Erro no processo de login:", err);
      toast.error("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentQuickLogin = async (code: string, pin: string) => {
    if (!code || !pin) return;
    setLoading(true);
    
    try {
      // Buscar o aluno pelo código de acesso
      const { data: students, error } = await supabase
        .from('alunos')
        .select('*, pais(*)')
        .eq('access_code', code.toUpperCase());

      if (error) throw error;

      if (students && students.length > 0) {
        const student = students[0];
        // Verificar se o PIN do pai coincide
        if (student.pais && student.pais.parent_pin === pin) {
          setSelectedChild(student);
          setActiveChildId(student.id);
          setView('child');
        } else {
          toast.error("PIN dos pais incorreto.");
        }
      } else {
        toast.error("Código de aluno não encontrado.");
      }
    } catch (err) {
      console.error("Erro no login do aluno:", err);
      toast.error("Erro ao validar acesso.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    setLoading(true);
    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.nome
        }
      }
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        toast.error("Este e-mail já está cadastrado. Por favor, faça login ou recupere sua senha.");
        setView('login');
      } else {
        toast.error("Erro no cadastro: " + authError.message);
      }
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Criar registro na tabela pais (o PIN)
      const { error: dbError } = await supabase
        .from('pais')
        .insert([
          { 
            id: authData.user.id, 
            email: data.email, 
            nome: data.nome, 
            parent_pin: data.parentPin 
          }
        ]);

      if (dbError) {
        console.error("Erro ao salvar dados da família:", dbError);
      }

      alert("Conta criada com sucesso! Verifique seu e-mail (se habilitado) ou faça login.");
      setView('login');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfiles([]);
    setFamilyData(null);
    setSubscription(null);
    setView('login');
  };

  const handleUpdateAvatar = async (profileId: string, avatar: string) => {
    try {
      const { error } = await supabase
        .from('alunos')
        .update({ avatar })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, avatar } : p));
      
      // If the selected child is the one being updated, update it too
      if (selectedChild?.id === profileId) {
        setSelectedChild({ ...selectedChild, avatar });
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      alert('Erro ao atualizar avatar.');
    }
  };

  const handleProfileSelect = (profile: any) => {
    if (!subscription) {
      toast.error('Sua jornada Phaleduc está pausada. Por favor, reative seu plano para acessar as atividades.');
      navigate('/assinaturas');
      return;
    }
    setSelectedChild(profile);
    setActiveChildId(profile.id);
    setView('child');
  };

  const handleParentSuccess = () => {
    setPinModalOpen(false);
    setView('parent');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      alert('Senha atualizada com sucesso!');
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
      setFamilyData({ ...familyData });
    } catch (err) {
      console.error('Error saving password:', err);
      alert('Erro ao salvar nova senha.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-112px)] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white font-display overflow-hidden relative">
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <LoginView 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setView('register')} 
            onStudentLogin={handleStudentQuickLogin}
            onForgotPassword={handleForgotPassword}
          />
        )}

        {view === 'register' && (
          <RegisterView 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setView('login')} 
          />
        )}

        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-50 min-h-[calc(100vh-112px)] py-20 px-8 relative"
          >
            {/* Logout Button for Onboarding */}
            <button 
              onClick={handleLogout}
              className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-secondary/40 hover:text-danger hover:bg-danger/5 transition-all font-bold text-xs shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>

            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center gap-4 mb-12">
                {[
                  { id: 'password', label: 'Senha', icon: Unlock },
                  { id: 'pin', label: 'PIN', icon: Lock },
                  { id: 'children', label: 'Crianças', icon: PlusCircle }
                ].map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      onboardingStep === step.id ? "bg-primary text-white shadow-lg" : "bg-white text-secondary/20"
                    )}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest hidden md:block",
                      onboardingStep === step.id ? "text-secondary" : "text-secondary/20"
                    )}>
                      {step.label}
                    </span>
                    {idx < 2 && <div className="w-8 h-[2px] bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>

              {onboardingStep === 'password' && (
                <PasswordCreationView 
                  userId={user?.id} 
                  userName={user?.nome || familyData?.nome || "Responsável"} 
                  email={user?.email || familyData?.email}
                  isTemp={user?.isTemp}
                  onSuccess={async (newUserId?: string) => {
                    const finalUserId = newUserId || user?.id;
                    if (newUserId) {
                      // Se o ID mudou (após signUp), atualizamos o estado local
                      setUser({ ...user, id: newUserId, isTemp: false });
                    }
                    if (finalUserId) await syncDataAndNavigate(finalUserId);
                  }} 
                />
              )}

              {onboardingStep === 'pin' && (
                <div className="max-w-md mx-auto bg-white rounded-[40px] p-12 shadow-2xl border border-gray-100">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                    <Lock className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black text-secondary text-center mb-2 tracking-tighter">Definir PIN</h2>
                  <p className="text-secondary/50 text-center mb-10 font-medium">Crie um PIN de 4 dígitos para acessar o Modo Família.</p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const pin = (e.target as any).pin.value;
                    if (pin.length !== 4) return alert("O PIN deve ter 4 dígitos.");
                    setLoading(true);
                    const { error } = await supabase.from('pais').update({ parent_pin: pin }).eq('id', user.id);
                    if (error) {
                      alert("Erro ao salvar PIN.");
                      setLoading(false);
                    } else {
                      await syncDataAndNavigate(user.id);
                    }
                  }} className="space-y-8">
                    <input 
                      name="pin"
                      type="password" 
                      maxLength={4}
                      required
                      className="w-full text-center text-5xl font-black tracking-[1em] py-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-primary focus:outline-none transition-all placeholder:text-gray-200"
                      placeholder="••••"
                    />
                    <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                      Salvar e Continuar
                    </button>
                  </form>
                </div>
              )}

              {onboardingStep === 'children' && (
                <ChildRegistrationView 
                  parentId={user?.id} 
                  onSuccess={async () => {
                    await loadFamilyData(user.id);
                    setView('profiles');
                  }} 
                />
              )}
            </div>
          </motion.div>
        )}

        {view === 'profiles' && (
          <ProfileSelectionView 
            profiles={profiles}
            onSelectProfile={handleProfileSelect}
            onParentAccess={() => setPinModalOpen(true)}
            onLogout={handleLogout}
            onUpdateAvatar={handleUpdateAvatar}
            subscription={subscription}
          />
        )}

        {view === 'child' && selectedChild && (
          <motion.div 
            key="child"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-[calc(100vh-112px)] flex flex-col lg:flex-row"
          >
            {/* Sidebar - Backpack */}
            <aside className="w-full lg:w-80 bg-brand-green/30 border-r border-secondary/5 p-8 flex flex-col gap-8 order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Backpack className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-secondary uppercase tracking-tighter text-sm">Mochila Cultural</h3>
                  <p className="text-[10px] text-secondary/40 font-black uppercase tracking-widest">Coleção de {selectedChild.nome}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {BADGES.map((badge) => (
                  <div key={badge.id} className="bg-white p-4 rounded-[32px] flex flex-col items-center text-center gap-2 group hover:scale-105 transition-all cursor-help shadow-sm">
                    <span className="text-4xl group-hover:rotate-12 transition-transform">{badge.icon}</span>
                    <span className="text-[10px] font-black text-secondary/60 uppercase leading-tight tracking-tight">{badge.name}</span>
                  </div>
                ))}
                <div className="bg-white/50 border-2 border-dashed border-secondary/10 p-4 rounded-[32px] flex items-center justify-center opacity-40">
                  <Plus className="w-6 h-6 text-secondary/40" />
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-secondary/10">
                <button 
                  onClick={() => setView('profiles')}
                  className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Trocar Perfil
                </button>
              </div>
            </aside>

            {/* Main Content - Trail Map */}
            <main className="flex-1 p-8 md:p-12 lg:p-20 flex flex-col items-center order-1 lg:order-2">
              <header className="w-full flex justify-between items-center mb-16">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl border-4 border-primary">
                    {selectedChild.avatar}
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">Olá, {selectedChild.nome}!</h2>
                    <p className="text-lg text-secondary/50 font-medium">Pronto para a aventura de hoje?</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                  <Sparkles className="text-yellow-400 w-5 h-5 fill-current" />
                  <span className="font-black text-secondary">1.240 Pontos</span>
                </div>
              </header>

              <div className="relative w-full max-w-4xl">
                {/* Trail Path SVG Background */}
                <svg className="absolute inset-0 w-full h-full -z-10 opacity-10" viewBox="0 0 800 600">
                  <path 
                    d="M100,500 C200,500 300,100 400,300 C500,500 600,100 700,100" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="40" 
                    strokeLinecap="round" 
                    className="text-primary"
                  />
                </svg>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
                  {WEEKLY_STATIONS.map((station, i) => {
                    const status = getStationStatus(station.id);
                    const resource = loopConfig?.[station.id];
                    const agendamento = loopConfig?.[`${station.id}_agendamento`];

                    return (
                      <div 
                        key={station.day} 
                        className={cn(
                          "flex flex-col items-center gap-4",
                          i % 2 === 0 ? "md:translate-y-12" : "md:-translate-y-12"
                        )}
                      >
                        <button 
                          disabled={status === 'locked' || status === 'scheduled'}
                          onClick={() => {
                            if (resource) {
                              setSelectedActivity({ ...resource, tipo: station.id });
                              setIsActivityModalOpen(true);
                            } else if (station.id === 'missao' && loopConfig?.missao_titulo) {
                              setSelectedActivity({
                                id: loopConfig.loop_config_id,
                                titulo: loopConfig.missao_titulo,
                                descricao: loopConfig.missao_prompt || 'Realize a atividade cultural proposta pelo seu tutor.',
                                tipo: 'missao',
                                miniatura_url: 'https://images.unsplash.com/photo-1523050853063-bd8012fec4c8?auto=format&fit=crop&q=80&w=800',
                                isManual: true
                              });
                              setIsActivityModalOpen(true);
                            }
                          }}
                          className={cn(
                            "w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-all hover:scale-110 active:scale-95 relative group",
                            status === 'locked' ? "bg-gray-300 grayscale cursor-not-allowed" : 
                            status === 'scheduled' ? "bg-amber-400 grayscale-[0.5] cursor-wait" :
                            status === 'completed' ? "bg-green-500" : station.color,
                            station.special && status !== 'locked' && "animate-bounce"
                          )}
                        >
                          {status === 'completed' ? (
                            <Check className="w-10 h-10 md:w-12 md:h-12 mb-1" />
                          ) : status === 'scheduled' ? (
                            <Clock className="w-10 h-10 md:w-12 md:h-12 mb-1" />
                          ) : (
                            <station.icon className="w-10 h-10 md:w-12 md:h-12 mb-1" />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {status === 'completed' ? 'Concluído' : station.label}
                          </span>
                          
                          {/* Tooltip/Desc */}
                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold z-20">
                            {status === 'locked' ? 'Aguardando Tutor' : 
                             status === 'scheduled' ? `Libera em: ${new Date(agendamento).toLocaleString()}` :
                             resource?.titulo || station.desc}
                          </div>

                          {/* Status Badge */}
                          {status === 'available' && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                              <Play className="w-4 h-4 fill-current" />
                            </div>
                          )}
                        </button>
                        <div className="text-center">
                          <span className="block text-sm font-black text-secondary uppercase tracking-widest">{station.day}</span>
                          <div className="w-2 h-2 bg-gray-200 rounded-full mx-auto mt-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Age-specific UI hint */}
              <div className="mt-auto pt-20 text-center">
                <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-sm">
                  {selectedChild.ageGroup === '5-7' ? (
                    <><Mic className="w-4 h-4" /> Modo Visual e Áudio Ativo</>
                  ) : (
                    <><Pencil className="w-4 h-4" /> Foco em Autonomia e Escrita</>
                  )}
                </div>
              </div>
            </main>

            {/* Activity Modal */}
            <AnimatePresence>
              {isActivityModalOpen && selectedActivity && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsActivityModalOpen(false)}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
                  >
                    {/* Left: Media/Content */}
                    <div className="w-full md:w-1/2 bg-gray-100 relative aspect-video md:aspect-auto">
                      {selectedActivity.formato === 'video' ? (
                        <iframe 
                          src={selectedActivity.url_recurso}
                          className="w-full h-full object-cover"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <img 
                          src={selectedActivity.miniatura_url || "https://picsum.photos/seed/activity/800/600"} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                        <span className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" /> {selectedActivity.tipo}
                        </span>
                      </div>
                    </div>

                    {/* Right: Info & Action */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-3xl font-black text-secondary tracking-tighter mb-2">{selectedActivity.titulo}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                              {selectedActivity.nivel}
                            </span>
                            <span className="px-3 py-1 bg-secondary/5 text-secondary/40 text-[10px] font-black uppercase tracking-widest rounded-full">
                              {selectedActivity.categoria}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => setIsActivityModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                          <X className="w-6 h-6 text-secondary/40" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-4 space-y-6 mb-8">
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-secondary/40 uppercase tracking-widest">Descrição da Atividade</h4>
                          <p className="text-secondary/70 font-medium leading-relaxed">{selectedActivity.descricao}</p>
                        </div>

                        {selectedActivity.formato === 'pdf' && (
                          <a 
                            href={selectedActivity.url_recurso} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                          >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-secondary group-hover:text-primary shadow-sm">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-black text-secondary text-sm">Ver Material de Apoio</p>
                              <p className="text-[10px] text-secondary/40 font-bold uppercase">Clique para abrir o PDF</p>
                            </div>
                          </a>
                        )}
                      </div>

                      <div className="space-y-4">
                        <button 
                          onClick={() => {
                            handleCompleteActivity(selectedActivity.id, selectedActivity.tipo, selectedActivity.isManual);
                            setIsActivityModalOpen(false);
                          }}
                          className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                        >
                          <CheckCircle2 className="w-6 h-6" /> Concluir Atividade
                        </button>
                        <p className="text-center text-[10px] text-secondary/30 font-black uppercase tracking-widest">
                          Ao concluir, você ganhará 100 pontos de XP!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {view === 'materials' && (
          <MaterialsView 
            parentId={user?.id} 
            onBack={() => setView('parent')} 
          />
        )}

        {view === 'parent' && (
          <motion.div 
            key="parent"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[calc(100vh-112px)] bg-white p-8 md:p-12 lg:p-20"
          >
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
              <div>
                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs mb-2">
                  <Unlock className="w-4 h-4" /> Modo Família Ativo
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">Painel de Acompanhamento</h2>
                <div className="flex items-center gap-6 mt-6">
                  <button 
                    onClick={() => setActiveParentTab('dashboard')}
                    className={cn(
                      "text-xs font-black uppercase tracking-widest transition-all pb-2 border-b-2",
                      activeParentTab === 'dashboard' ? "text-primary border-primary" : "text-secondary/40 border-transparent hover:text-secondary"
                    )}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveParentTab('orders')}
                    className={cn(
                      "text-xs font-black uppercase tracking-widest transition-all pb-2 border-b-2",
                      activeParentTab === 'orders' ? "text-primary border-primary" : "text-secondary/40 border-transparent hover:text-secondary"
                    )}
                  >
                    Meus Pedidos
                  </button>
                  <button 
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="flex items-center gap-2 text-[10px] font-black text-secondary/40 hover:text-primary transition-all uppercase tracking-widest pb-2"
                  >
                    <Settings className="w-4 h-4" /> Segurança
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {subscription && (
                  <button 
                    onClick={handleCreatePortalSession}
                    className="px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" /> Gerenciar Assinatura
                  </button>
                )}
                <button 
                  onClick={() => setView('materials')}
                  className="px-8 py-4 bg-primary/10 text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" /> Meus Materiais
                </button>
                <button 
                  onClick={() => setView('profiles')}
                  className="px-8 py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center gap-2"
                >
                  Sair do Painel
                </button>
              </div>
            </header>

            <AnimatePresence>
              {showPasswordChange && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-w-7xl mx-auto mb-16 overflow-hidden"
                >
                  <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-black text-secondary">Alterar Senha</h3>
                      <button onClick={() => setShowPasswordChange(false)} className="text-secondary/40 hover:text-danger"><X className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleUpdatePassword} className="grid md:grid-cols-2 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Nova Senha</label>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Confirmar Senha</label>
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button 
                          type="submit"
                          disabled={isSavingPassword}
                          className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                          {isSavingPassword ? 'Salvando...' : 'Atualizar Senha'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeParentTab === 'dashboard' ? (
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Children List with Access Codes */}
              <div className="lg:col-span-3 bg-gray-50 rounded-[40px] p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-secondary tracking-tight">Seus Filhos</h3>
                      <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">Clique para ver o acompanhamento individual</p>
                    </div>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Total:</span>
                    <span className="font-black text-secondary">{profiles.length} {profiles.length === 1 ? 'Criança' : 'Crianças'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((child) => (
                    <button 
                      key={child.id} 
                      onClick={() => setActiveChildId(child.id)}
                      className={cn(
                        "bg-white p-6 rounded-3xl border transition-all flex items-center gap-4 text-left group relative overflow-hidden",
                        activeChildId === child.id 
                          ? "border-primary ring-4 ring-primary/10 shadow-lg" 
                          : "border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md"
                      )}
                    >
                      {activeChildId === child.id && (
                        <div className="absolute top-0 right-0 w-12 h-12 bg-primary text-white flex items-center justify-center rounded-bl-2xl">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110",
                        activeChildId === child.id ? "bg-primary/10" : "bg-gray-50"
                      )}>
                        {child.avatar || '👶'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-secondary">{child.nome}</h4>
                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">{child.nivel || 'Nível não definido'}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Código:</span>
                          <code className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-black text-sm tracking-widest">
                            {child.id.slice(0, 6).toUpperCase()}
                          </code>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Chart */}
              <div className="lg:col-span-2 bg-gray-50 rounded-[40px] p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-secondary tracking-tight">
                      Desenvolvimento: {profiles.find(c => c.id === activeChildId)?.nome || 'Carregando...'}
                    </h3>
                    <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">Análise de competências linguísticas</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span className="text-xs font-bold text-secondary/60">Progresso Atual</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={childMetrics || PARENT_STATS}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#232b4e', fontSize: 12, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Progresso"
                        dataKey="A"
                        stroke="#76c06b"
                        fill="#76c06b"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  {(childMetrics || []).map((metric: any) => (
                    <div key={metric.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">{metric.subject}</span>
                        <span className="text-[10px] font-black text-primary">N{Math.round((metric.A / 100) * 4)}</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.A}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Loop Timeline */}
              <div className="lg:col-span-3 bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-secondary tracking-tight">Loop Semanal</h3>
                    <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">Acompanhe o desbloqueio da trilha</p>
                  </div>
                </div>

                <div className="space-y-8 relative">
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-100 -z-10" />
                  
                  {WEEKLY_STATIONS.map((station) => {
                    const status = getStationStatus(station.id);
                    const isUnlocked = status !== 'locked';
                    
                    return (
                      <div key={station.id} className="flex items-center gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                          isUnlocked ? "bg-primary text-white" : "bg-white text-gray-200 border-2 border-gray-100"
                        )}>
                          <station.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className={cn("font-black uppercase tracking-widest text-xs", isUnlocked ? "text-secondary" : "text-gray-300")}>
                            {station.label} ({station.day})
                          </h4>
                          <p className="text-[10px] font-bold text-secondary/40">
                            {status === 'completed' ? "Atividade Concluída" :
                             status === 'available' ? "Disponível para o Aluno" :
                             status === 'scheduled' ? `Agendado: ${new Date(loopConfig[`${station.id}_agendamento`]).toLocaleString()}` :
                             "Aguardando Liberação"}
                          </p>
                        </div>
                        {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-success" />}
                        {status === 'scheduled' && <Clock className="w-4 h-4 text-primary/40" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Reports */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-50 rounded-[40px] p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-secondary tracking-tight">Relatórios do Tutor</h3>
                      <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">Feedback pedagógico qualitativo</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {childFeedback.map((fb) => (
                      <div key={fb.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {new Date(fb.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <Quote className="w-4 h-4 text-primary/20" />
                        </div>
                        <p className="text-sm text-secondary/70 font-medium leading-relaxed italic">"{fb.conteudo}"</p>
                        <div className="pt-4 border-t border-gray-50">
                          <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Orientação para você:</p>
                          <p className="text-xs text-secondary/60 font-bold">{fb.orientacao_familia}</p>
                        </div>
                      </div>
                    ))}
                    {childFeedback.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-secondary/40 font-bold uppercase tracking-widest text-xs">Nenhum feedback ainda</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mission Center & Reflection */}
              <div className="space-y-8">
                {/* Friday Mission Card */}
                <div className="bg-primary text-white rounded-[40px] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Package className="w-32 h-32" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Missão de Sexta-feira</h4>
                  <h3 className="text-2xl font-black mb-6 leading-tight">Mão na Massa!</h3>
                  <p className="text-white/80 font-medium mb-8">
                    As missões culturais são enviadas pelo tutor para serem realizadas em família. Verifique se há uma nova missão desbloqueada!
                  </p>
                  
                  {loopConfig?.missao_sexta_desbloqueada ? (
                    <div className={cn(
                      "p-6 rounded-3xl border space-y-4 transition-all",
                      getStationStatus('missao') === 'completed' 
                        ? "bg-white/20 border-white/40" 
                        : "bg-white/10 border-white/20"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className={cn("w-4 h-4", getStationStatus('missao') === 'completed' ? "text-white" : "text-yellow-300")} />
                          <p className="text-sm font-black">
                            {getStationStatus('missao') === 'completed' ? '✅ Missão Concluída!' : `✨ Missão Ativa: ${loopConfig.missao_titulo || 'Mão na Massa!'}`}
                          </p>
                        </div>
                        {getStationStatus('missao') === 'completed' && (
                          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">
                            Sucesso
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium opacity-90 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                        {loopConfig.missao_prompt || 'Realize a atividade cultural proposta e envie sua reflexão abaixo.'}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-black/10 p-6 rounded-3xl border border-white/5 flex items-center gap-3">
                      <Lock className="w-5 h-5 opacity-40" />
                      <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Aguardando desbloqueio</p>
                    </div>
                  )}
                </div>

                {/* Reflection Form */}
                <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-success" />
                    </div>
                    <h4 className="font-black uppercase tracking-widest text-xs text-secondary">Reflexão do Responsável</h4>
                  </div>
                  
                  <form onSubmit={handleSaveReflection} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-2">Nível de Engajamento (1-5)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReflection({ ...reflection, engajamento: n })}
                            className={cn(
                              "flex-1 py-2 rounded-xl font-black text-xs transition-all",
                              reflection.engajamento === n ? "bg-success text-white" : "bg-gray-50 text-secondary/20"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-2">Comentário Breve</label>
                      <textarea 
                        value={reflection.comentario}
                        onChange={(e) => setReflection({ ...reflection, comentario: e.target.value })}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-success/20 transition-all font-medium text-sm h-24"
                        placeholder="Como foi a experiência?"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmittingReflection || !loopConfig?.missao_sexta_desbloqueada}
                      className="w-full py-4 bg-success text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-success/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {isSubmittingReflection ? 'Enviando...' : 'Enviar Reflexão'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="bg-gray-50 rounded-[40px] p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-secondary tracking-tight">Histórico de Pedidos</h3>
                      <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">Acompanhe suas compras e faturas</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {loadingOrders ? (
                      <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-secondary/40 font-bold">Você ainda não realizou nenhum pedido.</p>
                        <button 
                          onClick={() => navigate('/loja')}
                          className="mt-4 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                        >
                          Visitar a Loja Phaleduc
                        </button>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                          <div className="flex flex-col lg:flex-row justify-between gap-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                  order.status === 'pago' ? "bg-success/10 text-success" :
                                  order.status === 'Processing' ? "bg-primary/10 text-primary" :
                                  order.status === 'Shipped' ? "bg-indigo-50 text-indigo-600" :
                                  order.status === 'Delivered' ? "bg-emerald-50 text-emerald-600" :
                                  "bg-gray-100 text-gray-500"
                                )}>
                                  {order.status === 'pago' ? 'Confirmado' : 
                                   order.status === 'Processing' ? 'Processando' :
                                   order.status === 'Shipped' ? 'Enviado' :
                                   order.status === 'Delivered' ? 'Entregue' : order.status}
                                </span>
                                <span className="text-[10px] font-black text-secondary/20 uppercase tracking-widest">
                                  #{order.id.slice(0, 8).toUpperCase()}
                                </span>
                              </div>
                              <h4 className="text-xl font-black text-secondary">
                                Pedido de {new Date(order.created_at).toLocaleDateString('pt-BR')}
                              </h4>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-secondary/60">
                                  <Package className="w-4 h-4" />
                                  {order.items?.length || 0} Itens
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-secondary/60">
                                  <CreditCard className="w-4 h-4" />
                                  US$ {(order.total_amount_cents / 100).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                              {order.tracking_number && (
                                <a 
                                  href={`https://www.17track.net/en/track?nums=${order.tracking_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all"
                                >
                                  <Truck className="w-4 h-4" /> Rastrear Pedido
                                </a>
                              )}
                              <button 
                                onClick={() => handleDownloadInvoice(order)}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-secondary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                              >
                                <FileText className="w-4 h-4" /> Download Invoice
                              </button>
                            </div>
                          </div>

                          <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-secondary/40 font-black text-xs">
                                  {item.quantity}x
                                </div>
                                <div>
                                  <p className="text-sm font-black text-secondary truncate max-w-[150px]">
                                    {item.name}
                                    {item.variant_name && (
                                      <span className="text-primary ml-1">({item.variant_name})</span>
                                    )}
                                  </p>
                                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                                    {item.sku ? `SKU: ${item.sku}` : (item.type === 'fisico' ? 'Produto Físico' : 'Assinatura')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trava de Segurança (PIN) */}
      <PinVerificationModal 
        isOpen={pinModalOpen} 
        onClose={() => setPinModalOpen(false)} 
        onSuccess={handleParentSuccess} 
        correctPin={familyData?.parent_pin || "1234"}
      />
    </div>
  );
};

const TutoresPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mustCreatePassword, setMustCreatePassword] = useState(false);
  const [tutorData, setTutorData] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tutorStudents, setTutorStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTurma, setSelectedTurma] = useState<any | null>(null);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [biblioteca, setBiblioteca] = useState<any[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeStepToAssign, setActiveStepToAssign] = useState<number | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [weeklyLoop, setWeeklyLoop] = useState<any>({
    historia: null,
    historia_agendamento: '',
    jogo: null,
    jogo_agendamento: '',
    tarefa: null,
    tarefa_agendamento: '',
    revisao: null,
    revisao_agendamento: '',
    missao: null,
    missao_agendamento: '',
    liberadoAgora: false
  });
  const [selectedStudentReports, setSelectedStudentReports] = useState<any[]>([]);
  const [selectedStudentReflections, setSelectedStudentReflections] = useState<any[]>([]);
  const [activityExecutions, setActivityExecutions] = useState<any[]>([]);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<any>(null);
  const [evaluationPoints, setEvaluationPoints] = useState(0);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [isSavingLoop, setIsSavingLoop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loopProgress, setLoopProgress] = useState<Record<string, number>>({});
  const [metrics, setMetrics] = useState({
    oralidade: 0,
    compreensao: 0,
    escrita: 0,
    cultura: 0,
    feedback: '',
    orientacao: '',
    missaoTitulo: '',
    missaoPrompt: '',
    historiaDesbloqueada: true,
    jogoDesbloqueado: true,
    tarefaDesbloqueada: true,
    revisaoDesbloqueada: true,
    missaoSextaDesbloqueada: true
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    if (isLoggedIn && tutorData) {
      fetchTutorStudents();
    }
  }, [isLoggedIn, tutorData]);

  useEffect(() => {
    if (activeTab === 'loop' && (selectedTurma || selectedStudent)) {
      fetchWeeklyLoop();
    }
  }, [activeTab, selectedTurma, selectedStudent]);

  useEffect(() => {
    if (isLoggedIn && tutorData && (selectedTurma || selectedStudent)) {
      fetchLoopProgress();
    }
  }, [weeklyLoop, selectedTurma, selectedStudent]);

  const fetchLoopProgress = async () => {
    if (!weeklyLoop || (!selectedTurma && !selectedStudent)) return;

    const resourceIds = [
      weeklyLoop.historia?.id,
      weeklyLoop.jogo?.id,
      weeklyLoop.tarefa?.id,
      weeklyLoop.revisao?.id,
      weeklyLoop.missao?.id
    ].filter(Boolean);

    const hasManualMission = !weeklyLoop.missao?.id;

    if (resourceIds.length === 0 && !hasManualMission) {
      setLoopProgress({});
      return;
    }

    try {
      let query = supabase
        .from('execucoes_atividades')
        .select('aluno_id, recurso_id, loop_config_id, tipo_atividade, semana_inicio');

      // Filtrar por aluno ou turma
      if (selectedStudent) {
        query = query.eq('aluno_id', selectedStudent.id);
      } else if (selectedTurma) {
        const studentIds = tutorStudents
          .filter(s => s.turma_id === selectedTurma.id)
          .map(s => s.id);
        if (studentIds.length > 0) {
          query = query.in('aluno_id', studentIds);
        } else {
          setLoopProgress({});
          return;
        }
      }

      const orFilters = [];
      if (resourceIds.length > 0) {
        orFilters.push(`recurso_id.in.(${resourceIds.join(',')})`);
      }
      
      // Para missões manuais, filtramos pelo loop_config_id
      if (hasManualMission && weeklyLoop.loop_config_id) {
        orFilters.push(`loop_config_id.eq.${weeklyLoop.loop_config_id}`);
      }

      if (orFilters.length === 0) {
        setLoopProgress({});
        return;
      }

      const { data: executions, error: execError } = await query.or(orFilters.join(','));
      if (execError) throw execError;

      const progress: Record<string, number> = {};
      const types = ['historia', 'jogo', 'tarefa', 'revisao', 'missao'];

      types.forEach(type => {
        const resource = weeklyLoop[type];
        
        // Se for missão manual
        if (type === 'missao' && !resource?.id) {
          const manualExecutions = executions?.filter(ex => 
            ex.tipo_atividade === 'missao' && 
            ex.semana_inicio === weeklyLoop.semana_inicio &&
            ex.loop_config_id === weeklyLoop.loop_config_id
          ) || [];
          if (selectedStudent) {
            const completed = manualExecutions.some(ex => ex.aluno_id === selectedStudent.id);
            progress[type] = completed ? 100 : 0;
          } else if (selectedTurma) {
            const studentsInTurma = tutorStudents.filter(s => s.turma_id === selectedTurma.id);
            if (studentsInTurma.length === 0) {
              progress[type] = 0;
            } else {
              const studentIdsInTurma = studentsInTurma.map(s => s.id);
              const completedCount = manualExecutions.filter(ex => studentIdsInTurma.includes(ex.aluno_id)).length;
              progress[type] = Math.round((completedCount / studentsInTurma.length) * 100);
            }
          }
          return;
        }

        if (!resource?.id) {
          progress[type] = 0;
          return;
        }

        const resourceExecutions = executions?.filter(ex => ex.recurso_id === resource.id) || [];
        
        if (selectedStudent) {
          const completed = resourceExecutions.some(ex => ex.aluno_id === selectedStudent.id);
          progress[type] = completed ? 100 : 0;
        } else if (selectedTurma) {
          const studentsInTurma = tutorStudents.filter(s => s.turma_id === selectedTurma.id);
          if (studentsInTurma.length === 0) {
            progress[type] = 0;
          } else {
            const studentIdsInTurma = studentsInTurma.map(s => s.id);
            const completedCount = resourceExecutions.filter(ex => studentIdsInTurma.includes(ex.aluno_id)).length;
            progress[type] = Math.round((completedCount / studentsInTurma.length) * 100);
          }
        }
      });

      setLoopProgress(progress);
    } catch (err) {
      console.error('Error fetching loop progress:', err);
    }
  };

  const fetchWeeklyLoop = async () => {
    try {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      const mondayStr = monday.toISOString().split('T')[0];

      let query = supabase.from('loops_semanais').select('*, historia:historia_id(*), jogo:jogo_id(*), tarefa:tarefa_id(*), revisao:revisao_id(*), missao:missao_id(*)');
      
      if (selectedTurma) {
        query = query.eq('turma_id', selectedTurma.id);
      } else if (selectedStudent) {
        query = query.eq('aluno_id', selectedStudent.id);
      } else {
        return;
      }

      const { data, error } = await query.eq('semana_referencia', mondayStr).maybeSingle();
      
      let activeConfig = data;

      // Se selecionou um aluno e não tem loop individual (ou está vazio), busca o da turma dele
      const isConfigEmpty = !activeConfig || (!activeConfig.historia_id && !activeConfig.jogo_id && !activeConfig.tarefa_id && !activeConfig.revisao_id && !activeConfig.missao_id);
      
      if (isConfigEmpty && selectedStudent?.turma_id) {
        const { data: turmaData } = await supabase
          .from('loops_semanais')
          .select('*, historia:historia_id(*), jogo:jogo_id(*), tarefa:tarefa_id(*), revisao:revisao_id(*), missao:missao_id(*)')
          .eq('turma_id', selectedStudent.turma_id)
          .eq('semana_referencia', mondayStr)
          .maybeSingle();
        
        // Só usa o da turma se ele tiver conteúdo
        if (turmaData && (turmaData.historia_id || turmaData.jogo_id || turmaData.tarefa_id || turmaData.revisao_id || turmaData.missao_id)) {
          activeConfig = turmaData;
        }
      }

      if (activeConfig) {
        // Buscar também as configs extras (missão, desbloqueios)
        let queryExtra = supabase.from('loop_semanal_config').select('*').eq('semana_inicio', mondayStr);
        if (selectedStudent) queryExtra = queryExtra.eq('aluno_id', selectedStudent.id);
        else if (selectedTurma) queryExtra = queryExtra.eq('turma_id', selectedTurma.id);
        
        let { data: extraConfig } = await queryExtra.maybeSingle();

        // Fallback para a turma se estiver vendo um aluno e não houver config individual
        if (!extraConfig && selectedStudent?.turma_id) {
          const { data: turmaExtra } = await supabase
            .from('loop_semanal_config')
            .select('*')
            .eq('turma_id', selectedStudent.turma_id)
            .eq('semana_inicio', mondayStr)
            .maybeSingle();
          if (turmaExtra) extraConfig = turmaExtra;
        }

        setWeeklyLoop({
          historia: activeConfig.historia,
          historia_agendamento: activeConfig.historia_agendamento || '',
          jogo: activeConfig.jogo,
          jogo_agendamento: activeConfig.jogo_agendamento || '',
          tarefa: activeConfig.tarefa,
          tarefa_agendamento: activeConfig.tarefa_agendamento || '',
          revisao: activeConfig.revisao,
          revisao_agendamento: activeConfig.revisao_agendamento || '',
          missao: activeConfig.missao,
          missao_agendamento: activeConfig.missao_agendamento || '',
          liberadoAgora: activeConfig.liberacao_manual,
          loop_config_id: extraConfig?.id,
          semana_inicio: mondayStr
        });

        if (extraConfig) {
          setMetrics(prev => ({
            ...prev,
            missaoSextaDesbloqueada: extraConfig.missao_sexta_desbloqueada,
            missaoTitulo: extraConfig.missao_titulo || '',
            missaoPrompt: extraConfig.missao_prompt || '',
            historiaDesbloqueada: extraConfig.historia_desbloqueada,
            jogoDesbloqueado: extraConfig.jogo_desbloqueado,
            tarefaDesbloqueada: extraConfig.tarefa_desbloqueada,
            revisaoDesbloqueada: extraConfig.revisao_desbloqueada ?? true,
          }));
        } else {
          // Resetar métricas de desbloqueio se não houver config extra
          setMetrics(prev => ({
            ...prev,
            missaoSextaDesbloqueada: true,
            missaoTitulo: '',
            missaoPrompt: '',
            historiaDesbloqueada: true,
            jogoDesbloqueado: true,
            tarefaDesbloqueada: true,
            revisaoDesbloqueada: true,
          }));
        }
      } else {
        setWeeklyLoop({
          historia: null,
          historia_agendamento: '',
          jogo: null,
          jogo_agendamento: '',
          tarefa: null,
          tarefa_agendamento: '',
          revisao: null,
          revisao_agendamento: '',
          missao: null,
          missao_agendamento: '',
          liberadoAgora: false
        });
      }
    } catch (err) {
      console.error('Error fetching weekly loop:', err);
    }
  };

  const saveWeeklyLoop = async (updatedLoop: any) => {
    if (!selectedTurma && !selectedStudent) return;
    setIsSavingLoop(true);

    try {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      const mondayStr = monday.toISOString().split('T')[0];

      const payload = {
        turma_id: selectedStudent ? null : (selectedTurma?.id || null),
        aluno_id: selectedStudent?.id || null,
        tutor_id: tutorData?.id || null,
        semana_referencia: mondayStr,
        historia_id: updatedLoop.historia?.id || null,
        historia_agendamento: updatedLoop.historia_agendamento || null,
        jogo_id: updatedLoop.jogo?.id || null,
        jogo_agendamento: updatedLoop.jogo_agendamento || null,
        tarefa_id: updatedLoop.tarefa?.id || null,
        tarefa_agendamento: updatedLoop.tarefa_agendamento || null,
        revisao_id: updatedLoop.revisao?.id || null,
        revisao_agendamento: updatedLoop.revisao_agendamento || null,
        missao_id: updatedLoop.missao?.id || null,
        missao_agendamento: updatedLoop.missao_agendamento || null,
        liberacao_manual: updatedLoop.liberadoAgora
      };

      const conflictColumns = selectedStudent ? 'aluno_id,semana_referencia' : 'turma_id,semana_referencia';
      const { error: loopError } = await supabase
        .from('loops_semanais')
        .upsert(payload, { onConflict: conflictColumns });

      if (loopError) throw loopError;

      // 2. Salvar configurações extras (desbloqueios e missão)
      const extraPayload = {
        aluno_id: selectedStudent?.id || null,
        turma_id: selectedStudent ? null : (selectedTurma?.id || null),
        tutor_id: tutorData?.id || null,
        semana_inicio: mondayStr,
        historia_desbloqueada: metrics.historiaDesbloqueada,
        jogo_desbloqueado: metrics.jogoDesbloqueado,
        tarefa_desbloqueada: metrics.tarefaDesbloqueada,
        revisao_desbloqueada: metrics.revisaoDesbloqueada,
        missao_sexta_desbloqueada: metrics.missaoSextaDesbloqueada,
        missao_titulo: metrics.missaoTitulo,
        missao_prompt: metrics.missaoPrompt
      };

      const extraConflictColumns = selectedStudent ? 'aluno_id,semana_inicio' : 'turma_id,semana_inicio';
      const { error: extraError } = await supabase
        .from('loop_semanal_config')
        .upsert(extraPayload, { onConflict: extraConflictColumns });

      if (extraError) throw extraError;

    } catch (err) {
      console.error('Error saving weekly loop:', err);
    } finally {
      setIsSavingLoop(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const fetchLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('biblioteca_recursos')
        .select('*')
        .order('titulo');
      
      if (error) throw error;
      if (data) setBiblioteca(data);
    } catch (err) {
      console.error('Error fetching library:', err);
    }
  };

  const fetchActivityExecutions = async (alunoId: string) => {
    try {
      const { data, error } = await supabase
        .from('execucoes_atividades')
        .select('*, recurso:recurso_id(*), loop_config:loop_config_id(*)')
        .eq('aluno_id', alunoId)
        .order('data_conclusao', { ascending: false });
      
      if (error) throw error;
      setActivityExecutions(data || []);
    } catch (err) {
      console.error('Error fetching executions:', err);
    }
  };

  const handleSaveEvaluation = async () => {
    if (!selectedExecution) return;
    setIsSavingMetrics(true);
    try {
      const { error } = await supabase
        .from('execucoes_atividades')
        .update({
          pontos: evaluationPoints,
          feedback_tutor: evaluationFeedback,
          status: 'avaliado',
          avaliado_em: new Date().toISOString()
        })
        .eq('id', selectedExecution.id);

      if (error) throw error;
      
      // Update local state
      setActivityExecutions(prev => prev.map(ex => 
        ex.id === selectedExecution.id 
          ? { ...ex, pontos: evaluationPoints, feedback_tutor: evaluationFeedback, status: 'avaliado' }
          : ex
      ));
      
      setIsEvaluationModalOpen(false);
    } catch (err) {
      console.error('Error saving evaluation:', err);
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const fetchTutorStudents = async () => {
    try {
      // 1. Buscar turmas do tutor
      const { data: turmasData } = await supabase
        .from('turmas')
        .select('*')
        .eq('tutor_id', tutorData.id);
      
      if (turmasData) setTurmas(turmasData);

      // 2. Buscar alunos: 
      // - Atribuídos diretamente ao tutor (tutor_id)
      // - OU que pertençam a uma das turmas do tutor
      const turmaIds = turmasData?.map(t => t.id) || [];
      
      let query = supabase
        .from('alunos')
        .select('*, pais(*), turmas(nome, tutor_id)');

      if (turmaIds.length > 0) {
        query = query.or(`tutor_id.eq.${tutorData.id},turma_id.in.(${turmaIds.join(',')})`);
      } else {
        query = query.eq('tutor_id', tutorData.id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      if (data) setTutorStudents(data);

      await fetchLibrary();
    } catch (err) {
      console.error('Error fetching tutor data:', err);
    }
  };

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  };

  const fetchStudentReports = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('feedbacks_pedagogicos')
        .select('*')
        .eq('aluno_id', studentId)
        .order('semana_inicio', { ascending: false });
      
      if (data) setSelectedStudentReports(data);

      const { data: reflections, error: rError } = await supabase
        .from('reflexoes_familia')
        .select('*')
        .eq('aluno_id', studentId)
        .order('created_at', { ascending: false });

      if (reflections) setSelectedStudentReflections(reflections);
    } catch (err) {
      console.error('Error fetching reports/reflections:', err);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentReports(selectedStudent.id);
      fetchActivityExecutions(selectedStudent.id);
    } else {
      setSelectedStudentReports([]);
      setActivityExecutions([]);
    }
  }, [selectedStudent]);

  const handleSaveWeeklyClosing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setIsSavingMetrics(true);
    const semanaInicio = getMonday(new Date());

    try {
      // 1. Salvar métricas N0-N4 (Insert para manter histórico)
      const { error: mError } = await supabase
        .from('metricas_progresso')
        .insert({
          aluno_id: selectedStudent.id,
          tutor_id: tutorData?.id || null,
          semana_inicio: semanaInicio,
          oralidade: metrics.oralidade,
          compreensao: metrics.compreensao,
          escrita: metrics.escrita,
          cultura: metrics.cultura
        });

      if (mError) throw mError;

      // 2. Salvar feedback qualitativo (Insert para manter histórico)
      const { error: fError } = await supabase
        .from('feedbacks_pedagogicos')
        .insert({
          aluno_id: selectedStudent.id,
          tutor_id: tutorData?.id || null,
          semana_inicio: semanaInicio,
          conteudo: metrics.feedback,
          orientacao_familia: metrics.orientacao
        });

      if (fError) throw fError;

      // 3. Desbloquear loop semanal e configurar missão
      const { error: lError } = await supabase
        .from('loop_semanal_config')
        .upsert({
          aluno_id: selectedStudent.id,
          semana_inicio: semanaInicio,
          historia_desbloqueada: metrics.historiaDesbloqueada,
          jogo_desbloqueado: metrics.jogoDesbloqueado,
          tarefa_desbloqueada: metrics.tarefaDesbloqueada,
          revisao_desbloqueada: metrics.revisaoDesbloqueada,
          missao_sexta_desbloqueada: metrics.missaoSextaDesbloqueada,
          missao_titulo: metrics.missaoTitulo,
          missao_prompt: metrics.missaoPrompt
        }, { onConflict: 'aluno_id,semana_inicio' });

      if (lError) throw lError;

      alert('Fechamento de semana salvo com sucesso! A família foi notificada.');
      fetchStudentReports(selectedStudent.id);
      setMetrics({ 
        oralidade: 0, 
        compreensao: 0, 
        escrita: 0, 
        cultura: 0, 
        feedback: '', 
        orientacao: '',
        missaoTitulo: '',
        missaoPrompt: '',
        historiaDesbloqueada: true,
        jogoDesbloqueado: true,
        tarefaDesbloqueada: true,
        revisaoDesbloqueada: true,
        missaoSextaDesbloqueada: true
      });
    } catch (err: any) {
      console.error('Error saving weekly closing:', err);
      alert(`Erro ao salvar fechamento: ${err.message || 'Verifique se as tabelas SQL foram criadas.'}`);
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      console.error("Error resetting password:", err);
      toast.error("Erro ao enviar e-mail de recuperação: " + err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      // Tentar login via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        toast.error(`Erro no login: ${authError.message}`);
        return;
      }

      if (authData.user) {
        // Buscar dados do tutor
        const { data: tutor, error: tutorError } = await supabase
          .from('tutores')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (tutorError || !tutor) {
          // Se não encontrou pelo user_id, tentar pelo email para migração
          const { data: tutorByEmail } = await supabase
            .from('tutores')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (tutorByEmail) {
            // Vincular o tutor ao novo user_id
            await supabase.from('tutores').update({ user_id: authData.user.id }).eq('id', tutorByEmail.id);
            setTutorData({ ...tutorByEmail, user_id: authData.user.id });
          } else {
            toast.error('Tutor não encontrado no banco de dados.');
            return;
          }
        } else {
          setTutorData(tutor);
        }

        if (tutor && tutor.status !== 'ativo') {
          toast.error('Seu cadastro ainda não está ativo.');
          await supabase.auth.signOut();
          return;
        }

        setIsLoggedIn(true);
        setMustCreatePassword(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSavingPassword(true);
    try {
      // 1. Criar conta no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tutorData.email,
        password: newPassword,
        options: { data: { full_name: tutorData.nome, role: 'tutor' } }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          alert("Este e-mail já está cadastrado no sistema de autenticação. Por favor, use a opção de recuperar senha.");
          return;
        }
        throw authError;
      }

      const newAuthId = authData.user?.id;
      if (!newAuthId) throw new Error("Falha ao criar conta de autenticação.");

      const oldId = tutorData.id;

      // 2. Atualizar registro na tabela 'tutores' com o novo ID do Auth
      // Se o ID mudou, atualizamos o ID (PK) e o user_id
      if (oldId && oldId !== newAuthId) {
        console.log("Migrando ID do tutor de", oldId, "para", newAuthId);
        const { error: updateError } = await supabase
          .from('tutores')
          .update({ 
            id: newAuthId,
            user_id: newAuthId,
            nome: tutorData.nome,
            status: 'ativo'
          })
          .eq('id', oldId);
        
        if (updateError) throw updateError;
      } else {
        const { error: upsertError } = await supabase
          .from('tutores')
          .upsert({ 
            id: newAuthId,
            user_id: newAuthId,
            email: tutorData.email,
            nome: tutorData.nome,
            status: 'ativo'
          }, { onConflict: 'email' });
        
        if (upsertError) throw upsertError;
      }

      // 3. Migrar dados relacionados se o ID mudou
      if (oldId && oldId !== newAuthId) {
        console.log("Migrando dados do tutor do ID antigo:", oldId, "para o novo:", newAuthId);
        
        // Migrar Alunos
        await supabase.from('alunos').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Turmas
        await supabase.from('turmas').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Métricas de Progresso
        await supabase.from('metricas_progresso').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Feedbacks Pedagógicos
        await supabase.from('feedbacks_pedagogicos').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Avaliações de Tutores
        await supabase.from('avaliacoes_tutores').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Configurações de Loop
        await supabase.from('loop_semanal_config').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Loops Semanais
        await supabase.from('loops_semanais').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
        // Migrar Missões de Casa
        await supabase.from('missoes_casa').update({ tutor_id: newAuthId }).eq('tutor_id', oldId);
      }

      // Atualizar estado local
      setTutorData(prev => ({ ...prev, id: newAuthId }));
      setMustCreatePassword(false);
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Senha criada com sucesso! Sua conta está agora vinculada ao sistema de segurança.');
    } catch (err: any) {
      console.error('Error saving password:', err);
      alert('Erro ao salvar senha: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (showRegister) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-6"
      >
        <button 
          onClick={() => setShowRegister(false)}
          className="mb-8 flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs hover:text-primary transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Login
        </button>
        <TutorRegistration onSuccess={() => setShowRegister(false)} />
      </motion.div>
    );
  }

  if (!isLoggedIn) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6"
      >
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 space-y-8 border border-gray-100">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-4xl font-black text-secondary">Portal do Educador</h2>
            <p className="text-secondary/60 font-medium italic">"Educar é semear com sabedoria e colher com amor."</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all font-medium pr-14"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary transition-colors"
                >
                  {showPassword ? <X className="w-5 h-5" /> : <Play className="w-5 h-5 rotate-90" />}
                </button>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
            >
              Acessar Portal
            </button>
          </form>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-secondary/40 font-medium">
              Esqueceu sua senha? <button onClick={() => {
                if (!email) {
                  toast.error("Por favor, informe seu e-mail para recuperar a senha.");
                  return;
                }
                handleForgotPassword(email);
              }} className="text-secondary cursor-pointer hover:underline">Clique aqui</button>
            </p>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest mb-4">Ainda não é um tutor?</p>
              <button 
                onClick={() => setShowRegister(true)}
                className="text-primary font-black uppercase tracking-widest text-sm hover:underline"
              >
                Quero ser Tutor Phaleduc
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (mustCreatePassword) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6"
      >
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 space-y-8 border border-gray-100">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Unlock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black text-secondary">Criar sua Senha</h2>
            <p className="text-secondary/60 font-medium">Olá, {tutorData?.nome}! Para sua segurança, crie uma senha definitiva para acessar o portal.</p>
          </div>

          <form onSubmit={handleCreatePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Nova Senha</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Confirmar Senha</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button 
              type="submit"
              disabled={isSavingPassword}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSavingPassword ? 'Salvando...' : 'Definir Senha e Entrar'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-wider",
        activeTab === id 
          ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-105" 
          : "text-secondary/60 hover:bg-secondary/5"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-100 p-8 flex flex-col gap-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">P</div>
          <div>
            <h3 className="font-black text-secondary leading-tight">Portal Phaleduc</h3>
            <p className="text-xs text-secondary/40 font-bold uppercase tracking-tighter">LMS v2.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="🏠 Início" />
          <SidebarItem id="alunos" icon={Users} label="👥 Meus Alunos" />
          <SidebarItem id="loop" icon={LayoutDashboard} label="🎯 Loop Semanal" />
          <SidebarItem id="trilha" icon={BookOpen} label="🎓 Certificação" />
          <SidebarItem id="mala-rosa" icon={ShoppingBag} label="🎒 Mala Rosa" />
          <SidebarItem id="comunidade" icon={Coffee} label="🤝 Comunidade" />
          <SidebarItem id="perfil" icon={Award} label="🏆 Conclusão" />
        </nav>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm uppercase tracking-wider"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'loop' && (
            <motion.div 
              key="loop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-secondary flex items-center gap-3">
                    <LayoutDashboard className="w-6 h-6 text-primary" /> 
                    {selectedTurma ? `Turma: ${selectedTurma.nome}` : selectedStudent ? `Aluno: ${selectedStudent.nome}` : 'Painel de Controle de Missões'}
                  </h3>
                  <p className="text-xs font-medium text-secondary/40 uppercase tracking-widest">
                    {selectedTurma || selectedStudent ? 'Orquestração do Loop Semanal' : 'Selecione uma turma ou aluno para começar'}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-2">Contexto de Atribuição</span>
                    <div className="relative">
                      <select 
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.startsWith('turma:')) {
                            const t = turmas.find(t => t.id === val.replace('turma:', ''));
                            setSelectedTurma(t || null);
                            setSelectedStudent(null);
                          } else if (val.startsWith('aluno:')) {
                            const s = tutorStudents.find(s => s.id === val.replace('aluno:', ''));
                            setSelectedStudent(s || null);
                            setSelectedTurma(null);
                          } else {
                            setSelectedTurma(null);
                            setSelectedStudent(null);
                          }
                        }}
                        className="px-6 py-3 bg-gray-50 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest text-secondary focus:ring-2 focus:ring-primary/20 transition-all min-w-[240px]"
                        value={selectedTurma ? `turma:${selectedTurma.id}` : selectedStudent ? `aluno:${selectedStudent.id}` : ''}
                      >
                        <option value="">Selecione Turma ou Aluno</option>
                        {turmas.length > 0 && (
                          <optgroup label="Turmas">
                            {turmas.map(t => (
                              <option key={t.id} value={`turma:${t.id}`}>Turma: {t.nome}</option>
                            ))}
                          </optgroup>
                        )}
                        {tutorStudents.length > 0 && (
                          <optgroup label="Alunos Individuais">
                            {tutorStudents.map(s => (
                              <option key={s.id} value={`aluno:${s.id}`}>Aluno: {s.nome}</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      {selectedStudent && (
                        <div className="absolute -top-1 -right-1 flex gap-1">
                          {selectedStudent.turma_id && (
                            <div className="w-3 h-3 bg-primary rounded-full border-2 border-white" title="Pertence a uma turma" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10 mt-4 md:mt-0">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Liberar Loop Inteiro</span>
                    <button 
                      onClick={() => {
                        const newLoop = {...weeklyLoop, liberadoAgora: !weeklyLoop.liberadoAgora};
                        setWeeklyLoop(newLoop);
                        saveWeeklyLoop(newLoop);
                      }}
                      className={cn("w-12 h-6 rounded-full transition-all relative", weeklyLoop.liberadoAgora ? "bg-success" : "bg-gray-200")}
                    >
                      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", weeklyLoop.liberadoAgora ? "right-1" : "left-1")} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 5 Columns Flow */}
              <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative",
                (!selectedTurma && !selectedStudent) && "opacity-50 pointer-events-none"
              )}>
                {(!selectedTurma && !selectedStudent) && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-[40px]">
                    <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4 border border-gray-100">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                        <Users className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-secondary">Selecione um Contexto</h4>
                      <p className="text-sm text-secondary/60 font-medium max-w-[240px]">Escolha uma turma ou um aluno individual para gerenciar as atividades da semana.</p>
                    </div>
                  </div>
                )}
                {[
                  { id: 1, title: 'História', icon: BookOpen, color: 'primary', day: 'Segunda', type: 'historia' },
                  { id: 2, title: 'Jogo', icon: Gamepad2, color: 'success', day: 'Terça', type: 'jogo' },
                  { id: 3, title: 'Tarefa', icon: Mic, color: 'warning', day: 'Quarta', type: 'tarefa' },
                  { id: 4, title: 'Revisão', icon: Sparkles, color: 'primary', day: 'Quinta', type: 'revisao' },
                  { id: 5, title: 'Missão', icon: Package, color: 'secondary', day: 'Sexta', type: 'missao' }
                ].map((step) => {
                  const resource = weeklyLoop[step.type];
                  return (
                    <div key={step.id} className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", step.color === 'primary' ? 'bg-primary/10' : step.color === 'success' ? 'bg-success/10' : step.color === 'warning' ? 'bg-warning/10' : 'bg-secondary/10')}>
                            <step.icon className={cn("w-4 h-4", step.color === 'primary' ? 'text-primary' : step.color === 'success' ? 'text-success' : step.color === 'warning' ? 'text-warning' : 'text-secondary')} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">{step.title}</h4>
                            <p className="text-[9px] font-bold text-secondary/30 uppercase">{step.day}</p>
                          </div>
                        </div>
                      </div>

                      <div className={cn(
                        "min-h-[280px] rounded-[32px] border-2 border-dashed p-4 flex flex-col transition-all",
                        resource ? "border-primary/20 bg-primary/5" : "border-gray-100 bg-gray-50/50"
                      )}>
                        {resource ? (
                          <div className="flex-1 flex flex-col gap-4">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white shadow-sm">
                              <img src={resource.miniatura_url || `https://picsum.photos/seed/${resource.id}/400/225`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newLoop = {
                                    ...weeklyLoop, 
                                    [step.type]: null,
                                    [`${step.type}_agendamento`]: ''
                                  };
                                  setWeeklyLoop(newLoop);
                                  saveWeeklyLoop(newLoop);
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all z-10"
                                title="Remover atividade"
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-xs font-black text-secondary line-clamp-1">{resource.titulo}</h5>
                              <p className="text-[10px] text-secondary/50 line-clamp-2 leading-relaxed">{resource.descricao}</p>
                            </div>
                            
                            <div className="mt-auto space-y-3">
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-secondary/40 px-1">Agendar para:</label>
                                <input 
                                  type="datetime-local"
                                  value={weeklyLoop[`${step.type}_agendamento`] || ''}
                                  onChange={(e) => {
                                    const newLoop = {...weeklyLoop, [`${step.type}_agendamento`]: e.target.value};
                                    setWeeklyLoop(newLoop);
                                    saveWeeklyLoop(newLoop);
                                  }}
                                  className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-secondary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                              </div>

                              <button 
                                onClick={() => {
                                  const newLoop = {...weeklyLoop, liberadoAgora: !weeklyLoop.liberadoAgora};
                                  setWeeklyLoop(newLoop);
                                  saveWeeklyLoop(newLoop);
                                }}
                                className={cn(
                                  "w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                  weeklyLoop.liberadoAgora ? "bg-success text-white" : "bg-primary text-white"
                                )}
                              >
                                <Calendar className="w-3 h-3" /> {weeklyLoop.liberadoAgora ? 'Liberado' : 'Agendar'}
                              </button>
                              
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-secondary/30">
                                  <span>Progresso</span>
                                  <span>{loopProgress[step.type] || 0}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full transition-all duration-1000",
                                      (loopProgress[step.type] || 0) === 100 ? "bg-success" : "bg-primary"
                                    )} 
                                    style={{ width: `${loopProgress[step.type] || 0}%` }} 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              const typeMap: Record<number, string> = {
                                1: 'historia',
                                2: 'jogo',
                                3: 'tarefa',
                                4: 'revisao',
                                5: 'missao'
                              };
                              setActiveStepToAssign(step.id);
                              setLibraryFilter(typeMap[step.id] || 'all');
                              setLibrarySearch('');
                              setIsLibraryOpen(true);
                              fetchLibrary(); // Refresh library when opening
                            }}
                            className="flex-1 flex flex-col items-center justify-center gap-3 group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all">
                              <Plus className="w-5 h-5 text-secondary/20" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/20">Atribuir Recurso</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Mission Details & Unlocks */}
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <Compass className="w-6 h-6 text-pink-500" />
                  <h4 className="text-lg font-black text-secondary">Detalhes da Missão Cultural</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Título da Missão</label>
                    <input 
                      type="text"
                      value={metrics.missaoTitulo}
                      onChange={(e) => setMetrics({ ...metrics, missaoTitulo: e.target.value })}
                      className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Ex: Exploradores de Museus"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Prompt/Instrução da Missão</label>
                    <textarea 
                      value={metrics.missaoPrompt}
                      onChange={(e) => setMetrics({ ...metrics, missaoPrompt: e.target.value })}
                      className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-24"
                      placeholder="O que o aluno deve fazer nesta missão?"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                  {[
                    { id: 'historiaDesbloqueada', label: 'História', icon: BookOpen },
                    { id: 'jogoDesbloqueado', label: 'Jogo', icon: Gamepad2 },
                    { id: 'tarefaDesbloqueada', label: 'Tarefa', icon: Pencil },
                    { id: 'revisaoDesbloqueada', label: 'Revisão', icon: RefreshCw },
                    { id: 'missaoSextaDesbloqueada', label: 'Missão', icon: Compass },
                  ].map((station) => (
                    <button
                      key={station.id}
                      onClick={() => setMetrics({ ...metrics, [station.id]: !(metrics as any)[station.id] })}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all font-bold text-[10px] uppercase tracking-widest",
                        (metrics as any)[station.id]
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-gray-50 border-gray-100 text-secondary/40"
                      )}
                    >
                      <station.icon className="w-4 h-4" />
                      {station.label} {(metrics as any)[station.id] ? 'Liberado' : 'Bloqueado'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button & Status */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500",
                    isSavingLoop ? "bg-warning animate-pulse" : "bg-success"
                  )} />
                  <p className="text-xs font-bold text-secondary/60">
                    {isSavingLoop ? 'Salvando alterações...' : saveSuccess ? 'Alterações salvas com sucesso! ✨' : 'Todas as alterações foram sincronizadas'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {saveSuccess && (
                    <motion.span 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] font-black text-success uppercase tracking-widest"
                    >
                      Sincronizado!
                    </motion.span>
                  )}
                  <button 
                    onClick={() => saveWeeklyLoop(weeklyLoop)}
                    disabled={isSavingLoop || (!selectedTurma && !selectedStudent)}
                    className={cn(
                      "px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                      isSavingLoop 
                        ? "bg-gray-100 text-secondary/40 cursor-not-allowed" 
                        : saveSuccess
                          ? "bg-success text-white shadow-xl shadow-success/20"
                          : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                    )}
                  >
                    {isSavingLoop ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : saveSuccess ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isSavingLoop ? 'Salvando...' : saveSuccess ? 'Salvo!' : 'Salvar Atribuições'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alunos' && (
            <motion.div 
              key="alunos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black text-secondary">Meus Alunos</h2>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Total:</span>
                  <span className="font-black text-secondary">{tutorStudents.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Student List */}
                <div className="lg:col-span-4 space-y-4">
                  {tutorStudents.map((student) => (
                    <button 
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={cn(
                        "w-full p-6 rounded-3xl border transition-all flex items-center gap-4 text-left group",
                        selectedStudent?.id === student.id ? "bg-white border-primary shadow-lg" : "bg-white border-gray-100 hover:border-primary/50"
                      )}
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                        {student.avatar || '👶'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-secondary">{student.nome}</h4>
                          {student.turma_id && (
                            <div className="w-2 h-2 bg-primary rounded-full" title="Aluno de Turma" />
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">{student.nivel}</p>
                      </div>
                      <ChevronRight className={cn("w-5 h-5 transition-all", selectedStudent?.id === student.id ? "text-primary translate-x-1" : "text-gray-200")} />
                    </button>
                  ))}
                  {tutorStudents.length === 0 && (
                    <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                      <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-secondary/40 font-bold uppercase tracking-widest text-xs">Nenhum aluno vinculado</p>
                    </div>
                  )}
                </div>

                {/* Weekly Closing Form */}
                <div className="lg:col-span-8">
                  {selectedStudent ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-50 space-y-10"
                    >
                      <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-4xl">
                          {selectedStudent.avatar || '👶'}
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-secondary">Fechamento de Semana</h3>
                          <p className="text-secondary/60 font-medium">Acompanhamento para {selectedStudent.nome}</p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveWeeklyClosing} className="space-y-10">
                        {/* Metrics N0-N4 */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Métricas de Aprendizado (N0 a N4)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                              { id: 'oralidade', label: 'Oralidade' },
                              { id: 'compreensao', label: 'Compreensão' },
                              { id: 'escrita', label: 'Escrita' },
                              { id: 'cultura', label: 'Cultura' }
                            ].map((axis) => (
                              <div key={axis.id} className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <label className="font-bold text-secondary">{axis.label}</label>
                                  <span className="text-primary font-black">N{(metrics as any)[axis.id]}</span>
                                </div>
                                <div className="flex gap-2">
                                  {[0, 1, 2, 3, 4].map((n) => (
                                    <button
                                      key={n}
                                      type="button"
                                      onClick={() => setMetrics({ ...metrics, [axis.id]: n })}
                                      className={cn(
                                        "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                                        (metrics as any)[axis.id] === n 
                                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                          : "bg-gray-50 text-secondary/40 hover:bg-gray-100"
                                      )}
                                    >
                                      N{n}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Qualitative Feedback */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Feedback para a Família
                          </h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Relatório Qualitativo</label>
                              <textarea 
                                value={metrics.feedback}
                                onChange={(e) => setMetrics({ ...metrics, feedback: e.target.value })}
                                className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32"
                                placeholder="Como foi o desempenho do aluno nesta semana?"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Orientação para a Família (Co-professora)</label>
                              <textarea 
                                value={metrics.orientacao}
                                onChange={(e) => setMetrics({ ...metrics, orientacao: e.target.value })}
                                className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32"
                                placeholder="Dicas para os pais reforçarem o aprendizado em casa."
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Weekly Loop Management */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Gerenciamento do Loop Semanal
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { id: 'historiaDesbloqueada', label: 'História', icon: BookOpen },
                              { id: 'jogoDesbloqueado', label: 'Jogo', icon: Gamepad2 },
                              { id: 'tarefaDesbloqueada', label: 'Tarefa', icon: Pencil },
                              { id: 'revisaoDesbloqueada', label: 'Revisão', icon: RefreshCw },
                              { id: 'missaoSextaDesbloqueada', label: 'Missão', icon: Target }
                            ].map((step) => (
                              <button
                                key={step.id}
                                type="button"
                                onClick={() => setMetrics({ ...metrics, [step.id]: !(metrics as any)[step.id] })}
                                className={cn(
                                  "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                                  (metrics as any)[step.id] 
                                    ? "bg-primary/5 border-primary text-primary shadow-sm" 
                                    : "bg-white border-gray-100 text-secondary/20 hover:border-gray-200"
                                )}
                              >
                                <step.icon className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                  (metrics as any)[step.id] ? "bg-primary border-primary" : "border-gray-200"
                                )}>
                                  {(metrics as any)[step.id] && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Home Mission Prompt */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Missão de Casa (Sexta-feira)
                          </h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Título da Missão</label>
                              <input 
                                type="text"
                                value={metrics.missaoTitulo}
                                onChange={(e) => setMetrics({ ...metrics, missaoTitulo: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary"
                                placeholder="Ex: Entrevista com a Vovó"
                                required={metrics.missaoSextaDesbloqueada}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-4">Prompt da Missão (Instrução para a Família)</label>
                              <textarea 
                                value={metrics.missaoPrompt}
                                onChange={(e) => setMetrics({ ...metrics, missaoPrompt: e.target.value })}
                                className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-24"
                                placeholder="O que a criança e a família devem fazer juntas?"
                                required={metrics.missaoSextaDesbloqueada}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 flex justify-end gap-4">
                          <button 
                            type="button"
                            onClick={() => setSelectedStudent(null)}
                            className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-secondary/40 hover:bg-gray-50 transition-all"
                          >
                            Cancelar
                          </button>
                          <button 
                            type="submit"
                            disabled={isSavingMetrics}
                            className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                          >
                            {isSavingMetrics ? 'Salvando...' : 'Finalizar Semana'}
                          </button>
                        </div>
                      </form>

                      {/* Reflections History */}
                      {/* Activity Evaluations Section */}
                      <div className="pt-10 border-t border-gray-50 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Atividades Realizadas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activityExecutions.length > 0 ? activityExecutions.map((exec) => (
                            <div key={exec.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">
                                    {exec.tipo_atividade}
                                  </span>
                                  <h5 className="text-sm font-black text-secondary">
                                    {exec.recurso?.titulo || exec.loop_config?.missao_titulo || 'Atividade Sem Título'}
                                  </h5>
                                </div>
                                <div className={cn(
                                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                  exec.status === 'avaliado' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                )}>
                                  {exec.status === 'avaliado' ? 'Avaliado' : 'Pendente'}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                    <Star className="w-4 h-4 fill-current" />
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-secondary/40">Pontos</p>
                                    <p className="text-xs font-black text-secondary">{exec.pontos || 0}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => {
                                    setSelectedExecution(exec);
                                    setEvaluationPoints(exec.pontos || 0);
                                    setEvaluationFeedback(exec.feedback_tutor || '');
                                    setIsEvaluationModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all"
                                >
                                  {exec.status === 'avaliado' ? 'Editar Nota' : 'Avaliar'}
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                              <p className="text-secondary/40 font-bold uppercase tracking-widest text-[10px]">Nenhuma atividade realizada ainda</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedStudentReflections.length > 0 && (
                        <div className="pt-10 border-t border-gray-50 space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-success flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Reflexões da Família
                          </h4>
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedStudentReflections.map((reflection) => (
                              <div key={reflection.id} className="p-6 bg-success/5 rounded-3xl border border-success/10 space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-success">Engajamento:</span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((n) => (
                                        <div key={n} className={cn("w-2 h-2 rounded-full", n <= reflection.engajamento ? "bg-success" : "bg-success/20")} />
                                      ))}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-secondary/40">
                                    {new Date(reflection.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-sm text-secondary/70 font-medium leading-relaxed italic">"{reflection.comentario}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reports History */}
                      {selectedStudentReports.length > 0 && (
                        <div className="pt-10 border-t border-gray-50 space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Histórico de Relatórios
                          </h4>
                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedStudentReports.map((report) => (
                              <div key={report.id} className="p-6 bg-gray-50 rounded-3xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                    Semana de {new Date(report.semana_inicio).toLocaleDateString('pt-BR')}
                                  </span>
                                  <span className="text-[10px] font-bold text-secondary/40">
                                    Enviado em {new Date(report.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-sm text-secondary/70 font-medium italic">"{report.conteudo}"</p>
                                {report.orientacao_familia && (
                                  <div className="pt-2 border-t border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-1">Orientação:</p>
                                    <p className="text-xs text-secondary/60">{report.orientacao_familia}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-secondary/10 mb-8">
                        <Users className="w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-black text-secondary">Selecione um aluno</h3>
                      <p className="text-secondary/40 font-medium max-w-xs mx-auto mt-2">Escolha um aluno na lista ao lado para realizar o fechamento pedagógico da semana.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-secondary">Olá, {tutorData?.nome || 'Educador(a)'}! 👋</h1>
                  <p className="text-secondary/60 font-medium italic">"Transformando a herança brasileira em futuro através da sua voz."</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-secondary/60 hover:text-secondary transition-all relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-black">
                      {tutorData?.nome?.[0] || 'E'}
                    </div>
                    <span className="font-bold text-secondary text-sm">{tutorData?.nome || 'Educador(a) Phaleduc'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Card */}
                <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center space-y-6">
                  <h3 className="font-black text-secondary uppercase tracking-widest text-xs">Progresso Geral</h3>
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
                      <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={502.4} strokeDashoffset={502.4 * (1 - 0.75)} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-secondary">75%</span>
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-tighter">Concluído</span>
                    </div>
                  </div>
                  <p className="text-sm text-secondary/60 font-medium">Faltam apenas 2 módulos para sua certificação!</p>
                </div>

                {/* Notice Board */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-50 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-secondary uppercase tracking-widest text-xs">Mural de Avisos</h3>
                    <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Ver todos</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Novo Material: Loop Semanal", date: "Hoje", type: "Material", color: "bg-primary" },
                      { title: "Webinar: Ciência do PLH", date: "Amanhã, 19h", type: "Evento", color: "bg-secondary" },
                      { title: "Atualização no Método de Avaliação", date: "2 dias atrás", type: "Aviso", color: "bg-yellow-400" },
                    ].map((notice, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group cursor-pointer border border-transparent hover:border-gray-100">
                        <div className={cn("w-3 h-3 rounded-full", notice.color)}></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-secondary group-hover:text-primary transition-all">{notice.title}</h4>
                          <p className="text-xs text-secondary/40 font-medium">{notice.date} • {notice.type}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-secondary/20 group-hover:text-primary transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges Shelf */}
                <div className="lg:col-span-3 bg-secondary p-10 rounded-[50px] shadow-2xl shadow-secondary/20 text-white space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-black uppercase tracking-widest text-xs opacity-60">Estante de Badges</h3>
                      <p className="text-2xl font-black">Suas Conquistas</p>
                    </div>
                    <Trophy className="w-10 h-10 opacity-20" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[
                      { name: "Especialista Bilinguismo", icon: Brain, active: true, sub: "Módulo 1", color: "text-green-400" },
                      { name: "Engajado", icon: Users, active: true, sub: "Social" },
                      { name: "Mestre do Método", icon: ShoppingBag, active: true, sub: "Módulo 3", color: "text-yellow-400" },
                      { name: "Expert PLH", icon: Award, active: false, sub: "Módulo 2" },
                      { name: "Comunitário", icon: MessageSquare, active: false, sub: "Fórum" },
                      { name: "Mestre Loop", icon: GraduationCap, active: false, sub: "Final" },
                    ].map((badge, i) => (
                      <div key={i} className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-3xl transition-all",
                        badge.active ? "bg-white/10 scale-105 border border-white/20" : "opacity-30 grayscale"
                      )}>
                        <badge.icon className={cn("w-8 h-8", badge.color)} />
                        <div className="text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest block">{badge.name}</span>
                          <span className="text-[8px] font-bold opacity-60 uppercase tracking-tighter">{badge.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'trilha' && (
            <motion.div 
              key="trilha"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Modules List */}
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-3xl font-black text-secondary mb-6">Trilha de Certificação</h2>
                {[
                  { id: 1, title: "Ciência do PLH", status: "Concluído", progress: 100 },
                  { id: 2, title: "Heterogeneidade", status: "Concluído", progress: 100 },
                  { id: 3, title: "Método Loop Semanal", status: "Em progresso", progress: 45 },
                  { id: 4, title: "Parceria com a Família", status: "Bloqueado", progress: 0 },
                ].map((mod) => (
                  <div key={mod.id} className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer group",
                    mod.status === "Em progresso" ? "bg-white border-primary shadow-lg" : "bg-white border-gray-100 hover:border-primary/50",
                    mod.status === "Bloqueado" && "opacity-50 grayscale cursor-not-allowed"
                  )}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        {mod.id}
                      </div>
                      {mod.status === "Bloqueado" && <Lock className="w-5 h-5 text-gray-300" />}
                    </div>
                    <h4 className="font-black text-secondary mb-1">{mod.title}</h4>
                    <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest mb-4">{mod.status}</p>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${mod.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Content Area */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-black aspect-video rounded-[40px] overflow-hidden shadow-2xl relative group">
                  <img src="https://picsum.photos/seed/education/1280/720" alt="Video Placeholder" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-all">
                      <Play className="w-10 h-10 fill-current ml-2" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-2xl font-black text-white">Aula 3.2: Estrutura do Loop Semanal</h3>
                    <p className="text-white/60 font-medium">Módulo 3: Método Loop Semanal</p>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-50 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-secondary">Material de Apoio</h3>
                    <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:underline">
                      <Download className="w-4 h-4" /> Baixar PDF
                    </button>
                  </div>
                  <div className="prose prose-secondary max-w-none">
                    <p className="text-secondary/70 font-medium leading-relaxed">
                      Nesta aula, exploramos como o Método Loop Semanal organiza as atividades de forma cíclica, garantindo que o aluno tenha contato constante com os pilares da língua portuguesa de forma lúdica e estruturada.
                    </p>
                    <ul className="space-y-4 mt-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-secondary/70 font-medium">Compreensão da estrutura cíclica.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-secondary/70 font-medium">Adaptação para diferentes níveis de proficiência.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                    <button className="px-8 py-4 rounded-2xl border border-gray-100 font-black uppercase tracking-widest text-xs text-secondary/40 hover:bg-gray-50 transition-all">Aula Anterior</button>
                    <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Iniciar Quiz</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'mala-rosa' && (
            <motion.div 
              key="mala-rosa"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-4xl font-black text-secondary">Mala Rosa Digital</h2>
                  <p className="text-secondary/60 font-medium">Seu repositório de recursos pedagógicos.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Buscar recursos..."
                      className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <button className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Filter className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: "Plano de Aula: Carnaval", tag: "Infantil", icon: Bird, type: "PDF", downloads: 124 },
                  { title: "Jogo das Rimas", tag: "Alfabetização", icon: GraduationCap, type: "ZIP", downloads: 89 },
                  { title: "Tutorial: Loop Semanal", tag: "Tutorial", icon: Video, type: "MP4", downloads: 256 },
                  { title: "Flashcards: Animais", tag: "Infantil", icon: Bird, type: "PDF", downloads: 167 },
                  { title: "Música: Alfabeto", tag: "Música", icon: Music, type: "MP3", downloads: 432 },
                  { title: "Guia de Heterogeneidade", tag: "Alfabetização", icon: GraduationCap, type: "PDF", downloads: 95 },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <item.icon className="w-7 h-7" />
                      </div>
                      <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary/40">{item.tag}</span>
                    </div>
                    <h4 className="text-xl font-black text-secondary mb-2 group-hover:text-primary transition-all">{item.title}</h4>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-xs font-bold text-secondary/40">
                        <Download className="w-4 h-4" /> {item.downloads} downloads
                      </div>
                      <span className="text-xs font-black text-primary uppercase tracking-widest">{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'comunidade' && (
            <motion.div 
              key="comunidade"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-black text-secondary">Espaço do Café</h2>
                <p className="text-secondary/60 font-medium italic">"Um lugar para trocar experiências e fortalecer nossa rede de solidariedade."</p>
              </div>

              <div className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-50 flex gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex-shrink-0"></div>
                <div className="flex-1 space-y-4">
                  <textarea 
                    placeholder="Compartilhe uma ideia ou dúvida..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none h-32"
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button className="p-2 text-secondary/40 hover:text-primary transition-all"><Camera className="w-5 h-5" /></button>
                      <button className="p-2 text-secondary/40 hover:text-primary transition-all"><LinkIcon className="w-5 h-5" /></button>
                    </div>
                    <button className="px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all">Publicar</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { user: "Ana Silva", location: "Portugal", content: "Hoje usei o Jogo das Rimas com minha turma de 5 anos e foi um sucesso! Eles adoraram os cards coloridos.", likes: 24, comments: 5 },
                  { user: "John Doe", location: "EUA", content: "Alguém tem dicas para trabalhar heterogeneidade em turmas online com fusos horários diferentes?", likes: 12, comments: 18 },
                ].map((post, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-50 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-2xl"></div>
                      <div>
                        <h4 className="font-black text-secondary">{post.user}</h4>
                        <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">{post.location}</p>
                      </div>
                    </div>
                    <p className="text-secondary/70 font-medium leading-relaxed">{post.content}</p>
                    <div className="flex gap-6 pt-4 border-t border-gray-50">
                      <button className="flex items-center gap-2 text-xs font-black text-secondary/40 hover:text-primary transition-all">
                        <Star className="w-4 h-4" /> Apoiar ({post.likes})
                      </button>
                      <button className="flex items-center gap-2 text-xs font-black text-secondary/40 hover:text-primary transition-all">
                        <MessageSquare className="w-4 h-4" /> Comentar ({post.comments})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'perfil' && (
            <motion.div 
              key="perfil"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-50 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                  <div className="w-48 h-48 bg-secondary/10 rounded-[60px] flex items-center justify-center border-4 border-white shadow-2xl">
                    <Users className="w-20 h-20 text-secondary" />
                  </div>
                  <button className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div>
                    <h2 className="text-5xl font-black text-secondary">{tutorData?.nome || 'Tutor Phaleduc'}</h2>
                    <p className="text-xl text-secondary/40 font-bold uppercase tracking-widest">
                      {tutorData?.convite_enviado_em ? `Membro desde ${new Date(tutorData.convite_enviado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}` : 'Membro desde Jan 2024'}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black uppercase tracking-widest text-xs">Nível 4</div>
                    <div className="px-6 py-3 bg-secondary/10 text-secondary rounded-2xl font-black uppercase tracking-widest text-xs">1.250 XP</div>
                    <div className="px-6 py-3 bg-yellow-400/10 text-yellow-600 rounded-2xl font-black uppercase tracking-widest text-xs">3 Badges</div>
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="flex items-center gap-2 text-xs font-black text-secondary/40 hover:text-primary transition-all uppercase tracking-widest"
                    >
                      <Settings className="w-4 h-4" /> Configurações de Segurança
                    </button>
                  </div>
                </div>
              </div>

              {showPasswordChange && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-12 rounded-[50px] shadow-xl border border-primary/20 space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black text-secondary">Alterar Senha</h3>
                    <button onClick={() => setShowPasswordChange(false)} className="text-secondary/40 hover:text-danger"><X className="w-6 h-6" /></button>
                  </div>
                  <form onSubmit={handleCreatePassword} className="grid md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Nova Senha</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Confirmar Senha</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button 
                        type="submit"
                        disabled={isSavingPassword}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        {isSavingPassword ? 'Salvando...' : 'Atualizar Senha'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Checklist de Qualidade */}
              <div className="bg-white p-12 rounded-[50px] shadow-xl border border-gray-50 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black text-secondary">Checklist de Qualidade: Projeto Final</h3>
                  <span className="px-6 py-2 bg-yellow-400 text-white rounded-full font-black uppercase tracking-widest text-[10px]">Ação Necessária</span>
                </div>
                <p className="text-secondary/60 font-medium">Antes de enviar o vídeo do seu projeto prático, verifique se todos os itens abaixo foram atendidos:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Iluminação adequada e áudio claro",
                    "Aplicação real do Método Loop Semanal",
                    "Interação lúdica com o aluno",
                    "Uso de materiais da Mala Rosa",
                    "Duração entre 5 e 10 minutos",
                    "Resolução mínima de 720p (HD)"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl group cursor-pointer hover:bg-primary/5 transition-all">
                      <div className="w-8 h-8 rounded-xl border-2 border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <CheckCircle2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                      <span className="font-bold text-secondary/70 group-hover:text-secondary transition-all">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col items-center space-y-6">
                  <div className="w-full max-w-xl p-12 border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center text-center space-y-4 hover:border-primary/40 transition-all cursor-pointer group">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-secondary/20 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <Video className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-secondary">Upload do Vídeo</h4>
                      <p className="text-sm text-secondary/40 font-medium">Arraste seu arquivo ou clique para selecionar</p>
                    </div>
                  </div>
                  <button className="px-12 py-6 bg-secondary text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-secondary/20 hover:scale-105 transition-all opacity-50 cursor-not-allowed">
                    Enviar para Avaliação
                  </button>
                </div>
              </div>

              {/* Certificate Area */}
              <div className="bg-primary p-12 rounded-[50px] shadow-2xl shadow-primary/20 text-white flex flex-col md:flex-row items-center gap-12 opacity-60">
                <div className="w-40 h-40 bg-white/10 rounded-[40px] flex items-center justify-center">
                  <Award className="w-20 h-20 opacity-40" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h3 className="text-4xl font-black">Selo Tutor Certificado</h3>
                  <p className="text-white/70 font-medium text-lg">Conclua o Projeto Prático para desbloquear seu selo oficial e certificado de conclusão.</p>
                  <button className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl cursor-not-allowed">
                    Download Bloqueado
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Evaluation Modal */}
      <AnimatePresence>
        {isEvaluationModalOpen && selectedExecution && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEvaluationModalOpen(false)}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl relative z-10 p-10 space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-secondary">Avaliar Atividade</h3>
                  <p className="text-xs font-medium text-secondary/40 uppercase tracking-widest">{selectedExecution.recurso?.titulo}</p>
                </div>
                <button onClick={() => setIsEvaluationModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X className="w-6 h-6 text-secondary/40" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-secondary/40">Pontuação (Estrelas)</label>
                    <span className="text-2xl font-black text-primary">{evaluationPoints}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setEvaluationPoints(n)}
                        className={cn(
                          "flex-1 aspect-square rounded-xl flex items-center justify-center transition-all",
                          evaluationPoints >= n ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-secondary/20 hover:bg-gray-100"
                        )}
                      >
                        <Star className={cn("w-4 h-4", evaluationPoints >= n ? "fill-current" : "")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-secondary/40">Feedback do Tutor</label>
                  <textarea 
                    value={evaluationFeedback}
                    onChange={(e) => setEvaluationFeedback(e.target.value)}
                    className="w-full p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32"
                    placeholder="Deixe um comentário motivador para o aluno..."
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveEvaluation}
                disabled={isSavingMetrics}
                className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2"
              >
                {isSavingMetrics ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Salvar Avaliação</>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-gray-100 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-secondary">Biblioteca de Recursos</h3>
                  <p className="text-xs font-medium text-secondary/40 uppercase tracking-widest">Selecione o conteúdo para a etapa</p>
                </div>
                <button onClick={() => setIsLibraryOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X className="w-6 h-6 text-secondary/40" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/20" />
                  <input 
                    type="text"
                    placeholder="Buscar por título ou descrição..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {['all', 'historia', 'jogo', 'tarefa', 'revisao', 'missao'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setLibraryFilter(type)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        libraryFilter === type 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-gray-100 text-secondary/40 hover:bg-gray-200"
                      )}
                    >
                      {type === 'all' ? 'Todos' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {(() => {
                const filtered = biblioteca.filter(item => {
                  const matchesSearch = item.titulo.toLowerCase().includes(librarySearch.toLowerCase()) || 
                                       (item.descricao && item.descricao.toLowerCase().includes(librarySearch.toLowerCase()));
                  const matchesFilter = libraryFilter === 'all' || item.tipo === libraryFilter;
                  return matchesSearch && matchesFilter;
                });

                if (filtered.length > 0) {
                  return filtered.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        const stepKey = activeStepToAssign === 1 ? 'historia' : 
                                       activeStepToAssign === 2 ? 'jogo' : 
                                       activeStepToAssign === 3 ? 'tarefa' : 
                                       activeStepToAssign === 4 ? 'revisao' : 'missao';
                        const newLoop = {...weeklyLoop, [stepKey]: item};
                        setWeeklyLoop(newLoop);
                        saveWeeklyLoop(newLoop);
                        setIsLibraryOpen(false);
                      }}
                      className="group text-left space-y-3"
                    >
                      <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 relative">
                        <img src={item.miniatura_url || `https://picsum.photos/seed/${item.id}/400/225`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                            <Plus className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="px-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">{item.tipo}</span>
                        <h5 className="text-sm font-black text-secondary mt-1">{item.titulo}</h5>
                        <p className="text-xs text-secondary/40 line-clamp-2 mt-1">{item.descricao}</p>
                      </div>
                    </button>
                  ));
                }

                return (
                  <div className="col-span-full py-20 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-secondary/40 font-bold uppercase tracking-widest text-xs">Nenhum recurso encontrado</p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      navigate('/alunos-pais');
    } catch (err: any) {
      console.error("Error resetting password:", err);
      toast.error("Erro ao atualizar senha: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 space-y-8 border border-gray-100">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl font-black text-secondary">Nova Senha</h2>
          <p className="text-secondary/60 font-medium italic">Crie uma nova senha segura para sua conta.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Nova Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary/40 ml-4">Confirmar Senha</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Atualizar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen font-sans">
      <Toaster position="top-right" richColors />
      <ScrollToTop />
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbar />}
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/aulas" element={<AulasPage />} />
            <Route path="/loja" element={
              <Elements stripe={stripePromise}>
                <LojaPage />
              </Elements>
            } />
            <Route path="/assinaturas" element={<AssinaturasPage />} />
            <Route path="/depoimentos" element={<DepoimentosPage />} />
            <Route path="/fotos" element={<FotosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/inscricao" element={<InscricaoPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/jogos" element={<GamesPlatform />} />
            <Route path="/alunos-pais" element={<AlunosPaisPage />} />
            <Route path="/tutores" element={<TutoresPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/*" element={<AdminArea />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
