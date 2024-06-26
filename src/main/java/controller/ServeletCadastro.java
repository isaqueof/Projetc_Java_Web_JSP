package controller;

import java.io.IOException;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import dao.DAOcadastro;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelCadastro;

@WebServlet(urlPatterns = { "/ServeletCadastro" })
public class ServeletCadastro extends HttpServlet {

	private static final long serialVersionUID = 1L;

	static DAOcadastro daoCadastro = new DAOcadastro();

	public ServeletCadastro() {
		// TODO document why this constructor is empty
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {

			String acao = request.getParameter("acao");

			if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("deletar")) {

				String idUser = request.getParameter("id");

				daoCadastro.deletarCadastro(idUser);
				request.setAttribute("msg", "Usuário " + idUser + " deletado com sucesso !!!");

				request.getRequestDispatcher("principal/pagePrincipal.jsp").forward(request, response);

			} else if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("deletarajax")) {

				String idUser = request.getParameter("id");

				daoCadastro.deletarCadastro(idUser);

				response.getWriter().write("Excluido com sucesso!");

			} else if (acao != null && !acao.isEmpty() && acao.equalsIgnoreCase("buscarCadastroAjax")) {

				List<ModelCadastro> dadosJsonUser = daoCadastro.consultaUsuarioList();

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
			String id = request.getParameter("id");
			String centrodecusto = request.getParameter("centrodecusto");
			String funcao = request.getParameter("funcao");
			String nome = request.getParameter("nome");
			String datanascimento = request.getParameter("datanascimento");
			String cpf = request.getParameter("cpf");
			String rg = request.getParameter("rg");
			String aso = request.getParameter("aso");
			String dataaso = request.getParameter("dataaso");

			// Verifica se todos os parâmetros necessários estão presentes
			if (centrodecusto == null || funcao == null || nome == null || datanascimento == null || cpf == null
					|| rg == null || aso == null || dataaso == null) {
				throw new IllegalArgumentException("Todos os parâmetros são obrigatórios");
			}

			ModelCadastro modelCadastro = new ModelCadastro();
			modelCadastro.setId(id != null && !id.isEmpty() ? Long.parseLong(id) : null);
			modelCadastro.setCentrodecusto(centrodecusto);
			modelCadastro.setFuncao(funcao);
			modelCadastro.setNome(nome);
			modelCadastro.setDatanascimento(datanascimento);
			modelCadastro.setCpf(cpf);
			modelCadastro.setRg(rg);
			modelCadastro.setAso(aso);
			modelCadastro.setDataaso(dataaso);

			String acao = request.getParameter("acao");
			if (acao != null && acao.equalsIgnoreCase("salvaAjax")) {
				// Certifique-se de inicializar seu DAO antes de usá-lo
				DAOcadastro daoCad = new DAOcadastro(); // Aqui estou assumindo que você tem um construtor padrão para
														// DAOCadastro
				daoCad.gravarCadastro(modelCadastro);
				response.getWriter().write("Atualizado com sucesso!");
			} else {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().write("Ação inválida");
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write("Erro ao processar a solicitação: " + e.getMessage());
		}

	}
}
