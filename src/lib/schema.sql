-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RESET DATABASE (OPCIONAL - USAR COM CUIDADO)
-- DROP TABLE IF EXISTS subscriptions CASCADE;
-- DROP TABLE IF EXISTS store_orders CASCADE;
-- DROP TABLE IF EXISTS store_products CASCADE;
-- DROP TABLE IF EXISTS store_categories CASCADE;
-- DROP TABLE IF EXISTS avaliacoes_tutores CASCADE;
-- DROP TABLE IF EXISTS missoes_casa CASCADE;
-- DROP TABLE IF EXISTS execucoes_atividades CASCADE;
-- DROP TABLE IF EXISTS reflexoes_familia CASCADE;
-- DROP TABLE IF EXISTS loop_semanal_config CASCADE;
-- DROP TABLE IF EXISTS loops_semanais CASCADE;
-- DROP TABLE IF EXISTS biblioteca_recursos CASCADE;
-- DROP TABLE IF EXISTS metricas_progresso CASCADE;
-- DROP TABLE IF EXISTS feedbacks_pedagogicos CASCADE;
-- DROP TABLE IF EXISTS alunos CASCADE;
-- DROP TABLE IF EXISTS turmas CASCADE;
-- DROP TABLE IF EXISTS tutores CASCADE;
-- DROP TABLE IF EXISTS pais CASCADE;

-- Tabela de Pais (Famílias)
CREATE TABLE IF NOT EXISTS pais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Link to Supabase Auth
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    endereco TEXT,
    senha TEXT,
    senha_temporaria TEXT,
    convite_enviado_em TIMESTAMP WITH TIME ZONE,
    parent_pin TEXT DEFAULT '0000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tutores (Educadores)
CREATE TABLE IF NOT EXISTS tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Link to Supabase Auth
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    especialidade TEXT,
    bio TEXT,
    senha TEXT,
    senha_temporaria TEXT,
    convite_enviado_em TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pendente',
    nivel TEXT DEFAULT 'Bronze',
    xp INTEGER DEFAULT 0,
    badges TEXT, -- Lista de badges separados por vírgula
    projeto_final_status TEXT DEFAULT 'pendente',
    projeto_final_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS turmas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    nivel TEXT, -- Iniciante, Intermediário, etc
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Optional: if students have their own auth
    nome TEXT NOT NULL,
    data_nascimento DATE,
    nivel TEXT, -- Ex: Iniciante, Intermediário
    avatar TEXT,
    observacoes TEXT,
    senha_temporaria TEXT,
    parent_id UUID REFERENCES pais(id) ON DELETE CASCADE ON UPDATE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    turma_id UUID REFERENCES turmas(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar as métricas de progresso (N0-N4) nos 4 eixos
CREATE TABLE IF NOT EXISTS metricas_progresso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    semana_inicio DATE NOT NULL,
    oralidade INTEGER CHECK (oralidade >= 0 AND oralidade <= 4),
    compreensao INTEGER CHECK (compreensao >= 0 AND compreensao <= 4),
    escrita INTEGER CHECK (escrita >= 0 AND escrita <= 4),
    cultura INTEGER CHECK (cultura >= 0 AND cultura <= 4),
    data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);

-- Tabela para feedbacks qualitativos semanais/quinzenais
CREATE TABLE IF NOT EXISTS feedbacks_pedagogicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    semana_inicio DATE NOT NULL,
    conteudo TEXT NOT NULL,
    orientacao_familia TEXT,
    data_competencia DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para avaliações de desempenho dos tutores (Admin -> Tutor)
CREATE TABLE IF NOT EXISTS avaliacoes_tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES tutores(id) ON DELETE CASCADE ON UPDATE CASCADE,
    desempenho_alunos INTEGER CHECK (desempenho_alunos >= 1 AND desempenho_alunos <= 5),
    feedback_pais INTEGER CHECK (feedback_pais >= 1 AND feedback_pais <= 5),
    observacoes TEXT,
    data_avaliacao DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para controle do loop semanal (desbloqueio de trilha)
CREATE TABLE IF NOT EXISTS loop_semanal_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    semana_inicio DATE NOT NULL,
    historia_desbloqueada BOOLEAN DEFAULT FALSE,
    jogo_desbloqueado BOOLEAN DEFAULT FALSE,
    tarefa_desbloqueada BOOLEAN DEFAULT FALSE,
    missao_sexta_desbloqueada BOOLEAN DEFAULT FALSE,
    missao_titulo TEXT,
    missao_prompt TEXT,
    revisao_desbloqueada BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices únicos para garantir apenas um config por semana por aluno ou turma
CREATE UNIQUE INDEX IF NOT EXISTS idx_loop_config_aluno_semana ON loop_semanal_config (aluno_id, semana_inicio) WHERE aluno_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_loop_config_turma_semana ON loop_semanal_config (turma_id, semana_inicio) WHERE turma_id IS NOT NULL;

-- Tabela de Biblioteca de Recursos
CREATE TABLE IF NOT EXISTS biblioteca_recursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT NOT NULL, -- video, jogo, tarefa, historia, revisao, missao
    url_recurso TEXT NOT NULL,
    miniatura_url TEXT,
    formato TEXT, -- pdf, audio, video, link, etc
    conteudo_json JSONB, -- Para listas de tarefas ou cards de missão
    nivel TEXT,
    categoria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Loops Semanais (Conteúdo da Trilha)
CREATE TABLE IF NOT EXISTS loops_semanais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    semana_referencia DATE NOT NULL,
    semana_inicio DATE NOT NULL, -- Adicionado para consistência
    historia_id UUID REFERENCES biblioteca_recursos(id),
    historia_agendamento TIMESTAMP WITH TIME ZONE,
    jogo_id UUID REFERENCES biblioteca_recursos(id),
    jogo_agendamento TIMESTAMP WITH TIME ZONE,
    tarefa_id UUID REFERENCES biblioteca_recursos(id),
    tarefa_agendamento TIMESTAMP WITH TIME ZONE,
    revisao_id UUID REFERENCES biblioteca_recursos(id),
    revisao_agendamento TIMESTAMP WITH TIME ZONE,
    missao_id UUID REFERENCES biblioteca_recursos(id),
    missao_agendamento TIMESTAMP WITH TIME ZONE,
    liberacao_manual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices únicos para garantir apenas um loop por semana por aluno ou turma
CREATE UNIQUE INDEX IF NOT EXISTS idx_loops_aluno_semana ON loops_semanais (aluno_id, semana_referencia) WHERE aluno_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_loops_turma_semana ON loops_semanais (turma_id, semana_referencia) WHERE turma_id IS NOT NULL;

-- Tabela para as missões de casa culturais
CREATE TABLE IF NOT EXISTS missoes_casa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL ON UPDATE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    objetivo_pedagogico TEXT,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para as reflexões da família (Mão Dupla)
CREATE TABLE IF NOT EXISTS reflexoes_familia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    familia_id UUID REFERENCES pais(id) ON DELETE CASCADE ON UPDATE CASCADE,
    semana_inicio DATE,
    engajamento INTEGER CHECK (engajamento >= 1 AND engajamento <= 5),
    comentario TEXT,
    audio_url TEXT, -- URL para o áudio/vídeo de 30-60 seg
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para execuções de atividades pelos alunos
CREATE TABLE IF NOT EXISTS execucoes_atividades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    recurso_id UUID REFERENCES biblioteca_recursos(id) ON DELETE CASCADE,
    data_conclusao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aluno_id, recurso_id)
);

-- Tabela de Categorias da Loja
CREATE TABLE IF NOT EXISTS store_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos da Loja
CREATE TABLE IF NOT EXISTS store_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL, -- Preço em centavos para Stripe (USD)
    category_id UUID REFERENCES store_categories(id) ON DELETE SET NULL,
    image_url TEXT,
    type TEXT DEFAULT 'fisico', -- 'fisico' ou 'digital'
    stock_quantity INTEGER DEFAULT 0,
    is_subscription_activator BOOLEAN DEFAULT FALSE,
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS store_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    parent_id UUID REFERENCES pais(id) ON DELETE SET NULL ON UPDATE CASCADE,
    total_amount_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado', 'enviado', 'entregue'
    items JSONB NOT NULL, -- Lista de produtos no pedido
    shipping_address TEXT,
    payment_id TEXT, -- ID do Stripe ou outro processador
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Assinaturas (Subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES pais(id) ON DELETE CASCADE ON UPDATE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_type TEXT NOT NULL, -- 'mensal', 'semestral', 'anual'
    status TEXT NOT NULL DEFAULT 'inactive', -- 'active', 'inactive', 'past_due', 'canceled'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função RPC para decrementar estoque
CREATE OR REPLACE FUNCTION decrement_product_stock(product_id UUID, quantity INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE store_products
    SET stock_quantity = stock_quantity - quantity
    WHERE id = product_id AND stock_quantity >= quantity;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pais ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca_recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE loops_semanais ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_semanal_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE execucoes_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks_pedagogicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflexoes_familia ENABLE ROW LEVEL SECURITY;
ALTER TABLE missoes_casa ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Simplified for this environment)
CREATE POLICY "Allow all for tutores" ON tutores FOR ALL USING (true);
CREATE POLICY "Allow all for pais" ON pais FOR ALL USING (true);
CREATE POLICY "Allow all for alunos" ON alunos FOR ALL USING (true);
CREATE POLICY "Allow all for turmas" ON turmas FOR ALL USING (true);
CREATE POLICY "Allow all for biblioteca_recursos" ON biblioteca_recursos FOR ALL USING (true);
CREATE POLICY "Allow all for loops_semanais" ON loops_semanais FOR ALL USING (true);
CREATE POLICY "Allow all for loop_semanal_config" ON loop_semanal_config FOR ALL USING (true);
CREATE POLICY "Allow all for execucoes_atividades" ON execucoes_atividades FOR ALL USING (true);
CREATE POLICY "Allow all for metricas_progresso" ON metricas_progresso FOR ALL USING (true);
CREATE POLICY "Allow all for feedbacks_pedagogicos" ON feedbacks_pedagogicos FOR ALL USING (true);
CREATE POLICY "Allow all for reflexoes_familia" ON reflexoes_familia FOR ALL USING (true);
CREATE POLICY "Allow all for missoes_casa" ON missoes_casa FOR ALL USING (true);
CREATE POLICY "Allow all for avaliacoes_tutores" ON avaliacoes_tutores FOR ALL USING (true);
CREATE POLICY "Allow all for store_categories" ON store_categories FOR ALL USING (true);
CREATE POLICY "Allow all for store_products" ON store_products FOR ALL USING (true);
CREATE POLICY "Allow all for store_orders" ON store_orders FOR ALL USING (true);
CREATE POLICY "Allow all for subscriptions" ON subscriptions FOR ALL USING (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_alunos_parent_id ON alunos(parent_id);
CREATE INDEX IF NOT EXISTS idx_alunos_tutor_id ON alunos(tutor_id);
CREATE INDEX IF NOT EXISTS idx_alunos_turma_id ON alunos(turma_id);
CREATE INDEX IF NOT EXISTS idx_metricas_aluno_id ON metricas_progresso(aluno_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_aluno_id ON feedbacks_pedagogicos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_loops_aluno_id ON loops_semanais(aluno_id);
CREATE INDEX IF NOT EXISTS idx_loops_turma_id ON loops_semanais(turma_id);
CREATE INDEX IF NOT EXISTS idx_store_products_category_id ON store_products(category_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_parent_id ON store_orders(parent_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Inserir categorias iniciais
INSERT INTO store_categories (name, slug) VALUES 
('Mala Rosa', 'mala-rosa'),
('Vestuário', 'vestuario'),
('Educadores', 'educadores'),
('Biblioteca', 'biblioteca')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
