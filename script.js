

// Pedido atual
let pedido = [];

let pedidos = [];

let mesasOcupadas = [];

let garconsData = [];
let produtosData = [];
let perfilAtual = null;

function getPerfilAtual() {
    return localStorage.getItem('restaurante_perfil') || perfilAtual || 'garcom';
}

function telasPermitidasParaPerfil(perfil) {
    return perfil === 'gerente'
        ? ['pedido', 'relatorio', 'mesas-ocupadas', 'gerenciar', 'gerenciar-produtos', 'finalizacao']
        : ['pedido', 'mesas-ocupadas', 'finalizacao'];
}

function podeAcessarTela(nomeTela) {
    return telasPermitidasParaPerfil(getPerfilAtual()).includes(nomeTela);
}

function atualizarInterfacePorPerfil() {
    const perfil = getPerfilAtual();
    perfilAtual = perfil;

    const botaoGerenciar = document.querySelector('nav button[data-tela="gerenciar"]');
    const botaoGerenciarProdutos = document.querySelector('nav button[data-tela="gerenciar-produtos"]');
    if (botaoGerenciar) {
        botaoGerenciar.style.display = perfil === 'gerente' ? 'inline-block' : 'none';
    }
    if (botaoGerenciarProdutos) {
        botaoGerenciarProdutos.style.display = perfil === 'gerente' ? 'inline-block' : 'none';
    }

    const nav = document.getElementById('nav-principal');
    if (nav) {
        nav.style.display = 'flex';
    }
}

window.onload = function() {
    const logado = localStorage.getItem('restaurante_logado') === '1';
    const ultimaGuardada = localStorage.getItem('ultima_tela');

    if (logado) {
        atualizarInterfacePorPerfil();
        const telas = telasPermitidasParaPerfil(getPerfilAtual());
        const ultima = telas.includes(ultimaGuardada) ? ultimaGuardada : 'pedido';
        mostrarTela(ultima);
    } else {
        document.getElementById('nav-principal').style.display = 'none';
        mostrarTela('login');
    }

    carregarGarcons();
    carregarMesas();
    carregarMesasOcupadas();
    carregarRelatorio();
    carregarProdutos();
    carregarProdutosGerenciar();
    atualizarEstoqueTela();
    definirDatasRelatorio();
}

// Troca de telas
function mostrarTela(nomeTela) {
    if (!document.getElementById(nomeTela)) return;

    if (nomeTela !== 'login' && !podeAcessarTela(nomeTela)) {
        nomeTela = 'pedido';
    }

    if (!document.getElementById(nomeTela)) return;

    let telas = document.querySelectorAll('.tela');

    telas.forEach(function(tela) {
        tela.classList.remove('ativa');
    });

    document.getElementById(nomeTela).classList.add('ativa');
    try { localStorage.setItem('ultima_tela', nomeTela); } catch(e) {}
}

async function loginRestaurante() {
    let usuario = document.getElementById('usuario-login').value.trim();
    let senha = document.getElementById('senha-login').value.trim();
    let perfil = document.getElementById('tipo-acesso').value;

    const erro = document.getElementById('login-erro');

    if (!usuario || !senha) {
        erro.innerText = 'Informe usuário e senha.';
        erro.style.display = 'block';
        return;
    }

    try {
        let resposta = await fetch('api.php?acao=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, senha, perfil })
        });

        let retorno = await resposta.json();

        if (retorno.sucesso) {
            erro.innerText = '';
            erro.style.display = 'none';
            try {
                localStorage.setItem('restaurante_logado', '1');
                localStorage.setItem('restaurante_perfil', retorno.role);
                localStorage.setItem('ultima_tela', 'pedido');
            } catch(e) {}
            atualizarInterfacePorPerfil();
            document.getElementById('nav-principal').style.display = 'flex';
            mostrarTela('pedido');
        } else {
            erro.innerText = retorno.erro || 'Usuário ou senha incorretos.';
            erro.style.display = 'block';
        }
    } catch (e) {
        erro.innerText = 'Erro ao conectar com o servidor.';
        erro.style.display = 'block';
        console.log(e);
    }
}

function fazerLogout() {
    document.getElementById('usuario-login').value = '';
    document.getElementById('senha-login').value = '';
    const erro = document.getElementById('login-erro');
    erro.innerText = '';
    erro.style.display = 'none';
    try {
        localStorage.removeItem('restaurante_logado');
        localStorage.removeItem('restaurante_perfil');
        localStorage.removeItem('ultima_tela');
    } catch(e) {}
    document.getElementById('nav-principal').style.display = 'none';
    mostrarTela('login');
}

function alternarVisibilidadeSenha() {
    const input = document.getElementById('senha-login');
    const botao = document.querySelector('.btn-olho');

    if (!input || !botao) return;

    const mostrando = input.type === 'text';
    input.type = mostrando ? 'password' : 'text';
    botao.innerHTML = mostrando ? '👁' : '🙈';
    botao.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Ocultar senha');
}

function adicionarItem(id, nome, preco, botao) {
    let estoqueElemento =
document.getElementById(`estoque-${id}`);

if(estoqueElemento){

    let estoque =
    parseInt(
        estoqueElemento.innerText.replace('Estoque: ','')
    );

    if(estoque <= 0){

        alert('Produto sem estoque.');

        return;
    }
}

    let existente = pedido.find(
        item => item.produto_id === id
    );

    if (existente) {

        existente.quantidade++;

    } else {

        pedido.push({
            produto_id: id,
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }

    atualizarPedido();

    let textoOriginal = botao.innerHTML;

    botao.innerHTML = 'Adicionado ✅';

    botao.style.background = '#16a34a';

    setTimeout(function(){

        botao.innerHTML = textoOriginal;

        botao.style.background = '';

    },1000);
}



// Atualiza pedido
function atualizarPedido() {

    let lista = document.getElementById('lista-pedido');

    let totalTexto = document.getElementById('total');

    lista.innerHTML = '';

    let total = 0;

    pedido.forEach(function(item) {

        total += item.preco * item.quantidade;

        lista.innerHTML += `
            <div class="item-pedido">
                <span>${item.nome}</span>
                <div class="item-actions">
                    <strong>${item.quantidade}x - R$ ${item.preco * item.quantidade}</strong>
                    <button class="btn-remover-item" onclick="removerItem(${item.produto_id})">Remover</button>
                </div>
            </div>
        `;
    });

    if (pedido.length === 0) {

        lista.innerHTML =
            '<p>Nenhum item adicionado.</p>';
    }

    totalTexto.innerHTML =
        `Total: R$ ${total}`;
}

function removerItem(produtoId) {
    pedido = pedido.filter(item => item.produto_id !== produtoId);
    atualizarPedido();
}


// Abrir finalização
function abrirFinalizacao() {

    let cliente = document.getElementById('cliente').value;
    let cpf = document.getElementById('cliente-cpf').value;
    let telefone = document.getElementById('cliente-telefone').value;
    let mesa = document.getElementById('mesa').value;
    let garcom = document.getElementById('garcom').value;

    if (cliente === '' || cpf === '' || telefone === '' || mesa === '' || garcom === '') {
        alert('Preencha todos os campos do cliente!');
        return;
    }

    // Verifica mesa ocupada
    if (mesasOcupadas.includes(mesa)) {

        alert('Essa mesa já está ocupada!');
        return;
    }

    if (pedido.length === 0) {

        alert('Adicione itens!');
        return;
    }

    mostrarTela('finalizacao');

    let resumo = document.getElementById('resumo-pedido');

    let totalFinal = document.getElementById('total-final');

    resumo.innerHTML = '';

    let total = 0;

    resumo.innerHTML += `
        <div class="resumo-cliente">
            <p><strong>Cliente:</strong> ${cliente}</p>
            <p><strong>CPF:</strong> ${cpf}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Mesa:</strong> ${mesa}</p>
        </div>
    `;

    pedido.forEach(function(item) {
        total += item.preco * item.quantidade;

        resumo.innerHTML += `
            <div class="item-pedido">
                <span>${item.nome}</span>
               <strong>
                ${item.quantidade}x - R$ ${item.preco * item.quantidade}
                </strong>
            </div>
        `;
    });

    totalFinal.innerHTML = `Total Final: R$ ${total}`;
}


// Finalizar pedido
async function finalizarPedido() {

let cliente = document.getElementById('cliente').value;
let cpf = document.getElementById('cliente-cpf').value;
let telefone = document.getElementById('cliente-telefone').value;
let mesa = document.getElementById('mesa').value;
let garcom = document.getElementById('garcom').value;

let total = 0;
let formaPagamento = document.getElementById('forma-pagamento').value;

if (!formaPagamento) {
    alert('Selecione a forma de pagamento.');
    return;
}

pedido.forEach(function(item) {

    total += item.preco * item.quantidade;

});

try {

    let resposta = await fetch("api.php?acao=pedido", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            cliente: cliente,
            cpf: cpf,
            telefone: telefone,
            mesa: mesa,
            garcom: garcom,
            total: total,
            forma_pagamento: formaPagamento,
            itens: pedido

        })

    });
   let texto = await resposta.text();
    console.log(texto);

    let retorno = JSON.parse(texto);
    if (retorno.sucesso) {
        
        atualizarEstoqueTela();
        carregarProdutos();
        
        mesasOcupadas.push(mesa);
        atualizarDisponibilidadeMesas();
        atualizarListaMesasOcupadas();

        document.getElementById('mensagem-final').style.display = 'flex';

        pedido = [];

        atualizarPedido();

        document.getElementById('cliente').value = '';
        document.getElementById('cliente-cpf').value = '';
        document.getElementById('cliente-telefone').value = '';
        document.getElementById('mesa').value = '';
        document.getElementById('garcom').value = '';
        document.getElementById('forma-pagamento').value = '';
        
        // atualizar relatório imediatamente após novo pedido
        try { carregarRelatorio(); carregarFaturamentoCategoria(); } catch(e) { console.log(e); }

    } else {

        alert("Erro ao salvar pedido.");

    }

} catch (erro) {

    console.log(erro);

    alert("Erro de conexão com o servidor.");

}

}
// Relatório
function atualizarRelatorio() {

    let lista = document.getElementById('lista-relatorio');

    lista.innerHTML = '';

    let faturamentoDia = 0;

    pedidos.forEach(function(pedido) {

        faturamentoDia += pedido.total;

        lista.innerHTML += `
            <div class="pedido-relatorio">

                <p><strong>Cliente:</strong> ${pedido.cliente}</p>

                <p><strong>Mesa:</strong> ${pedido.mesa}</p>

                <p><strong>Garçom:</strong> ${pedido.garcom}</p>

                <p><strong>Pagamento:</strong> ${pedido.forma_pagamento ? pedido.forma_pagamento.toUpperCase() : 'Não informado'}</p>

                <p><strong>Total:</strong> R$ ${pedido.total}</p>

            </div>
        `;
    });

    document.getElementById('total-pedidos').innerHTML =
        pedidos.length;

    document.getElementById('faturamento-dia').innerHTML =
        'R$ ' + faturamentoDia;


    if (pedidos.length === 0) {

        lista.innerHTML = `
            <p>Nenhum pedido realizado.</p>
        `;
    }
}


// Fecha mensagem
function fecharMensagem() {

    document.getElementById('mensagem-final').style.display = 'none';

    mostrarTela('pedido');
}

async function carregarGarcons(){
    let select = document.getElementById('garcom');
    if (!select) return;
    select.innerHTML = '<option value="">Carregando...</option>';

    try {
        let resposta = await fetch('api.php?acao=garcons');
        let garcons = await resposta.json();

        garconsData = garcons;

        select.innerHTML = '<option value="">Selecione o garçom</option>';

        garcons.forEach(g => {
            let nomeCompleto = g.sobrenome ? `${g.nome} ${g.sobrenome}` : g.nome;
            select.innerHTML += `<option value="${g.id}">${nomeCompleto}</option>`;
        });

        carregarListaGarcons(garcons);
    } catch (e) {
        select.innerHTML = '<option value="">Nenhum garçom disponível</option>';
        console.log('Erro ao carregar garçons', e);
    }
}

function carregarListaGarcons(garcons) {
    let lista = document.getElementById('lista-garcons');
    if (!lista) return;

    if (!garcons || garcons.length === 0) {
        lista.innerHTML = '<p>Nenhum garçom cadastrado.</p>';
        return;
    }

    lista.innerHTML = garcons.map(g => {
        let nomeCompleto = g.sobrenome ? `${g.nome} ${g.sobrenome}` : g.nome;
        let salario = g.salario !== undefined ? parseFloat(g.salario).toFixed(2) : '0.00';
        let mesas = g.mesas ? g.mesas : 'Nenhuma mesa no momento';

        return `
            <div class="item-pedido item-garcom">
                <div class="garcom-info">
                    <span class="garcom-nome">${nomeCompleto}</span>
                    <small class="garcom-mesa">Mesa(s): ${mesas}</small>
                </div>
                <div class="salario-bloco">
                    <label>Salário</label>
                    <input type="number" id="salario-garcom-${g.id}" value="${salario}" step="0.01" min="0" />
                </div>
            </div>
        `;
    }).join('');
}

async function salvarSalariosGarcons() {
    let salarios = garconsData.map(g => {
        let input = document.getElementById(`salario-garcom-${g.id}`);
        return {
            id: g.id,
            salario: input ? parseFloat(input.value) || 0 : 0
        };
    });

    try {
        let resposta = await fetch('api.php?acao=salvar-salarios-garcons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ salarios })
        });

        let retorno = await resposta.json();
        let erro = document.getElementById('garcom-erro');

        if (retorno.sucesso) {
            erro.innerText = '';
            carregarGarcons();
            alert('Salários atualizados com sucesso!');
        } else {
            erro.innerText = 'Erro ao salvar os salários.';
        }
    } catch (e) {
        document.getElementById('garcom-erro').innerText = 'Erro de conexão ao salvar salários.';
    }
}
async function cadastrarGarcom() {

    let nome = document.getElementById('novo-nome-garcom').value.trim();
    let sobrenome = document.getElementById('novo-sobrenome-garcom').value.trim();
    let salario = document.getElementById('novo-salario-garcom').value;

    if (!nome) {
        alert('Informe o nome do garçom.');
        return;
    }

    try {

        let resposta = await fetch('api.php?acao=cadastrar-garcom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                sobrenome,
                salario
            })
        });

        let retorno = await resposta.json();

        if (retorno.sucesso) {

            document.getElementById('novo-nome-garcom').value = '';
            document.getElementById('novo-sobrenome-garcom').value = '';
            document.getElementById('novo-salario-garcom').value = '';

            carregarGarcons();

            alert('Garçom cadastrado com sucesso!');
        } else {
            alert(retorno.erro || 'Erro ao cadastrar.');
        }

    } catch (e) {
        console.log(e);
        alert('Erro de conexão.');
    }
}

function formatarFormaPagamento(forma) {
    const mapa = {
        pix: 'Pix',
        dinheiro: 'Dinheiro',
        debito: 'Débito',
        credito: 'Crédito',
        'nao-informado': 'Não informado'
    };

    if (!forma) return 'Não informado';

    const valor = String(forma).toLowerCase();
    return mapa[valor] || valor.charAt(0).toUpperCase() + valor.slice(1);
}

function renderizarFechamentoCaixa(pedidos) {
    let container = document.getElementById('resumo-fechamento-caixa');
    if (!container) return;

    let pedidosAtivos = pedidos.filter(p => String(p.status || '').toLowerCase() === 'open');
    let resumo = {};

    pedidosAtivos.forEach(function(pedido) {
        let forma = pedido.forma_pagamento ? String(pedido.forma_pagamento).toLowerCase() : 'nao-informado';

        if (!resumo[forma]) {
            resumo[forma] = {
                nome: formatarFormaPagamento(forma),
                total: 0,
                quantidade: 0
            };
        }

        resumo[forma].total += parseFloat(pedido.total || 0);
        resumo[forma].quantidade += 1;
    });

    if (pedidosAtivos.length === 0) {
        container.innerHTML = '<p>Nenhum pedido aberto para este período.</p>';
        return;
    }

    let totalGeral = pedidosAtivos.reduce((acc, pedido) => acc + parseFloat(pedido.total || 0), 0);

    container.innerHTML = `
        <div class="fechamento-caixa-total">
            <span>Total do período:</span>
            <span>R$ ${totalGeral.toFixed(2)}</span>
        </div>
        <div class="fechamento-lista">
            ${pedidosAtivos.map(pedido => `
                <div class="fechamento-item">
                    <div>
                        <strong>${pedido.cliente || 'Cliente não informado'}</strong>
                        <div>${formatarFormaPagamento(pedido.forma_pagamento)} · Mesa ${pedido.mesa || '—'}</div>
                    </div>
                    <span>R$ ${parseFloat(pedido.total || 0).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="fechamento-caixa-total" style="margin-top: 10px;">
            <span>Resumo por pagamento</span>
        </div>
        ${Object.values(resumo).map(item => `
            <div class="fechamento-item">
                <span>${item.nome}</span>
                <strong>${item.quantidade} pedido(s)</strong>
                <span>R$ ${item.total.toFixed(2)}</span>
            </div>
        `).join('')}
    `;
}

function imprimirFechamentoCaixa() {
    const fechamento = document.getElementById('resumo-fechamento-caixa');
    if (!fechamento) return;

    const totalGeral = fechamento.querySelector('.fechamento-caixa-total')?.textContent || '';
    const conteudoOriginal = document.body.innerHTML;
    const conteudoImpressao = `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 700px; margin: 0 auto;">
            <h2 style="margin-bottom: 12px;">Fechamento de Caixa</h2>
            <p style="margin-bottom: 16px;">Resumo do período</p>
            <div>${fechamento.innerHTML}</div>
            <div style="margin-top: 16px; border-top: 1px solid #ddd; padding-top: 12px; font-weight: bold; font-size: 16px;">
                ${totalGeral}
            </div>
        </div>
    `;

    document.body.innerHTML = conteudoImpressao;
    window.print();
    document.body.innerHTML = conteudoOriginal;
    window.location.reload();
}

async function carregarRelatorio() {

    let dataInicio = document.getElementById('data-inicio').value || 
        new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    
    let dataFim = document.getElementById('data-fim').value || 
        new Date().toISOString().split('T')[0];

    let filtroStatus = document.getElementById('filtro-status-pedido')?.value || 'todos';

    let resposta = await fetch(
    `api.php?acao=relatorio&data_inicio=${dataInicio}&data_fim=${dataFim}`
);

let texto = await resposta.text();

console.log("RETORNO API:", texto);

let pedidos = JSON.parse(texto);

    let lista = document.getElementById("lista-relatorio");

    lista.innerHTML = "";

    let faturamento = 0;

    pedidos.forEach(pedido => {
        let statusPedido = String(pedido.status || '').toLowerCase();

        if (filtroStatus !== 'todos' && statusPedido !== filtroStatus) {
            return;
        }

        if (statusPedido === 'open') {
            faturamento += parseFloat(pedido.total || 0);
        }

        let mesaTexto = pedido.mesa && pedido.mesa !== '0' ? `Mesa ${pedido.mesa}` : 'Mesa liberada';
        let statusTexto = statusPedido === 'open'
            ? (pedido.mesa && pedido.mesa !== '0' ? '🟢 Ativo' : '🟡 Mesa liberada')
            : '❌ Cancelado';

        lista.innerHTML += `
            <div class="pedido-relatorio">
                <p><strong>Cliente:</strong> ${pedido.cliente || 'Cliente não informado'}</p>
                <p><strong>Mesa:</strong> ${mesaTexto}</p>
                <p><strong>Garçom:</strong> ${pedido.garcom || 'Não informado'}</p>
                <p><strong>Pagamento:</strong> ${formatarFormaPagamento(pedido.forma_pagamento)}</p>
                <p><strong>Total:</strong> R$ ${parseFloat(pedido.total || 0).toFixed(2)}</p>
                <p>
                <strong>Status:</strong>
                ${statusTexto}
                </p>
                <p><small>${new Date(pedido.data_pedido).toLocaleString('pt-BR')}</small></p>
                ${statusPedido === 'open'
                    ? `<button class="btn-cancelar-relatorio" onclick="cancelarPedidoRelatorio(${pedido.id})">Cancelar Pedido</button>`
                    : `<span class="pedido-cancelado-texto">Pedido cancelado</span>`}
        `;
    });

    document.getElementById("total-pedidos").innerHTML = pedidos.length;

    document.getElementById("faturamento-dia").innerHTML = 
        "R$ " + faturamento.toFixed(2);

    renderizarFechamentoCaixa(pedidos);
    carregarFaturamentoCategoria();
}

async function carregarProdutos(){

    let resposta =
    await fetch("api.php?acao=produtos");

    let produtos =
    await resposta.json();

    produtos.forEach(produto => {

        let elemento =
        document.getElementById(
            `estoque-${produto.id}`
        );

        if(elemento){

            elemento.innerHTML =
            `Estoque: ${produto.estoque}`;

        }

    });

}

async function carregarProdutosGerenciar() {
    try {
        let resposta = await fetch("api.php?acao=produtos");
        let produtos = await resposta.json();
        produtosData = produtos;
        exibirProdutosGerenciar(produtosData);
    } catch (e) {
        let container = document.getElementById('lista-produtos-gerenciamento');
        if (container) {
            container.innerHTML = '<p>Erro ao carregar produtos.</p>';
        }
        console.log('Erro ao carregar produtos para gerenciamento', e);
    }
}

function exibirProdutosGerenciar(produtos) {
    let container = document.getElementById('lista-produtos-gerenciamento');
    if (!container) return;

    let busca = document.getElementById('busca-produto')?.value.toLowerCase().trim() || '';
    let filtrados = produtos.filter(produto => produto.nome.toLowerCase().includes(busca));

    if (filtrados.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    container.innerHTML = filtrados.map(produto => `
        <div class="produto-item">
            <div class="produto-dados">
                <span class="produto-nome">${produto.nome}</span>
                <span class="produto-info">ID ${produto.id}</span>
            </div>
            <div class="produto-controls">
                <div class="produto-edicao">
                    <label>Preço</label>
                    <input type="number" id="produto-preco-${produto.id}" value="${parseFloat(produto.preco).toFixed(2)}" step="0.01" min="0">
                </div>
                <div class="produto-edicao">
                    <label>Estoque</label>
                    <input type="number" id="produto-estoque-${produto.id}" value="${produto.estoque}" min="0">
                </div>
                <button class="btn-confirmar" onclick="salvarProduto(${produto.id})">Salvar</button>
            </div>
        </div>
    `).join('');
}

function filtrarProdutosGerenciar() {
    exibirProdutosGerenciar(produtosData);
}

function formatCPF(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    input.value = value;
}

function formatTelefone(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 11);
    if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    input.value = value;
}

async function salvarProduto(id) {
    let precoInput = document.getElementById(`produto-preco-${id}`);
    let estoqueInput = document.getElementById(`produto-estoque-${id}`);

    if (!precoInput || !estoqueInput) return;

    let preco = parseFloat(precoInput.value) || 0;
    let estoque = parseInt(estoqueInput.value) || 0;

    try {
        let resposta = await fetch('api.php?acao=atualizar-produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, preco, estoque })
        });

        let retorno = await resposta.json();
        if (retorno.sucesso) {
            alert('Produto atualizado com sucesso!');
            carregarProdutos();
            carregarProdutosGerenciar();
        } else {
            alert('Erro ao atualizar produto: ' + (retorno.erro || ''));
        }
    } catch (e) {
        console.log(e);
        alert('Erro de conexão ao atualizar produto.');
    }
}

async function atualizarEstoqueTela() {
    let resposta = await fetch("api.php?acao=produtos");
    let produtos = await resposta.json();

    produtos.forEach(produto => {
        let elemento = document.getElementById(`estoque-${produto.id}`);
        if (!elemento) return;

        if (produto.estoque <= 5) {
            elemento.style.color = 'red';
            elemento.style.fontWeight = 'bold';
            elemento.innerText = `⚠ Estoque Baixo: ${produto.estoque}`;
        } else {
            elemento.style.color = '';
            elemento.style.fontWeight = '';
            elemento.innerText = `Estoque: ${produto.estoque}`;
        }
    });
}

function definirDatasRelatorio() {
    let hoje = new Date().toISOString().split('T')[0];
    let trinta = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    
    document.getElementById('data-inicio').value = trinta;
    document.getElementById('data-fim').value = hoje;
}

async function carregarFaturamentoCategoria() {
    let dataInicio = document.getElementById('data-inicio').value;
    let dataFim = document.getElementById('data-fim').value;

    let resposta = await fetch(
        `api.php?acao=relatorio-categoria&data_inicio=${dataInicio}&data_fim=${dataFim}`
    );

    let categorias = await resposta.json();

    let container = document.getElementById('faturamento-categoria');
    
    container.innerHTML = '';

    if (categorias.length === 0) {
        container.innerHTML = '<p>Nenhum dado disponível para este período.</p>';
        return;
    }

    let totalGeral = 0;
    categorias.forEach(cat => {
        totalGeral += parseFloat(cat.total_categoria);
    });

    categorias.forEach(categoria => {
        let percentual = ((parseFloat(categoria.total_categoria) / totalGeral) * 100).toFixed(1);
        let valor = parseFloat(categoria.total_categoria).toFixed(2);

        container.innerHTML += `
            <div class="categoria-item">
                <div class="categoria-info">
                    <span class="categoria-nome">${categoria.categoria}</span>
                    <span class="categoria-valor">R$ ${valor}</span>
                </div>
                <div class="categoria-barra">
                    <div class="categoria-progresso" style="width: ${percentual}%"></div>
                </div>
                <span class="categoria-percentual">${percentual}%</span>
            </div>
        `;
    });
}

function filtrarRelatorio() {
    carregarRelatorio();
}

function cancelarPedido() {
    // Se houver uma mesa marcada como ocupada no pedido atual, libera-a
    let mesa = document.getElementById('mesa').value;

    // Limpa pedido e campos
    pedido = [];
    atualizarPedido();
    document.getElementById('cliente').value = '';
    document.getElementById('cliente-cpf').value = '';
    document.getElementById('cliente-telefone').value = '';
    document.getElementById('mesa').value = '';
    document.getElementById('garcom').value = '';

    // Se a mesa estava em mesasOcupadas (pode ter sido ocupada por engano), remover
    let idx = mesasOcupadas.findIndex(m => String(m) === String(mesa));
    if (idx !== -1) {
        mesasOcupadas.splice(idx, 1);
    }

    atualizarDisponibilidadeMesas();

    alert('Pedido cancelado.');
}

// Mesas: 1 a 15
function carregarMesas() {
    let select = document.getElementById('mesa');
    if (!select) return;

    // clear existing numeric options (keep the first placeholder)
    select.innerHTML = '<option value="">Selecione a mesa</option>';

    for (let i = 1; i <= 15; i++) {
        let opt = document.createElement('option');
        opt.value = String(i);
        opt.text = `Mesa ${i}`;
        select.appendChild(opt);
    }

    select.addEventListener('change', function() {
        atualizarDisponibilidadeMesas();
    });

    atualizarDisponibilidadeMesas();
}

function atualizarDisponibilidadeMesas() {
    let select = document.getElementById('mesa');
    let status = document.getElementById('mesa-status');
    if (!select || !status) return;

    let options = select.querySelectorAll('option');

    options.forEach(opt => {
        if (opt.value === '') return;
        if (mesasOcupadas.includes(opt.value) || mesasOcupadas.includes(parseInt(opt.value))) {
            opt.disabled = true;
            opt.text = `Mesa ${opt.value} (Ocupada)`;
        } else {
            opt.disabled = false;
            opt.text = `Mesa ${opt.value}`;
        }
    });

    let val = select.value;
    if (!val) {
        status.innerText = '';
        return;
    }

    if (mesasOcupadas.includes(val) || mesasOcupadas.includes(parseInt(val))) {
        status.innerText = 'Esta mesa está ocupada.';
        status.style.color = '#c92a2a';
    } else {
        status.innerText = 'Mesa disponível.';
        status.style.color = '#16a34a';
    }
}

async function carregarMesasOcupadas() {
    try {
        let resposta = await fetch('api.php?acao=mesas-ocupadas');
        let dados = await resposta.json();
        // normaliza para strings
        mesasOcupadas = dados.map(m => String(m));
        atualizarDisponibilidadeMesas();
        atualizarListaMesasOcupadas();
    } catch (e) {
        console.log('Erro ao carregar mesas ocupadas', e);
    }
}

function atualizarListaMesasOcupadas() {
    let container = document.getElementById('lista-mesas-ocupadas');
    if (!container) return;

    if (!mesasOcupadas || mesasOcupadas.length === 0) {
        container.innerHTML = '<p>Nenhuma mesa ocupada.</p>';
        return;
    }

    container.innerHTML = mesasOcupadas.map(m => `
        <div class="item-pedido">
            <span>Mesa ${m}</span>
            <button class="btn-liberar-mesa" onclick="liberarMesa(${m})">Desocupar Mesa</button>
        </div>
    `).join('');
}

async function liberarMesa(mesa) {
    if (!mesa || mesa === '0') {
        alert('Mesa inválida.');
        return;
    }

    if (!confirm(`Confirma liberar a mesa ${mesa}?`)) return;

    try {
        let resposta = await fetch('api.php?acao=liberar-mesa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mesa })
        });

        let retorno = await resposta.json();
        if (retorno.sucesso) {
            // atualizar estado local e UI
            let idx = mesasOcupadas.findIndex(m => String(m) === String(mesa));
            if (idx !== -1) mesasOcupadas.splice(idx, 1);
            atualizarDisponibilidadeMesas();
            atualizarListaMesasOcupadas();
            carregarRelatorio();
            alert('Mesa liberada.');
        } else {
            alert('Erro ao liberar mesa: ' + (retorno.erro || ''));
        }
    } catch (e) {
        console.log(e);
        alert('Erro ao conectar com o servidor.');
    }
}

async function cancelarPedidoRelatorio(pedidoId) {
    if (!confirm('Confirma cancelar este pedido?')) return;

    try {
         console.log("Cancelando pedido:", pedidoId);
        let resposta = await fetch('api.php?acao=cancelar-pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pedido_id: pedidoId })
        });

        let retorno = await resposta.json();
        if (retorno.sucesso) {
            // atualizar UI
            carregarRelatorio();
            carregarMesasOcupadas();
            carregarFaturamentoCategoria();
            atualizarEstoqueTela();
            alert('Pedido cancelado com sucesso.');
        } else {
            alert('Erro ao cancelar pedido: ' + (retorno.erro || ''));
        }
    } catch (e) {
        console.log(e);
        alert('Erro de conexão ao cancelar pedido.');
    }
}