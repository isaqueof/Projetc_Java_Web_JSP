window.addEventListener('load', () => {
	listUsers();
});

function listUsers() {
	const urlAction = document.getElementById('formUser').action;

	$(".alert").alert('dispose')
	$(".alert").alert('dispose')
	$.ajax({
		method: "get",
		url: urlAction,
		data: '&acao=buscarCadastroAjax',
		success: function(response, xhr, status) {

			const json = JSON.parse(response);

			let ind = '';
			json.forEach((user, index) => {
				ind += '<tr> <td style="display: none;">' + user.id
					+ '</td> <td> ' + user.centrodecusto
					+ '</td> <td> ' + user.funcao
					+ '</td> <td> ' + user.nome
					+ '</td> <td> ' + user.datanascimento
					+ '</td> <td> ' + user.cpf
					+ '</td> <td> ' + user.rg
					+ '</td> <td> ' + user.aso
					+ '</td> <td> ' + user.dataaso
					+ '</td> <td> <button class="btn btn-sm btn-primary editar-btn" type="button"><i class="fa-solid fa-pencil"></i></button><button class="btn btn-success btn-sm salvar-btn" style="display: none;" type="button"><i class="fa-solid fa-download"></i></button></td>'
					+ '</td> <td> <button class="btn btn-sm btn-danger" onclick="criarDeleteComAjax(' + user.id + ')" type="button"><i class="fa-solid fa-trash-can" ></i></button></td></tr>';
			});

			$('#tableBody_users').html(ind);
			if ($.fn.DataTable.isDataTable('#tabelaresultados')) {
				$('#tabelaresultados').DataTable().clear().destroy();
			}
			$(document).ready(function() {
				$('#tabelaresultados').DataTable({
					language: {
						url: '//cdn.datatables.net/plug-ins/2.0.5/i18n/pt-BR.json',
					},
					layout: {
						top: {
							buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
						}
					},
					// Torna o DataTable responsivo
					responsive: true,
					columnDefs: [
						{ className: "text-center", targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
						{ responsivePriority: 1, targets: 0 , visible: false}, // ID - Maior prioridade
						{ responsivePriority: 2, targets: 1 }, // Centro de Custo
						{ responsivePriority: 3, targets: 2 }, // Função
						{ responsivePriority: 4, targets: 3 }, // Nome
						{ responsivePriority: 5, targets: 4 }, // Data nascimento
						{ responsivePriority: 6, targets: 5 }, // CPF
						{ responsivePriority: 7, targets: 6 }, // RG
						{ responsivePriority: 8, targets: 7 }, // ASO
						{ responsivePriority: 9, targets: 8 }, // Data ASO
						{ responsivePriority: 10, targets: 9 }, // Editar
						{ responsivePriority: 11, targets: 10 } // Options
					],
					columns: [
						{ title: 'ID', width: 'auto' }, // Define a largura da coluna ID automaticamente
						{ title: 'Centro de Custo', width: 'auto' }, // Define a largura da coluna Centro de Custo automaticamente
						{ title: 'Função', width: 'auto' }, // Define a largura da coluna Função automaticamente
						{ title: 'Nome', width: 'auto' }, // Define a largura da coluna Nome automaticamente
						{ title: 'Data nascimento', width: 'auto' }, // Define a largura da coluna Data nascimento automaticamente
						{ title: 'Cpf', width: 'auto' }, // Define a largura da coluna CPF automaticamente
						{ title: 'Rg', width: 'auto' }, // Define a largura da coluna RG automaticamente
						{ title: 'Aso', width: 'auto' }, // Define a largura da coluna ASO automaticamente
						{ title: 'Data Aso', width: 'auto' }, // Define a largura da coluna Data Aso automaticamente
						{ title: 'Editar', width: 'auto' }, // Define a largura da coluna Editar automaticamente
						{ title: 'Options', width: 'auto' } // Define a largura da coluna Options automaticamente
					]
				});
			});
		}

	}).fail(function(xhr, status, errorThrown) {
		alert('Erro ao buscar usuário por nome: ' + xhr.responseText + '\n================================' + errorThrown + '================================' + status);
	});

}

function gravarCadastro() {
	// Coletar os valores dos campos do formulário
	const formData = {
		centrodecusto: $('#centrodecusto').val(),
		funcao: $('#funcao').val(),
		nome: $('#nome').val(),
		datanascimento: $('#datanascimento').val(),
		cpf: $('#cpf').val(),
		rg: $('#rg').val(),
		aso: $('#aso').val(),
		dataaso: $('#dataaso').val(),
		acao: "salvaAjax" // Adiciona o parâmetro acao com o valor salvaAjax
		// Adicione outros campos conforme necessário
	};

	// Enviar os dados para a servlet via AJAX
	$.ajax({
		method: "POST",
		url: "ServeletCadastro",
		data: formData,
		success: function(response) {
			// Exibir mensagem de sucesso ou tomar outras ações necessárias
			alert('Cadastro realizado com sucesso!');
			// Recarregar o DataTable após o cadastro ser realizado com sucesso
			if ($.fn.DataTable.isDataTable('#tabelaresultados')) {
				$('#tabelaresultados').DataTable().clear().destroy();
				listUsers();

			}

		},
		error: function(xhr, status, errorThrown) {
			// Exibir mensagem de erro ou tomar outras ações necessárias
			alert('Ocorreu um erro ao cadastrar: ' + xhr.responseText);
		}
	});
	fecharModalELimparFormulario();
}

// Função para fechar o modal e limpar o formulário
function fecharModalELimparFormulario() {
	// Fechar o modal
	$('#exampleModal').modal('hide');

	// Remover a classe que mantém o modal aberto
	$('body').removeClass('modal-open');

	// Remover o backdrop do modal
	$('.modal-backdrop').remove();

	// Limpar o formulário
	$('#formUser')[0].reset(); // Isso irá limpar todos os campos do formulário
}

// Evento de exibição do modal
$('#exampleModal').on('shown.bs.modal', function() {
	// Limpar o formulário
	$('#formUser')[0].reset();
});


function editarLinha(id) {
	let tabela = $('#tabelaresultados').DataTable();
	let linha = tabela.row(function(idx, data, node) {
		return data[0] === id ? true : false;
	});

	linha.nodes().to$().find('td').each(function() {
		let celula = $(this);
		let valor = celula.text();
		celula.empty().append($('<input type="text" class="form-control" />').val(valor));
	});

	linha.nodes().to$().find('button[onclick^="editarLinha"]').attr('onclick', 'salvarLinha(' + id + ')');

}

function salvarLinha(id) {
	let tabela = $('#tabelaresultados').DataTable();
	let linha = tabela.row(function(idx, data, node) {
		return data[0] === id ? true : false;
	});

	let dadosEditados = {};

	linha.nodes().to$().find('td').each(function(index) {
		let celula = $(this);
		let valor = celula.find('input').val();
		celula.empty().text(valor);
		dadosEditados[tabela.columns(index).header().innerText] = valor;
	});

	linha.nodes().to$().find('button[onclick^="salvarLinha"]').attr('onclick', 'editarLinha(' + id + ')');

	// Faça uma chamada AJAX para salvar os dados editados no servidor
	let urlAction = document.getElementById('formUser').action;
	$.ajax({
		method: "get",
		type: "UPDATE",
		url: urlAction,
		data: "id=" + id + '&acao=salvaAjax',
		success: function(response) {

			console.log('Dados atualizados com sucesso!');

		},
		error: function() {
			alert('Ocorreu um erro ao comunicar com o servidor.');
		}
	}).fail(function(xhr, status, errorThrown) {
		alert('Erro ao deletar usuário por id: ' + xhr + '  ' + status + ' ' + errorThrown);
	});

}


$(document).ready(function() {
	let clicks = 0;
	let timeout;

	// Evento de clique no botão "Editar"
	$("#tabelaresultados").on("click", ".editar-btn", function() {
		let linha = $(this).closest("tr");
		linha.find("td:nth-child(n+2):nth-child(-n+9)").each(function() { // Colunas 2 a 9
			let valor = $(this).text();
			$(this).html('<input type="text" value="' + valor + '">');
		});
		linha.find(".editar-btn").hide();
		linha.find(".salvar-btn").show();
		editando = true; // Marcando como editando quando o botão "Editar" é clicado
	});

	// Evento de clique no botão "Salvar"
	$("#tabelaresultados").on("click", ".salvar-btn", function() {
		let linha = $(this).closest("tr");
		linha.find("td:nth-child(n+2):nth-child(-n+9) input").each(function() { // Colunas 2 a 9
			let novoValor = $(this).val();
			$(this).parent().html(novoValor);
		});
		linha.find(".salvar-btn").hide();
		linha.find(".editar-btn").show();
		editando = false; // Marcando como não editando quando o botão "Salvar" é clicado
	});

	// Evento de clique nas células do tbody
	$("#tableBody_users").on("click", "td:nth-child(-n+9)", function() {
		clicks++; // Incrementa o contador de cliques
		if (clicks === 1) { // Se for o primeiro clique
			timeout = setTimeout(function() {
				clicks = 0; // Reseta o contador de cliques após o tempo limite
			}, 300); // Defina o tempo limite em milissegundos para distinguir entre um clique simples e um duplo
		} else { // Se for o segundo clique (clique duplo)
			clearTimeout(timeout); // Limpa o tempo limite
			clicks = 0; // Reseta o contador de cliques
			let valor = $(this).text();
			$(this).html('<input type="text" value="' + valor + '">');
			// Mudar o botão para "Salvar"
			$(this).closest("tr").find(".editar-btn").hide();
			$(this).closest("tr").find(".salvar-btn").show();
		}
	});
});




function removerLinhaPorId(id, selector) {
	// Obtenha a instância da DataTable
	let tabela = $(selector).DataTable();

	// Encontre a linha pelo ID
	tabela.rows().every(function(rowIdx, tableLoop, rowLoop) {
		let data = this.data();
		if (data[0] == id) { // Supondo que o ID esteja na primeira coluna (índice 0)
			// Remova a linha
			tabela.row(this.node()).remove().draw();
			return false; // interrompe a execução do loop
		}
	});
}


function criarDeleteComAjax(id) {
	let urlAction = document.getElementById('formUser').action;
	$.ajax({
		method: "get",
		type: 'DELETE',
		url: urlAction,
		data: "id=" + id + '&acao=deletarajax',
		success: function(response) {
			removerLinhaPorId(id, '#tabelaresultados');

		}

	}).fail(function(xhr, status, errorThrown) {
		alert('Erro ao deletar usuário por id: ' + xhr + '  ' + status + ' ' + errorThrown);
	});

}


