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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

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

		String acao = request.getParameter("acao");

		try {
			if ("relatorioaso".equals(acao)) {
				List<ModelCadastro> usuarios = daoCadastro.consultaUsuarioList();
				response.setContentType("application/pdf");
				response.setHeader("Content-Disposition", "attachment; filename=relatorio_aso.pdf");
				Document document = new Document();
				PdfWriter.getInstance(document, response.getOutputStream());

				document.open();

				// Adicionar título
				Font fontTitulo = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
				Paragraph titulo = new Paragraph("Relatório de ASO", fontTitulo);
				titulo.setAlignment(Element.ALIGN_CENTER);
				document.add(titulo);

				// Adicionar tabela
				PdfPTable table = new PdfPTable(8); // Número de colunas
				table.setWidthPercentage(100);
				table.setSpacingBefore(10f);
				table.setSpacingAfter(10f);

				// Adicionar cabeçalhos
				Stream.of("ID", "Nome", "CPF", "Data de Nascimento", "Função", "Centro de Custo", "Data do ASO",
						"Próximo ASO").forEach(columnTitle -> {
							PdfPCell header = new PdfPCell();
							header.setBackgroundColor(BaseColor.LIGHT_GRAY);
							header.setBorderWidth(2);
							header.setPhrase(new Phrase(columnTitle));
							table.addCell(header);
						});

				// Preencher dados
				for (ModelCadastro usuario : usuarios) {
					table.addCell(String.valueOf(usuario.getId()));
					table.addCell(usuario.getNome());
					table.addCell(usuario.getCpf());
					table.addCell(usuario.getDatanascimento());
					table.addCell(usuario.getFuncao());
					table.addCell(usuario.getCentrodecusto());
					table.addCell(usuario.getDataaso());

					String proximoASO = calcularProximoASO(usuario.getDataaso());
					PdfPCell cellProximoASO = new PdfPCell(new Phrase(proximoASO));

					// Verificar se precisa fazer o ASO
					if (precisaFazerASO(proximoASO)) {
						cellProximoASO.setBackgroundColor(BaseColor.YELLOW);
					}

					table.addCell(cellProximoASO);
				}

				document.add(table);
				document.close();
			}

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
				case "relatorioaso":
					handleRelatorioASO(response);
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

	private void handleDeletarAjax(HttpServletRequest request, HttpServletResponse response)
			throws IOException, SQLException {
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

			// Caminho do arquivo relativo
			String filePathRelative = System.currentTimeMillis() + "_" + fileName;
			Path filePath = uploadPath.resolve(filePathRelative);

			System.out.println("Diretório de upload absoluto: " + uploadDir);
			System.out.println("Caminho do arquivo: " + filePath);

			try (InputStream fileContent = filePart.getInputStream()) {
				Files.copy(fileContent, filePath, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException e) {
				LOGGER.log(Level.SEVERE, "Erro ao salvar o arquivo", e);
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().print("Erro ao salvar o arquivo.");
				return;
			}

			String id = request.getParameter("id");
			ModelCadastro modelCadastro = daoCadastro.buscarCadastroPorId(Long.parseLong(id));
			if (modelCadastro != null) {
				// Salve apenas o nome do arquivo ou caminho relativo
				modelCadastro.setFilePath(filePathRelative);
				daoCadastro.gravarCadastro(modelCadastro);

				// Correção: Geração da URL acessível publicamente
				String fileUrl = request.getContextPath() + "/uploads/" + filePathRelative;
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

	private void handleFormSubmission(HttpServletRequest request, HttpServletResponse response)
			throws IOException, SQLException {
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

	private void handleRelatorioASO(HttpServletResponse response) throws SQLException, DocumentException, IOException {
		List<ModelCadastro> dados = daoCadastro.consultaUsuarioList();
		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment; filename=relatorio_aso.pdf");

		Document document = new Document();
		try {
			PdfWriter.getInstance(document, response.getOutputStream());
			document.open();
			document.add(new Paragraph("Relatório de ASO"));
			document.add(new Paragraph(" ")); // Add an empty line

			for (ModelCadastro cadastro : dados) {
				// Adicione as informações do cadastro ao documento PDF
				document.add(new Paragraph("ID: " + cadastro.getId()));
				document.add(new Paragraph("Nome: " + cadastro.getNome()));
				document.add(new Paragraph("CPF: " + cadastro.getCpf()));
				document.add(new Paragraph("Data de Nascimento: " + cadastro.getDatanascimento()));
				document.add(new Paragraph("Função: " + cadastro.getFuncao()));
				document.add(new Paragraph("Centro de Custo: " + cadastro.getCentrodecusto()));
				document.add(new Paragraph("Data do Último ASO: " + cadastro.getDataaso()));
				document.add(new Paragraph(" "));
			}
		} catch (DocumentException e) {
			throw new IOException("Erro ao gerar PDF", e);
		} finally {
			document.close();
		}
	}

	private String calcularProximoASO(String dataASO) {
		try {
			String[] partesData = dataASO.split("/");
			int dia = Integer.parseInt(partesData[0]);
			int mes = Integer.parseInt(partesData[1]) - 1; // Mês no objeto Date é 0-11
			int ano = Integer.parseInt(partesData[2]);

			Calendar calendar = Calendar.getInstance();
			calendar.set(ano, mes, dia);
			calendar.add(Calendar.YEAR, 1); // Adicionar um ano

			int diaProximo = calendar.get(Calendar.DAY_OF_MONTH);
			int mesProximo = calendar.get(Calendar.MONTH) + 1;
			int anoProximo = calendar.get(Calendar.YEAR);

			return String.format("%02d/%02d/%04d", diaProximo, mesProximo, anoProximo);
		} catch (Exception e) {
			return "Data Inválida";
		}
	}

	private boolean precisaFazerASO(String proximoASO) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			Date dataProximoASO = sdf.parse(proximoASO);
			Date dataAtual = new Date();

			return dataProximoASO.before(dataAtual);
		} catch (ParseException e) {
			return false;
		}
	}
}