import React, { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
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
  LayoutDashboard,
  Calendar,
  Gamepad,
  Menu,
  X,
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
  Bell,
  Plus,
  Filter,
  LogOut,
  ChevronDown,
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
  Trash2
} from 'lucide-react';
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
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-secondary leading-[0.9] tracking-tighter">
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
          
          <h3 className="text-4xl font-black mb-6">{feature.title}</h3>
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
          <h2 className="text-5xl lg:text-7xl font-black text-secondary leading-[1.1]">
            Olá, eu sou a <span className="text-primary">Teacher Ale!</span>
          </h2>
        </div>
        
        <p className="text-xl lg:text-2xl text-secondary/70 font-medium leading-relaxed">
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
        <h2 className="text-6xl font-black text-secondary tracking-tight">Reviews</h2>
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
      <h2 className="text-6xl font-black text-secondary tracking-tight">Nossas aventuras</h2>
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
      <h2 className="text-6xl font-black text-secondary tracking-tight">Inscrições abertas</h2>
      <p className="text-2xl text-secondary/80 font-medium leading-relaxed">
        Que tal despertar o prazer do seu filho em falar Português? Na Phaleduc, as aulas são desenvolvidas com temas variados com o objetivo de promover a língua portuguesa como língua de herança. As aulas são presenciais e focadas em compreensão, oralidade, aquisição de novos vocabulários e conexão entre os brasileirinhos.
      </p>
      <Link 
        to="/inscricao" 
        className="inline-block bg-primary text-white px-16 py-8 rounded-3xl font-black text-2xl uppercase tracking-widest hover:scale-110 transition-all shadow-2xl shadow-primary/30"
      >
        EU QUERO
      </Link>
    </div>
  </section>
);

const PageHeader = ({ title }: { title: string }) => (
  <section className="py-24 bg-gray-50 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-8">
      <h1 className="text-7xl md:text-8xl font-black text-secondary tracking-tighter">{title}</h1>
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
          <h3 className="text-4xl lg:text-5xl font-black text-secondary tracking-tight">Sobre a Ale</h3>
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
          <h2 className="text-6xl font-black text-secondary">A Phaleduc</h2>
          <p className="text-2xl text-secondary/60 mt-4 font-bold">Portuguese Heritage as Language Education</p>
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
              <h4 className="text-3xl font-black text-primary mb-6">{item.title}</h4>
              <p className="text-lg font-medium text-secondary/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary text-white p-16 rounded-[60px] space-y-8">
          <h3 className="text-4xl font-black">Por que manter o Português como Herança?</h3>
          <p className="text-xl font-medium text-white/80 leading-relaxed">
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
            <h2 className="text-6xl font-black text-secondary">4-13 anos</h2>
            <p className="text-2xl text-secondary/70 font-medium leading-relaxed">
              Crianças entre 4 a 13 anos, nascidas no Brasil ou em outros países e que tenham o contato com a Língua Portuguesa em casa ou em comunidades Brasileiras.
            </p>
            <h2 className="text-5xl font-black text-secondary pt-8">Metodologia de Ensino</h2>
            <p className="text-xl text-secondary/70 font-medium leading-relaxed">
              Nosso método de ensino é desenvolvido unindo o dinamismo das tecnologias e a ludicidade que auxiliam no desenvolvimento do plano de ensino, ou seja, unimos educação + jogos + conteúdos digitais + praticidade para atingirmos nossos objetivos.
            </p>
            <p className="text-xl text-secondary/70 font-medium leading-relaxed">
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
            <h3 className="text-4xl font-black text-secondary mb-8">Conteúdo programático</h3>
            <p className="text-xl text-secondary/70 font-medium leading-relaxed mb-6">
              O conteúdo programático é planejado abrangendo a cultura brasileira e suas datas comemorativas, as características da comunidade e demonstrações dos aspectos locais e de uma população.
            </p>
            <p className="text-xl text-secondary/70 font-medium leading-relaxed">
              A abordagem da pluralidade cultural do Brasil é enfatizada através de diferentes jogos e brincadeiras, gêneros textuais, conteúdos digitais e produções escritas.
            </p>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h3 className="text-4xl font-black text-secondary">Desenvolvimento</h3>
            <ul className="space-y-6">
              {[
                "Participação ativa dos alunos no contexto de sua aprendizagem.",
                "Percepção do papel do professor como facilitador efetivo e mediador do conhecimento.",
                "Conteúdo de linguagem (oralidade e escrita) de acordo com o nível de aprendizagem do aluno."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-xl font-bold text-secondary">
                  <CheckCircle2 className="w-8 h-8 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-16">
          <h2 className="text-5xl font-black text-secondary text-center">Objetivos por Faixa Etária</h2>
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
              <p className="text-2xl italic font-medium text-secondary/80 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full"></div>
                <div>
                  <h4 className="text-2xl font-black text-secondary">{review.author}</h4>
                  <p className="text-primary font-bold">{review.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

const STORE_CATEGORIES = [
  { id: 1, title: 'Mala Rosa', desc: 'Kit de atividades físicas', icon: Package, color: 'bg-primary' },
  { id: 2, title: 'Vestuário', desc: 'Camisetas e bonés', icon: ShoppingBag, color: 'bg-success' },
  { id: 3, title: 'Educadores', desc: 'Materiais para franqueados', icon: GraduationCap, color: 'bg-secondary' },
  { id: 4, title: 'Biblioteca', desc: 'Livros físicos curados', icon: BookOpen, color: 'bg-accent' },
];

const STORE_PRODUCTS = [
  { 
    id: 1, 
    title: 'Boneco Hero Phaleduc', 
    price: 29.90, 
    rating: 5, 
    image: 'https://raw.githubusercontent.com/raoliveinasc/Phaleduc/main/mascote.png',
    category: 'Brinquedos'
  },
  { 
    id: 2, 
    title: 'Camiseta Orgulho Brasileiro', 
    price: 19.90, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    category: 'Vestuário'
  },
  { 
    id: 3, 
    title: 'Mala Rosa - Kit Completo', 
    price: 89.00, 
    rating: 5, 
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400',
    category: 'Kits'
  },
  { 
    id: 4, 
    title: 'Planner do Educador PLH', 
    price: 45.00, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
    category: 'Educadores'
  },
];

const LojaPage = () => {
  const [currency, setCurrency] = useState('USD');
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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

          {/* Currency & Cart - Right */}
          <div className="flex-shrink-0 flex items-center gap-4 min-w-[200px] justify-end">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-1">Moeda</span>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-gray-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest text-secondary focus:outline-none cursor-pointer border border-gray-100 hover:bg-white transition-colors"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="BRL">BRL (R$)</option>
              </select>
            </div>

            <button className="relative group">
              <div className="flex items-center gap-3 bg-secondary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20">
                <Backpack className="w-5 h-5" />
                <span className="hidden xl:inline">Minha Mochila</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-black border-4 border-white animate-bounce shadow-lg">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Store Menu */}
        <nav className="bg-gray-50/50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-4 flex flex-wrap justify-center gap-8">
            {['Materiais Didáticos', 'Para Tutores', 'Vestuário & Merch', 'Assinaturas'].map((item) => (
              <button key={item} className="text-xs font-black text-secondary/60 uppercase tracking-widest hover:text-primary transition-colors">
                {item}
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
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              Leve o Português para o <span className="text-primary">Mundo Real</span>
            </h1>
            <p className="text-xl text-white/80 font-medium max-w-lg">
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
          {STORE_CATEGORIES.map((cat) => (
            <motion.div 
              key={cat.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className={cn("aspect-square rounded-[40px] p-10 flex flex-col justify-between transition-all shadow-xl shadow-black/5", cat.color)}>
                <cat.icon className="w-12 h-12 text-white" />
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-2">{cat.title}</h3>
                  <p className="text-white/70 text-sm font-medium">{cat.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-widest text-xs">Os mais amados</span>
              <h2 className="text-5xl font-black text-secondary tracking-tighter">Favoritos da Turminha</h2>
            </div>
            <button className="text-secondary font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:text-primary transition-colors">
              Ver tudo <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STORE_PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-black/5 group border border-transparent hover:border-primary/10 transition-all"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
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
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</span>
                      <h3 className="text-lg font-black text-secondary tracking-tight leading-tight">{product.title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-black text-secondary">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-2xl font-black text-secondary">
                      {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'R$'} {product.price.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => setCartCount(prev => prev + 1)}
                      className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setCartCount(prev => prev + 1)}
                    className="w-full py-4 bg-gray-50 text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD700] hover:text-secondary transition-all"
                  >
                    Quero para meu filho
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                  <h2 className="text-4xl font-black text-secondary group-hover:text-primary transition-colors leading-tight">
                    <a href={post.link} target="_blank">{post.title}</a>
                  </h2>
                  <p className="text-xl text-secondary/60 font-medium leading-relaxed">{post.excerpt}</p>
                  <a href={post.link} target="_blank" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:gap-4 transition-all">
                    Ler mais <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-12">
            <div className="bg-gray-50 p-10 rounded-[40px] space-y-8">
              <h4 className="text-2xl font-black text-secondary">Pesquisar</h4>
              <div className="relative">
                <input type="text" placeholder="Buscar no blog..." className="w-full p-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm" />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/40" />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-2xl font-black text-secondary">Artigos Recentes</h4>
              <ul className="space-y-4">
                {posts.map((post, i) => (
                  <li key={i}>
                    <a href={post.link} target="_blank" className="text-lg font-bold text-secondary/70 hover:text-primary transition-colors leading-tight block">
                      {post.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-2xl font-black text-secondary">Categorias</h4>
              <ul className="space-y-4">
                {["Aprendizado", "Dicas", "Sobre"].map((cat, i) => (
                  <li key={i}>
                    <a href="#" className="flex justify-between items-center text-lg font-bold text-secondary/70 hover:text-primary transition-colors">
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
  const plans = [
    {
      name: "Online",
      price: "90",
      features: [
        "1 Child",
        "Online",
        "Até 3 alunos por turma"
      ],
      link: "https://forms.gle/ZUquKgmhqrWwBGqS6"
    },
    {
      name: "Presencial",
      price: "120",
      features: [
        "1 Criança",
        "Material Incluso",
        "Até 4 alunos por turma"
      ],
      link: "https://forms.gle/ZUquKgmhqrWwBGqS6",
      featured: true
    },
    {
      name: "Cursos Virtuais",
      price: "Diversos",
      features: [
        "Crianças, Pais e Tutores",
        "Conteúdo Virtual",
        "Escolha seu curso"
      ],
      link: "https://forms.gle/ZUquKgmhqrWwBGqS6"
    }
  ];

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
                <h3 className="text-3xl font-black mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-black">${plan.price}</span>
                  {plan.price !== "Diversos" && <span className="text-xl opacity-60 font-bold">/ mensal</span>}
                </div>
                <ul className="space-y-6 mb-12 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-4 text-lg font-bold">
                      <CheckCircle2 className={cn("w-6 h-6", plan.featured ? "text-primary" : "text-primary")} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a 
                  href={plan.link} 
                  target="_blank"
                  className={cn(
                    "w-full py-6 rounded-3xl font-black uppercase tracking-widest text-center transition-all",
                    plan.featured 
                      ? "bg-primary text-white hover:brightness-110 shadow-xl shadow-primary/20" 
                      : "bg-secondary text-white hover:bg-secondary/90"
                  )}
                >
                  Quero este
                </a>
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
          <h2 className="text-6xl font-black text-secondary tracking-tight">Vamos Conversar?</h2>
          <p className="text-2xl text-secondary/70 font-medium leading-relaxed">
            Tire suas dúvidas sobre matrículas, horários e nossa metodologia.
          </p>
          <div className="space-y-8">
            <div className="flex items-center gap-8">
              <div className="bg-primary/10 p-6 rounded-3xl text-primary">
                <Phone className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-secondary/40">Telefone</p>
                <p className="text-3xl font-black text-secondary">469-476-6590</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="bg-primary/10 p-6 rounded-3xl text-primary">
                <Mail className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-secondary/40">E-mail</p>
                <p className="text-3xl font-black text-secondary">contato@phaleduc.com</p>
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
        <h2 className="text-5xl font-black text-secondary">Em breve: Novas Aventuras!</h2>
        <p className="text-2xl text-secondary/70 font-medium max-w-2xl mx-auto">
          Estamos preparando uma plataforma incrível com jogos exclusivos para a turminha Phaleduc.
        </p>
      </div>
    </section>
  </motion.div>
);

// --- Mundo Phaleduc (Alunos & Pais) ---

const CHILDREN_PROFILES = [
  { id: 1, name: "Léo", age: 6, avatar: "🦁", ageGroup: "5-7" },
  { id: 2, name: "Bia", age: 10, avatar: "🦋", ageGroup: "8-13" },
];

const WEEKLY_STATIONS = [
  { day: "Segunda", label: "Input", icon: BookOpen, color: "bg-primary", desc: "Livro/Vídeo" },
  { day: "Terça", label: "Prática", icon: Gamepad2, color: "bg-success", desc: "Game de Vocabulário" },
  { day: "Quarta", label: "Produção", icon: Mic, color: "bg-secondary", desc: "Gravar Áudio" },
  { day: "Quinta", label: "Produção", icon: Pencil, color: "bg-accent", desc: "Escrever Texto" },
  { day: "Sexta", label: "Missão", icon: Package, color: "bg-danger", desc: "Missão Offline", special: true },
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

const AlunosPaisPage = () => {
  const [view, setView] = useState<'entry' | 'child' | 'parent'>('entry');
  const [selectedChild, setSelectedChild] = useState<typeof CHILDREN_PROFILES[0] | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");

  const handleChildSelect = (child: typeof CHILDREN_PROFILES[0]) => {
    setSelectedChild(child);
    setView('child');
  };

  const handleParentAccess = () => {
    setPinModalOpen(true);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      setView('parent');
      setPinModalOpen(false);
      setPin("");
    } else {
      alert("PIN Incorreto! Tente 1234");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-white font-display overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'entry' && (
          <motion.div 
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-brand-green flex flex-col items-center justify-center p-8"
          >
            <img src={LOGO_URL} alt="Phaleduc" className="h-16 mb-16" referrerPolicy="no-referrer" />
            <h1 className="text-4xl md:text-6xl font-black text-secondary mb-12 text-center tracking-tighter leading-none">Quem está aprendendo hoje?</h1>
            
            <div className="flex flex-wrap justify-center gap-12 mb-16">
              {CHILDREN_PROFILES.map((child) => (
                <button 
                  key={child.id}
                  onClick={() => handleChildSelect(child)}
                  className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-4 border-transparent group-hover:border-primary flex items-center justify-center text-6xl md:text-7xl shadow-2xl transition-all overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {child.avatar}
                  </div>
                  <span className="text-2xl font-black text-secondary group-hover:text-primary transition-colors tracking-tight">{child.name}</span>
                </button>
              ))}
              
              <button 
                onClick={handleParentAccess}
                className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/50 border-4 border-dashed border-secondary/20 group-hover:border-secondary/40 flex items-center justify-center text-secondary/40 transition-all">
                  <Lock className="w-12 h-12" />
                </div>
                <span className="text-2xl font-black text-secondary/40 group-hover:text-secondary/60 transition-colors tracking-tight">Modo Família</span>
              </button>
            </div>

            <p className="text-secondary/30 font-black tracking-widest uppercase text-xs">Mundo Phaleduc • 2026</p>
          </motion.div>
        )}

        {view === 'child' && selectedChild && (
          <motion.div 
            key="child"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen flex flex-col lg:flex-row"
          >
            {/* Sidebar - Backpack */}
            <aside className="w-full lg:w-80 bg-brand-green/30 border-r border-secondary/5 p-8 flex flex-col gap-8 order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Backpack className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-secondary uppercase tracking-tighter text-sm">Mochila Cultural</h3>
                  <p className="text-[10px] text-secondary/40 font-black uppercase tracking-widest">Coleção de {selectedChild.name}</p>
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
                  onClick={() => setView('entry')}
                  className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Sair do Mundo
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
                    <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">Olá, {selectedChild.name}!</h2>
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
                  {WEEKLY_STATIONS.map((station, i) => (
                    <div 
                      key={station.day} 
                      className={cn(
                        "flex flex-col items-center gap-4",
                        i % 2 === 0 ? "md:translate-y-12" : "md:-translate-y-12"
                      )}
                    >
                      <button 
                        className={cn(
                          "w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-all hover:scale-110 active:scale-95 relative group",
                          station.color,
                          station.special && "animate-bounce"
                        )}
                      >
                        <station.icon className="w-10 h-10 md:w-12 md:h-12 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{station.label}</span>
                        
                        {/* Tooltip/Desc */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                          {station.desc}
                        </div>
                      </button>
                      <div className="text-center">
                        <span className="block text-sm font-black text-secondary uppercase tracking-widest">{station.day}</span>
                        <div className="w-2 h-2 bg-gray-200 rounded-full mx-auto mt-2" />
                      </div>
                    </div>
                  ))}
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
          </motion.div>
        )}

        {view === 'parent' && (
          <motion.div 
            key="parent"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-white p-8 md:p-12 lg:p-20"
          >
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
              <div>
                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs mb-2">
                  <Unlock className="w-4 h-4" /> Modo Família Ativo
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">Painel de Acompanhamento</h2>
              </div>
              <button 
                onClick={() => setView('entry')}
                className="px-8 py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center gap-2"
              >
                Sair do Painel
              </button>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Stats Chart */}
              <div className="lg:col-span-2 bg-gray-50 rounded-[40px] p-8 md:p-12">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black text-secondary tracking-tight">Desenvolvimento das Dimensões</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span className="text-xs font-bold text-secondary/60">Progresso Atual</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={PARENT_STATS}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#232b4e', fontSize: 12, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Progresso"
                        dataKey="A"
                        stroke="#3498db"
                        fill="#3498db"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mission Center & Feedback */}
              <div className="space-y-8">
                {/* Friday Mission Card */}
                <div className="bg-primary text-white rounded-[40px] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Package className="w-32 h-32" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Roteiro da Sexta-feira</h4>
                  <h3 className="text-2xl font-black mb-6 leading-tight">Missão Offline: O Mestre da Cozinha</h3>
                  <p className="text-white/80 font-medium mb-8">
                    "Peça para seu filho nomear 5 objetos na cozinha enquanto preparam algo juntos."
                  </p>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Como foi a atividade?</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-colors">Conseguiu Sozinho</button>
                      <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-colors">Precisou de Ajuda</button>
                      <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-colors">Não quis fazer</button>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-secondary text-white rounded-[40px] p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-black uppercase tracking-widest text-xs">Dica da Semana</h4>
                  </div>
                  <p className="text-white/70 text-sm font-medium leading-relaxed">
                    O bilinguismo de herança é fortalecido pelo afeto. Tente ler o livro da semana antes de dormir!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <AnimatePresence>
        {pinModalOpen && (
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
              
              <form onSubmit={handlePinSubmit} className="space-y-8">
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
                    onClick={() => { setPinModalOpen(false); setPin(""); }}
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
    </div>
  );
};

const TutoresPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

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
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
            >
              Acessar Portal
            </button>
          </form>
          
          <p className="text-center text-sm text-secondary/40 font-medium">
            Esqueceu sua senha? <span className="text-secondary cursor-pointer hover:underline">Clique aqui</span>
          </p>
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
                  <h1 className="text-4xl font-black text-secondary">Olá, Educador(a) Phaleduc! 👋</h1>
                  <p className="text-secondary/60 font-medium italic">"Transformando a herança brasileira em futuro através da sua voz."</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-secondary/60 hover:text-secondary transition-all relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-black">E</div>
                    <span className="font-bold text-secondary text-sm">Educador(a) Phaleduc</span>
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
                    <h2 className="text-5xl font-black text-secondary">Tutor Phaleduc</h2>
                    <p className="text-xl text-secondary/40 font-bold uppercase tracking-widest">Membro desde Jan 2024</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black uppercase tracking-widest text-xs">Nível 4</div>
                    <div className="px-6 py-3 bg-secondary/10 text-secondary rounded-2xl font-black uppercase tracking-widest text-xs">1.250 XP</div>
                    <div className="px-6 py-3 bg-yellow-400/10 text-yellow-600 rounded-2xl font-black uppercase tracking-widest text-xs">3 Badges</div>
                  </div>
                </div>
              </div>

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

// --- Main App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans">
        <ScrollToTop />
        <TopBar />
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/aulas" element={<AulasPage />} />
              <Route path="/loja" element={<LojaPage />} />
              <Route path="/depoimentos" element={<DepoimentosPage />} />
              <Route path="/fotos" element={<FotosPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/inscricao" element={<InscricaoPage />} />
              <Route path="/contato" element={<ContatoPage />} />
              <Route path="/jogos" element={<GamesPlatform />} />
              <Route path="/alunos-pais" element={<AlunosPaisPage />} />
              <Route path="/tutores" element={<TutoresPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
