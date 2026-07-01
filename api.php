<?php

header('Content-Type: application/json');

include("conexao.php");

$acao = $_GET['acao'] ?? '';

switch($acao){

    case 'login':

        $dados = json_decode(file_get_contents("php://input"), true);
        $usuario = trim($dados['usuario'] ?? '');
        $senha = trim($dados['senha'] ?? '');
        $perfil = trim($dados['perfil'] ?? 'gerente');

        $conn->query("CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario VARCHAR(50) NOT NULL,
            senha VARCHAR(255) NOT NULL,
            perfil VARCHAR(20) NOT NULL,
            nome VARCHAR(100) NOT NULL,
            UNIQUE KEY usuario_perfil (usuario, perfil)
        )");

        $conn->query("INSERT IGNORE INTO usuarios (usuario, senha, perfil, nome) VALUES ('gerente', 'gerente123', 'gerente', 'Gerente')");
        $conn->query("INSERT IGNORE INTO usuarios (usuario, senha, perfil, nome) VALUES ('garcom', 'garcom123', 'garcom', 'Garçom')");

        $usuarioEsc = $conn->real_escape_string($usuario);
        $senhaEsc = $conn->real_escape_string($senha);
        $perfilEsc = $conn->real_escape_string($perfil);

        $sql = "SELECT nome, perfil FROM usuarios WHERE usuario = '$usuarioEsc' AND senha = '$senhaEsc' AND perfil = '$perfilEsc' LIMIT 1";
        $resultado = $conn->query($sql);

        if ($resultado && $resultado->num_rows > 0) {
            $linha = $resultado->fetch_assoc();

            echo json_encode([
                'sucesso' => true,
                'role' => $linha['perfil'],
                'nome' => $linha['nome']
            ]);
        } else {
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Usuário ou senha incorretos para este tipo de acesso.'
            ]);
        }

    break;

    case 'garcons':

        $sql = "SELECT id, nome, sobrenome, salario FROM garcons";

        $resultado = $conn->query($sql);

        $dados = [];

        while($linha = $resultado->fetch_assoc()){
            $dados[] = $linha;
        }

        echo json_encode($dados);

    break;

    case 'salvar-salarios-garcons':

        $dados = json_decode(file_get_contents("php://input"), true);
        $salarios = $dados['salarios'] ?? [];

        $sucesso = true;

        foreach ($salarios as $item) {
            $id = intval($item['id']);
            $salario = floatval($item['salario']);

            $sql = "UPDATE garcons SET salario = $salario WHERE id = $id";

            if (!$conn->query($sql)) {
                $sucesso = false;
                break;
            }
        }

        echo json_encode(["sucesso" => $sucesso]);

    break;

case 'cadastrar-garcom':

    $dados = json_decode(file_get_contents("php://input"), true);

    $nome = $conn->real_escape_string($dados['nome'] ?? '');
    $sobrenome = $conn->real_escape_string($dados['sobrenome'] ?? '');
    $salario = floatval($dados['salario'] ?? 0);

    if(empty($nome)){
        echo json_encode([
            "sucesso" => false,
            "erro" => "Nome obrigatório"
        ]);
        break;
    }

    $sql = "
    INSERT INTO garcons
    (
        nome,
        sobrenome,
        salario
    )
    VALUES
    (
        '$nome',
        '$sobrenome',
        $salario
    )
    ";

    if($conn->query($sql)){
        echo json_encode(["sucesso" => true]);
    }else{
        echo json_encode([
            "sucesso" => false,
            "erro" => $conn->error
        ]);
    }

break;
    case 'produtos':

        $sql = "SELECT * FROM produtos";

        $resultado = $conn->query($sql);

        $dados = [];

        while($linha = $resultado->fetch_assoc()){
            $dados[] = $linha;
        }

        echo json_encode($dados);

    break;


    case 'pedido':

        $dados = json_decode(file_get_contents("php://input"), true);

        $cliente = $conn->real_escape_string($dados['cliente']);
        $mesa = intval($dados['mesa']);
        $garcom = intval($dados['garcom']);
        $total = floatval($dados['total']);

        $sqlCliente = "
        INSERT INTO clientes(nome)
        VALUES('$cliente')
        ";

        if (!$conn->query($sqlCliente)) {
            echo json_encode(["sucesso" => false, "erro" => $conn->error]);
            break;
        }

        $cliente_id = $conn->insert_id;

        $sqlPedido = "
        INSERT INTO pedidos
        (
            cliente_id,
            garcom_id,
            mesa,
            total,
            status
        )
        VALUES
        (
            $cliente_id,
            $garcom,
            $mesa,
            $total,
            'open'
        )
        ";

        if (!$conn->query($sqlPedido)) {
            echo json_encode(["sucesso" => false, "erro" => $conn->error]);
            break;
        }

        $pedido_id = $conn->insert_id;

        foreach($dados['itens'] as $item){

            $produto = intval($item['produto_id']);
            $quantidade = intval($item['quantidade']);
            $preco = floatval($item['preco']);

            $sqlItem = "
            INSERT INTO itens_pedido
            (
                pedido_id,
                produto_id,
                quantidade,
                preco
            )
            VALUES
            (
                $pedido_id,
                $produto,
                $quantidade,
                $preco
            )
            ";

            if (!$conn->query($sqlItem)) {
                echo json_encode(["sucesso" => false, "erro" => $conn->error]);
                break 2;
            }
                $sqlConsulta = "        
                SELECT estoque
                FROM produtos
                WHERE id = $produto
                ";

            $resConsulta = $conn->query($sqlConsulta);

            $produtoAtual = $resConsulta->fetch_assoc();

            if($produtoAtual['estoque'] < $quantidade){

                echo json_encode([
                "sucesso" => false,
                "erro" => "Estoque insuficiente"
        ]);

            break 2;
        }
            $sqlEstoque = "
            UPDATE produtos
            SET estoque = estoque - $quantidade
            WHERE id = $produto
            ";

            if(!$conn->query($sqlEstoque)){
                echo json_encode(["sucesso" => false, "erro" => $conn->error]);
                break 2;
            }
        }

        echo json_encode([
            "sucesso" => true
        ]);

    break;


    case 'relatorio':

        $dataInicio = $_GET['data_inicio'] ?? date('Y-m-d', strtotime('-30 days'));
        $dataFim = $_GET['data_fim'] ?? date('Y-m-d');

        $sql = "
        SELECT
            p.id,
            c.nome cliente,
            p.mesa,
            g.nome garcom,
            COALESCE(SUM(ip.quantidade * ip.preco), 0) AS total,
            p.status,
            p.data_pedido
        FROM pedidos p
        INNER JOIN clientes c
            ON c.id = p.cliente_id
        INNER JOIN garcons g
            ON g.id = p.garcom_id
        LEFT JOIN itens_pedido ip
            ON ip.pedido_id = p.id
        WHERE DATE(p.data_pedido) >= '$dataInicio'
        AND DATE(p.data_pedido) <= '$dataFim'
        GROUP BY p.id, c.nome, p.mesa, g.nome, p.data_pedido
        ORDER BY p.id DESC
        ";

        $resultado = $conn->query($sql);

        $dados = [];

        while($linha = $resultado->fetch_assoc()){
            $dados[] = $linha;
        }

        echo json_encode($dados);

    break;

    case 'cancelar-pedido':

    $dados = json_decode(file_get_contents('php://input'), true);
    $pedido_id = intval($dados['pedido_id'] ?? 0);

    if ($pedido_id <= 0) {
        echo json_encode([
            "sucesso" => false,
            "erro" => "pedido_id inválido"
        ]);
        break;
    }

    $sqlVerifica = "
    SELECT status
    FROM pedidos
    WHERE id = $pedido_id
    ";

    $resVerifica = $conn->query($sqlVerifica);

    if(!$resVerifica || $resVerifica->num_rows == 0){
        echo json_encode([
            "sucesso" => false,
            "erro" => "Pedido não encontrado"
        ]);
        break;
    }

    $pedidoVerificado = $resVerifica->fetch_assoc();

    if($pedidoVerificado['status'] == 'closed'){
        echo json_encode([
            "sucesso" => false,
            "erro" => "Pedido já cancelado"
        ]);
        break;
    }
    // restaurar estoque
$sqlItens = "SELECT produto_id, quantidade
             FROM itens_pedido
             WHERE pedido_id = $pedido_id";

$res = $conn->query($sqlItens);

while ($row = $res->fetch_assoc()) {

    $pid = intval($row['produto_id']);
    $qtd = intval($row['quantidade']);

    $conn->query(
        "UPDATE produtos
         SET estoque = estoque + $qtd
         WHERE id = $pid"
    );
}

// cancelar pedido
$sql = "
UPDATE pedidos
SET status = 'closed'
WHERE id = $pedido_id
";

if ($conn->query($sql)) {

    echo json_encode([
        "sucesso" => true
    ]);

} else {

    echo json_encode([
        "sucesso" => false,
        "erro" => $conn->error
    ]);
}

break;

    case 'mesas-ocupadas':

        $sql = "SELECT DISTINCT mesa FROM pedidos WHERE status = 'open' AND mesa IS NOT NULL";
        $resultado = $conn->query($sql);

        $mesas = [];
        while($linha = $resultado->fetch_assoc()){
            $mesas[] = $linha['mesa'];
        }

        echo json_encode($mesas);

    break;

    case 'liberar-mesa':

        // aceitar POST JSON ou GET
        $mesa = null;
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $dados = json_decode(file_get_contents('php://input'), true);
            $mesa = intval($dados['mesa'] ?? 0);
        } else {
            $mesa = intval($_GET['mesa'] ?? 0);
        }

        if ($mesa <= 0) {
            echo json_encode(["sucesso" => false, "erro" => 'mesa inválida']);
            break;
        }

        $sql = "UPDATE pedidos SET status = 'closed' WHERE mesa = $mesa AND status = 'open'";

        if ($conn->query($sql)) {
            echo json_encode(["sucesso" => true]);
        } else {
            echo json_encode(["sucesso" => false, "erro" => $conn->error]);
        }

    break;

    case 'relatorio-categoria':

        $dataInicio = $_GET['data_inicio'] ?? date('Y-m-d', strtotime('-30 days'));
        $dataFim = $_GET['data_fim'] ?? date('Y-m-d');

        $sql = "
        SELECT
            pr.categoria,
            SUM(ip.quantidade * ip.preco) as total_categoria
        FROM itens_pedido ip
        INNER JOIN produtos pr
            ON ip.produto_id = pr.id
        INNER JOIN pedidos p
            ON ip.pedido_id = p.id
        WHERE DATE(p.data_pedido) >= '$dataInicio'
        AND DATE(p.data_pedido) <= '$dataFim'
        AND p.status = 'open'
        GROUP BY pr.categoria
        ORDER BY total_categoria DESC
        ";

        $resultado = $conn->query($sql);

        $dados = [];

        while($linha = $resultado->fetch_assoc()){
            $dados[] = $linha;
        }

        echo json_encode($dados);

    break;

}

