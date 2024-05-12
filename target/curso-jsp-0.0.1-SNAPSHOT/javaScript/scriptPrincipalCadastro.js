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
			$('#tabelaresultados').DataTable().destroy();
			$(document).ready(function() {
				// Inicialize a tabela DataTable							
				$('#tabelaresultados').DataTable({
					// Opções e configurações aqui
					language: {
						url: '//cdn.datatables.net/plug-ins/2.0.5/i18n/pt-BR.json',
					},
					layout: {
						top: {
							buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
						}
					},
					columnDefs: [
						{ className: "text-center", targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },

					],
					columns: [
						{ title: 'ID' },
						{ title: 'Centro de Custo' },
						{ title: 'Função' },
						{ title: 'Nome' },
						{ title: 'Data nascimento' },
						{ title: 'Cpf' },
						{ title: 'Rg' },
						{ title: 'Aso' },
						{ title: 'Data Aso' },
						{ title: 'Editar' },
						{ title: 'Options' },
					],

				});
			});
		}

	}).fail(function(xhr, status, errorThrown) {
		alert('Erro ao buscar usuário por nome: ' + xhr.responseText + '\n================================' + errorThrown + '================================' + status);
	});

}

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
		data: "id=" + id + '&acao=salvarAjax',
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

const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
	myInput.focus();
})

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





function gravarCad(event) {
	// Prevenir o comportamento padrão do envio do formulário
	event.preventDefault();

	// Obtenha os dados do formulário
	let formData = $('#formUser').serialize();

	// Faça uma chamada AJAX para gravar o cadastro no servidor
	const urlAction = $('#formUser').attr('action');
	$.ajax({
		method: "post",
		url: urlAction,
		data: formData + '&acao=salvaAjax', // Adicione os dados do formulário à requisição
		success: function(response) {
			// Recarregue o DataTable após o sucesso da requisição AJAX
			$('#tabelaresultados').DataTable().ajax.reload();
			alert('Cadastro realizado com sucesso! Ajax');
		},
		error: function(xhr, status, errorThrown) {
			alert('Ocorreu um erro ao comunicar com o servidor.');
		}
	}).fail(function(xhr, status, errorThrown) {
		alert('Erro ao gravar cadastro: ' + xhr + '  ' + status + ' ' + errorThrown);
	});
}


function teste() {
	console.log('teste');
}