-- Adicionar coluna categoria à tabela produtos (se não existir)
ALTER TABLE produtos ADD COLUMN categoria VARCHAR(50) DEFAULT 'Outros';

-- Atualizar categorias dos produtos existentes
UPDATE produtos SET categoria = 'Bebidas' WHERE id IN (1,2,3,4,5,6);
UPDATE produtos SET categoria = 'Entradas' WHERE id IN (7,8,9);
UPDATE produtos SET categoria = 'Lanches' WHERE id IN (10,11,12,13);
UPDATE produtos SET categoria = 'Massas' WHERE id IN (14,15,16,17);
UPDATE produtos SET categoria = 'Pratos Principais' WHERE id IN (18,19,20,21);
UPDATE produtos SET categoria = 'Sobremesas' WHERE id IN (22,23,24,25);

-- Adicionar sobrenome aos garçons
ALTER TABLE garcons ADD COLUMN IF NOT EXISTS sobrenome VARCHAR(100) DEFAULT '';
UPDATE garcons SET sobrenome = 'Silva' WHERE nome = 'Carlos';
UPDATE garcons SET sobrenome = 'Souza' WHERE nome = 'Maria';
UPDATE garcons SET sobrenome = 'Santos' WHERE nome = 'João';
UPDATE garcons SET sobrenome = 'Lima' WHERE nome = 'Ana';

-- Adicionar salário aos garçons
ALTER TABLE garcons ADD COLUMN IF NOT EXISTS salario DECIMAL(10,2) NOT NULL DEFAULT 0;
UPDATE garcons SET salario = 1500.00 WHERE nome = 'Carlos';
UPDATE garcons SET salario = 1600.00 WHERE nome = 'Maria';
UPDATE garcons SET salario = 1400.00 WHERE nome = 'João';
UPDATE garcons SET salario = 1550.00 WHERE nome = 'Ana';

-- Adicionar status aos pedidos (open/closed)
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'closed';
