package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import connection.SingleConnectionBanco;
import model.ModelCadastro;

public class DAOcadastro {

	private Connection connection;

	public DAOcadastro() {
		connection = SingleConnectionBanco.getConnection();
	}

	public DAOcadastro(Connection connection) {
		this.connection = connection;
	}

	public void gravarCadastro(ModelCadastro objeto) throws SQLException {
		if (objeto.isNovo()) {
			inserirCadastro(objeto);
		} else {
			atualizarCadastro(objeto);
		}
	}

	private void inserirCadastro(ModelCadastro objeto) throws SQLException {
		String sql = "INSERT INTO cadastro (centrodecusto, funcao, nome, datanascimento, cpf, rg, aso, dataaso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
			preparedStatement.setString(1, objeto.getCentrodecusto());
			preparedStatement.setString(2, objeto.getFuncao());
			preparedStatement.setString(3, objeto.getNome());
			preparedStatement.setString(4, objeto.getDatanascimento());
			preparedStatement.setString(5, objeto.getCpf());
			preparedStatement.setString(6, objeto.getRg());
			preparedStatement.setString(7, objeto.getAso());
			preparedStatement.setString(8, objeto.getDataaso());

			preparedStatement.executeUpdate();
			connection.commit();
		} catch (SQLException e) {
			connection.rollback();
			throw new SQLException("Erro ao inserir cadastro: " + e.getMessage());
		}
	}

	private void atualizarCadastro(ModelCadastro objeto) throws SQLException {
		String sql = "UPDATE cadastro SET centrodecusto=?, funcao=?, nome=?, datanascimento=?, cpf=?, rg=?, aso=?, dataaso=? WHERE id=?";
		try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
			preparedStatement.setString(1, objeto.getCentrodecusto());
			preparedStatement.setString(2, objeto.getFuncao());
			preparedStatement.setString(3, objeto.getNome());
			preparedStatement.setString(4, objeto.getDatanascimento());
			preparedStatement.setString(5, objeto.getCpf());
			preparedStatement.setString(6, objeto.getRg());
			preparedStatement.setString(7, objeto.getAso());
			preparedStatement.setString(8, objeto.getDataaso());
			preparedStatement.setLong(9, objeto.getId());

			preparedStatement.executeUpdate();
			connection.commit();
		} catch (SQLException e) {
			connection.rollback();
			throw new SQLException("Erro ao atualizar cadastro: " + e.getMessage());
		}
	}

	public ModelCadastro consultaUsuario(String nome) throws SQLException {
		// Implemente a lógica para consultar o usuário pelo nome
		ModelCadastro model = new ModelCadastro();

		try {
			String sql = "select * from cadastro where upper(nome) = upper('" + nome + "')";

			PreparedStatement preparedStatement = connection.prepareStatement(sql);

			ResultSet resultSet = preparedStatement.executeQuery();

			while (resultSet.next()) {

				model.setCentrodecusto(resultSet.getString("centrodecusto"));
				model.setFuncao(resultSet.getString("funcao"));
				model.setNome(resultSet.getString("nome"));
				model.setDatanascimento(resultSet.getString("datanascimento"));
				model.setCpf(resultSet.getString("cpf"));
				model.setRg(resultSet.getString("rg"));
				model.setAso(resultSet.getString("aso"));
				model.setDataaso(resultSet.getString("dataaso"));

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return model;
	}

	public List<ModelCadastro> consultaUsuarioList() throws SQLException {

		List<ModelCadastro> retorno = new ArrayList<>();

		String sql = "SELECT * FROM cadastro";

		PreparedStatement statement = connection.prepareStatement(sql);

		statement.execute();

		ResultSet resultado = statement.executeQuery();

		while (resultado.next()) { /* percorrer as linhas de resultado do SQL */

			ModelCadastro modelCadastro = new ModelCadastro();

			modelCadastro.setId(resultado.getLong("id"));
			modelCadastro.setCentrodecusto(resultado.getString("centrodecusto"));
			modelCadastro.setFuncao(resultado.getString("funcao"));
			modelCadastro.setNome(resultado.getString("nome"));
			modelCadastro.setDatanascimento(resultado.getString("datanascimento"));
			modelCadastro.setCpf(resultado.getString("cpf"));
			modelCadastro.setRg(resultado.getString("rg"));
			modelCadastro.setAso(resultado.getString("aso"));
			modelCadastro.setDataaso(resultado.getString("dataaso"));

			retorno.add(modelCadastro);
		}

		return retorno;

	}

	public void deletarCadastro(String idUser) {

		try {

			String sql = "DELETE FROM cadastro WHERE id = ?;";
			PreparedStatement preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setLong(1, Long.parseLong(idUser));
			preparedStatement.executeUpdate();
			connection.commit();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

}
