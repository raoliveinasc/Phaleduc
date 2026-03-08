-- Tabela para armazenar as métricas de progresso (N0-N4) nos 4 eixos
CREATE TABLE IF NOT EXISTS metricas_progresso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
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
    conteudo TEXT NOT NULL,
    orientacao_familia TEXT,
    data_competencia DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para controle do loop semanal (desbloqueio de trilha)
CREATE TABLE IF NOT EXISTS loop_semanal_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    semana_inicio DATE NOT NULL,
    historia_desbloqueada BOOLEAN DEFAULT FALSE,
    jogo_desbloqueado BOOLEAN DEFAULT FALSE,
    tarefa_desbloqueada BOOLEAN DEFAULT FALSE,
    missao_sexta_desbloqueada BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aluno_id, semana_inicio)
);

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
    missao_id UUID REFERENCES missoes_casa(id) ON DELETE CASCADE,
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    familia_id UUID REFERENCES pais(id) ON DELETE CASCADE,
    nivel_engajamento INTEGER CHECK (nivel_engajamento >= 1 AND nivel_engajamento <= 5),
    comentario TEXT,
    audio_url TEXT, -- URL para o áudio/vídeo de 30-60 seg
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
