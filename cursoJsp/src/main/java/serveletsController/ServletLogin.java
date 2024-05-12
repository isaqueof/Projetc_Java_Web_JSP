package serveletsController;

import java.io.IOException;

import dao.DAOLoginRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelLogin;

@WebServlet(urlPatterns = { "/principal/ServletLogin"})
public class ServletLogin extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private DAOLoginRepository daoLoginRepository = new DAOLoginRepository();

	public ServletLogin() {

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String acao = request.getParameter("acao");

		if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("logout")) {
			request.getSession().invalidate();// invalida a sessão
			RequestDispatcher redirecionar = request.getRequestDispatcher("login1.jsp");
			redirecionar.forward(request, response);
		} else {
			doPost(request, response);
		}

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String uname = request.getParameter("uname");
		String psw = request.getParameter("psw");
		String url = request.getParameter("url");

		try {

			if (uname != null && !psw.isEmpty() && psw != null && !psw.isEmpty()) {

				ModelLogin modelLogin = new ModelLogin();
				modelLogin.setUname(uname);
				modelLogin.setPsw(psw);

				if (daoLoginRepository.validarAutenticacao(modelLogin)) {

					request.getSession().setAttribute("usuario", modelLogin.getUname());

					if (url == null || url.equals("null")) {
						url = "principal/pagePrincipal.jsp";
					}

					RequestDispatcher dispatcher = request.getRequestDispatcher(url);
					request.setAttribute("msg2", "Senha: " + psw);
					dispatcher.forward(request, response);

				} else {
					RequestDispatcher dispatcher = request.getRequestDispatcher("/loginNovo.jsp");
					request.setAttribute("msg", "Informe o Login e senha corretamente!");
					dispatcher.forward(request, response);
				}

			} else {

				RequestDispatcher dispatcher = request.getRequestDispatcher("loginNovo.jsp");
				request.setAttribute("msg", "Informe o Login e senha corretamente!");
				dispatcher.forward(request, response);

			}

		} catch (Exception e) {
			e.printStackTrace();
			RequestDispatcher redirecionar = request.getRequestDispatcher("error.jsp");
			request.setAttribute("msg", e.getMessage());
			redirecionar.forward(request, response);
		}

	}
}
