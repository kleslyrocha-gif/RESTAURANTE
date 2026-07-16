<?php

$host = "localhost";
$usuario = "root";
$senha = ""; 
$banco = "restaurante";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro: " . $conn->connect_error);
}
$conn->set_charset("utf8");