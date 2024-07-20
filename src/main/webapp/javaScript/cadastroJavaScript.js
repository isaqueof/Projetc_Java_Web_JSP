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
                ind += '<tr id="row-' + user.id + '">'; // Adiciona o ID à linha aqui
                ind += '<td style="display: none;">' + user.id + '</td>';
                ind += '<td data-field="centrodecusto">' + user.centrodecusto + '</td>';
                ind += '<td data-field="funcao">' + user.funcao + '</td>';
                ind += '<td data-field="nome">' + user.nome + '</td>';
                ind += '<td data-field="datanascimento">' + user.datanascimento + '</td>';
                ind += '<td data-field="cpf">' + user.cpf + '</td>';
                ind += '<td data-field="rg">' + user.rg + '</td>';
                ind += '<td data-field="aso">' + user.aso + '</td>';
                ind += '<td data-field="dataaso">' + user.dataaso + '</td>';
                ind += '<td><button class="btn btn-sm btn-primary editar-btn" type="button"><i class="fa-solid fa-pencil"></i></button>';
                ind += '<button class="btn btn-success btn-sm salvar-btn" onclick="salvarLinha(' + user.id + ')" style="display: none;" type="button"><i class="fa-solid fa-download"></i> Salvar</button></td>';
                ind += '<td><button class="btn btn-sm btn-danger" onclick="criarDeleteComAjax(' + user.id + ')" type="button"><i class="fa-solid fa-trash-can"></i></button></td>';
                ind += '</tr>';
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
                        { title: 'ID', width: 'auto' },
                        { title: 'Centro de Custo', width: 'auto' },
                        { title: 'Função', width: 'auto' },
                        { title: 'Nome', width: 'auto' },
                        { title: 'Data nascimento', width: 'auto' },
                        { title: 'Cpf', width: 'auto' },
                        { title: 'Rg', width: 'auto' },
                        { title: 'Aso', width: 'auto' },
                        { title: 'Data Aso', width: 'auto' },
                        { title: 'Editar', width: 'auto' },
                        { title: 'Options', width: 'auto' }
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
    var urlAction = document.getElementById('formUser').action;
	// Enviar os dados para a servlet via AJAX
	$.ajax({
		method: "POST",
		url: urlAction,
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

        $(document).ready(function() {
            let clicks = 0;
            let timeout;

            $("#tabelaresultados").on("click", ".editar-btn", function() {
                let linha = $(this).closest("tr");
                linha.find("td[data-field]").each(function() {
                    let valor = $(this).text();
                    $(this).html('<input type="text" class="form-control" value="' + valor + '">');
                });
                linha.find(".editar-btn").hide();
                linha.find(".salvar-btn").show();
            });

            $("#tabelaresultados").on("click", ".salvar-btn", function() {
                let linha = $(this).closest("tr");
                linha.find("td[data-field] input").each(function() {
                    let novoValor = $(this).val();
                    $(this).parent().text(novoValor);
                });
                linha.find(".salvar-btn").hide();
                linha.find(".editar-btn").show();

                let id = linha.attr('id').split('-')[1];
                //salvarLinha(id);
            });

            $("#tableBody_users").on("click", "td[data-field]", function() {
                clicks++;
                if (clicks === 1) {
                    timeout = setTimeout(function() {
                        clicks = 0;
                    }, 300);
                } else {
                    clearTimeout(timeout);
                    clicks = 0;
                    let valor = $(this).text();
                    $(this).html('<input type="text" class="form-control" value="' + valor + '">');
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