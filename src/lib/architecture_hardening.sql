-- 1. Soft Delete Support
ALTER TABLE pais ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE tutores ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Ensure user_id exists in tutores and alunos (fixes error 42703)
ALTER TABLE tutores ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Entitlement System (Recommendation 3)
CREATE TABLE IF NOT EXISTS aluno_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    recurso_id UUID REFERENCES biblioteca_recursos(id) ON DELETE CASCADE,
    order_id UUID REFERENCES store_orders(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aluno_id, recurso_id)
);

-- Trigger for Auto-Provisioning on Paid Orders
CREATE OR REPLACE FUNCTION provision_order_assets()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_record RECORD;
BEGIN
    -- Only provision if status changes to 'pago'
    IF (TG_OP = 'UPDATE' AND OLD.status != 'pago' AND NEW.status = 'pago') OR (TG_OP = 'INSERT' AND NEW.status = 'pago') THEN
        -- Loop through items in the order
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            -- Find the product to see if it has a linked resource
            -- Assuming items JSON has product_id
            SELECT * INTO product_record FROM store_products WHERE id = (item->>'id')::UUID;
            
            -- If the product is linked to a resource (e.g., via a naming convention or future field)
            -- For now, we'll assume products can be linked to resources. 
            -- Let's add a field to store_products for this.
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add resource_id to store_products to link store items to portal content
ALTER TABLE store_products ADD COLUMN IF NOT EXISTS linked_resource_id UUID REFERENCES biblioteca_recursos(id);

-- Refined Trigger Function
CREATE OR REPLACE FUNCTION provision_order_assets()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    p_id UUID;
    r_id UUID;
    a_id UUID;
BEGIN
    IF (NEW.status = 'pago') THEN
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            p_id := (item->>'id')::UUID;
            SELECT linked_resource_id INTO r_id FROM store_products WHERE id = p_id;
            
            IF r_id IS NOT NULL THEN
                -- Provision for all children of the parent who made the order
                FOR a_id IN SELECT id FROM alunos WHERE parent_id = NEW.parent_id AND deleted_at IS NULL
                LOOP
                    INSERT INTO aluno_assets (aluno_id, recurso_id, order_id)
                    VALUES (a_id, r_id, NEW.id)
                    ON CONFLICT (aluno_id, recurso_id) DO NOTHING;
                END LOOP;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_provision_assets ON store_orders;
CREATE TRIGGER trg_provision_assets
AFTER INSERT OR UPDATE OF status ON store_orders
FOR EACH ROW EXECUTE FUNCTION provision_order_assets();

-- 3. RLS Hardening (Recommendation 4)
-- Ensure users can only see non-deleted records and their own data

-- PAIS
DROP POLICY IF EXISTS "Pais see own record" ON pais;
CREATE POLICY "Pais see own record" ON pais 
FOR SELECT USING (auth.uid() = id AND deleted_at IS NULL);

-- ALUNOS
DROP POLICY IF EXISTS "Pais see own children" ON alunos;
CREATE POLICY "Pais see own children" ON alunos 
FOR SELECT USING (
    parent_id = auth.uid() AND deleted_at IS NULL
);

-- TUTORES
DROP POLICY IF EXISTS "Tutores see own students" ON alunos;
CREATE POLICY "Tutores see own students" ON alunos 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tutores 
        WHERE tutores.id = alunos.tutor_id AND tutores.user_id = auth.uid() AND deleted_at IS NULL
    )
);

-- ASSETS
ALTER TABLE aluno_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alunos see own assets" ON aluno_assets
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM alunos 
        WHERE alunos.id = aluno_assets.aluno_id AND (alunos.parent_id = auth.uid() OR alunos.user_id = auth.uid())
    )
);
