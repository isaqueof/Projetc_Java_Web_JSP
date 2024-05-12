<!DOCTYPE html>
<html lang="en">
<head>
<title>Quantum Able Bootstrap 4 Admin Dashboard Template</title>

<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="description" content="codedthemes">
<meta name="keywords"
	content=", Responsive, Landing, Bootstrap, App, Template, Mobile, iOS, Android, apple, creative app">
<meta name="author" content="codedthemes">

<!-- Favicon icon -->
<link rel="shortcut icon"
	href="<%=request.getContextPath()%>/assets/images/favicon.png"
	type="image/x-icon">
<link rel="icon"
	href="<%=request.getContextPath()%>/assets/images/favicon.ico"
	type="image/x-icon">

<!-- Google font-->
<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700"
	rel="stylesheet">

<!--ico Fonts-->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/icon/icofont/css/icofont.css">

<!-- Required Fremwork -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/plugins/bootstrap/css/bootstrap.min.css">

<!-- Style.css -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/css/main.css">

<!-- Responsive.css-->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/css/responsive.css">

<link rel="stylesheet" type="text/css" href="style.css">

</head>
<body>
	<section class="login common-img-bg">
		<!-- Container-fluid starts -->
		<div class="container-fluid">
			<div class="row">
				<div class="col-sm-12">
					<div class="login-card card-block bg-white">
						<form class="md-float-material"
							action="<%=request.getContextPath()%>/ServletUsuarioController"
							method="post">

							<div class="text-center">
								<img
									src="<%=request.getContextPath()%>/assets/images/logo-black.png"
									alt="logo">
							</div>
							<h3 class="text-center txt-primary">Crie a sua conta aqui</h3>
							<div class="row">
								<div class="col-md-6">
									<div class="md-input-wrapper">
										<input type="text" class="md-form-control" name="nome"
											id="nome" value="${modolLogin.nome}" required="required">
										<label>Nome</label>
									</div>
								</div>
								<div class="col-md-6">
									<div class="md-input-wrapper">
										<input type="text" name="uname" id="uname"
											value="${modolLogin.uname}" class="md-form-control"
											required="required"> <label>Login</label>
									</div>
								</div>
							</div>
							<div class="md-input-wrapper">
								<input type="email" class="md-form-control" name="email"
									id="email" value="${modolLogin.email}" required="required">
								<label>Email</label>
							</div>
							<div class="md-input-wrapper">
								<input type="password" class="md-form-control" name="psw"
									id="psw" value="${modolLogin.psw}" required="required">
								<label>Senha</label>
							</div>

							<div class="row">
								<div class="col-md-6">
									<div class="md-input-wrapper">
										<input type="text" name="id" id="id" value="${modolLogin.id}"
											class="md-form-control" readonly="readonly"> <label>id</label>
									</div>
								</div>
							</div>


							<div
								class="rkmd-checkbox checkbox-rotate checkbox-ripple b-none m-b-20">
								<label class="input-checkbox checkbox-primary"> <input
									type="checkbox" id="checkbox"> <span class="checkbox"></span>
								</label>
								<div class="captions">Lembre-me</div>
							</div>
							<div class="col-xs-10 offset-xs-1">
								<button
									class="btn btn-primary btn-md btn-block waves-effect waves-light m-b-20">Salvar</button>
							</div>



							<div class="row">
								<div class="col-xs-12 text-center">
									<span class="text-muted">Já tem uma conta?</span> <a
										href="<%=request.getContextPath()%>/login1.jsp"
										class="f-w-600 p-l-5"> Faça login aqui</a>
								</div>
							</div>

							<div class="divTextoResposta">
								<h4 class="textoResposta">${msg}</h4>
							</div>

						</form>
						<!-- end of form -->
					</div>
					<!-- end of login-card -->
				</div>
				<!-- end of col-sm-12 -->
			</div>
			<!-- end of row-->
		</div>
		<!-- end of container-fluid -->
	</section>


	<!-- Required Jqurey -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/jquery/dist/jquery.min.js"></script>
	<script
		src="<%=request.getContextPath()%>/assets/plugins/jquery-ui/jquery-ui.min.js"></script>
	<script
		src="<%=request.getContextPath()%>/assets/plugins/tether/dist/js/tether.min.js"></script>

	<!-- Required Fremwork -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/bootstrap/js/bootstrap.min.js"></script>

	<!--text js-->
	<script type="text/javascript"
		src="<%=request.getContextPath()%>/pages/elements.js"></script>
</body>
</html>
