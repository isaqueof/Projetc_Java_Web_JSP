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
<link rel="stylesheet" href="css/style_principal.css">

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

<!-- Script -->



</head>

<body>

	<jsp:include page="navBar.jsp"></jsp:include>


	<div class="pesquisar">
		<div class="menu">

			<ul class="nav ">
				<li class="nav-item " data-bs-toggle="modal"
					data-bs-target="#exampleModal"><a class="nav-link active"
					aria-current="page" href="#">Cadastro</a></li>
				<li class="nav-item"><a class="nav-link" href="#">Load XML</a></li>
			</ul>

		</div>
	</div>


	<div class="lista ">

		<form class="form-material" action="ServeletCadastro" method="post"
			id="formUser">
			<input type="hidden" name="acao" id="acao" value="">
			<div class="container my-4">
				<div class="row">
					<div id="resultadoMsg"
						class="table-responsive divTable col-sm-12 col-md-12 col-lg-12 col-xl-12 table-content">
						<table id="tabelaresultados"
							class="table table-striped table-sm align-middle table-borded table-dark table-striped table-hover">
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
									<th scope="col">Options</th>

								</tr>
							</thead>
							<tbody id="tableBody_users">


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


						<div class="col-md-6">
							<label for="inputAddress" class="form-label">Centro de
								custo</label> <input type="text" class="form-control"
								name="centrodecusto" id="centrodecusto"
								value="${ modolCadastro.centrodecusto }">
						</div>

						<div class="col-md-6">
							<label for="inputtext" class="form-label">Função</label> <input
								type="text" class="form-control" name="funcao" id="funcao"
								value="${ modolCadastro.funcao }">
						</div>


						<div class="col-12">
							<label for="inputtext" class="form-label">Nome</label> <input
								type="text" class="form-control" name="nome" id="nome"
								value="${ modolCadastro.nome }">
						</div>

						<div class="col-md-6">
							<label for="inputtext" class="form-label">Data nascimento</label>
							<input type="text" class="form-control" name="datanascimento"
								id="datanascimento" value="${ modolCadastro.datanascimento }">
						</div>


						<div class="col-md-6">
							<label for="inputtext" class="form-label">Cpf</label> <input
								type="text" class="form-control" name="cpf" id="cpf"
								value="${ modolCadastro.cpf }">
						</div>

						<div class="col-md-6">
							<label for="inputtext" class="form-label">Rg</label> <input
								type="text" class="form-control" name="rg" id="rg"
								value="${ modolCadastro.rg }">
						</div>

						<div class="col-md-6">
							<label for="inputtext" class="form-label">Aso</label> <input
								type="text" class="form-control" name="aso" id="aso"
								value="${ modolCadastro.aso }">
						</div>

						<div class="col-md-6">
							<label for="inputtext" class="form-label">Data aso</label> <input
								type="text" class="form-control" name="dataaso" id="dataaso"
								value="${ modolCadastro.dataaso }">
						</div>

						<div class="col-12 modal-footer">
							<button type="button" class="btn btn-secondary"
								data-bs-dismiss="modal">Fechar</button>
							<button type="button" onclick="gravarCadastro()"
								class="btn btn-primary" id="salvarBtn">Salvar</button>
						</div>


					</form>
				</div>
			</div>
		</div>
	</div>





	<script type="text/javascript" src="webjars/jquery/3.7.1/jquery.min.js"></script>
	<!-- JavaScript (Table) -->
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
	<script type="text/javascript" src="javaScript/cadastroJavaScript.js"></script>

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
<!-- 	<div class="pesquisar">
		<div class="menu">

			<ul class="nav ">
				<li class="nav-item " data-bs-toggle="modal"
					data-bs-target="#exampleModal"><a class="nav-link active"
					aria-current="page" href="#">Cadastro</a></li>
				<li class="nav-item"><a class="nav-link" href="#">Load XML</a></li>
			</ul>

		</div>
		<div class="input-group mb-3 container">
			<input type="text" class="form-control"
				placeholder="Pesquisar cadastro" aria-label="nome"
				aria-describedby="button-addon2" id="nomeBusca" value="">
			<button class="btn btn-success btn-outline-secondary" type="submit"
			 onload=""	onclick="buscaUsuario();" id="bottonClick">Pesquisar</button>
		</div>



		<div class="lista ">
			<form class="form-material" action="ServeletCadastro" method="post"
				id="formUser">

				<input type="hidden" name="acao" id="acao" value="">
				<div class="table-responsive table-content" id="resultadoMsg">
					<table
						class="table table-striped table-sm align-middle table-borded table-dark table-striped table-hover"
						id="tabelaresultados">
						<thead class="thead">
							<tr>

								<th scope="col">Centro de custo</th>
								<th scope="col">Função</th>
								<th scope="col">Nome</th>
								<th scope="col">Data nascimento</th>
								<th scope="col">Cpf</th>
								<th scope="col">Rg</th>
								<th scope="col">Aso</th>
								<th scope="col">Data Aso</th>
								<th scope="col">Editar</th>
								<th scope="col">Excluir</th>

							</tr>
						</thead>
						<tbody class="table-group-divider">

						</tbody>
					</table>
				</div>

				<p id="totalResultados"></p>
			</form>

		</div>





	</div> -->
