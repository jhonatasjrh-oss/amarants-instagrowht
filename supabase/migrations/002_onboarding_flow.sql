-- 1. Adiciona colunas à tabela brand_kit
ALTER TABLE public.brand_kit
  ADD COLUMN IF NOT EXISTS nome_completo    text,
  ADD COLUMN IF NOT EXISTS telefone         text,
  ADD COLUMN IF NOT EXISTS plano_escolhido  text DEFAULT 'free';

-- 2. Cria tabela instagram_analysis
CREATE TABLE IF NOT EXISTS public.instagram_analysis (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id              uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instagram_handle     text        NOT NULL,
  score                integer,
  pontos_fortes        text[],
  pontos_fracos        text[],
  risco_shadowban      text,
  frequencia_atual     text,
  engajamento_estimado text,
  plano_acao           jsonb,
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE public.instagram_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_analysis"
  ON public.instagram_analysis
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
