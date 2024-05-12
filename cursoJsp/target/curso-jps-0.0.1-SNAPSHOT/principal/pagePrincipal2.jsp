<!DOCTYPE html>
<html lang="en">

<head>
<title>FiwTech</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
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

<!-- themify -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/icon/themify-icons/themify-icons.css">

<!-- iconfont -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/icon/icofont/css/icofont.css">

<!-- simple line icon -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/icon/simple-line-icons/css/simple-line-icons.css">

<!-- Required Fremwork -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/plugins/bootstrap/css/bootstrap.min.css">

<!-- Chartlist chart css -->
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/assets/plugins/chartist/dist/chartist.css"
	type="text/css" media="all">

<!-- Weather css -->
<link href="<%=request.getContextPath()%>/assets/css/svg-weather.css"
	rel="stylesheet">


<!-- Style.css -->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/css/main.css">

<!-- Responsive.css-->
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/assets/css/responsive.css">

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
	rel="stylesheet">

</head>

<body class="sidebar-mini fixed">

	<jsp:include page="page-header.jsp"></jsp:include>

	<div class="content-wrapper">

		<div class="container-fluid">
			<div class="row">
				<div class="main-header">
					<h4>Dashboard</h4>
				</div>
			</div>

			<div class="fixed-button">
				<a href="#!" class="btn btn-md btn-primary"> <i
					class="fa fa-shopping-cart" aria-hidden="true"></i> Upgrade To Pro
				</a>
			</div>
		</div>

		<div class="container-fluid">
			<div class="row">
				<div class="main-header">
					<a href="<%=request.getContextPath()%>/register1.jsp">Cadastro
						Usuário</a>
				</div>



				<form class="md-float-material"
					action="<%=request.getContextPath()%>/ServletUsuarioController"
					method="post" id="formUser">

					<input type="hidden" name="acao" id="acao" value="">

					<div class="row">
						<div class="col-md-6">
							<div class="md-input-wrapper">



								<input type="text" class="md-form-control" name="id" id="id"
									required="required"> <label>Digite o Id</label>
							</div>
						</div>
					</div>





					<div class="container mt-3">
						<h3>Excluir Usuário</h3>
						<p>
							Clique aqui !


							<button type="button" class="btn btn-warning"
								data-bs-toggle="modal" data-bs-target="#myModal">Excluir
								Usuário !</button>
					</div>


					<div class="divTextoResposta">
						<h4 class="textoResposta">${msg}</h4>
					</div>

					<!-- The Modal -->
					<div class="modal" id="myModal">
						<div class="modal-dialog">
							<div class="modal-content">

								<!-- Modal Header -->
								<div class="modal-header">
									<h4 class="modal-title">Usuário será excluido !</h4>
									<button type="button" class="btn-close" data-bs-dismiss="modal" ></button>
								</div>

								<!-- Modal body -->
								<div class="modal-body">O Id será excluido !!!</a></div>

								<!-- Modal footer -->
								<div class="modal-footer">
									<button type="button" class="btn btn-danger"
										data-bs-dismiss="modal" onclick="criarDelete()">Excluir</button>
								</div>

							</div>
						</div>
					</div>

				</form>


			</div>
		</div>
	</div>



	<script type="text/javascript">
		function criarDelete() {

			document.getElementById("formUser").method = 'get';
			document.getElementById("acao").value = 'deletar';
			document.getElementById("formUser").submit();

		}
	</script>
	

	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

	<!-- Required Jqurey -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/Jquery/dist/jquery.min.js"></script>
	<script
		src="<%=request.getContextPath()%>/assets/plugins/jquery-ui/jquery-ui.min.js"></script>
	<script
		src="<%=request.getContextPath()%>/assets/plugins/tether/dist/js/tether.min.js"></script>

	<!-- Required Fremwork -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/bootstrap/js/bootstrap.min.js"></script>

	<!-- Scrollbar JS-->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/jquery-slimscroll/jquery.slimscroll.js"></script>
	<script
		src="<%=request.getContextPath()%>/assets/plugins/jquery.nicescroll/jquery.nicescroll.min.js"></script>

	<!--classic JS-->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/classie/classie.js"></script>

	<!-- notification -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/notification/js/bootstrap-growl.min.js"></script>

	<!-- Sparkline charts -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/jquery-sparkline/dist/jquery.sparkline.js"></script>

	<!-- Counter js  -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/waypoints/jquery.waypoints.min.js"></script>
	<script
		src="<%=request.getContextPath()%>/assets/plugins/countdown/js/jquery.counterup.js"></script>

	<!-- Echart js -->
	<script
		src="<%=request.getContextPath()%>/assets/plugins/charts/echarts/js/echarts-all.js"></script>

	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>

	<!-- custom js -->
	<script type="text/javascript"
		src="<%=request.getContextPath()%>/assets/js/main.min.js"></script>
	<script type="text/javascript"
		src="<%=request.getContextPath()%>/assets/pages/dashboard.js"></script>
	<script type="text/javascript"
		src="<%=request.getContextPath()%>/assets/pages/elements.js"></script>
	<script src="<%=request.getContextPath()%>/assets/js/menu.min.js"></script>
	<script>
		var $window = $(window);
		var nav = $('.fixed-button');
		$window.scroll(function() {
			if ($window.scrollTop() >= 200) {
				nav.addClass('active');
			} else {
				nav.removeClass('active');
			}
		});
	</script>
</body>

</html>
