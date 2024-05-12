package serveletsController;

import java.io.IOException;

import dao.DAOUsuaryRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelLogin;

@WebServlet(urlPatterns = { "/ServletUsuarioController" })
public class ServletUsuarioController extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private DAOUsuaryRepository daoUsuaryRepository = new DAOUsuaryRepository();

	public ServletUsuarioController() {

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		

		try {
			
			
			String acao = request.getParameter("acao");

			if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("deletar")) {
				
				String idUser = request.getParameter("id");
				
				daoUsuaryRepository.deletarUsuary(idUser);
				request.setAttribute("msg", "Usuário " + idUser + " deletado com sucesso !!!");
			} else {
				
				request.setAttribute("msg", "Usuário não deletado!!!");
				
			}

			request.getRequestDispatcher("principal/pagePrincipal.jsp").forward(request, response);

		} catch (Exception e) {
			e.printStackTrace();
			RequestDispatcher redirecionar = request.getRequestDispatcher("error.jsp");
			request.setAttribute("msg", e.getMessage());
			redirecionar.forward(request, response);

		}

	}

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
			RequestDispatcher redirecionar = request.getRequestDispatcher("error.jsp");
			request.setAttribute("msg", e.getMessage());
			redirecionar.forward(request, response);
		}
	}
}
