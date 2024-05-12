<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link href="<%=request.getContextPath()%>/css/cssPage.css"
	rel="stylesheet">
</head>
<body>


	<jsp:include page="navBar.jsp"></jsp:include>


	<div class="divFomulario">

		<form class="form1" action="<%=request.getContextPath()%>/ServletUsuarioController"
			method="post" id="formUser">

			<div class="">
				<div class="col-md-6">
					<div class="md-input-wrapper">



						<input type="text" class="md-form-control" name="id" id="id"
							required="required"> <label>Digite o Id</label>
					</div>
				</div>
			</div>


		</form>

	</div>






	<script type="text/javascript">
		function criarDelete() {

			document.getElementById("formUser").method = 'get';
			document.getElementById("acao").value = 'deletar';
			document.getElementById("formUser").submit();

		}
	</script>


</body>
</html>