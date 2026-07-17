# 🍽️ Sistema de Gerenciamento de Restaurante

Sistema web desenvolvido para gerenciamento de um restaurante, permitindo o cadastro de clientes, garçons, produtos, mesas e pedidos, utilizando PHP, MySQL, HTML, CSS e JavaScript.
Aluna: Klesly de Souza Rocha
---

# Tecnologias utilizadas

- PHP
- MySQL
- HTML5
- CSS3
- JavaScript
- XAMPP
- phpMyAdmin

---

# Requisitos

Antes de executar o projeto, tenha instalado:

- XAMPP
- Navegador Web (Google Chrome, Edge, Firefox, etc.)

---

# Como executar o projeto

## 1. Instalar o XAMPP

Caso ainda não tenha instalado, faça o download do XAMPP e realize a instalação normalmente.

---

## 2. Copiar o projeto

Extraia o projeto para a pasta:

```
C:\xampp\htdocs\
```

O projeto deverá ficar semelhante a:

```
C:\xampp\htdocs\bancodedados
```

---

## 3. Iniciar o Apache e o MySQL

Abra o **XAMPP Control Panel**.

Clique em:

- Start no Apache
- Start no MySQL

Os dois serviços deverão ficar na cor verde.

---

## 4. Criar o banco de dados

Abra o navegador e acesse:

```
http://localhost/phpmyadmin
```

Clique em:

```
Novo
```

Crie um banco chamado:

```
restaurante
```

---

## 5. Importar o banco

Selecione o banco criado.

Clique na aba:

```
SQL
```

Cole todo o script SQL fornecido (criação das tabelas e inserção dos dados).

Depois clique em:

```
Executar
```

Ao finalizar, todas as tabelas serão criadas automaticamente.

---

# Estrutura do banco

O sistema utiliza as seguintes tabelas:

- usuarios
- clientes
- garcons
- mesas
- produtos
- pedidos
- itens_pedido

---

# Executando o projeto

Com Apache e MySQL ligados, abra o navegador e acesse:

```
http://localhost/bancodedados
```

ou

```
http://localhost/bancodedados/index.php
```

---

# Login

Caso o projeto possua autenticação, utilize:

**Login**

```
admin
```

**Senha**

```
123456
```

---

# Funcionalidades

O sistema permite:

- Login de usuários
- Cadastro de clientes
- Cadastro de garçons
- Cadastro de mesas
- Cadastro de produtos
- Cadastro de pedidos
- Inclusão de itens em cada pedido
- Consulta das informações cadastradas
- Integração com banco de dados MySQL

---

# Estrutura do projeto

```
bancodedados/

├── assets/
│   ├── css/
│   ├── js/
│   └── imagens/
│
├── api.php
├── conexao.php
├── index.php
├── login.php
├── banco.html
└── README.md
```

---

# Fluxo de funcionamento

1. O usuário acessa o sistema pelo navegador.
2. A interface envia requisições utilizando JavaScript.
3. O PHP recebe essas requisições.
4. O arquivo `conexao.php` estabelece a conexão com o MySQL.
5. O banco executa as operações.
6. O PHP retorna os resultados.
7. A interface atualiza as informações para o usuário.

---

# Observações

- O Apache e o MySQL devem permanecer iniciados durante a execução do sistema.
- Caso utilize outra porta no Apache, altere a URL de acesso conforme a configuração do XAMPP.
- Se ocorrer erro de conexão, verifique se o banco `restaurante` foi criado corretamente e se as tabelas foram importadas.

---

# Autor

Projeto desenvolvido para fins acadêmicos na disciplina de Programação para Web.
