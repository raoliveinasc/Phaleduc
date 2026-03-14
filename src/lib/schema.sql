-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Pais (Famílias)
CREATE TABLE IF NOT EXISTS pais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    endereco TEXT,
    senha TEXT,
    senha_temporaria TEXT,
    convite_enviado_em TIMESTAMP WITH TIME ZONE,
    parent_pin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tutores (Educadores)
CREATE TABLE IF NOT EXISTS tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    data_nascimento DATE,
    nivel TEXT, -- Ex: Iniciante, Intermediário
    avatar TEXT,
    observacoes TEXT,
    parent_id UUID REFERENCES pais(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
    turma_id UUID REFERENCES turmas(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar as métricas de progresso (N0-N4) nos 4 eixos
CREATE TABLE IF NOT EXISTS metricas_progresso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
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
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
    semana_inicio DATE NOT NULL,
    conteudo TEXT NOT NULL,
    orientacao_familia TEXT,
    data_competencia DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para avaliações de desempenho dos tutores (Admin -> Tutor)
CREATE TABLE IF NOT EXISTS avaliacoes_tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES tutores(id) ON DELETE CASCADE,
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
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
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

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS turmas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    nivel TEXT, -- Iniciante, Intermediário, etc
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
    semana_referencia DATE NOT NULL,
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
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    objetivo_pedagogico TEXT,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para as reflexões da família (Mão Dupla)
CREATE TABLE IF NOT EXISTS reflexoes_familia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    familia_id UUID REFERENCES pais(id) ON DELETE CASCADE,
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

-- Basic Policies (Simplified for this environment)
-- In a real app, we would check auth.uid() against tutor_id or parent_id
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
