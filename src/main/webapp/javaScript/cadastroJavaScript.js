window.addEventListener('load', () => {
    listUsers();
})


function listUsers() {
    const urlAction = document.getElementById('formUser').action;

    $(".alert").alert('dispose');
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

                // Adiciona os botões Editar e Salvar
                ind += '<td>';
                ind += '<button class="btn btn-sm btn-primary editar-btn" type="button"><i class="fa-solid fa-pencil"></i></button>';
                ind += '<button class="btn btn-success btn-sm salvar-btn" onclick="salvarLinha(' + user.id + ')" style="display: none;" type="button"><i class="fa-solid fa-download"></i> Salvar</button>';
                ind += '</td>';

                // Adiciona o campo de upload e o link para o PDF
                ind += '<td>';
                ind += '<input type="file" class="form-control" id="uploadPdf-' + user.id + '" accept=".pdf" style="display:none;" onchange="uploadPdf(' + user.id + ')">';
                ind += '<button class="btn btn-sm btn-secondary" onclick="document.getElementById(\'uploadPdf-' + user.id + '\').click()">Upload PDF</button>';
                ind += '<a href="#" class="btn btn-info btn-sm pdf-link" id="pdf-link-' + user.id + '" target="_blank">Visualizar PDF</a>';
                ind += '</td>';

                // Adiciona o botão de Delete
                ind += '<td>';
                ind += '<button class="btn btn-sm btn-danger" onclick="criarDeleteComAjax(' + user.id + ')" type="button"><i class="fa-solid fa-trash-can"></i></button>';
                ind += '</td>';

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
			})


        }
    }).fail(function(xhr, status, errorThrown) {
        alert('Erro ao buscar usuário por nome: ' + xhr.responseText + '\n================================' + errorThrown + '================================' + status);
    });
}


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
$('#exampleModal').on('hidden.bs.modal', function () {
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
        acao: "salvaAjax"
    };
    var urlAction = document.getElementById('formUser').action;

    $.ajax({
        method: "POST",
        url: urlAction,
        data: formData,
        success: function(response) {
            alert('Cadastro realizado com sucesso!');
            if ($.fn.DataTable.isDataTable('#tabelaresultados')) {
                $('#tabelaresultados').DataTable().clear().destroy();
                listUsers();
            }
            fecharModalELimparFormulario();
        },
        error: function(xhr, status, errorThrown) {
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
            var file = fileInput.files[0];
            var formData = new FormData();
            formData.append('file', file);
            formData.append('id', id);
            formData.append('acao', 'uploadPdf');

            $.ajax({
                method: 'POST',
                url: document.getElementById('formUser').action,
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log(response);
                    var pdfLink = $('#pdf-link-' + id);
                    pdfLink.attr('href', '/path/to/upload/directory/' + id + '_' + file.name);
                    pdfLink.text('Visualizar PDF');
                },
                error: function(xhr, status, errorThrown) {
                    alert('Erro ao fazer upload do arquivo: ' + xhr.responseText);
                }
            });
}

//UPLOAD PDF
$(document).on('change', 'input[type="file"]', function() {
            var id = $(this).attr('id').split('-')[1];
            uploadPdf(id);
		});
		

function editarLinha(id) {
    let tabela = $('#tabelaresultados').DataTable();
    let linha = tabela.row(function(idx, data, node) {
        return data[0] === id ? true : false;
    });

    linha.nodes().to$().find('td').each(function() {
        let celula = $(this);
        let valor = celula.text();
        celula.empty().append($('<input type="text" class="form-control input-edit" />').val(valor));
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
            $(this).html('<input type="text" class="form-control input-edit" value="' + valor + '">');
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
            $(this).html('<input type="text" class="form-control input-edit" value="' + valor + '">');
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