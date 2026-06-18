<<<<<<< HEAD
# RESTAURANTE
PROJETO DE BANCO DE DADOS
=======
# 📊 Melhorias do Relatório - Instruções de Implementação

## ✅ O que foi alterado:

### 1. **Banco de Dados**
- Adicionada coluna `categoria` na tabela `produtos`
- Todas os produtos já foram categorizados (Bebidas, Entradas, Lanches, Massas, Pratos Principais, Sobremesas)

### 2. **API (api.php)**
- Ação `relatorio` agora aceita filtros de data (`data_inicio` e `data_fim`)
- Nova ação `relatorio-categoria` que retorna o faturamento total agrupado por categoria

### 3. **Interface (banco.html)**
- Removido "Faturamento do Dia" e "Faturamento do Mês" (agora é "Faturamento do Período")
- Adicionado seção de **Filtro por Data** com:
  - Campo de data inicial (padrão: 30 dias atrás)
  - Campo de data final (padrão: hoje)
  - Botão para aplicar filtro

### 4. **Seção de Faturamento por Categoria**
- Nova seção que mostra o faturamento de cada categoria em formato visual
- Gráfico de barras mostrando percentual de cada categoria
- Atualiza automaticamente ao filtrar por data

### 5. **JavaScript (script.js)**
- Nova função `definirDatasRelatorio()` - define datas padrão ao carregar
- Nova função `carregarFaturamentoCategoria()` - carrega dados de faturamento por categoria
- Função `filtrarRelatorio()` - aplica o filtro de data
- Função `carregarRelatorio()` - agora integrada com filtro de data

### 6. **CSS (style.css)**
- Estilos para o filtro de data
- Estilos para as categorias (barras, percentuais, layout)

---

## 🔧 Passos para Implementar:

### 1. Atualizar o Banco de Dados
Execute o arquivo `atualizar_banco.sql` no seu MySQL:

**Via PHPMyAdmin:**
1. Abra PHPMyAdmin
2. Selecione o banco `restaurante`
3. Vá em "SQL"
4. Copie e cole o conteúdo do arquivo `atualizar_banco.sql`
5. Clique em "Executar"

**Via Terminal (Windows):**
```bash
cd c:\xampp\mysql\bin
mysql -u root restaurante < c:\xampp\htdocs\bancodedados\atualizar_banco.sql
```

### 2. Verificar se tudo está funcionando
1. Abra seu navegador e acesse: `http://localhost/bancodedados/banco.html`
2. Vá para a aba "Relatório"
3. Você deverá ver:
   - Filtro de datas (pré-preenchido com os últimos 30 dias)
   - Seção "Faturamento por Categoria" com as barras de percentual
   - Botão "Filtrar" para mudar o período

### 3. Testar o Filtro
1. Faça alguns pedidos (na aba "Novo Pedido")
2. Volte ao relatório
3. Altere as datas do filtro e clique em "Filtrar"
4. Veja os dados atualizando em tempo real!

---

## 📈 Recurso de Faturamento por Categoria

O novo gráfico de categorias mostra:
- **Nome da categoria** (ex: Bebidas, Lanches, etc.)
- **Total gasto** naquela categoria
- **Barra visual** com percentual do faturamento total
- **Percentual** em relação ao faturamento total

Isso ajuda a identificar qual categoria gera mais receita! 🎯

---

## 🐛 Troubleshooting

Se o relatório não carregar:
1. Verifique se o arquivo `atualizar_banco.sql` foi executado
2. Abra o console do navegador (F12) e verifique erros
3. Verifique se a conexão MySQL está ativa

Se as categorias não aparecerem:
1. Abra PHPMyAdmin
2. Vá em "restaurante" → "produtos"
3. Verifique se a coluna "categoria" existe
4. Verifique se os produtos têm valores na coluna categoria

---

**Qualquer dúvida, é só chamar!** 🚀
>>>>>>> 7681b7c (Primeiro commit)
