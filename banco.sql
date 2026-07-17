-- ==========================================
-- CRIAR BANCO DE DADOS
-- ==========================================
CREATE DATABASE restaurante;
USE restaurante;

-- ==========================================
-- TABELA USUARIOS
-- ==========================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL
);

-- ==========================================
-- TABELA CLIENTES
-- ==========================================
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20)
);

-- ==========================================
-- TABELA GARCONS
-- ==========================================
CREATE TABLE garcons (
    id_garcom INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    salario DECIMAL(10,2) NOT NULL
);

-- ==========================================
-- TABELA MESAS
-- ==========================================
CREATE TABLE mesas (
    id_mesa INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL UNIQUE,
    status ENUM('Livre','Ocupada','Reservada') DEFAULT 'Livre'
);

-- ==========================================
-- TABELA PRODUTOS
-- ==========================================
CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL
);

-- ==========================================
-- TABELA PEDIDOS
-- ==========================================
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_garcom INT NOT NULL,
    id_mesa INT NOT NULL,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Aberto','Mesa liberada','Cancelado') DEFAULT 'Aberto',
    valor_total DECIMAL(10,2) DEFAULT 0.00,

    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),

    CONSTRAINT fk_pedido_garcom
        FOREIGN KEY (id_garcom)
        REFERENCES garcons(id_garcom),

    CONSTRAINT fk_pedido_mesa
        FOREIGN KEY (id_mesa)
        REFERENCES mesas(id_mesa)
);

-- ==========================================
-- TABELA ITENS_PEDIDO
-- ==========================================
CREATE TABLE itens_pedido (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_item_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido),

    CONSTRAINT fk_item_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
);
-- ==========================================
-- USUÁRIOS
-- ==========================================
INSERT INTO usuarios (nome, login, senha, perfil) VALUES
('Gerente', 'gerente', 'gerente123', 'gerente'),
('Garçom', 'garcom', 'garcom123', 'garcom'),

-- ==========================================
-- CLIENTES
-- ==========================================
INSERT INTO clientes (nome, cpf, telefone) VALUES
('Carlos Oliveira','111.111.111-11','(89)99911-1111'),
('Fernanda Lima','222.222.222-22','(89)99922-2222'),
('Ricardo Alves','333.333.333-33','(89)99933-3333'),
('Juliana Rocha','444.444.444-44','(89)99944-4444'),
('Pedro Santos','555.555.555-55','(89)99955-5555'),
('Ana Clara','666.666.666-66','(89)99966-6666'),
('Lucas Pereira','777.777.777-77','(89)99977-7777'),
('Gabriel Costa','888.888.888-88','(89)99988-8888'),
('Mariana Silva','999.999.999-99','(89)99999-9999'),
('Paulo Henrique','101.101.101-10','(89)99888-0000');

-- ==========================================
-- GARÇONS
-- ==========================================
INSERT INTO garcons (nome, sobrenome, salario) VALUES
('José','Oliveira',1800.00),
('Mateus','Silva',1850.00),
('André','Souza',1900.00),
('Rafael','Costa',2000.00),
('Bruno','Lima',1950.00),
('Carlos','Pereira',2050.00),
('Eduardo','Alves',1980.00),
('Vinicius','Rocha',2100.00),
('Felipe','Martins',1950.00),
('Gustavo','Barbosa',2000.00);

-- ==========================================
-- MESAS
-- ==========================================
INSERT INTO mesas (numero, status) VALUES
(1,'Livre'),
(2,'Livre'),
(3,'Livre'),
(4,'Ocupada'),
(5,'Livre'),
(6,'Mesa Liberada'),
(7,'Livre'),
(8,'Livre'),
(9,'Livre'),
(10,'Livre');

-- ==========================================
-- PEDIDOS
-- ==========================================
INSERT INTO pedidos (id_cliente,id_garcom,id_mesa,status,valor_total) VALUES
(1,1,1,'Finalizado',32.90),
(2,2,2,'Finalizado',57.90),
(3,3,3,'Em preparo',69.90),
(4,4,4,'Aberto',49.90),
(5,5,5,'Finalizado',89.90),
(6,6,6,'Finalizado',52.90),
(7,7,7,'Aberto',38.90),
(8,8,8,'Em preparo',74.90),
(9,9,9,'Finalizado',61.80),
(10,10,10,'Aberto',94.80);

-- ==========================================
-- ITENS DOS PEDIDOS
-- ==========================================
INSERT INTO itens_pedido (id_pedido,id_produto,quantidade,preco) VALUES

(1,10,1,27.90),
(1,1,1,5.00),

(2,17,1,49.90),
(2,19,1,8.00),

(3,16,1,69.90),

(4,17,1,49.90),

(5,24,1,89.90),

(6,8,1,52.90),

(7,12,1,36.90),
(7,23,1,10.90),

(8,20,1,58.90),
(8,3,1,15.00),

(9,15,2,19.90),
(9,7,2,11.00),

(10,16,1,69.90),
(10,4,1,18.00),
(10,22,1,11.90);

INSERT INTO produtos (nome, categoria, preco, estoque) VALUES
('Água Mineral', 'Bebida', 5.00, 100),
('Batata Frita', 'Porção', 22.00, 50),
('Brownie', 'Sobremesa', 15.00, 30),
('Caipirinha', 'Bebida', 18.00, 40),
('Cerveja', 'Bebida', 12.00, 80),
('Frios Fatiados', 'Entrada', 28.00, 20),
('Fettuccine', 'Massa', 39.90, 25),
('Filé', 'Prato Principal', 52.90, 20),
('Frango Grelhado', 'Prato Principal', 34.90, 30),
('Hambúrguer', 'Lanche', 27.90, 40),
('Hot Dog', 'Lanche', 18.90, 40),
('Lasanha', 'Massa', 36.90, 25),
('Macarronada', 'Massa', 33.90, 25),
('Onion Rings', 'Porção', 20.90, 30),
('Petit Gateau', 'Sobremesa', 19.90, 20),
('Picanha', 'Prato Principal', 69.90, 15),
('Pizza', 'Pizza', 49.90, 20),
('Pudim', 'Sobremesa', 12.90, 20),
('Refrigerante', 'Bebida', 8.00, 100),
('Salmão', 'Prato Principal', 58.90, 15),
('Sanduíche Natural', 'Lanche', 21.90, 30),
('Sorvete', 'Sobremesa', 11.90, 40),
('Suco Natural', 'Bebida', 10.90, 50),
('Vinho', 'Bebida', 89.90, 15),
('X-Bacon', 'Lanche', 30.90, 30);
