<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Estudo HTML</title>

<!-- Bootstrap CSS -->
<link href="webjars/bootstrap/5.3.3/css/bootstrap.min.css"
	rel="stylesheet" />
<link rel="stylesheet" href="styleLogin.css" />

</head>

<!--JS-->

<body>

	<div class="divInicial">
		<div class="inicial"> 
			<div class="log" data-tiltdata-tilt data-tilt-max="50"
				data-tilt-speed="400" data-tilt-perspective="500">
				<label class="textLabel" for="senha">Faça seu Login!!!</label>
				<form class="md-float-material" action="ServletLogin" method="post">
					<label for="login">Login</label> <input type="text" id="login"
						name="uname" placeholder="Digite seu login..." required="required" />

					<label for="senha">Senha</label> <input type="password" id="senha"
						name="psw" placeholder="Digite sua senha..." required="required" />
					<label for="pais">País</label> <select id="country" name="country">
						<option value="brasil">Brasil</option>
						<option value="canada">Canada</option>
						<option value="usa">USA</option>


					</select> <input type="submit" value="Fazer Login" />

					<!-- <div class="card-footer"> -->
					<div class="col-sm-12 col-xs-12 text-center">
						<span class="text-muted corText"><a style="color: wheat;">
								Não tem uma conta?</a></span> <a
							href="<%=request.getContextPath()%>/register.jsp"
							class="f-w-600 p-l-5 corText2"> Inscreva-se agora</a>
					</div>
				</form>



			</div>

		</div>

	</div>

	<h4 id="texto" class="textoResposta">${msg}</h4>


	<!-- JavaScript (Opcional) -->
	<!-- jQuery primeiro, depois Popper.js, depois Bootstrap JS -->
	<script src="webjars/bootstrap/5.3.3/js/bootstrap.bundle.min.js"
		integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
		crossorigin="anonymous"></script>

	<script type="text/javascript" src="javaScript/script_login.js"></script>
</body>
</html>
