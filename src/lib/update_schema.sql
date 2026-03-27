-- 1. Snapshot Columns for Historical Integrity
ALTER TABLE execucoes_atividades 
ADD COLUMN IF NOT EXISTS missao_titulo_snapshot TEXT,
ADD COLUMN IF NOT EXISTS missao_prompt_snapshot TEXT,
ADD COLUMN IF NOT EXISTS origem_atribuicao TEXT DEFAULT 'turma';

-- 2. Audit Logs Table for Security and Accountability
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Date Normalization Check (Monday Constraint)
CREATE OR REPLACE FUNCTION is_monday(d DATE) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXTRACT(DOW FROM d) = 1;
END;
$$ LANGUAGE plpgsql;

-- 4. Hardening RLS (Example for 'pais' and 'alunos')
-- Habilitar RLS nas tabelas
ALTER TABLE pais ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;

-- First, drop existing broad policies
DROP POLICY IF EXISTS "Allow all for pais" ON pais;
DROP POLICY IF EXISTS "Allow all for alunos" ON alunos;

-- Pais can only see their own record
-- In this app, 'id' is the Auth UID for the 'pais' table
CREATE POLICY "Pais see own record" ON pais 
FOR SELECT USING (auth.uid() = id);

-- Pais can only see their own children
-- Since parent_id references pais.id (which is the Auth UID)
CREATE POLICY "Pais see own children" ON alunos 
FOR SELECT USING (auth.uid() = parent_id);

-- Tutores can only see their own students
-- In this app, 'user_id' is the Auth UID for the 'tutores' table
CREATE POLICY "Tutores see own students" ON alunos 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tutores 
        WHERE tutores.id = alunos.tutor_id AND tutores.user_id = auth.uid()
    )
);
