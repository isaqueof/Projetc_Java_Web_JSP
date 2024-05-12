package dao;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import connection.SingleConnectionBanco;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ModelLogin;

public class DAOUsuaryRepository {

	private Connection connection;

	public DAOUsuaryRepository() {
		connection = SingleConnectionBanco.getConnection();
	}

	public ModelLogin gravarUsuario(ModelLogin objeto) {

		if (objeto.isNovo()) {
			try {

				String sql = "INSERT INTO public.\"modelLogin\"(uname,psw,nome,email) VALUES (?, ?, ?, ?)";

				PreparedStatement preparedStatement = connection.prepareStatement(sql);
				preparedStatement.setString(1, objeto.getUname());
				preparedStatement.setString(2, objeto.getPsw());
				preparedStatement.setString(3, objeto.getNome());
				preparedStatement.setString(4, objeto.getEmail());

				preparedStatement.execute();
				connection.commit();

			} catch (Exception e) {
				e.printStackTrace();
			}

		} else {

			try {

				// Atualizar ------
				String sql = "UPDATE public.\"modelLogin\" SET uname=?, psw=?, email=?, nome=? WHERE id =  "
						+ objeto.getId() + " ";
				PreparedStatement preparedStatement = connection.prepareStatement(sql);
				preparedStatement.setString(1, objeto.getUname());
				preparedStatement.setString(2, objeto.getPsw());
				preparedStatement.setString(3, objeto.getNome());
				preparedStatement.setString(4, objeto.getEmail());

				preparedStatement.execute();
				connection.commit();

			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return this.consultaUsuario(objeto.getUname());
	}

	public List<ModelLogin> consultaUsuarioList(String nome) throws SQLException {

		List<ModelLogin> retorno = new ArrayList<>();

		String sql = "SELECT * FROM public.\"modelLogin\" where upper(nome) like upper(?) ";

		PreparedStatement statement = connection.prepareStatement(sql);

		statement.setString(1, "%" + nome + "%");

		ResultSet resultado = statement.executeQuery();

		while (resultado.next()) { /* percorrer as linhas de resultado do SQL */

			ModelLogin modelLogin = new ModelLogin();

			modelLogin.setId(resultado.getLong("id"));
			modelLogin.setEmail(resultado.getString("email"));
			modelLogin.setNome(resultado.getString("nome"));
			modelLogin.setUname(resultado.getString("uname"));
			modelLogin.setPsw(resultado.getString("psw"));

			retorno.add(modelLogin);
		}

		return retorno;

	}

	public ModelLogin consultaUsuario(String uname) {

		ModelLogin model = new ModelLogin();

		try {
			String sql = "select * from public.\"modelLogin\" where upper(uname) = upper('" + uname + "')";

			PreparedStatement preparedStatement = connection.prepareStatement(sql);

			ResultSet resultSet = preparedStatement.executeQuery();

			while (resultSet.next()) {
				model.setId(resultSet.getLong("id"));
				model.setEmail(resultSet.getString("email"));
				model.setNome(resultSet.getString("nome"));
				model.setUname(resultSet.getString("uname"));
				model.setPsw(resultSet.getString("psw"));

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return model;

	}

	public boolean validarLogin(String uname) {

		try {
			String sql = "select count(1) > 0 as existe from public.\"modelLogin\" where upper(uname) = upper('" + uname
					+ "')";

			PreparedStatement preparedStatement = connection.prepareStatement(sql);

			ResultSet resultSet = preparedStatement.executeQuery();

			resultSet.next();
			return resultSet.getBoolean("existe");

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public void deletarUsuary(String idUser) {

		try {

			String sql = "DELETE FROM public.\"modelLogin\" WHERE id = ?;";
			PreparedStatement preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setLong(1, Long.parseLong(idUser));
			preparedStatement.executeUpdate();
			connection.commit();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public void idUser(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String iduser = request.getParameter("acao");
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.println("Bem Vindo<h3>" + iduser + " " + "</h3>");
		out.close();

	}

}