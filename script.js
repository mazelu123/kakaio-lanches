const dadosCardapio = {
    combos: [
        { nome: "Combo Família (#1)", desc: "4 Burg + Refrigerante 1L", preco: "R$ 57,99" },
        { nome: "Combo Especial (#2)", desc: "2 Burger + 2 Caçulinhas", preco: "R$ 31,99" },
        { nome: "Combo Kids (#1)", desc: "1 Torrada + 1 Suco Natural", preco: "R$ 11,99" },
        { nome: "Mega Combo (#4)", desc: "1 X-Tudo + 1 Caçulinha", preco: "R$ 21,99" }
    ],
    tradicionais: [
        { nome: "X-Tudo", desc: "Pão, hambúrguer, ovo, frango, bacon, calabresa, presunto, queijo e salada", preco: "R$ 18,00" },
        { nome: "Gigantão", desc: "Pão, dois hambúrgueres, dois ovos, cebola, dois presuntos, dois queijos e salada", preco: "R$ 23,00" },
        { nome: "Sertanejo", desc: "Pão, hambúrguer de picanha, cebola, queijo coalho, catupiry e salada", preco: "R$ 16,00" },
        { nome: "Torrada", desc: "Pão, presunto, queijo e salada", preco: "R$ 6,00" }
    ],
    artesanais: [
        { nome: "Artesanal Simples", desc: "Pão, hambúrguer artesanal, cheddar e salada", preco: "R$ 18,00" },
        { nome: "Artesanal Duplo", desc: "Pão, dois hambúrgueres, dois ovos, cheddar, cebola e salada", preco: "R$ 25,00" },
        { nome: "Artesanal de Bacon", desc: "Pão, hambúrguer artesanal, bacon, cheddar, cebola e salada", preco: "R$ 19,00" }
    ],
    bebidas: [
        { nome: "Sucos Naturais", desc: "Morango, Uva, Graviola, Cajá, Acerola, Manga, etc.", preco: "R$ 6,00" },
        { nome: "Refri Lata", desc: "Diversos sabores", preco: "R$ 6,00" },
        { nome: "Água Mineral", desc: "Sem gás", preco: "R$ 3,00" }
    ],
    sobremesas: [
        { nome: "Nega Maluca", desc: "Sabor Chocolate (A fatia)", preco: "R$ 10,00" }
    ]
};

function mostrarCategoria(cat) {
    const container = document.getElementById('lista-itens');
    const botoes = document.querySelectorAll('.opcoes');
    
    // Atualiza botão ativo
    botoes.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Gera o HTML
    let html = '';
    dadosCardapio[cat].forEach(item => {
        html += `
            <div class="item-cardapio">
                <div class="info-item">
                    <h3 class="nome-item">${item.nome}</h3>
                    <p class="descricao-item">${item.desc}</p>
                </div>
                <div class="preco-item">${item.preco}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Iniciar com combos
document.addEventListener('DOMContentLoaded', () => {
    mostrarCategoria('combos');
});

// Array para armazenar os produtos selecionados
let carrinho = [];

// Função para abrir e fechar o modal do carrinho
function toggleCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    modal.classList.toggle('escondido');
}

// Função chamada quando clica no botão "+" do cardápio
function adicionarAoCarrinho(nome, preco) {
    // Verifica se o item já existe no carrinho
    let itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade++; // Se existe, só aumenta a quantidade
    } else {
        // Se não existe, adiciona um novo objeto ao array
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    atualizarInterfaceCarrinho();
}

// Função para botões de "+" e "-" dentro do carrinho
function alterarQuantidade(nome, mudanca) {
    let item = carrinho.find(item => item.nome === nome);
    
    if (item) {
        item.quantidade += mudanca;
        
        // Se a quantidade chegar a 0, remove o item do carrinho
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.nome !== nome);
        }
        
        atualizarInterfaceCarrinho();
    }
}

// Função que redesenha os itens no HTML e calcula o total
function atualizarInterfaceCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const contadorTopo = document.getElementById('carrinho-contador');
    const totalCarrinho = document.getElementById('total-carrinho');
    
    listaCarrinho.innerHTML = ''; // Limpa a lista para redesenhar
    
    let total = 0;
    let qtdTotalItens = 0;
    
    carrinho.forEach(item => {
        let subtotalItem = item.preco * item.quantidade;
        total += subtotalItem;
        qtdTotalItens += item.quantidade;
        
        // Cria o HTML do item dentro do carrinho
        listaCarrinho.innerHTML += `
            <div class="item-no-carrinho">
                <div class="info-item-carrinho">
                    <h4>${item.nome}</h4>
                    <span>R$ ${subtotalItem.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="controles-qtd">
                    <button onclick="alterarQuantidade('${item.nome}', -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarQuantidade('${item.nome}', 1)">+</button>
                </div>
            </div>
        `;
    });
    
    // Atualiza os valores na tela
    contadorTopo.innerText = qtdTotalItens;
    totalCarrinho.innerText = total.toFixed(2).replace('.', ',');
    
    // Se o carrinho foi zerado e estava aberto, pode fechar automaticamente (opcional)
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<p style="text-align:center; color:#888;">Seu carrinho está vazio.</p>';
    }
}

// ==========================================
// LÓGICA DE FINALIZAÇÃO DE PEDIDO
// ==========================================

function abrirFinalizacao() {
    // Verifica se tem algo no carrinho
    if (carrinho.length === 0) {
        alert("Adicione pelo menos um item ao carrinho antes de continuar!");
        return;
    }
    
    // Esconde o carrinho e mostra a tela de finalização
    document.getElementById('modal-carrinho').classList.add('escondido');
    document.getElementById('modal-finalizacao').classList.remove('escondido');
    
    // Lista os itens no resumo
    const listaFinal = document.getElementById('lista-final');
    listaFinal.innerHTML = '';
    
    let total = 0;
    carrinho.forEach(item => {
        let subtotal = item.preco * item.quantidade;
        total += subtotal;
        listaFinal.innerHTML += `<p><b>${item.quantidade}x</b> ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}</p>`;
    });
    
    // Atualiza o total
    document.getElementById('total-final').innerText = total.toFixed(2).replace('.', ',');
}

function fecharFinalizacao() {
    document.getElementById('modal-finalizacao').classList.add('escondido');
}

function voltarParaCarrinho() {
    fecharFinalizacao();
    toggleCarrinho(); // Abre o carrinho novamente
}

// Mostra o campo de troco apenas se for em Dinheiro (Espécie)
function verificarTroco() {
    const pagamento = document.getElementById('pagamento').value;
    const trocoDiv = document.getElementById('troco-div');
    
    if (pagamento === 'especie') {
        trocoDiv.style.display = 'flex';
    } else {
        trocoDiv.style.display = 'none';
        document.getElementById('troco').value = ''; // Limpa o campo
    }
}

// Função temporária de envio
function enviarPedido() {
    const endereco = document.getElementById('endereco').value;
    
    if (endereco.trim() === '') {
        alert("Por favor, preencha o endereço de entrega!");
        return;
    }
    
    alert("Tela de finalização concluída! Tudo pronto para a etapa de envio.");
}// Função que monta o pedido e envia para o WhatsApp
function enviarPedido() {
    const endereco = document.getElementById('endereco').value;
    const pagamento = document.getElementById('pagamento').value;
    const observacao = document.getElementById('observacao').value;
    let troco = '';

    // Validação de endereço
    if (endereco.trim() === '') {
        alert("Por favor, preencha o endereço de entrega!");
        return;
    }

    // Verifica se precisa de troco
    if (pagamento === 'especie') {
        const valorTroco = document.getElementById('troco').value;
        if (valorTroco) {
            troco = `\n*Troco para:* R$ ${valorTroco}`;
        } else {
            troco = `\n*Troco para:* Não precisa`;
        }
    }

    // Montando a mensagem para o WhatsApp
    let textoPedido = `*NOVO PEDIDO - KAKAIO LANCHES* 🍔🍟\n\n`;
    textoPedido += `*Detalhes do Pedido:*\n`;

    let total = 0;
    carrinho.forEach(item => {
        let subtotal = item.preco * item.quantidade;
        total += subtotal;
        textoPedido += `• ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });

    textoPedido += `\n*Total a pagar:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
    textoPedido += `\n🚚 *Dados da Entrega:*\n`;
    textoPedido += `*Endereço:* ${endereco}\n`;
    
    // Formatando o nome do pagamento
    let nomePagamento = "";
    if(pagamento === 'pix') nomePagamento = "Pix";
    if(pagamento === 'cartao') nomePagamento = "Cartão";
    if(pagamento === 'especie') nomePagamento = "Dinheiro";

    textoPedido += `*Forma de Pagamento:* ${nomePagamento}${troco}\n`;
    
    if (observacao.trim() !== '') {
        textoPedido += `\n📝 *Observações:* ${observacao}`;
    }

    // DDI (55) + DDD + Seu Número de WhatsApp
    // MUDE O NÚMERO ABAIXO PARA O SEU WHATSAPP REAL! (Apenas números)
    const numeroWhatsApp = "8496263793"; 
    
    // Cria o link e redireciona o cliente
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoPedido)}`;
    window.open(url, '_blank');
    
    // Opcional: Esvaziar o carrinho e fechar a tela após enviar
    // carrinho = [];
    // atualizarCarrinho();
    // fecharFinalizacao();
}