package filter;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import connection.SingleConnectionBanco;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@WebFilter(urlPatterns = { "/principal/*", "/error.jsp"}) /*Interceptas todas as requisiçoes que vierem do projeto ou mapeamento*/
public class FilterAutentic implements Filter {

	private static Connection connection;

	public FilterAutentic() {
		super();

	}

	@Override
	public void destroy() {

		try {
			connection.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		try {

			HttpServletRequest req = (HttpServletRequest) request;
			HttpSession session = req.getSession();

			String usuarioLogado = (String) session.getAttribute("usuario");
			String urlAtenticacao = req.getServletPath();

			if (usuarioLogado == null && !urlAtenticacao.equalsIgnoreCase("/principal/ServletLogin")) {

				RequestDispatcher dispatcher = request.getRequestDispatcher("/login.jsp?url=" + urlAtenticacao);
				request.setAttribute("msg", "Por Favor Realize o Login!!!");
				dispatcher.forward(request, response);
				return;
			} else {
				chain.doFilter(request, response);

			}

			connection.commit();

		} catch (Exception e) {
			e.printStackTrace();
			RequestDispatcher redirecionar = request.getRequestDispatcher("error.jsp");
			request.setAttribute("msg", e.getMessage());
			redirecionar.forward(request, response);
			
			try {
				connection.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		}

	}

	public void init(FilterConfig fConfig) throws ServletException {

		connection = SingleConnectionBanco.getConnection();
	}

}
