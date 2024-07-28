package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dao.DAOcadastro;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import model.ModelCadastro;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(urlPatterns = { "/ServeletCadastro" })
@MultipartConfig(maxFileSize = 16177215)
public class ServeletCadastro extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = Logger.getLogger(ServeletCadastro.class.getName());
	static DAOcadastro daoCadastro = new DAOcadastro();

	public ServeletCadastro() {
		// Construtor vazio
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {
			String acao = request.getParameter("acao");

			if (acao != null && !acao.isEmpty()) {
				switch (acao.toLowerCase()) {
				case "deletar":
					handleDeletar(request, response);
					break;
				case "deletarajax":
					handleDeletarAjax(request, response);
					break;
				case "buscarcadastroajax":
					handleBuscarCadastroAjax(response);
					break;
				default:
					throw new IllegalArgumentException("Ação inválida");
				}
			} else {
				request.setAttribute("msg", "Ação não especificada!");
				request.getRequestDispatcher("principal/pagePrincipal.html").forward(request, response);
			}
		} catch (Exception e) {
			LOGGER.log(Level.SEVERE, "Erro ao processar GET", e);
			request.setAttribute("msg", e.getMessage());
			request.getRequestDispatcher("/error.jsp").forward(request, response);
		}
	}

	private void handleDeletar(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, SQLException {
		String idUser = request.getParameter("id");
		daoCadastro.deletarCadastro(idUser);
		request.setAttribute("msg", "Usuário " + idUser + " deletado com sucesso !!!");
		request.getRequestDispatcher("principal/pagePrincipal.html").forward(request, response);
	}

	private void handleDeletarAjax(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
		String idUser = request.getParameter("id");
		daoCadastro.deletarCadastro(idUser);
		response.getWriter().write("Excluído com sucesso!");
	}

	private void handleBuscarCadastroAjax(HttpServletResponse response) throws IOException, SQLException {
		List<ModelCadastro> dadosJsonUser = daoCadastro.consultaUsuarioList();
		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(dadosJsonUser);
		response.getWriter().write(json);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException {
	    try {
	        String acao = request.getParameter("acao");

	        if ("uploadPdf".equals(acao)) {
	            handleFileUpload(request, response);
	        } else if ("salvaajax".equalsIgnoreCase(acao)) {
	            handleFormSubmission(request, response);
	        } else {
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            response.getWriter().write("Ação inválida");
	        }
	    } catch (Exception e) {
	        LOGGER.log(Level.SEVERE, "Erro ao processar POST", e);
	        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	        response.getWriter().write("Erro ao processar a solicitação: " + e.getMessage());
	    }
	}
	
	

	
	
	private void handleFileUpload(HttpServletRequest request, HttpServletResponse response)
	        throws IOException, ServletException, SQLException {
	    Part filePart = request.getPart("file");

	    if (filePart != null && filePart.getSize() > 0) {
	        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
	        String uploadDir = getServletContext().getRealPath("/uploads/");
	        Path uploadPath = Paths.get(uploadDir);
	        
	        

	        if (!Files.exists(uploadPath)) {
	            Files.createDirectories(uploadPath);
	        }
	        
	        

	        String filePath = Paths.get(uploadDir, System.currentTimeMillis() + "_" + fileName).toString();
	       
	        System.out.println("Diretório de upload absoluto: " + uploadDir);

	        try (InputStream fileContent = filePart.getInputStream()) {
	            Files.copy(fileContent, Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
	        } catch (IOException e) {
	            LOGGER.log(Level.SEVERE, "Erro ao salvar o arquivo", e);
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            response.getWriter().print("Erro ao salvar o arquivo.");
	            return;
	        }

	        String id = request.getParameter("id");
	        ModelCadastro modelCadastro = daoCadastro.buscarCadastroPorId(Long.parseLong(id));
	        if (modelCadastro != null) {
	            modelCadastro.setFilePath(filePath);
	            daoCadastro.gravarCadastro(modelCadastro);

	            // Correção: Geração da URL acessível publicamente
	            String fileUrl = request.getContextPath() + "/uploads/" + Paths.get(filePath).getFileName().toString();
	            response.getWriter().write(fileUrl);
	        } else {
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            response.getWriter().print("Cadastro não encontrado.");
	        }
	    } else {
	        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	        response.getWriter().print("Nenhum arquivo foi enviado.");
	    }
	}


	private void handleFormSubmission(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
		String id = request.getParameter("id");
		String centrodecusto = request.getParameter("centrodecusto");
		String funcao = request.getParameter("funcao");
		String nome = request.getParameter("nome");
		String datanascimento = request.getParameter("datanascimento");
		String cpf = request.getParameter("cpf");
		String rg = request.getParameter("rg");
		String aso = request.getParameter("aso");
		String dataaso = request.getParameter("dataaso");

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

		daoCadastro.gravarCadastro(modelCadastro);
		response.getWriter().write("Atualizado com sucesso!");
	}
}
