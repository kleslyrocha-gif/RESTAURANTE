CREATE DATABASE restaurante;

USE restaurante;

CREATE TABLE garcons(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    salario DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE clientes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE produtos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    preco DECIMAL(10,2),
    estoque INT,
    categoria VARCHAR(50)
);

CREATE TABLE pedidos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    garcom_id INT,
    mesa INT,
    total DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'closed',
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido(
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    preco DECIMAL(10,2)
);

INSERT INTO garcons(nome, sobrenome, salario) VALUES
('Carlos', 'Silva', 1500.00),
('Maria', 'Souza', 1600.00),
('João', 'Santos', 1400.00),
('Ana', 'Lima', 1550.00);

INSERT INTO produtos(nome,preco,estoque,categoria) VALUES

('Água Mineral',4,30,'Bebidas'),
('Refrigerante',8,20,'Bebidas'),
('Suco Natural',10,15,'Bebidas'),
('Cerveja',12,40,'Bebidas'),
('Caipirinha',18,12,'Bebidas'),
('Vinho',25,8,'Bebidas'),

('Batata Frita',18,20,'Entradas'),
('Onion Rings',20,10,'Entradas'),
('Tábua de Frios',35,6,'Entradas'),

('Hambúrguer Artesanal',28,12,'Lanches'),
('X-Bacon',32,10,'Lanches'),
('Hot Dog Especial',18,15,'Lanches'),
('Sanduíche Natural',16,10,'Lanches'),

('Lasanha',38,10,'Massas'),
('Pizza Grande',45,8,'Massas'),
('Macarronada',30,10,'Massas'),
('Fettuccine Alfredo',42,7,'Massas'),

('Filé à Parmegiana',48,8,'Pratos Principais'),
('Picanha Completa',75,5,'Pratos Principais'),
('Frango Grelhado',35,10,'Pratos Principais'),
('Salmão ao Molho',65,6,'Pratos Principais'),

('Pudim',14,10,'Sobremesas'),
('Brownie',18,8,'Sobremesas'),
('Sorvete',12,15,'Sobremesas'),
('Petit Gateau',22,6,'Sobremesas');

