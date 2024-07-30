window.addEventListener('load', () => {
	listUsers();

})


function listUsers() {
	const urlAction = document.getElementById('formUser').action

	// Verificação de URL de ação
	if (!urlAction) {
		console.error("URL de ação não encontrada.");
		return;
	}

	$(".alert").alert('dispose');
	$.ajax({
		method: "get",
		url: urlAction,
		data: '&acao=buscarCadastroAjax',
		success: function(response, xhr, status) {
			const json = JSON.parse(response);
			let ind = '';

			json.forEach((user, index) => {
				ind += `<tr id="row-${user.id}">`;
				ind += `<td style="display: none;" >${user.id}</td>`;
				ind += `<td data-field="centrodecusto" type="text">${user.centrodecusto}</td>`;
				ind += `<td data-field="funcao" type="text">${user.funcao}</td>`;
				ind += `<td data-field="nome" type="text">${user.nome}</td>`;
				ind += `<td data-field="datanascimento" type="date" >${user.datanascimento}</td>`;
				ind += `<td data-field="cpf" type="text" class="cpf-cell" id="cpf-validade">${user.cpf}</td>`;
				ind += `<td data-field="rg" type="text">${user.rg}</td>`;
				ind += `<td data-field="aso" type="text">${user.aso}</td>`;
				ind += `<td data-field="dataaso" type="date">${user.dataaso}</td>`;

				// Adiciona os botões Editar e Salvar
				ind += '<td>';
				ind += `<button class="btn btn-sm btn-primary editar-btn edit-btn" type="button" onclick="editarLinha(${user.id})"><i class="fa-solid fa-pencil"></i></button>`;
				ind += `<button class="btn btn-success btn-sm salvar-btn" onclick="salvarLinha(${user.id})" style="display: none;" type="button"><i class="fa-solid fa-download"></i> Salvar</button>`;
				ind += '</td>';

				// Adiciona o campo de upload e o link para o PDF
				ind += '<td>';
				ind += `<input type="file" name="file" class="form-control" id="uploadPdf-${user.id}" accept=".pdf" style="display:none;" onchange="uploadPdf(${user.id})">`;
				ind += `<button type="button" class="btn btn-sm btn-secondary" id="viewPdfButton-${user.id}" onclick="document.getElementById('uploadPdf-${user.id}').click()">Upload PDF</button>`;

				if (user.pdfPath) {
					ind += `<a href="/uploads/${user.pdfPath}" class="btn btn-info btn-sm pdf-link verificar-btn" id="pdf-link-${user.id}" target="_blank" data-id="${user.id}">Visualizar PDF</a>`;
				} else {
					ind += `<a href="#" class="btn btn-info btn-sm pdf-link verificar-btn" id="pdf-link-${user.id}" target="_blank" style="display:none;" data-id="${user.id}">Visualizar PDF</a>`;
				}
				ind += '</td>';



				// Adiciona o botão de Delete	
				ind += '<td>';
				ind += `<button class="btn btn-sm btn-danger" onclick="criarDeleteComAjax(${user.id})" type="button"><i class="fa-solid fa-trash-can"></i></button>`;
				ind += '</td>';

				ind += '</tr>';
			});

			$('#tableBody_users').html(ind);
			if ($.fn.DataTable.isDataTable('#tabelaresultados')) {
				$('#tabelaresultados').DataTable().clear().destroy();
			}

			$('#tabelaresultados').DataTable({
				language: {
					url: '//cdn.datatables.net/plug-ins/2.0.5/i18n/pt-BR.json',
				},
				"lengthMenu": [10, 25, 50, 100], // Opções de itens por página
				"pageLength": 10, // Valor padrão de itens por página
				"dom": '<"top"B> <"top"f> <"top"l>rt<"bottom"ip><"clear">',
				scrollX: false,
				autoWidth: false,
				responsive: false,
				columnDefs: [
					{ className: "text-center", targets: '_all' },
					{ responsivePriority: 1, targets: 0, visible: false },
					{ responsivePriority: 2, targets: 1 },
					{ responsivePriority: 3, targets: 2 },
					{ responsivePriority: 4, targets: 3 },
					{ responsivePriority: 5, targets: 4 },
					{ responsivePriority: 6, targets: 5 },
					{ responsivePriority: 7, targets: 6 },
					{ responsivePriority: 8, targets: 7 },
					{ responsivePriority: 9, targets: 8 },
					{ responsivePriority: 10, targets: 9 },
					{ responsivePriority: 11, targets: 10 },
					{ responsivePriority: 12, targets: 11 }
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
					{ title: 'Arquivos' },
					{ title: 'Deletar' }
				]
			});
		}
	}).fail(function(xhr, status, errorThrown) {
		alert('Erro ao buscar usuário por nome: ' + xhr.responseText + '\n================================' + errorThrown + '================================' + status);
	});
}



$(document).ready(function() {
	// Adiciona um evento de clique para verificar PDFs
	$('.verificar-btn').each(function() {
		var id = $(this).data('id');
		verificarPdf(id, $(this));
	});

	function verificarPdf(id, button) {
		$.ajax({
			url: '/ServeletCadastro',
			method: 'GET',
			data: { acao: 'verificarpdf', id: id },
			success: function(response) {
				if (response.trim() === 'PDF disponível') {
					button.show(); // Mostra o botão se o PDF estiver disponível
				} else {
					button.hide(); // Oculta o botão se o PDF não estiver disponível
				}
			},
			error: function() {
				console.error('Erro ao verificar PDF');
				button.hide(); // Oculta o botão em caso de erro
			}
		});
	}
});



function validateAndFormatCPF(element) {
	var cpf = element.text();
	if (!isValidCPF(cpf)) {
		alert('CPF inválido!');
		element.focus();
		return false;
	}
	element.text(formatCPF(cpf));
	return true;
}

document.getElementById('cpf').addEventListener('input', function(e) {
	var value = e.target.value;
	var cpfPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
		.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
		.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
		.replace(/(\d{3})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
		.replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
	e.target.value = cpfPattern;
})

// Adiciona um evento de input ao seu campo de entrada para ajustar a largura dinamicamente
document.querySelectorAll('.input-edit').forEach(function(input) {
	adjustWidthToText(input); // Ajusta a largura inicialmente
	input.addEventListener('input', function() {
		adjustWidthToText(input);
	});
});


function limparFormulario() {
	$('#centrodecusto').val('');
	$('#funcao').val('');
	$('#nome').val('');
	$('#datanascimento').val('');
	$('#cpf').val('');
	$('#rg').val('');
	$('#aso').val('');
	$('#dataaso').val('');
	// Adicione outros campos conforme necessário
}

function fecharModalELimparFormulario() {
	// Fechar o modal
	$('#exampleModal').modal('hide');

	// Limpar o formulário
	$('#formUser').trigger('reset'); // Limpa todos os campos do formulário
}

// Evento de exibição do modal
$('#exampleModal').on('shown.bs.modal', function() {
	limparFormulario();
	setTimeout(function() {
		limparFormulario();
	}, 100); // Ajuste o tempo conforme necessário
});

// Evento para garantir que o modal seja reaberto corretamente
$('#exampleModal').on('hidden.bs.modal', function() {
	// Garantir que o modal-backdrop seja removido
	$('.modal-backdrop').remove();
	// Limpar o formulário
	limparFormulario();
});

function validarFormulario() {
	// Adicione suas validações aqui
	// Exemplo: Verificar se o nome está preenchido
	if ($('#nome').val().trim() === '') {
		alert('O nome é obrigatório!');
		return false;
	}
	return true;
}

function gravarCadastro() {
	if (!validarFormulario()) return;

	// Coleta dos dados do formulário
	const formData = {
		centrodecusto: $('#centrodecusto').val(),
		funcao: $('#funcao').val(),
		nome: $('#nome').val(),
		datanascimento: $('#datanascimento').val(),
		cpf: $('#cpf').val(),
		rg: $('#rg').val(),
		aso: $('#aso').val(),
		dataaso: $('#dataaso').val(),
		acao: "salvaAjax" // Certifique-se de que este valor é esperado pelo servidor
	};

	console.log("Dados do formulário:", formData); // Adicione esta linha

	const urlAction = document.getElementById('formUser').action;

	$.ajax({
		method: "POST",
		url: urlAction,
		data: formData,
		success: function(response) {
			console.log("Resposta do servidor:", response); // Adicione esta linha
			alert('Cadastro realizado com sucesso!');
			if ($.fn.DataTable.isDataTable('#tabelaresultados')) {
				$('#tabelaresultados').DataTable().clear().destroy();
				listUsers();
			}
			fecharModalELimparFormulario();
		},
		error: function(xhr, status, errorThrown) {
			console.error('Erro ao cadastrar:', xhr.responseText); // Altere para console.error
			alert('Ocorreu um erro ao cadastrar: ' + xhr.responseText);
		}
	});
}

function salvarLinha(id) {
	var urlAction = document.getElementById('formUser').action;

	var row = document.getElementById('row-' + id);

	if (!row) {
		console.error('Linha não encontrada para o ID:', id);
		return;
	}

	const formData = {
		id: id,
		centrodecusto: row.querySelector('[data-field="centrodecusto"] input') ? row.querySelector('[data-field="centrodecusto"] input').value : row.querySelector('[data-field="centrodecusto"]').innerText,
		funcao: row.querySelector('[data-field="funcao"] input') ? row.querySelector('[data-field="funcao"] input').value : row.querySelector('[data-field="funcao"]').innerText,
		nome: row.querySelector('[data-field="nome"] input') ? row.querySelector('[data-field="nome"] input').value : row.querySelector('[data-field="nome"]').innerText,
		datanascimento: row.querySelector('[data-field="datanascimento"] input') ? row.querySelector('[data-field="datanascimento"] input').value : row.querySelector('[data-field="datanascimento"]').innerText,
		cpf: row.querySelector('[data-field="cpf"] input') ? row.querySelector('[data-field="cpf"] input').value : row.querySelector('[data-field="cpf"]').innerText,
		rg: row.querySelector('[data-field="rg"] input') ? row.querySelector('[data-field="rg"] input').value : row.querySelector('[data-field="rg"]').innerText,
		aso: row.querySelector('[data-field="aso"] input') ? row.querySelector('[data-field="aso"] input').value : row.querySelector('[data-field="aso"]').innerText,
		dataaso: row.querySelector('[data-field="dataaso"] input') ? row.querySelector('[data-field="dataaso"] input').value : row.querySelector('[data-field="dataaso"]').innerText,
		acao: "salvaAjax"
	};

	$.ajax({
		method: "POST",
		url: urlAction,
		data: formData,
		success: function(response) {
			alert('Cadastro atualizado com sucesso!');
			if ($.fn.DataTable.isDataTable('#tabelaresultados')) {
				$('#tabelaresultados').DataTable().clear().destroy();
				listUsers();
			}
		},
		error: function(xhr, status, errorThrown) {
			alert('Ocorreu um erro ao atualizar o cadastro: ' + xhr.responseText);
		}
	});
}


function uploadPdf(id) {
	var fileInput = document.getElementById('uploadPdf-' + id);
	if (!fileInput || !fileInput.files || !fileInput.files[0]) {
		console.error('Arquivo não selecionado ou input file não encontrado.');
		return;
	}

	var file = fileInput.files[0];
	var formData = new FormData();
	formData.append("file", file);
	formData.append("acao", "uploadPdf");
	formData.append("id", id);

	$.ajax({
		url: document.getElementById('formUser').action,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function(response) {
			console.log("Upload bem-sucedido: " + response);

			// Atualiza o link do PDF
			var linkElement = document.getElementById('pdf-link-' + id);
			if (linkElement) {
				linkElement.href = response;
				linkElement.style.display = 'inline-block';
				linkElement.innerText = 'Visualizar PDF';
			} else {
				console.error('Elemento do link não encontrado.');
			}


		},
		error: function(xhr, status, error) {
			console.error("Erro ao fazer upload: " + xhr.responseText);
		}
	});
}



$(document).ready(function() {
	function isValidCPF(cpf) {
		cpf = cpf.replace(/[^\d]+/g, '');
		if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
		var soma = 0, resto;
		for (var i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
		resto = (soma * 10) % 11;
		if ((resto == 10) || (resto == 11)) resto = 0;
		if (resto != parseInt(cpf.substring(9, 10))) return false;
		soma = 0;
		for (var i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
		resto = (soma * 10) % 11;
		if ((resto == 10) || (resto == 11)) resto = 0;
		if (resto != parseInt(cpf.substring(10, 11))) return false;
		return true;
	}

	function formatCPF(cpf) {
		return cpf.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	}

	function validateAndFormatCPF(element) {
		var cpf = element.val().replace(/\D/g, '');
		if (!isValidCPF(cpf)) {
			alert('CPF inválido!');
			element.focus();
			return false;
		}
		element.val(formatCPF(cpf));
		return true;
	}

	function isValidDate(date) {
		var datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
		if (!datePattern.test(date)) return false;

		var parts = date.split('/');
		var day = parseInt(parts[0], 10);
		var month = parseInt(parts[1], 10);
		var year = parseInt(parts[2], 10);

		var dateObj = new Date(year, month - 1, day);
		return (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day);
	}

	function formatDate(date) {
		var parts = date.split('/');
		var day = parts[0].padStart(2, '0');
		var month = parts[1].padStart(2, '0');
		var year = parts[2];
		return `${day}/${month}/${year}`;
	}

	function validateAndFormatDate(element) {
		var date = element.val().replace(/\D/g, '');
		if (!isValidDate(date)) {
			alert('Data inválida!');
			element.focus();
			return false;
		}
		element.val(formatDate(date));
		return true;
	}

	function editarLinha(id) {
		let tabela = $('#tabelaresultados').DataTable();
		let linha = tabela.row(function(idx, data, node) {
			return data[0] === id ? true : false;
		});

		linha.nodes().to$().find('td[data-field]').each(function() {
			let celula = $(this);
			let valor = celula.text();
			celula.empty().append($('<input type="text" class="form-control input-edit" />').val(valor));
		});

		linha.nodes().to$().find('button[onclick^="editarLinha"]').attr('onclick', 'salvarLinha(' + id + ')');
	}

	let clicks = 0;
	let timeout;

	$("#tabelaresultados").on("click", ".editar-btn", function() {
		let linha = $(this).closest("tr");
		linha.find("td[data-field]").each(function() {
			let valor = $(this).text();
			$(this).html('<input type="text" class="form-control input-edit" value="' + valor + '">');
		});
		linha.find(".editar-btn").hide();
		linha.find(".salvar-btn").show();
	});

	$("#tabelaresultados").on("click", ".salvar-btn", function() {
		let linha = $(this).closest("tr");
		let cpfCell = linha.find("td[data-field='cpf'] input");
		if (!validateAndFormatCPF(cpfCell)) {
			return;
		}

		let dataFields = ['datanascimento', 'dataaso'];
		let valid = true;

		linha.find("td[data-field] input").each(function() {
			let dataField = $(this).parent().attr('data-field');
			if (dataFields.includes(dataField)) {
				if (!validateAndFormatDate($(this))) {
					valid = false;
					return false; // Interrompe o loop se a validação falhar
				}
			}
			let novoValor = $(this).val();
			$(this).parent().text(novoValor);
		});

		if (valid) {
			linha.find(".salvar-btn").hide();
			linha.find(".editar-btn").show();
			let id = linha.attr('id').split('-')[1];
			// salvarLinha(id);
		}
	});

	$("#tabelaresultados").on("click", "td[data-field]", function() {
		clicks++;
		if (clicks === 1) {
			timeout = setTimeout(function() {
				clicks = 0;
			}, 300);
		} else {
			clearTimeout(timeout);
			clicks = 0;
			let valor = $(this).text();
			$(this).html('<input type="text" class="form-control input-edit" value="' + valor + '">');
			$(this).closest("tr").find(".editar-btn").hide();
			$(this).closest("tr").find(".salvar-btn").show();

			// Adiciona o evento de formatação dinâmica
			$(this).find('input').on('input', function() {
				let dataField = $(this).closest('td').attr('data-field');
				if (dataField === 'cpf') {
					this.value = formatCPF(this.value.replace(/\D/g, ''));
				} else if (dataField === 'datanascimento' || dataField === 'dataaso') {
					let datePattern = this.value.replace(/\D/g, '')
						.replace(/(\d{2})(\d)/, '$1/$2')
						.replace(/(\d{2})(\d)/, '$1/$2')
						.replace(/(\d{4})\d+?$/, '$1');
					this.value = datePattern;

					// Limita o mês até 12
					let parts = this.value.split('/');
					if (parts[1] > 12) {
						parts[1] = '12';
						this.value = parts.join('/');
					}
				}
			});
		}
	});

	// Adiciona o evento de formatação dinâmica ao clicar no botão editar
	$("#tabelaresultados").on("input", "td[data-field='cpf'] input", function() {
		this.value = formatCPF(this.value.replace(/\D/g, ''));
	});

	$("#tabelaresultados").on("input", "td[data-field='datanascimento'] input, td[data-field='dataaso'] input", function() {
		let datePattern = this.value.replace(/\D/g, '')
			.replace(/(\d{2})(\d)/, '$1/$2')
			.replace(/(\d{2})(\d)/, '$1/$2')
			.replace(/(\d{4})\d+?$/, '$1');
		this.value = datePattern;

		// Limita o mês até 12
		let parts = this.value.split('/');
		if (parts[1] > 12) {
			parts[1] = '12';
			this.value = parts.join('/');
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

