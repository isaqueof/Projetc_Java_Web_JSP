package controller;

import java.io.IOException;
import java.util.List;

import dao.DAOUsuaryRepository;
import dao.DAOcadastro;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelLogin;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet(urlPatterns = { "/ServletUsuarioController" })
public class ServletUsuarioController extends HttpServlet {

	private static final long serialVersionUID = 1L;

	static DAOUsuaryRepository daoUsuaryRepository = new DAOUsuaryRepository();

	static DAOcadastro daoCadastro = new DAOcadastro();

	public ServletUsuarioController() {
		// TODO document why this constructor is empty
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {

			String acao = request.getParameter("acao");

			if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("deletar")) {

				String idUser = request.getParameter("id");

				daoUsuaryRepository.deletarUsuary(idUser);
				request.setAttribute("msg", "Usuário " + idUser + " deletado com sucesso !!!");

				request.getRequestDispatcher("principal/pagePrincipal.jsp").forward(request, response);

			} else if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("buscarUserAjax")) {

				String nomeBusca = request.getParameter("nomeBusca");

				List<ModelLogin> dadosJsonUser = daoUsuaryRepository.consultaUsuarioList(nomeBusca);

				ObjectMapper mapper = new ObjectMapper();

				String json = mapper.writeValueAsString(dadosJsonUser);

				response.getWriter().write(json);

			} else {

				request.setAttribute("msg", "Usuário não deletado!!!");

			}

		} catch (Exception e) {
			e.printStackTrace();
			RequestDispatcher redirecionar = request.getRequestDispatcher("/error.jsp");
			request.setAttribute("msg", e.getMessage());
			redirecionar.forward(request, response);

		}

	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {

			String msg = "Operação realizada com sucesso !!!\n Faça Login !!!";

			String id = request.getParameter("id");
			String nome = request.getParameter("nome");
			String email = request.getParameter("email");
			String uname = request.getParameter("uname");
			String psw = request.getParameter("psw");

			ModelLogin modelLogin = new ModelLogin();

			modelLogin.setId(id != null && !id.isEmpty() ? Long.parseLong(id) : null);
			modelLogin.setNome(nome);
			modelLogin.setEmail(email);
			modelLogin.setUname(uname);
			modelLogin.setPsw(psw);

			if (daoUsuaryRepository.validarLogin(modelLogin.getUname()) && modelLogin.getId() == null) {

				msg = "Já existe usuário com o mesmo login, informe outro login !!!";

			} else {

				if (modelLogin.isNovo() == true) {
					msg = "Usuário cadastrado! Faça Login !!!";
				} else if (modelLogin.isNovo() == false) {
					msg = "Atualização de Usuário realizada !!!";
				}

				modelLogin = daoUsuaryRepository.gravarUsuario(modelLogin);

			}

			request.setAttribute("msg", msg);
			request.setAttribute("modolLogin", modelLogin);
			request.getRequestDispatcher("/register.jsp").forward(request, response);

		} catch (Exception e) {
			e.printStackTrace();
			RequestDispatcher redirecionar = request.getRequestDispatcher("/error.jsp");
			request.setAttribute("msg", e.getMessage());
			redirecionar.forward(request, response);
		}
	}
}
