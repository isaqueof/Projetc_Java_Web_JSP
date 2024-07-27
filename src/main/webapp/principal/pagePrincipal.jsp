<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>


<!-- Bootstrap CSS -->
<link href="webjars/bootstrap/5.3.3/css/bootstrap.min.css"
	rel="stylesheet" />

<link rel="stylesheet" href="css/style_pricipal.css">
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
	integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
	crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet"
	href="https://cdn.datatables.net/2.0.5/css/dataTables.bootstrap5.css">
<link rel="stylesheet"
	href="https://cdn.datatables.net/buttons/3.0.2/css/buttons.dataTables.css">
<link rel="stylesheet"
	href="https://cdn.datatables.net/select/2.0.0/css/select.bootstrap.css">
<link rel="stylesheet"
	href="https://cdn.datatables.net/datetime/1.5.2/css/dataTables.dateTime.min.css">
<link rel="stylesheet"
	href="https://editor.datatables.net/extensions/Editor/css/editor.bootstrap.css">

</head>

<body>

	<jsp:include page="navBar.jsp"></jsp:include>

	<div class="pesquisar">
		<div class="menu">

			<ul class="nav ">
				<li class="nav-item" data-bs-toggle="modal"
					data-bs-target="#exampleModal"><a class="nav-link active"
					aria-current="page" href="#">Cadastro</a></li>
				<li class="nav-item"><a class="nav-link" href="#">Load XML</a></li>
			</ul>

		</div>
	</div>


	<div class="lista">
		<form class="form-material" action="ServeletCadastro" method="post"
			id="formUser">
			<input type="hidden" name="acao" id="acao" value="">
			<div class="container my-4">
				<div class="row">
					<div id="resultadoMsg"
						class="table-container col-sm-12 col-md-12 col-lg-12 col-xl-12">
						<table id="tabelaresultados"
							class="display table table-striped table-sm align-middle table-bordered table-dark table-striped table-hover"
							style="width: 100%;">
							<thead>
								<tr>
									<th scope="col" style="display: none;">Id</th>
									<th scope="col">Centro de custo</th>
									<th scope="col">Função</th>
									<th scope="col">Nome</th>
									<th scope="col">Data nascimento</th>
									<th scope="col">Cpf</th>
									<th scope="col">Rg</th>
									<th scope="col">Aso</th>
									<th scope="col">Data Aso</th>
									<th scope="col">Editar</th>
									<th scope="col">Arquivos</th>
									<th scope="col">Deletar</th>
								</tr>
							</thead>
							<tbody id="tableBody_users">
								<!-- Data rows will be inserted here by JavaScript -->
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</form>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="exampleModal" tabindex="-1"
		aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">CADASTRO</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="form-material row g-3" action="ServeletCadastro"
						method="post" id="formUser">
						<input type="hidden" name="acao" id="acao" value="salvaAjax">

						<!-- Campos do formulário -->
						<div class="col-md-6">
							<label for="centrodecusto" class="form-label">Centro de
								custo</label> <input type="text" class="form-control"
								name="centrodecusto" id="centrodecusto">
						</div>
						<div class="col-md-6">
							<label for="funcao" class="form-label">Função</label> <input
								type="text" class="form-control" name="funcao" id="funcao">
						</div>
						<div class="col-12">
							<label for="nome" class="form-label">Nome</label> <input
								type="text" class="form-control" name="nome" id="nome">
						</div>
						<div class="col-md-6">
							<label for="datanascimento" class="form-label">Data
								nascimento</label> <input type="text" class="form-control"
								name="datanascimento" id="datanascimento">
						</div>
						<div class="col-md-6">
							<label for="cpf" class="form-label">Cpf</label> <input
								type="text" class="form-control" name="cpf" id="cpf">
						</div>
						<div class="col-md-6">
							<label for="rg" class="form-label">Rg</label> <input type="text"
								class="form-control" name="rg" id="rg">
						</div>
						<div class="col-md-6">
							<label for="aso" class="form-label">Aso</label> <input
								type="text" class="form-control" name="aso" id="aso">
						</div>
						<div class="col-md-6">
							<label for="dataaso" class="form-label">Data aso</label> <input
								type="text" class="form-control" name="dataaso" id="dataaso">
						</div>
						<div class="col-12 modal-footer">
							<button type="button" class="btn btn-secondary"
								data-bs-dismiss="modal">Fechar</button>
							<button type="button" class="btn btn-primary" id="salvarBtn"
								onclick="gravarCadastro()">Salvar</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>





	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script type="text/javascript" src="webjars/jquery/3.7.1/jquery.min.js"></script>
	<!-- JavaScript (Table) -->
	<script type="text/javascript" src="javaScript/cadastroJavaScript.js"></script>
	<script defer
		src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
	<script defer src="https://cdn.datatables.net/2.0.5/js/dataTables.js"></script>
	<script defer
		src="https://cdn.datatables.net/2.0.5/js/dataTables.bootstrap5.js"></script>
	<script defer
		src="https://cdn.datatables.net/buttons/3.0.2/js/dataTables.buttons.js"></script>
	<script defer
		src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.dataTables.js"></script>
	<script defer
		src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
	<script defer
		src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
	<script defer
		src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
	<script defer
		src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.html5.min.js"></script>
	<script defer
		src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.print.min.js"></script>
	<script defer
		src="https://datatables.net/extensions/buttons/examples/initialisation/export.html"></script>
	<script defer
		src="https://cdn.datatables.net/responsive/3.0.2/js/dataTables.responsive.js"></script>
	<script defer
		src="https://cdn.datatables.net/responsive/3.0.2/js/responsive.dataTables.js"></script>

	<!-- jQuery primeiro, depois Popper.js, depois Bootstrap JS -->
	<script src="webjars/bootstrap/5.3.3/js/bootstrap.bundle.min.js"
		integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
		crossorigin="anonymous"></script>
	


	<script type="text/javascript">
		const input = document.getElementById("nomeBusca");
		input.addEventListener("keyup", function(event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				document.getElementById("bottonClick").click();
			}
		});
	</script>

</body>
</html>